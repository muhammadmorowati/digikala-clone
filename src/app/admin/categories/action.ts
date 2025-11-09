"use server";
import {
  CategorySchema,
  categoryEditSchema,
  CategorySubmenusSchema,
  CategorySubmenuItemSchema,
} from "@/utils/validation";
import { access, mkdir, unlink, writeFile } from "node:fs/promises"
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "node:path";

// کمک تایپ‌ها
type PathStr = string;
type Bytes = Uint8Array;

function toBytes(ab: ArrayBuffer): Bytes {
  return new Uint8Array(ab);
}

// ───────────────── addCategory ─────────────────
export async function addCategory(_state: unknown, formData: FormData) {

  const heros = formData.getAll("hero");
  const banners = formData.getAll("banner");

  const parsed = CategorySchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    hero: heros,
    banner: banners,
  });
  if (!parsed.success) {
    return parsed.error.formErrors.fieldErrors;
  }
  const data = parsed.data;

  // اطمینان از وجود پوشه
  const categoryDir = path.join(process.cwd(), "public/categories");
  try {
    await access(categoryDir);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") await mkdir(categoryDir, { recursive: true });
    else throw e;
  }

  // ذخیره cover
  const coverPath: PathStr = `/categories/${crypto.randomUUID()}-${data.cover.name}`;
  await writeFile(
    path.join(process.cwd(), "public", coverPath),
    toBytes(await data.cover.arrayBuffer()) // ✅ ArrayBufferView
  );

  // ذخیره icon
  const iconPath: PathStr = `/categories/${crypto.randomUUID()}-${data.icon.name}`;
  await writeFile(
    path.join(process.cwd(), "public", iconPath),
    toBytes(await data.icon.arrayBuffer())
  );

  // hero images
  const heroPaths: PathStr[] = []; // ✅ تایپ صریح
  const existingHeros = new Set<string>();

  await Promise.all(
    (heros as File[]).map(async (image) => {
      if (image instanceof File) {
        const imagePath: PathStr = `/categories/hero/${crypto.randomUUID()}-${image.name}`;
        if (!existingHeros.has(image.name)) {
          existingHeros.add(image.name);
          await writeFile(
            path.join(process.cwd(), "public", imagePath),
            toBytes(await image.arrayBuffer())
          );
          heroPaths.push(imagePath);
        }
      }
    })
  );

  // banner images
  const bannerPaths: PathStr[] = []; // ✅ تایپ صریح
  const existingBanners = new Set<string>();

  await Promise.all(
    (banners as File[]).map(async (image) => {
      if (image instanceof File) {
        const imagePath: PathStr = `/categories/banner/${crypto.randomUUID()}-${image.name}`;
        if (!existingBanners.has(image.name)) {
          existingBanners.add(image.name);
          await writeFile(
            path.join(process.cwd(), "public", imagePath),
            toBytes(await image.arrayBuffer())
          );
          bannerPaths.push(imagePath);
        }
      }
    })
  );


  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/admin/categories");
}

// ───────────────── updateCategory ─────────────────
export async function updateCategory(_state: unknown, formData: FormData) {

  const heros = formData.getAll("hero");
  const banners = formData.getAll("banner");

  const parsed = categoryEditSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    hero: heros,
    banner: banners,
  });
  if (!parsed.success) {
    return parsed.error.formErrors.fieldErrors;
  }
  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/admin/categories");
}

// ───────────────── deleteCategory ─────────────────
export async function deleteCategory(id: string) {
  // این‌ها آرایه‌اند: یکی‌یکی پاک کن
  const files: PathStr[] = [
  ];

  await Promise.all(
    files.map(async (rel) => {
      const full = path.join(process.cwd(), "public", rel);
      try {
        await unlink(full);
      } catch (e) {
        console.warn("unlink failed:", full, e);
      }
    })
  );

  revalidatePath("/");
  revalidatePath("/admin/categories");
}

// ───────────────── submenu ─────────────────
export async function addSubmenu(formData: FormData) {
  const parsed = CategorySubmenusSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;

  const data = parsed.data;

  revalidatePath("/");
  revalidatePath("/categories/submenu");
  redirect("/admin/categories/submenu");
}

export async function deleteSubmenu(id: string) {

  revalidatePath("/");
  redirect("/admin/categories/submenu");
}

// ───────────────── submenu-item ─────────────────
export async function addSubmenuItem(formData: FormData) {
  const parsed = CategorySubmenuItemSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;

  const data = parsed.data;

  revalidatePath("/");
  revalidatePath("/categories/submenu-Item");
  redirect("/admin/categories/submenu-Item");
}

export async function deleteSubmenuItem(id: string) {

  revalidatePath("/");
  redirect("/admin/categories/submenu-Item");
}
