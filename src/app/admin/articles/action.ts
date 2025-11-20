"use server";

import { ArticleSchema, ArticleEditSchema } from "@/src/utils/validation";
import { promises as fs } from "fs";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "path";
import crypto from "crypto";
import { Article, Comment } from "@/src/utils/types";

// Paths
const ARTICLES_FILE = path.join(process.cwd(), "data", "articles.json");
const ARTICLE_DIR = path.join(process.cwd(), "public", "articles");

// Helpers
async function loadArticles(): Promise<Article[]> {
  try {
    const data = await fs.readFile(ARTICLES_FILE, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveArticles(list: Article[]) {
  await fs.mkdir(path.dirname(ARTICLES_FILE), { recursive: true });
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(list, null, 2), "utf8");
}

async function safeUnlink(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }
}

function safeParseTags(tags: any) {
  if (!tags) return [];
  if (typeof tags !== "string") return tags;
  try {
    return JSON.parse(tags);
  } catch {
    throw new Error("Invalid tags format");
  }
}

async function handleCoverUpload(coverFile?: File, oldPath?: string) {
  if (!coverFile) return oldPath;

  // Remove the old file
  if (oldPath) {
    await safeUnlink(path.join("public", oldPath));
  }

  // Save new file
  await fs.mkdir(ARTICLE_DIR, { recursive: true });
  const filename = `${crypto.randomUUID()}-${coverFile.name}`;
  const filePath = path.join(ARTICLE_DIR, filename);

  const bytes = new Uint8Array(await coverFile.arrayBuffer());
  await fs.writeFile(filePath, bytes);

  return `/articles/${filename}`;
}

/* =====================
   🧩 ADD ARTICLE
===================== */
export async function addArticle(_state: unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  entries.tags = safeParseTags(entries.tags);

  const result = ArticleSchema.safeParse(entries);
  if (!result.success) {
    return { success: false, errors: result.error.formErrors.fieldErrors };
  }

  const data = result.data;

  // Upload cover
  const coverPath = await handleCoverUpload(data.cover);

  // Create fresh article
  const newArticle: Article = {
    _id: crypto.randomUUID(),
    title: data.title,
    content: data.content,
    author: data.author,
    tags: data.tags,
    source: data.source,
    readingTime: data.readingTime,
    categoryId: data.categoryId,
    publishedAt: new Date().toISOString(),
    cover: coverPath!,
    comment: [] as Comment[], // FIXED TYPE
  };

  const articles = await loadArticles();
  articles.push(newArticle);
  await saveArticles(articles);

  revalidatePath("/");
  revalidatePath("/articles");

  redirect("/admin/articles");
}

/* =====================
   🧩 UPDATE ARTICLE
===================== */
export async function updateArticle(_state: unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  entries.tags = safeParseTags(entries.tags);

  const result = ArticleEditSchema.safeParse(entries);
  if (!result.success) {
    return { success: false, errors: result.error.formErrors.fieldErrors };
  }

  const data = result.data;

  const articles = await loadArticles();
  const index = articles.findIndex((a) => a._id === data._id);
  if (index === -1) return notFound();

  const article = articles[index];

  // Handle cover update
  const newCover = await handleCoverUpload(data.cover, article.cover);

  // Apply updates
  articles[index] = {
    ...article,
    ...data,
    cover: newCover ?? article.cover,
    publishedAt:
      data.publishedAt instanceof Date
        ? data.publishedAt.toISOString()
        : data.publishedAt || article.publishedAt,
    comment: article.comment as Comment[], // FIXED TYPE
  };

  await saveArticles(articles);

  revalidatePath("/");
  revalidatePath("/articles");

  redirect("/admin/articles");
}

/* =====================
   🧩 DELETE ARTICLE
===================== */
export async function deleteArticle(id: string) {
  const articles = await loadArticles();
  const index = articles.findIndex((a) => a._id === id);
  if (index === -1) return notFound();

  const article = articles[index];

  await safeUnlink(path.join("public", article.cover));
  articles.splice(index, 1);

  await saveArticles(articles);

  revalidatePath("/");
  revalidatePath("/admin/articles");
}
