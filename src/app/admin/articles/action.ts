"use server";

import { ArticleSchema, ArticleEditSchema } from "@/src/utils/validation";
import { promises as fs } from "fs";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "path";

// Paths
const articlesFilePath = path.join(process.cwd(), "data", "articles.json");
const articleDir = path.join(process.cwd(), "public", "articles");

// Helper: load articles.json
async function loadArticles() {
  try {
    const data = await fs.readFile(articlesFilePath, "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

// Helper: save articles.json
async function saveArticles(articles: any[]) {
  await fs.mkdir(path.dirname(articlesFilePath), { recursive: true });
  await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), "utf8");
}

// 🧩 ADD ARTICLE
export async function addArticle(_state: unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());

  // Parse tags if they come as stringified JSON
  if (typeof entries.tags === "string") {
    try {
      entries.tags = JSON.parse(entries.tags);
    } catch {
      return { tags: ["Invalid tags format"] };
    }
  }

  const result = ArticleSchema.safeParse(entries);
  if (!result.success) {
    console.log("❌ Validation errors:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  // Ensure directory exists
  await fs.mkdir(articleDir, { recursive: true });

  // Save cover image
  const coverPath = `/articles/${crypto.randomUUID()}-${data.cover.name}`;
  const ab = await data.cover.arrayBuffer();
  const bytes = new Uint8Array(ab);
  await fs.writeFile(path.join("public", coverPath), bytes);

  // Load current articles
  const articles = await loadArticles();

  // Add new article
  const newArticle = {
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

  // Parse tags if stringified
  if (typeof entries.tags === "string") {
    try {
      entries.tags = JSON.parse(entries.tags);
    } catch {
      return { tags: ["Invalid tags format"] };
    }
  }

  const result = ArticleEditSchema.safeParse(entries);
  if (!result.success) {
    console.log("❌ Validation errors:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const articleId = data._id;

  const articles = await loadArticles();
  const articleIndex = articles.findIndex((a: any) => a._id === articleId);
  if (articleIndex === -1) return notFound();

  let coverPath = articles[articleIndex].cover;

  // If new cover uploaded, replace it
  if (data.cover) {
    // Remove old cover
    try {
      await fs.unlink(path.join("public", coverPath));
    } catch {
      /* ignore if not found */
    }

    // Save new one
    coverPath = `/articles/${crypto.randomUUID()}-${data.cover.name}`;
    const ab = await data.cover.arrayBuffer();
    const bytes = new Uint8Array(ab);
    await fs.writeFile(path.join("public", coverPath), bytes);
  }

  // Update article
  articles[articleIndex] = {
    ...articles[articleIndex],
    title: data.title,
    content: data.content,
    author: data.author,
    tags: data.tags,
    source: data.source,
    readingTime: data.readingTime,
    publishedAt:
      data.publishedAt || articles[articleIndex].publishedAt,
    cover: coverPath,
    categoryId: data.categoryId,
  };

  await saveArticles(articles);

  revalidatePath("/");
  revalidatePath("/articles");
  redirect("/admin/articles");
}

// 🧩 DELETE ARTICLE
export async function deleteArticle(id: string) {
  const articles = await loadArticles();
  const index = articles.findIndex((a: any) => a._id === id);
  if (index === -1) return notFound();

  const article = articles[index];
  // Remove cover image
  try {
    await fs.unlink(path.join("public", article.cover));
  } catch {
    /* ignore if missing */
  }

  // Remove from list
  articles.splice(index, 1);
  await saveArticles(articles);

  revalidatePath("/");
  revalidatePath("/admin/articles");
}
