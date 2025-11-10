"use server";

import { hash } from "bcryptjs";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { User } from "@/src/utils/types";

// ---------- Helpers ----------
const USERS_FILE = path.join(process.cwd(), "data", "users.json");

async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export const hashPassword = async (password: string) => {
  return await hash(password, 12);
};

export const generateAccessToken = async (data: Record<string, any>) => {
  const secret = process.env.AccessTokenSecretKey || "access_secret";
  return sign({ ...data }, secret, { expiresIn: "60d" });
};

export const verifyAccessToken = async (token: string) => {
  try {
    const secret = process.env.AccessTokenSecretKey || "access_secret";
    return verify(token, secret) as JwtPayload;
  } catch (err) {
    console.warn("Invalid Access Token:", err);
    return false;
  }
};

export const generateRefreshToken = async (data: Record<string, any>) => {
  const secret = process.env.RefreshTokenSecretKey || "refresh_secret";
  return sign({ ...data }, secret, { expiresIn: "15d" });
};

// ---------- Auth Logic (mocked) ----------
export async function refreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const rt = cookieStore.get("refreshToken")?.value;
  if (!rt) return null;

  const secret = process.env.RefreshTokenSecretKey || "refresh_secret";
  try {
    const decoded = verify(rt, secret) as JwtPayload;
    if (!decoded?.email) return null;

    // ✅ Generate a new access token
    const newAccessToken = generateAccessToken({ email: decoded.email });
    cookieStore.set("token", newAccessToken, { httpOnly: true, path: "/" });

    return newAccessToken;
  } catch {
    return null;
  }
}

export async function authUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    const tokenPayload = verifyAccessToken(token.value);
    if (typeof tokenPayload === "object" && "email" in tokenPayload) {
      const users = await readUsers();
      const user = users.find((u) => u.email === tokenPayload.email);
      if (user) return user;
    }
  }

  // Try refreshing token if access token is invalid/expired
  const newAccessToken = await refreshToken();
  if (newAccessToken) {
    const newTokenPayload = verifyAccessToken(newAccessToken);
    if (typeof newTokenPayload === "object" && "email" in newTokenPayload) {
      const users = await readUsers();
      return users.find((u) => u.email === newTokenPayload.email) ?? null;
    }
  }

  return null;
}
