"use server";

import connectToDB from "@/config/mongodb";
import { ProductImage } from "@/src/utils/types";
import { ProductSchema } from "@/src/utils/validation";
import crypto from "node:crypto";
import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import ColorModel from "@/models/Color";
import FeatureModel from "@/models/Feature";
import ImageModel from "@/models/Image";
import ProductModel from "@/models/Product";
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
  await connectToDB();

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

  // create product
  const product = await ProductModel.create({
    title: data.title,
    en_title: data.en_title,
    rating: data.rating,
    voter: data.voter,
    sizes: data.sizes,
    thumbnail: thumbnailPath,
    price: data.price,
    discount: data.discount,
    discount_price: data.discount_price,
    description: data.description || "",
    recommended_percent: data.recommended_percent,
    guarantee: data.guarantee,
    likes: data.likes,
    images: [],
    colors: [],
    features: [],
    category: data.categoryId,
    submenuId: data.submenuId,
    submenuItemId: data.submenuItemId,
  });

  // features
  const featureIds: string[] = [];
  for (const f of featureArray) {
    const newFeature = await FeatureModel.create({
      key: f.key,
      value: f.value,
      productId: product._id,
    });
    featureIds.push(newFeature._id);
  }

  // colors
  const colorIds: string[] = [];
  for (const c of colorArray) {
    const newColor = await ColorModel.create({
      name: c.name,
      hex: c.hex,
      productId: product._id,
    });
    colorIds.push(newColor._id);
  }

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

      const created = await ImageModel.create({ url: p, productId: product._id });
      imageIds.push(created._id);
    })
  );

  await ProductModel.findByIdAndUpdate(product._id, {
    $set: { images: imageIds, colors: colorIds, features: featureIds },
  });

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

// ───────────── updateProduct
export async function updateProduct(_state: unknown, formData: FormData) {
  await connectToDB();

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
  const product = await ProductModel.findById(productId);
  if (!product) throw new Error(`Product with id ${productId} not found`);

  const productDir = path.join(process.cwd(), "public/products");
  await ensureDir(productDir);

  // thumbnail (optional)
  let thumbnailPath = product.thumbnail;
  if (data.thumbnail) {
    thumbnailPath = `/products/${crypto.randomUUID()}-${data.thumbnail.name}`;
    await writeFile(
      path.join(process.cwd(), "public", thumbnailPath),
      toBytes(await data.thumbnail.arrayBuffer())
    );
  }

  await ProductModel.findByIdAndUpdate(productId, {
    title: data.title,
    en_title: data.en_title,
    rating: data.rating,
    voter: data.voter,
    sizes: data.sizes,
    thumbnail: thumbnailPath,
    price: data.price,
    discount: data.discount,
    discount_price: data.discount_price,
    description: data.description || "",
    recommended_percent: data.recommended_percent,
    guarantee: data.guarantee,
    likes: data.likes,
    category: data.categoryId,
    submenuId: data.submenuId,
    submenuItemId: data.submenuItemId,
  });

  // features (upsert & prune)
  const existingFeatureIds = await FeatureModel.find({ productId }).distinct("_id");
  const newFeatureIds: string[] = [];
  for (const f of featureArray) {
    const updated = await FeatureModel.findOneAndUpdate(
      { productId, key: f.key },
      { value: f.value },
      { new: true, upsert: true }
    );
    newFeatureIds.push(updated._id);
  }
  await FeatureModel.deleteMany({ _id: { $in: existingFeatureIds.filter((id) => !newFeatureIds.includes(id)) } });

  // colors (upsert & prune)
  const existingColorIds = await ColorModel.find({ productId }).distinct("_id");
  const newColorIds: string[] = [];
  for (const c of colorArray) {
    const updated = await ColorModel.findOneAndUpdate(
      { productId, name: c.name },
      { hex: c.hex },
      { new: true, upsert: true }
    );
    newColorIds.push(updated._id);
  }
  await ColorModel.deleteMany({ _id: { $in: existingColorIds.filter((id) => !newColorIds.includes(id)) } });

  // images (create new & prune removed)
  const existingImageIds = await ImageModel.find({ productId }).distinct("_id");
  const existingImageUrls = await ImageModel.find({ productId }).distinct("url"); // ✅ URLs from DB (not product.images)
  const newImageIds: string[] = [];

  const images = formData.getAll("image");
  const seen = new Set<string>(existingImageUrls);
  await Promise.all(
    (images as File[]).map(async (image) => {
      if (!(image instanceof File)) return;
      // generate a path and avoid duplicates by full path
      const p = `/products/${crypto.randomUUID()}-${image.name}`;
      if (seen.has(p)) return;
      seen.add(p);
      await writeFile(path.join(process.cwd(), "public", p), toBytes(await image.arrayBuffer()));
      const created = await ImageModel.create({ url: p, productId: product._id });
      newImageIds.push(created._id);
    })
  );

  await ImageModel.deleteMany({ _id: { $in: existingImageIds.filter((id) => !newImageIds.includes(id)) } });

  await ProductModel.findByIdAndUpdate(product._id, {
    $set: { images: newImageIds, colors: newColorIds, features: newFeatureIds },
  });

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

// ───────────── deleteProduct
export async function deleteProduct(id: string) {
  await connectToDB();

  const productWithImages = await ProductModel.findOne({ _id: id }).populate("images");
  if (!productWithImages) return notFound();

  const imagePaths = (productWithImages.images as ProductImage[]).map((img) => img.url);
  const allImagePaths = [productWithImages.thumbnail, ...imagePaths].filter(Boolean) as string[];

  await Promise.all(
    allImagePaths.map(async (rel) => {
      const full = path.join(process.cwd(), "public", rel);
      try {
        await unlink(full);
      } catch (e) {
        const err = e as NodeJS.ErrnoException;
        if (err.code === "ENOENT") {
          console.warn("File not found:", full);
        } else {
          console.error("Failed to delete file:", full, err);
        }
      }
    })
  );

  await Promise.all([
    ImageModel.deleteMany({ productId: id }),
    FeatureModel.deleteMany({ productId: id }),
    ColorModel.deleteMany({ productId: id }),
    ProductModel.findOneAndDelete({ _id: id }),
  ]);

  revalidatePath("/");
  revalidatePath("/products");
}
