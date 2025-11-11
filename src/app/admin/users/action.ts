"use server";

import { generateAccessToken, generateRefreshToken } from "@/src/utils/auth";
import type { RegisterFormState, LoginFormState, User } from "@/src/utils/types";
import {
  RegisterSchema,
  LoginSchema,
  UserupdateSchema,
} from "@/src/utils/validation";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcryptjs";
import {
  access,
  mkdir,
  unlink,
  writeFile,
  readFile,
  writeFile as writeJSONFile,
} from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import path from "node:path";
import crypto from "node:crypto";

// ─────────────────────────── Helpers ───────────────────────────
const toBytes = (ab: ArrayBuffer) => new Uint8Array(ab);

async function ensureDir(dir: string) {
  try {
    await access(dir);
  } catch (err: any) {
    if (err.code === "ENOENT") await mkdir(dir, { recursive: true });
    else throw err;
  }
}

const errMsg = (err: unknown) =>
  err instanceof Error ? err.message : String(err ?? "Unknown error");

const cookieOpts = { httpOnly: true, secure: true, path: "/" } as const;

// JSON helpers
const usersFile = path.join(process.cwd(), "data", "users.json");

async function readUsers(): Promise<User[]> {
  try {
    const data = await readFile(usersFile, "utf8");
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeUsers(users: User[]) {
  await writeJSONFile(usersFile, JSON.stringify(users, null, 2), "utf8");
}

// ─────────────────────────── SIGNUP ───────────────────────────
export async function signup(
  state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  try {
    const parsed = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success)
      return { ...state, errors: parsed.error.formErrors.fieldErrors, success: false };

    const { name, email, phone, password } = parsed.data;
    const users = await readUsers();

    if (users.some((u) => u.name === name || u.email === email || u.phone === phone)) {
      return {
        ...state,
        errors: { general: ["نام کاربری، ایمیل یا شماره تلفن قبلاً ثبت شده است."] },
        success: false,
      };
    }

    const hashedPassword = await hash(password, 10);
    const role: "ADMIN" | "USER" = users.length === 0 ? "ADMIN" : "USER";

    const newUser: User = {
      _id: crypto.randomUUID(),
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);

    const accessToken = await generateAccessToken({ email });
    const store = await cookies();
    store.set("token", accessToken, cookieOpts);

    return { ...state, errors: {}, success: true };
  } catch (err) {
    return { ...state, errors: { general: [errMsg(err)] }, success: false };
  }
}

// ─────────────────────────── SIGNIN ───────────────────────────
export async function signin(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  try {
    const parsed = LoginSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success)
      return { ...state, errors: parsed.error.formErrors.fieldErrors, success: false };

    const { email, password } = parsed.data;
    const users = await readUsers();
    const user = users.find((u) => u.email === email);

    if (!user)
      return { ...state, errors: { general: ["کاربری با این مشخصات یافت نشد."] }, success: false };

    const valid = await compare(password, user.password ?? "");
    if (!valid)
      return { ...state, errors: { general: ["ایمیل یا رمز عبور اشتباه است."] }, success: false };

    const accessToken = await generateAccessToken({ email });
    const refreshToken = await generateRefreshToken({ email });

    const store = await cookies();
    store.set("token", accessToken, cookieOpts);
    store.set("refreshToken", refreshToken, { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });

    user.refreshToken = refreshToken;
    await writeUsers(users);

    return { ...state, errors: {}, success: true };
  } catch (err) {
    return { ...state, errors: { general: [errMsg(err)] }, success: false };
  }
}

// ─────────────────────────── SIGNOUT ───────────────────────────
export async function signOut() {
  const store = await cookies();
  store.set("token", "", { ...cookieOpts, maxAge: -1 });
  store.set("refreshToken", "", { ...cookieOpts, maxAge: -1 });
  redirect("/login");
}

// ─────────────────────────── UPDATE USER ───────────────────────────
export async function updateUser(formData: FormData) {
  const id = formData.get("_id")?.toString();
  if (!id) throw new Error("User ID is required");

  const entries = Object.fromEntries(formData.entries());
  if (entries.address) {
    try {
      entries.address = JSON.parse(String(entries.address));
    } catch {
      return { address: ["Invalid address format"] };
    }
  }

  const parsed = UserupdateSchema.safeParse(entries);
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;

  const users = await readUsers();
  const index = users.findIndex((u) => u._id === id);
  if (index === -1) return notFound();

  const data = parsed.data;
  const user = users[index];

  const usersDir = path.join(process.cwd(), "public/users");
  await ensureDir(usersDir);

  let avatarPath = user.avatar ?? "";
  if (data.avatar && data.avatar.size > 0) {
    if (user.avatar) {
      try {
        await unlink(path.join(process.cwd(), "public", user.avatar));
      } catch (err: any) {
        if (err.code !== "ENOENT") console.warn("⚠️ Failed to delete old avatar:", err);
      }
    }
    avatarPath = `/users/${crypto.randomUUID()}-${data.avatar.name}`;
    await writeFile(
      path.join(process.cwd(), "public", avatarPath),
      toBytes(await data.avatar.arrayBuffer())
    );
  }

  if (data.password && data.password.trim()) {
    user.password = await hash(data.password, 10);
  }

  if (data.role === "ADMIN" || data.role === "USER") {
    user.role = data.role;
  }

  users[index] = {
    ...user,
  ...data,
  role:
    data.role === "ADMIN"
      ? "ADMIN"
      : data.role === "USER"
      ? "USER"
      : user.role, // fallback to existing role
  avatar: avatarPath,
  updatedAt: new Date().toISOString(),
  };

  await writeUsers(users);
  revalidatePath("/");
  revalidatePath("/users");
  revalidatePath("/admin/users");
}

// ─────────────────────────── DELETE USER ───────────────────────────
export async function deleteUser(id: string) {
  const users = await readUsers();
  const index = users.findIndex((u) => u._id === id);
  if (index === -1) return notFound();

  const user = users[index];
  if (user.avatar) {
    try {
      await unlink(path.join(process.cwd(), "public", user.avatar));
    } catch (err: any) {
      if (err.code !== "ENOENT") console.warn("⚠️ Failed to delete avatar:", err);
    }
  }

  users.splice(index, 1);
  await writeUsers(users);

  revalidatePath("/");
  revalidatePath("/users");
  revalidatePath("/admin/users");
}

// ─────────────────────────── REFRESH TOKEN ───────────────────────────
export async function refreshToken(): Promise<string | null> {
  const store = await cookies();
  const token = store.get("refreshToken")?.value;
  if (!token) return null;

  const users = await readUsers();
  const user = users.find((u) => u.refreshToken === token);
  if (!user) return null;

  const secret = process.env.RefreshTokenSecretKey;
  if (!secret) return null;

  try {
    jwt.verify(token, secret);
  } catch {
    return null;
  }

  const newAccessToken = await generateAccessToken({ email: user.email });
  store.set("token", newAccessToken, cookieOpts);

  return newAccessToken;
}
