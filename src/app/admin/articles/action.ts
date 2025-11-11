"use server";

import { ArticleSchema, ArticleEditSchema } from "@/src/utils/validation";
import { promises as fs } from "fs";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "path";
import { Article } from "@/src/utils/types";

// Paths
const articlesFilePath = path.join(process.cwd(), "data", "articles.json");
const articleDir = path.join(process.cwd(), "public", "articles");

// Helpers
async function loadArticles(): Promise<Article[]> {
  try {
    const data = await fs.readFile(articlesFilePath, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveArticles(articles: Article[]) {
  await fs.mkdir(path.dirname(articlesFilePath), { recursive: true });
  await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), "utf8");
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

// 🧩 ADD ARTICLE
export async function addArticle(_state: unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  entries.tags = safeParseTags(entries.tags);

  const result = ArticleSchema.safeParse(entries);
  if (!result.success) {
    return { success: false, errors: result.error.formErrors.fieldErrors };
  }

  const data = result.data;
  await fs.mkdir(articleDir, { recursive: true });

  const coverFileName = `${crypto.randomUUID()}-${data.cover.name}`;
  const coverPath = `/articles/${coverFileName}`;
  const bytes = new Uint8Array(await data.cover.arrayBuffer());
  await fs.writeFile(path.join(articleDir, coverFileName), bytes);

  const articles = await loadArticles();
  const newArticle: Article = {
    _id: crypto.randomUUID(),
    title: data.title,
    content: data.content,
    author: data.author,
    tags: data.tags,
    source: data.source,
    readingTime: data.readingTime,
    publishedAt: new Date(),
    cover: coverPath,
    comment: [],
    categoryId: data.categoryId,
  };

  articles.push(newArticle);
  await saveArticles(articles);
  revalidatePath("/");
  revalidatePath("/articles");

  redirect("/admin/articles");
}

// 🧩 UPDATE ARTICLE
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

  let coverPath = articles[index].cover;
  if (data.cover) {
    await safeUnlink(path.join("public", coverPath));
    const coverFileName = `${crypto.randomUUID()}-${data.cover.name}`;
    coverPath = `/articles/${coverFileName}`;
    const bytes = new Uint8Array(await data.cover.arrayBuffer());
    await fs.writeFile(path.join(articleDir, coverFileName), bytes);
  }

  articles[index] = {
    ...articles[index],
    ...data,
    cover: coverPath,
    publishedAt: data.publishedAt ?? articles[index].publishedAt,
  };

  await saveArticles(articles);
  revalidatePath("/");
  revalidatePath("/articles");

  redirect("/admin/articles");
}

// 🧩 DELETE ARTICLE
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
