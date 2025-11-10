"use server";

import { StorySchema } from "@/src/utils/validation";
import { access, mkdir, unlink, writeFile, readFile, writeFile as writeJSONFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "node:path";
import crypto from "node:crypto";

type Story = {
  _id: string;
  title: string;
  cover: string;
  post: string;
  createdAt: string;
};

// helpers
const toBytes = (ab: ArrayBuffer) => new Uint8Array(ab);

const ensureDir = async (dir: string) => {
  try {
    await access(dir);
  } catch (e: any) {
    if (e.code === "ENOENT") await mkdir(dir, { recursive: true });
    else throw e;
  }
};

async function readJSON<T>(file: string): Promise<T[]> {
  try {
    const data = await readFile(file, "utf8");
    return JSON.parse(data) as T[];
  } catch (e: any) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

async function writeJSON(file: string, data: unknown) {
  await writeJSONFile(file, JSON.stringify(data, null, 2), "utf8");
}

// paths
const storiesFile = path.join(process.cwd(), "data", "stories.json");

// ───────────────────────── addStory
export async function addStory(_state: unknown, formData: FormData) {
  const parsed = StorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("❌ validation:", parsed.error.formErrors.fieldErrors);
    return parsed.error.formErrors.fieldErrors;
  }
  const data = parsed.data;

  const storyDir = path.join(process.cwd(), "public/stories");
  await ensureDir(storyDir);

  // save cover
  const coverPath = `/stories/${crypto.randomUUID()}-${data.cover.name}`;
  await writeFile(
    path.join(process.cwd(), "public", coverPath),
    toBytes(await data.cover.arrayBuffer())
  );

  // save post
  const postPath = `/stories/${crypto.randomUUID()}-${data.post.name}`;
  await writeFile(
    path.join(process.cwd(), "public", postPath),
    toBytes(await data.post.arrayBuffer())
  );

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

// ───────────────────────── deleteStory
export async function deleteStory(id: string) {
  const stories = await readJSON<Story>(storiesFile);
  const index = stories.findIndex((s) => s._id === id);
  if (index === -1) return notFound();

  const story = stories[index];
  const files = [story.cover, story.post].filter(Boolean) as string[];

  await Promise.all(
    files.map(async (rel) => {
      const full = path.join(process.cwd(), "public", rel);
      try {
        await unlink(full);
      } catch (e: any) {
        if (e.code !== "ENOENT") console.warn("⚠️ Failed to delete:", full);
      }
    })
  );

  stories.splice(index, 1);
  await writeJSON(storiesFile, stories);

  revalidatePath("/");
  revalidatePath("/stories");
}
