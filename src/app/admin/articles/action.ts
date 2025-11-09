"use server";

import { ArticleSchema, ArticleEditSchema } from "@/utils/validation";
import { promises as fs, unlink, writeFile } from "fs";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "path";
import { promisify } from "util";

const unlinkAsync = promisify(unlink);
const writeFileAsync = promisify(writeFile);

export async function addArticle(_state:unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());

  // Parse tags if they are sent as a string
  if (typeof entries.tags === "string") {
    try {
      entries.tags = JSON.parse(entries.tags);
    } catch (error:unknown) {
      console.error("Failed to parse tags:", error);
      return { tags: ["Invalid tags format"] };
    }
  }

  const result = ArticleSchema.safeParse(entries);

  if (result.success === false) {
    console.log("❌ Validation errors:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  // Define the directory path
  const articleDir = path.join(process.cwd(), "public/articles");
  try {
    await fs.access(articleDir);
  } catch (error:unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.mkdir(articleDir, { recursive: true });
    } else {
      throw error;
    }
  }

  const coverPath = `/articles/${crypto.randomUUID()}-${data.cover.name}`;
 const ab = await data.cover.arrayBuffer();
  const bytes = new Uint8Array(ab);
  await writeFileAsync(path.join(process.cwd(), "public", coverPath), bytes)



  revalidatePath("/");
  revalidatePath("/articles");

  redirect("/admin/articles");
}

export async function updateArticle(_state:unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());

  // Parse tags if they are sent as a string
  if (typeof entries.tags === "string") {
    try {
      entries.tags = JSON.parse(entries.tags);
    } catch (error) {
      console.error("Failed to parse tags:", error);
      return { tags: ["Invalid tags format"] };
    }
  }

  const result = ArticleEditSchema.safeParse(entries);

  if (result.success === false) {
    console.log("❌❌❌", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  revalidatePath("/");
  revalidatePath("/articles");

  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {

  revalidatePath("/");
  revalidatePath("/admin/articles");
}
