"use server";

import { ProductImage } from "@/utils/types";
import { ProductSchema } from "@/utils/validation";
import crypto from "node:crypto";
import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "node:path";

// ───────────── helpers
const toBytes = (ab: ArrayBuffer) => new Uint8Array(ab); // ArrayBufferView for writeFile
const ensureDir = async (dir: string) => {
  try {
    await access(dir);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") await mkdir(dir, { recursive: true });
    else throw e;
  }
};
const num = (v: FormDataEntryValue | undefined) => Number(v ?? 0);
const idStr = (v: FormDataEntryValue | undefined) => (v?.toString() ?? "");

// ───────────── addProduct
export async function addProduct(_state: unknown, formData: FormData) {

  const entries = Object.fromEntries(formData.entries());
  // parse arrays safely
  const featureArray: Array<{ key: string; value: string }> = (() => {
    try { return JSON.parse(String(entries.features ?? "[]")); } catch { return []; }
  })();
  const colorArray: Array<{ name: string; hex: string }> = (() => {
    try { return JSON.parse(String(entries.colors ?? "[]")); } catch { return []; }
  })();

  const parsedEntries = {
    ...entries,
    rating: num(entries.rating),
    voter: num(entries.voter),
    price: num(entries.price),
    discount: num(entries.discount),
    discount_price: num(entries.discount_price),
    recommended_percent: num(entries.recommended_percent),
    likes: num(entries.likes),
    submenuId: idStr(entries.submenuId),
    submenuItemId: idStr(entries.submenuItemId),
  };

  const result = ProductSchema.safeParse(parsedEntries);
  if (!result.success) {
    console.log("❌ validation:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;

  // ensure dir
  const productDir = path.join(process.cwd(), "public/products");
  await ensureDir(productDir);

  // thumbnail
  const thumbnailPath = `/products/${crypto.randomUUID()}-${data.thumbnail.name}`;
  await writeFile(
    path.join(process.cwd(), "public", thumbnailPath),
    toBytes(await data.thumbnail.arrayBuffer())
  );


  // features
  const featureIds: string[] = [];

  // colors
  const colorIds: string[] = [];

  // extra images
  const imageIds: string[] = [];
  const images = formData.getAll("image");
  const seenNames = new Set<string>();

  await Promise.all(
    (images as File[]).map(async (image) => {
      if (!(image instanceof File)) return;
      // avoid duplicate file names in the same submission
      if (seenNames.has(image.name)) return;
      seenNames.add(image.name);

      const p = `/products/${crypto.randomUUID()}-${image.name}`;
      await writeFile(path.join(process.cwd(), "public", p), toBytes(await image.arrayBuffer()));

    })
  );


  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

// ───────────── updateProduct
export async function updateProduct(_state: unknown, formData: FormData) {

  const entries = Object.fromEntries(formData.entries());
  const featureArray: Array<{ key: string; value: string }> = (() => {
    try { return JSON.parse(String(entries.features ?? "[]")); } catch { return []; }
  })();
  const colorArray: Array<{ name: string; hex: string }> = (() => {
    try { return JSON.parse(String(entries.colors ?? "[]")); } catch { return []; }
  })();

  const parsedEntries = {
    ...entries,
    rating: num(entries.rating),
    voter: num(entries.voter),
    price: num(entries.price),
    discount: num(entries.discount),
    discount_price: num(entries.discount_price),
    recommended_percent: num(entries.recommended_percent),
    likes: num(entries.likes),
    submenuId: idStr(entries.submenuId),
    submenuItemId: idStr(entries.submenuItemId),
  };

  const result = ProductSchema.safeParse(parsedEntries);
  if (!result.success) {
    console.log("❌ validation:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const productId = data._id;

  const productDir = path.join(process.cwd(), "public/products");
  await ensureDir(productDir);

  // features (upsert & prune)
  const newFeatureIds: string[] = [];
 
  // colors (upsert & prune)
  const newColorIds: string[] = [];

  const newImageIds: string[] = [];

  const images = formData.getAll("image");
  await Promise.all(
    (images as File[]).map(async (image) => {
      if (!(image instanceof File)) return;
      // generate a path and avoid duplicates by full path
      const p = `/products/${crypto.randomUUID()}-${image.name}`;

      revalidatePath("/");
      revalidatePath("/products");
      redirect("/admin/products");
    }
    ))
}
