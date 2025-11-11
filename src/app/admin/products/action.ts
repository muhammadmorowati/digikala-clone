"use server";

import { ProductSchema } from "@/src/utils/validation";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { Category, Product } from "@/src/utils/types";

// ─────────────────────────── helpers ───────────────────────────
const toBytes = (ab: ArrayBuffer) => new Uint8Array(ab);

async function ensureDir(dir: string) {
  try {
    await fs.access(dir);
  } catch (err: any) {
    if (err.code === "ENOENT") await fs.mkdir(dir, { recursive: true });
    else throw err;
  }
}

async function readJSON<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeJSON(filePath: string, data: unknown) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Data file path
const productsFile = path.join(process.cwd(), "data", "products.json");

type Feature = { key: string; value: string };
type Color = { name: string; hex: string };

// ─────────────────────────── addProduct ───────────────────────────
export async function addProduct(_state: unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());

  const featureArray: Feature[] = safeParseJSON(entries.features);
  const colorArray: Color[] = safeParseJSON(entries.colors);

  const numericEntries = {
    ...entries,
    price: Number(entries.price ?? 0),
    discount: Number(entries.discount ?? 0),
    discount_price: Number(entries.discount_price ?? 0),
    rating: Number(entries.rating ?? 0),
    voter: Number(entries.voter ?? 0),
  };

  const result = ProductSchema.safeParse(numericEntries);
  if (!result.success) {
    console.error("❌ Validation:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const productDir = path.join(process.cwd(), "public/products");
  await ensureDir(productDir);

  // Thumbnail
  const thumbnailPath = `/products/${crypto.randomUUID()}-${data.thumbnail.name}`;
  await fs.writeFile(
    path.join(process.cwd(), "public", thumbnailPath),
    toBytes(await data.thumbnail.arrayBuffer())
  );

  // Extra images
  const imagePaths: string[] = [];
  const seen = new Set<string>();
  for (const file of formData.getAll("image") as File[]) {
    if (file instanceof File && !seen.has(file.name)) {
      seen.add(file.name);
      const imgPath = `/products/${crypto.randomUUID()}-${file.name}`;
      await fs.writeFile(
        path.join(process.cwd(), "public", imgPath),
        toBytes(await file.arrayBuffer())
      );
      imagePaths.push(imgPath);
    }
  }

  const products = await readJSON<Product>(productsFile);

  const newProduct: Product = {
    _id: crypto.randomUUID(),
    title: data.title,
    en_title: data.en_title,
    price: data.price,
    discount: data.discount,
    discount_price: data.discount_price,
    rating: data.rating,
    voter: data.voter,
    thumbnail: thumbnailPath,
    description: data.description ?? "",
    category: { _id: data.categoryId } as Category,
    submenuId: data.submenuId,
    submenuItemId: data.submenuItemId,
    features: featureArray,
    colors: colorArray,
    images: imagePaths, // all strings
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  await writeJSON(productsFile, products);

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

// ─────────────────────────── updateProduct ───────────────────────────
export async function updateProduct(_state: unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  const featureArray: Feature[] = safeParseJSON(entries.features);
  const colorArray: Color[] = safeParseJSON(entries.colors);

  const result = ProductSchema.safeParse(entries);
  if (!result.success) {
    console.error("❌ Validation:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const products = await readJSON<Product>(productsFile);
  const index = products.findIndex((p) => p._id === data._id);
  if (index === -1) return notFound();

  const existing = products[index];
  const productDir = path.join(process.cwd(), "public/products");
  await ensureDir(productDir);

  // Thumbnail replacement
  let thumbnailPath = existing.thumbnail;
  if (data.thumbnail instanceof File && data.thumbnail.size > 0) {
    thumbnailPath = `/products/${crypto.randomUUID()}-${data.thumbnail.name}`;
    await fs.writeFile(
      path.join(process.cwd(), "public", thumbnailPath),
      toBytes(await data.thumbnail.arrayBuffer())
    );
  }

  // Add new images
  const imagePaths = [...(existing.images || [])] as string[];
  const seen = new Set(imagePaths);
  for (const file of formData.getAll("image") as File[]) {
    if (file instanceof File) {
      const imgPath = `/products/${crypto.randomUUID()}-${file.name}`;
      if (!seen.has(imgPath)) {
        await fs.writeFile(
          path.join(process.cwd(), "public", imgPath),
          toBytes(await file.arrayBuffer())
        );
        imagePaths.push(imgPath);
      }
    }
  }

  products[index] = {
    ...existing,
    ...data,
    thumbnail: thumbnailPath,
    features: featureArray,
    colors: colorArray,
    images: imagePaths,
    updatedAt: new Date().toISOString(),
  };

  await writeJSON(productsFile, products);

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

// ─────────────────────────── deleteProduct ───────────────────────────
export async function deleteProduct(id: string) {
  const products = await readJSON<Product>(productsFile);
  const index = products.findIndex((p) => p._id === id);
  if (index === -1) return notFound();

  const product = products[index];
  const allImages: string[] = [
    product.thumbnail,
    ...(product.images?.map((img) => (typeof img === "string" ? img : img.url)) || []),
  ];

  for (const rel of allImages) {
    try {
      await fs.unlink(path.join(process.cwd(), "public", rel));
    } catch (err: any) {
      if (err.code !== "ENOENT") console.warn("⚠️ Failed to delete:", rel);
    }
  }

  products.splice(index, 1);
  await writeJSON(productsFile, products);

  revalidatePath("/");
  revalidatePath("/products");
}

// ─────────────────────────── utilities ───────────────────────────
function safeParseJSON(input: unknown) {
  if (typeof input !== "string") return [];
  try {
    return JSON.parse(input);
  } catch {
    return [];
  }
}
