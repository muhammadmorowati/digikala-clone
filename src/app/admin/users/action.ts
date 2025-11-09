"use server";
import { generateAccessToken, generateRefreshToken } from "@/utils/auth";
import type { RegisterFormState, LoginFormState } from "@/utils/types";
import { RegisterSchema, LoginSchema, UserupdateSchema } from "@/utils/validation";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcryptjs";
import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import path from "node:path";
import crypto from "node:crypto";

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

    const parsed = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
      return { ...state, errors: parsed.error.formErrors.fieldErrors, success: false };
    }

    const { name, email, phone, password } = parsed.data;

    const hashedPassword = await hash(password, 10);

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

    const parsed = LoginSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
      return { ...state, errors: parsed.error.formErrors.fieldErrors, success: false };
    }

    const { email, password } = parsed.data;

    const accessToken = generateAccessToken({ email });
    const refreshToken = generateRefreshToken({ email });

    const store = await cookies();
    store.set("token", accessToken, cookieOpts);
    store.set("refreshToken", refreshToken, { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });

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

  // پوشه مقصد را بساز
  const usersDir = path.join(process.cwd(), "public/users");
  await ensureDir(usersDir);
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

  revalidatePath("/");
  revalidatePath("/users");
  revalidatePath("/admin/users");

// ========================== DELETE USER ==========================
export async function deleteUser(id: string) {


  revalidatePath("/");
  revalidatePath("/users");
}

// ========================== REFRESH TOKEN ==========================
export async function refreshToken(): Promise<string | null> {
  try {

    const store = await cookies();
    const rt = store.get("refreshToken")?.value;
    if (!rt) return null;

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
  } catch (e) {
    console.error("Error refreshing token:", e);
    return null;
  }
}
