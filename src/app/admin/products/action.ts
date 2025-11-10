"use server";

import { ProductSchema } from "@/src/utils/validation";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { redirect, notFound } from "next/navigation";
import { Category, Product, ProductImage } from "@/src/utils/types";

// Helpers
const toBytes = (ab: ArrayBuffer) => new Uint8Array(ab);
const ensureDir = async (dir: string) => {
  try {
    await fs.access(dir);
  } catch (e: any) {
    if (e.code === "ENOENT") await fs.mkdir(dir, { recursive: true });
    else throw e;
  }
};
const readJSON = async <T>(file: string): Promise<T[]> => {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data) as T[];
  } catch (e: any) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
};
const writeJSON = async (file: string, data: unknown) => {
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
};

// Data file paths
const productsFile = path.join(process.cwd(), "data", "products.json");

type Feature = { key: string; value: string };
type Color = { name: string; hex: string };

// ───────────── addProduct
export async function addProduct(_state: unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  const featureArray: Feature[] = (() => {
    try {
      return JSON.parse(String(entries.features ?? "[]"));
    } catch {
      return [];
    }
  })();
  const colorArray: Color[] = (() => {
    try {
      return JSON.parse(String(entries.colors ?? "[]"));
    } catch {
      return [];
    }
  })();

  const parsedEntries = {
    ...entries,
    price: Number(entries.price ?? 0),
    discount: Number(entries.discount ?? 0),
    discount_price: Number(entries.discount_price ?? 0),
    rating: Number(entries.rating ?? 0),
    voter: Number(entries.voter ?? 0),
  };

  const result = ProductSchema.safeParse(parsedEntries);
  if (!result.success) {
    console.log("❌ Validation:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;

  // Make sure folder exists
  const productDir = path.join(process.cwd(), "public/products");
  await ensureDir(productDir);

  // Save thumbnail
  const thumbnailPath = `/products/${crypto.randomUUID()}-${data.thumbnail.name}`;
  await fs.writeFile(
    path.join(process.cwd(), "public", thumbnailPath),
    toBytes(await data.thumbnail.arrayBuffer())
  );

  // Save extra images
  const imagePaths: string[] = [];
  const seen = new Set<string>();
  const images = formData.getAll("image") as File[];
  await Promise.all(
    images.map(async (image) => {
      if (!(image instanceof File) || seen.has(image.name)) return;
      seen.add(image.name);
      const p = `/products/${crypto.randomUUID()}-${image.name}`;
      await fs.writeFile(
        path.join(process.cwd(), "public", p),
        toBytes(await image.arrayBuffer())
      );
      imagePaths.push(p);
    })
  );

  // Create product object
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
    images: imagePaths,
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  await writeJSON(productsFile, products);

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

// ───────────── updateProduct
export async function updateProduct(_state: unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  const featureArray: Feature[] = (() => {
    try {
      return JSON.parse(String(entries.features ?? "[]"));
    } catch {
      return [];
    }
  })();
  const colorArray: Color[] = (() => {
    try {
      return JSON.parse(String(entries.colors ?? "[]"));
    } catch {
      return [];
    }
  })();

  const result = ProductSchema.safeParse(entries);
  if (!result.success) {
    console.log("❌ Validation:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const products = await readJSON<Product>(productsFile);
  const index = products.findIndex((p) => p._id === data._id);
  if (index === -1) return notFound();

  const existing = products[index];
  const productDir = path.join(process.cwd(), "public/products");
  await ensureDir(productDir);

  let thumbnailPath = existing.thumbnail;
  if (data.thumbnail instanceof File && data.thumbnail.size > 0) {
    thumbnailPath = `/products/${crypto.randomUUID()}-${data.thumbnail.name}`;
    await fs.writeFile(
      path.join(process.cwd(), "public", thumbnailPath),
      toBytes(await data.thumbnail.arrayBuffer())
    );
  }

  // handle new images
  const imagePaths = [...(existing.images || [])];
  const images = formData.getAll("image") as File[];
  const seen = new Set(imagePaths);
  for (const image of images) {
    if (image instanceof File) {
      const p = `/products/${crypto.randomUUID()}-${image.name}`;
      if (!seen.has(p)) {
        await fs.writeFile(
          path.join(process.cwd(), "public", p),
          toBytes(await image.arrayBuffer())
        );
        imagePaths.push(p);
      }
    }
  }

  products[index] = {
    ...existing,
    ...data,
    thumbnail: thumbnailPath,
    features: featureArray,
    colors: colorArray,
    images: imagePaths as string[],
    updatedAt: new Date().toISOString(),
  };

  await writeJSON(productsFile, products);

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

// ───────────── deleteProduct
export async function deleteProduct(id: string) {
  const products = await readJSON<Product>(productsFile);
  const index = products.findIndex((p) => p._id === id);
  if (index === -1) return notFound();

  const product = products[index];
  const allImages = [product.thumbnail, ...(product.images || [])];

for (const rel of allImages) {
  const filePath =
    typeof rel === "string"
      ? rel
      : (rel as ProductImage).url; // handle ProductImage object
  try {
    await fs.unlink(path.join(process.cwd(), "public", filePath));
  } catch (e: any) {
    if (e.code !== "ENOENT") console.warn("⚠️ Failed to delete:", filePath);
  }
}

  products.splice(index, 1);
  await writeJSON(productsFile, products);

  revalidatePath("/");
  revalidatePath("/products");
}
