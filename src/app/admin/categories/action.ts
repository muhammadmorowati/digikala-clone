"use server";

import {
  CategorySchema,
  categoryEditSchema,
  CategorySubmenusSchema,
  CategorySubmenuItemSchema,
} from "@/src/utils/validation";
import { access, mkdir, unlink, writeFile, readFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import path from "node:path";
import { Category, Submenu, SubmenuItem } from "@/src/utils/types";

// ───────────────── helpers ─────────────────
const dataDir = path.join(process.cwd(), "data");

async function readJSON<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(dataDir, filename);
    const data = await readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (e: any) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

async function writeJSON<T>(filename: string, data: T[]) {
  const filePath = path.join(dataDir, filename);
  await mkdir(dataDir, { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

function toBytes(ab: ArrayBuffer) {
  return new Uint8Array(ab);
}

async function ensureDir(dir: string) {
  try {
    await access(dir);
  } catch (e: any) {
    if (e.code === "ENOENT") await mkdir(dir, { recursive: true });
  }
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
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;
  const data = parsed.data;

  const categoryDir = path.join(process.cwd(), "public/categories");
  await ensureDir(categoryDir);

  const coverPath = `/categories/${crypto.randomUUID()}-${data.cover.name}`;
  await writeFile(
    path.join(process.cwd(), "public", coverPath),
    toBytes(await data.cover.arrayBuffer())
  );

  const iconPath = `/categories/${crypto.randomUUID()}-${data.icon.name}`;
  await writeFile(
    path.join(process.cwd(), "public", iconPath),
    toBytes(await data.icon.arrayBuffer())
  );

  const heroPaths: string[] = [];
  const bannerPaths: string[] = [];

  await Promise.all(
    (heros as File[]).map(async (image) => {
      if (image instanceof File) {
        const imgPath = `/categories/hero/${crypto.randomUUID()}-${image.name}`;
        await writeFile(
          path.join(process.cwd(), "public", imgPath),
          toBytes(await image.arrayBuffer())
        );
        heroPaths.push(imgPath);
      }
    })
  );

  await Promise.all(
    (banners as File[]).map(async (image) => {
      if (image instanceof File) {
        const imgPath = `/categories/banner/${crypto.randomUUID()}-${image.name}`;
        await writeFile(
          path.join(process.cwd(), "public", imgPath),
          toBytes(await image.arrayBuffer())
        );
        bannerPaths.push(imgPath);
      }
    })
  );

  const categories = await readJSON<Category>("categories.json");

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
  await writeJSON("categories.json", categories);

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
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;
  const data = parsed.data;

  const categories = await readJSON<Category>("categories.json");
  const categoryIndex = categories.findIndex((c) => c._id === data._id);
  if (categoryIndex === -1) return notFound();

  const category = categories[categoryIndex];
  let coverPath = category.cover?.[0] || "";
  let iconPath = category.icon || "";

  if (data.cover && data.cover.size > 0) {
    try {
      await unlink(path.join(process.cwd(), "public", coverPath));
    } catch {}
    coverPath = `/categories/${crypto.randomUUID()}-${data.cover.name}`;
    await writeFile(
      path.join(process.cwd(), "public", coverPath),
      toBytes(await data.cover.arrayBuffer())
    );
  }

  if (data.icon && data.icon.size > 0) {
    try {
      await unlink(path.join(process.cwd(), "public", iconPath));
    } catch {}
    iconPath = `/categories/${crypto.randomUUID()}-${data.icon.name}`;
    await writeFile(
      path.join(process.cwd(), "public", iconPath),
      toBytes(await data.icon.arrayBuffer())
    );
  }

  const heroPaths = category.hero || [];
  const bannerPaths = category.banner || [];

  await Promise.all(
    (heros as File[]).map(async (hero) => {
      if (hero instanceof File) {
        const heroPath = `/categories/hero/${crypto.randomUUID()}-${hero.name}`;
        await writeFile(
          path.join(process.cwd(), "public", heroPath),
          toBytes(await hero.arrayBuffer())
        );
        heroPaths.push(heroPath);
      }
    })
  );

  await Promise.all(
    (banners as File[]).map(async (banner) => {
      if (banner instanceof File) {
        const bannerPath = `/categories/banner/${crypto.randomUUID()}-${banner.name}`;
        await writeFile(
          path.join(process.cwd(), "public", bannerPath),
          toBytes(await banner.arrayBuffer())
        );
        bannerPaths.push(bannerPath);
      }
    })
  );

  categories[categoryIndex] = {
    ...category,
    title: data.title,
    href: data.href,
    cover: [coverPath],
    icon: iconPath,
    hero: heroPaths,
    banner: bannerPaths,
  };

  await writeJSON("categories.json", categories);

  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/admin/categories");
}

// ───────────────── deleteCategory ─────────────────
export async function deleteCategory(id: string) {
  const categories = await readJSON<Category>("categories.json");
  const index = categories.findIndex((c) => c._id === id);
  if (index === -1) return notFound();

  const category = categories[index];
  const files = [
    category.icon,
    ...(category.cover || []),
    ...(category.hero || []),
    ...(category.banner || []),
  ];

  await Promise.all(
    files.map(async (rel) => {
      try {
        await unlink(path.join(process.cwd(), "public", rel));
      } catch {}
    })
  );

  categories.splice(index, 1);
  await writeJSON("categories.json", categories);

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
  const submenus = await readJSON<Submenu>("submenus.json");

  const newSubmenu: Submenu = {
    _id: crypto.randomUUID(),
    title: data.title,
    href: data.href,
    categoryId: data.categoryId,
    items: [],
  };

  submenus.push(newSubmenu);
  await writeJSON("submenus.json", submenus);

  const categories = await readJSON<Category>("categories.json");
  const catIndex = categories.findIndex((c) => c._id === data.categoryId);
 if (catIndex !== -1) {
  const cat = categories[catIndex];

  const submenus = cat.submenus || [];
  submenus.push(newSubmenu); // push the whole submenu object

  cat.submenus = submenus;
  categories[catIndex] = cat;

  await writeJSON("categories.json", categories);
}

  revalidatePath("/");
  redirect("/admin/categories/submenu");
}

export async function deleteSubmenu(id: string) {
  const submenus = await readJSON<Submenu>("submenus.json");
  const index = submenus.findIndex((s) => s._id === id);
  if (index === -1) return notFound();

  submenus.splice(index, 1);
  await writeJSON("submenus.json", submenus);

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

  const submenuItems = await readJSON<SubmenuItem>("submenuItems.json");
  const newItem: SubmenuItem = {
    _id: crypto.randomUUID(),
    title: data.title,
    href: data.href,
    submenuId: data.submenuId,
  };

  submenuItems.push(newItem);
  await writeJSON("submenuItems.json", submenuItems);

  const submenus = await readJSON<Submenu>("submenus.json");
  const smIndex = submenus.findIndex((s) => s._id === data.submenuId);
 if (smIndex !== -1) {
  const submenu = submenus[smIndex];

  const items = submenu.items || [];
  items.push(newItem); // push the full SubmenuItem object

  submenu.items = items;
  submenus[smIndex] = submenu;

  await writeJSON("submenus.json", submenus);
}

  revalidatePath("/");
  redirect("/admin/categories/submenu-item");
}

export async function deleteSubmenuItem(id: string) {
  const submenuItems = await readJSON<SubmenuItem>("submenuItems.json");
  const index = submenuItems.findIndex((s) => s._id === id);
  if (index === -1) return notFound();

  submenuItems.splice(index, 1);
  await writeJSON("submenuItems.json", submenuItems);

  revalidatePath("/");
  redirect("/admin/categories/submenu-item");
}
