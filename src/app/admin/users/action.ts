"use server";

import { generateAccessToken, generateRefreshToken } from "@/utils/auth";
import { LoginFormState, RegisterFormState } from "@/utils/types";
import {
  LoginSchema,
  RegisterSchema,
  UserupdateSchema,
} from "@/utils/validation";
import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import bcrypt, { hash, compare } from "bcryptjs";
import connectToDB from "@/../config/mongodb";
import fs from "fs/promises";
import { verify } from "jsonwebtoken";
import UserModel from "@/../models/User";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import path from "node:path";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

// ---------- helpers ----------
const toBytes = (ab: ArrayBuffer) => new Uint8Array(ab);
const ensureDir = async (dir: string) => {
  try {
    await access(dir);
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") await mkdir(dir, { recursive: true });
    else throw e;
  }
};
const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e ?? "Unknown error"));
const cookieOpts = { httpOnly: true, secure: true, path: "/" } as const;

// ========================== SIGNUP ==========================
export async function signup(
  state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  try {
    await connectToDB();

    const parsed = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
      return { ...state, errors: parsed.error.formErrors.fieldErrors, success: false };
    }

    const { name, email, phone, password } = parsed.data;

    const exists = await UserModel.findOne({ $or: [{ name }, { email }, { phone }] }).lean();
    if (exists) {
      return {
        ...state,
        errors: { general: ["The username or email or phone exists already!!"] },
        success: false,
      };
    }

    const hashedPassword = await hash(password, 10);
    const usersCount = await UserModel.countDocuments();
    const role = usersCount > 0 ? "USER" : "ADMIN";

    await UserModel.create({ name, email, phone, password: hashedPassword, role });

    const accessToken = generateAccessToken({ name });

    const store = await cookies();
    store.set("token", accessToken, cookieOpts);

    // ⚠️ مهم: errors باید شیء باشه، نه undefined/null
    return { ...state, errors: {}, success: true };
  } catch (e) {
    console.log("Error ->", e);
    return { ...state, errors: { general: [errMsg(e)] }, success: false };
  }
}

// ========================== SIGNIN ==========================
export async function signin(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  try {
    await connectToDB();

    const parsed = LoginSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
      return { ...state, errors: parsed.error.formErrors.fieldErrors, success: false };
    }

    const { email, password } = parsed.data;

    // lean با جنریک تا TS بدونه password هست
    const user = (await UserModel.findOne({ email }).lean()) as { email: string; password: string } | null;
    if (!user) {
      return { ...state, errors: { general: ["کاربری با این مشخصات یافت نشد."] }, success: false };
    }

    const ok = await compare(password, user.password);
    if (!ok) {
      return { ...state, errors: { general: ["ایمیل یا رمز کاربری اشتباه است."] }, success: false };
    }

    const accessToken = generateAccessToken({ email });
    const refreshToken = generateRefreshToken({ email });

    const store = await cookies();
    store.set("token", accessToken, cookieOpts);
    store.set("refreshToken", refreshToken, { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });

    await UserModel.findOneAndUpdate(
      { email },
      { $push: { refreshToken } }, // اگر مدل شما آرایه نیست، $set کنید
      { new: true }
    );

    return { ...state, errors: {}, success: true };
  } catch (e) {
    console.log("Error ->", e);
    return { ...state, errors: { general: [errMsg(e)] }, success: false };
  }
}

// ========================== SIGN OUT ==========================
export async function signOut() {
  const store = await cookies();
  store.set("token", "", { ...cookieOpts, maxAge: -1 });
  store.set("refreshToken", "", { ...cookieOpts, maxAge: -1 });
  redirect("/login");
}

// ========================== UPDATE USER ==========================
export async function updateUser(formData: FormData) {
  await connectToDB();

  const id = formData.get("_id")?.toString();
  if (!id) throw new Error("User ID is required");

  const entries = Object.fromEntries(formData.entries());

  if (entries.address) {
    try {
      entries.address = JSON.parse(String(entries.address));
    } catch (e) {
      console.log("Invalid JSON format for address:", e);
      return { address: ["Invalid address format"] };
    }
  }

  const parsed = UserupdateSchema.safeParse(entries);
  if (!parsed.success) {
    console.log("❌❌❌", parsed.error.formErrors.fieldErrors);
    return parsed.error.formErrors.fieldErrors;
  }

  const data = parsed.data;
  const user = await UserModel.findById(id);
  if (!user) return notFound();

  // پوشه مقصد را بساز
  const usersDir = path.join(process.cwd(), "public/users");
  await ensureDir(usersDir);

  let avatarPath = user.avatar ?? "";
  if (data.avatar && data.avatar.size > 0) {
    if (user.avatar) {
      try {
        await unlink(path.join(process.cwd(), "public", user.avatar));
      } catch (e) {
        const err = e as NodeJS.ErrnoException;
        if (err.code !== "ENOENT") console.warn("unlink old avatar failed:", err);
      }
    }
    avatarPath = `/users/${crypto.randomUUID()}-${data.avatar.name}`;
    await writeFile(
      path.join(process.cwd(), "public", avatarPath),
      toBytes(await data.avatar.arrayBuffer())
    );
  }

  // فقط فیلدهای موجود را آپدیت کن تا مشکل string | undefined نداشته باشیم
  const updateFields: Partial<{
    name: string;
    role: string;
    email: string;
    phone: string;
    password: string;
    avatar: string;
    idNumber: string;
    job: string;
    address: {
      street?: string;
      plate?: string;
      city?: string;
      postalcode?: string;
      province?: string;
      unit?: string;
    };
  }> = {};

  if (data.name) updateFields.name = data.name;
  if (data.role) updateFields.role = data.role;
  if (data.email) updateFields.email = data.email;
  if (data.phone) updateFields.phone = data.phone;
  updateFields.avatar = avatarPath; // مسیر جدید یا قبلی

  if (data.password && data.password.trim()) {
    updateFields.password = await hash(data.password, 10);
  }

  if (data.idNumber) updateFields.idNumber = data.idNumber;
  if (data.job) updateFields.job = data.job;

  if (data.address) {
    updateFields.address = {
      street: data.address.street || "",
      plate: data.address.plate || "",
      city: data.address.city || "",
      postalcode: data.address.postalcode || "",
      province: data.address.province || "",
      unit: data.address.unit || "",
    };
  }

  await UserModel.findByIdAndUpdate(id, { $set: updateFields });

  revalidatePath("/");
  revalidatePath("/users");
  revalidatePath("/admin/users");
}

// ========================== DELETE USER ==========================
export async function deleteUser(id: string) {
  await connectToDB();

  const user = await UserModel.findOneAndDelete({ _id: id });
  if (!user) return notFound();

  if (user.avatar) {
    try {
      await unlink(path.join(process.cwd(), "public", user.avatar));
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      if (err.code !== "ENOENT") console.warn("unlink avatar failed:", err);
    }
  }

  revalidatePath("/");
  revalidatePath("/users");
}

// ========================== REFRESH TOKEN ==========================
export async function refreshToken(): Promise<string | null> {
  try {
    await connectToDB();

    const store = await cookies();
    const rt = store.get("refreshToken")?.value;
    if (!rt) return null;

    const user = await UserModel.findOne({ refreshToken: rt }).lean()
    if (!user) return null;

    const secret = process.env.RefreshTokenSecretKey;
    if (!secret) {
      console.error("Missing RefreshTokenSecretKey");
      return null;
    }

    try {
      jwt.verify(rt, secret);
    } catch (e) {
      console.error("Invalid refresh token:", e);
      return null;
    }

    const newAccessToken = generateAccessToken({ email: user.email });
    store.set("token", newAccessToken, cookieOpts);

    return newAccessToken;
  } catch (e) {
    console.error("Error refreshing token:", e);
    return null;
  }
}