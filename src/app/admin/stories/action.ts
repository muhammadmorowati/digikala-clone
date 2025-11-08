"use server";

import { StorySchema } from "@/utils/validation";
import connectToDB from "@/../config/mongodb";
import fs from "fs/promises";
import StoryModel from "@/../models/Story";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "path";
import { access, mkdir, unlink, writeFile } from "node:fs/promises"

// helpers
const toBytes = (ab: ArrayBuffer) => new Uint8Array(ab)
const ensureDir = async (dir: string) => {
  try {
    await access(dir);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") await mkdir(dir, { recursive: true });
    else throw e;
  }
};

export async function addStory(_state: unknown, formData: FormData) {
  await connectToDB();

  const parsed = StorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("❌ validation:", parsed.error.formErrors.fieldErrors);
    return parsed.error.formErrors.fieldErrors;
  }
  const data = parsed.data;

  // ensure /public/stories exists
  const storyDir = path.join(process.cwd(), "public/stories");
  await ensureDir(storyDir);

  // cover
  const coverPath = `/stories/${crypto.randomUUID()}-${data.cover.name}`;
  await writeFile(
    path.join(process.cwd(), "public", coverPath),
    toBytes(await data.cover.arrayBuffer())
  );

  // post
  const postPath = `/stories/${crypto.randomUUID()}-${data.post.name}`;
  await writeFile(
    path.join(process.cwd(), "public", postPath),
    toBytes(await data.post.arrayBuffer())
  );

  await StoryModel.create({
    title: data.title,
    cover: coverPath,
    post: postPath,
  });

  revalidatePath("/");
  revalidatePath("/stories");
  redirect("/admin/stories");
}

export async function deleteStory(id: string) {
  await connectToDB();

  const story = await StoryModel.findOneAndDelete({ _id: id });
  if (!story) return notFound();

  // remove files (ignore ENOENT)
  const files = [story.cover, story.post].filter(Boolean) as string[];
  await Promise.all(
    files.map(async (rel) => {
      const full = path.join(process.cwd(), "public", rel);
      try {
        await unlink(full);
      } catch (e) {
        const err = e as NodeJS.ErrnoException;
        if (err.code !== "ENOENT") {
          console.error("Failed to delete file:", full, err);
        }
      }
    })
  );

  revalidatePath("/");
  revalidatePath("/stories");
}