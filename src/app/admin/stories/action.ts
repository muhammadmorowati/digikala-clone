"use server";

import { StorySchema } from "@/src/utils/validation";
import {
  access,
  mkdir,
  unlink,
  writeFile,
  readFile,
} from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "node:path";
import crypto from "node:crypto";

// ─────────────────────────── Types ───────────────────────────
type Story = {
  _id: string;
  title: string;
  cover: string;
  post: string;
  createdAt: string;
};

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

async function readJSON<T>(filePath: string): Promise<T[]> {
  try {
    const data = await readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeJSON(filePath: string, data: unknown) {
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

// ─────────────────────────── Constants ───────────────────────────
const storiesFile = path.join(process.cwd(), "data", "stories.json");
const storiesDir = path.join(process.cwd(), "public", "stories");

// ─────────────────────────── addStory ───────────────────────────
export async function addStory(_state: unknown, formData: FormData) {
  const parsed = StorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    console.error("❌ Validation error:", parsed.error.formErrors.fieldErrors);
    return parsed.error.formErrors.fieldErrors;
  }

  const data = parsed.data;
  await ensureDir(storiesDir);

  // Save cover
  const coverPath = `/stories/${crypto.randomUUID()}-${data.cover.name}`;
  await writeFile(
    path.join(process.cwd(), "public", coverPath),
    toBytes(await data.cover.arrayBuffer())
  );

  // Save post
  const postPath = `/stories/${crypto.randomUUID()}-${data.post.name}`;
  await writeFile(
    path.join(process.cwd(), "public", postPath),
    toBytes(await data.post.arrayBuffer())
  );

  // Read and append new story
  const stories = await readJSON<Story>(storiesFile);
  const newStory: Story = {
    _id: crypto.randomUUID(),
    title: data.title,
    cover: coverPath,
    post: postPath,
    createdAt: new Date().toISOString(),
  };

  stories.push(newStory);
  await writeJSON(storiesFile, stories);

  revalidatePath("/");
  revalidatePath("/stories");
  redirect("/admin/stories");
}

// ─────────────────────────── deleteStory ───────────────────────────
export async function deleteStory(id: string) {
  const stories = await readJSON<Story>(storiesFile);
  const index = stories.findIndex((story) => story._id === id);
  if (index === -1) return notFound();

  const story = stories[index];
  const filePaths = [story.cover, story.post].filter(Boolean);

  // Remove files safely
  await Promise.all(
    filePaths.map(async (relPath) => {
      const fullPath = path.join(process.cwd(), "public", relPath);
      try {
        await unlink(fullPath);
      } catch (err: any) {
        if (err.code !== "ENOENT")
          console.warn("⚠️ Failed to delete:", fullPath);
      }
    })
  );

  // Update file list
  stories.splice(index, 1);
  await writeJSON(storiesFile, stories);

  revalidatePath("/");
  revalidatePath("/stories");
}
