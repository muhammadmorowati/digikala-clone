"use server";

import {
  CategorySchema,
  categoryEditSchema,
  CategorySubmenusSchema,
  CategorySubmenuItemSchema,
} from "@/src/utils/validation";
import { Category, Submenu, SubmenuItem } from "@/src/utils/types";
import { access, mkdir, unlink, writeFile, readFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "node:path";

// ────────────────────────────── CONSTANTS ──────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const PATHS = {
  categories: path.join(DATA_DIR, "categories.json"),
  submenus: path.join(DATA_DIR, "submenus.json"),
  submenuItems: path.join(DATA_DIR, "submenuItems.json"),
};

// ────────────────────────────── HELPERS ──────────────────────────────
async function ensureDir(dir: string) {
  try {
    await access(dir);
  } catch (e: any) {
    if (e.code === "ENOENT") await mkdir(dir, { recursive: true });
  }
}

async function readJSON<T>(filename: string): Promise<T[]> {
  try {
    const data = await readFile(filename, "utf8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e: any) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

async function writeJSON<T>(filename: string, data: T[]) {
  await ensureDir(DATA_DIR);
  await writeFile(filename, JSON.stringify(data, null, 2), "utf8");
}

function toBytes(ab: ArrayBuffer) {
  return new Uint8Array(ab);
}

// ────────────────────────────── CATEGORY ──────────────────────────────
export async function addCategory(_state: unknown, formData: FormData) {
  const heros = formData.getAll("hero");
  const banners = formData.getAll("banner");

  const parsed = CategorySchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    hero: heros,
    banner: banners,
  });

  if (!parsed.success) return parsed.error.formErrors.fieldErrors;
  const data = parsed.data;

  const categoryDir = path.join(PUBLIC_DIR, "categories");
  await ensureDir(categoryDir);

  // Save cover and icon
  const coverPath = `/categories/${crypto.randomUUID()}-${data.cover.name}`;
  await writeFile(path.join(PUBLIC_DIR, coverPath), toBytes(await data.cover.arrayBuffer()));

  const iconPath = `/categories/${crypto.randomUUID()}-${data.icon.name}`;
  await writeFile(path.join(PUBLIC_DIR, iconPath), toBytes(await data.icon.arrayBuffer()));

  // Save hero and banner images
  const heroPaths: string[] = [];
  const bannerPaths: string[] = [];

  for (const img of heros as File[]) {
    if (img instanceof File && img.size > 0) {
      const heroPath = `/categories/hero/${crypto.randomUUID()}-${img.name}`;
      await writeFile(path.join(PUBLIC_DIR, heroPath), toBytes(await img.arrayBuffer()));
      heroPaths.push(heroPath);
    }
  }

  for (const img of banners as File[]) {
    if (img instanceof File && img.size > 0) {
      const bannerPath = `/categories/banner/${crypto.randomUUID()}-${img.name}`;
      await writeFile(path.join(PUBLIC_DIR, bannerPath), toBytes(await img.arrayBuffer()));
      bannerPaths.push(bannerPath);
    }
  }

  const categories = await readJSON<Category>(PATHS.categories);

  const newCategory: Category = {
    _id: crypto.randomUUID(),
    title: data.title,
    href: data.href,
    cover: [coverPath],
    icon: iconPath,
    hero: heroPaths,
    banner: bannerPaths,
    submenus: [],
  };

  categories.push(newCategory);
  await writeJSON(PATHS.categories, categories);

  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/admin/categories");
}

export async function updateCategory(_state: unknown, formData: FormData) {
  const heros = formData.getAll("hero");
  const banners = formData.getAll("banner");

  const parsed = categoryEditSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    hero: heros,
    banner: banners,
  });
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;

  const data = parsed.data;
  const categories = await readJSON<Category>(PATHS.categories);
  const index = categories.findIndex((c) => c._id === data._id);
  if (index === -1) return notFound();

  const category = categories[index];
  let coverPath = category.cover?.[0] || "";
  let iconPath = category.icon || "";

  // Replace images if new ones uploaded
  if (data.cover?.size) {
    try {
      await unlink(path.join(PUBLIC_DIR, coverPath));
    } catch (e) {}
    coverPath = `/categories/${crypto.randomUUID()}-${data.cover.name}`;
    await writeFile(path.join(PUBLIC_DIR, coverPath), toBytes(await data.cover.arrayBuffer()));
  }

  if (data.icon?.size) {
    try {
      await unlink(path.join(PUBLIC_DIR, iconPath));
    } catch (e) {}
    iconPath = `/categories/${crypto.randomUUID()}-${data.icon.name}`;
    await writeFile(path.join(PUBLIC_DIR, iconPath), toBytes(await data.icon.arrayBuffer()));
  }

  const heroPaths = category.hero || [];
  const bannerPaths = category.banner || [];

  for (const img of heros as File[]) {
    if (img instanceof File && img.size > 0) {
      const heroPath = `/categories/hero/${crypto.randomUUID()}-${img.name}`;
      await writeFile(path.join(PUBLIC_DIR, heroPath), toBytes(await img.arrayBuffer()));
      heroPaths.push(heroPath);
    }
  }

  for (const img of banners as File[]) {
    if (img instanceof File && img.size > 0) {
      const bannerPath = `/categories/banner/${crypto.randomUUID()}-${img.name}`;
      await writeFile(path.join(PUBLIC_DIR, bannerPath), toBytes(await img.arrayBuffer()));
      bannerPaths.push(bannerPath);
    }
  }

  categories[index] = {
    ...category,
    title: data.title,
    href: data.href,
    cover: [coverPath],
    icon: iconPath,
    hero: heroPaths,
    banner: bannerPaths,
  };

  await writeJSON(PATHS.categories, categories);
  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const categories = await readJSON<Category>(PATHS.categories);
  const index = categories.findIndex((c) => c._id === id);
  if (index === -1) return notFound();

  const category = categories[index];
  const files = [category.icon, ...(category.cover || []), ...(category.hero || []), ...(category.banner || [])];

  for (const rel of files) {
    try {
      await unlink(path.join(PUBLIC_DIR, rel));
    } catch (e) {}
  }

  categories.splice(index, 1);
  await writeJSON(PATHS.categories, categories);
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

// ────────────────────────────── SUBMENU ──────────────────────────────
export async function addSubmenu(formData: FormData) {
  const parsed = CategorySubmenusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;

  const data = parsed.data;
  const submenus = await readJSON<Submenu>(PATHS.submenus);

  const newSubmenu: Submenu = {
    _id: crypto.randomUUID(),
    title: data.title,
    href: data.href,
    categoryId: data.categoryId,
    items: [],
  };

  submenus.push(newSubmenu);
  await writeJSON(PATHS.submenus, submenus);

  const categories = await readJSON<Category>(PATHS.categories);
  const catIndex = categories.findIndex((c) => c._id === data.categoryId);
  if (catIndex !== -1) {
    const cat = categories[catIndex];
    cat.submenus = [...(cat.submenus || []), newSubmenu];
    categories[catIndex] = cat;
    await writeJSON(PATHS.categories, categories);
  }

  revalidatePath("/");
  redirect("/admin/categories/submenu");
}

export async function deleteSubmenu(id: string) {
  const submenus = await readJSON<Submenu>(PATHS.submenus);
  const index = submenus.findIndex((s) => s._id === id);
  if (index === -1) return notFound();

  submenus.splice(index, 1);
  await writeJSON(PATHS.submenus, submenus);

  revalidatePath("/");
  redirect("/admin/categories/submenu");
}

// ────────────────────────────── SUBMENU ITEM ──────────────────────────────
export async function addSubmenuItem(formData: FormData) {
  const parsed = CategorySubmenuItemSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;

  const data = parsed.data;
  const submenuItems = await readJSON<SubmenuItem>(PATHS.submenuItems);

  const newItem: SubmenuItem = {
    _id: crypto.randomUUID(),
    title: data.title,
    href: data.href,
    submenuId: data.submenuId,
  };

  submenuItems.push(newItem);
  await writeJSON(PATHS.submenuItems, submenuItems);

  const submenus = await readJSON<Submenu>(PATHS.submenus);
  const smIndex = submenus.findIndex((s) => s._id === data.submenuId);
  if (smIndex !== -1) {
    const submenu = submenus[smIndex];
    submenu.items = [...(submenu.items || []), newItem];
    submenus[smIndex] = submenu;
    await writeJSON(PATHS.submenus, submenus);
  }

  revalidatePath("/");
  redirect("/admin/categories/submenu-item");
}

export async function deleteSubmenuItem(id: string) {
  const submenuItems = await readJSON<SubmenuItem>(PATHS.submenuItems);
  const index = submenuItems.findIndex((s) => s._id === id);
  if (index === -1) return notFound();

  submenuItems.splice(index, 1);
  await writeJSON(PATHS.submenuItems, submenuItems);

  revalidatePath("/");
  redirect("/admin/categories/submenu-item");
}
