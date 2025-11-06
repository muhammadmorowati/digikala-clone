"use server";

import connectToDB from "@/config/mongodb";
import {
  CategorySchema,
  categoryEditSchema,
  CategorySubmenusSchema,
  CategorySubmenuItemSchema,
} from "@/src/utils/validation";
import { access, mkdir, unlink, writeFile } from "node:fs/promises"; // ✅ فقط fs/promises
import CategoryModel from "@/models/Category";
import SubmenuModel from "@/models/Submenu";
import SubmenuItemModel from "@/models/SubmenuItem";
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
  await connectToDB();

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

  await CategoryModel.create({
    title: data.title,
    cover: coverPath,
    icon: iconPath,
    href: data.href,
    hero: heroPaths,
    banner: bannerPaths,
    submenus: [],
  });

  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/admin/categories");
}

// ───────────────── updateCategory ─────────────────
export async function updateCategory(_state: unknown, formData: FormData) {
  await connectToDB();

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
  const data = parsed.data;

  const category = await CategoryModel.findOne({ _id: data._id });
  if (!category) return notFound();

  let coverPath: PathStr = category.cover;
  let iconPath: PathStr = category.icon;

  if (data.cover && data.cover.size > 0) {
    try {
      await unlink(path.join(process.cwd(), "public", category.cover));
    } catch (e) {
      console.warn("unlink old cover failed:", e);
    }
    coverPath = `/categories/${crypto.randomUUID()}-${data.cover.name}`;
    await writeFile(
      path.join(process.cwd(), "public", coverPath),
      toBytes(await data.cover.arrayBuffer())
    );
  }

  if (data.icon && data.icon.size > 0) {
    try {
      await unlink(path.join(process.cwd(), "public", category.icon));
    } catch (e) {
      console.warn("unlink old icon failed:", e);
    }
    iconPath = `/categories/${crypto.randomUUID()}-${data.icon.name}`;
    await writeFile(
      path.join(process.cwd(), "public", iconPath),
      toBytes(await data.icon.arrayBuffer())
    );
  }

  // heroes
  const heroPaths: PathStr[] = Array.isArray(category.hero)
    ? [...category.hero]
    : [];
  const existingHeros = new Set<string>(
    heroPaths.map((p) => p.split("/").pop() || "")
  );

  await Promise.all(
    (heros as File[]).map(async (hero) => {
      if (hero instanceof File) {
        const heroName = hero.name;
        if (!existingHeros.has(heroName)) {
          existingHeros.add(heroName);
          const heroPath: PathStr = `/categories/hero/${crypto.randomUUID()}-${heroName}`;
          await writeFile(
            path.join(process.cwd(), "public", heroPath),
            toBytes(await hero.arrayBuffer())
          );
          heroPaths.push(heroPath);
        }
      }
    })
  );

  // banners
  const bannerPaths: PathStr[] = Array.isArray(category.banner)
    ? [...category.banner]
    : [];
  const existingBanners = new Set<string>(
    bannerPaths.map((p) => p.split("/").pop() || "")
  );

  await Promise.all(
    (banners as File[]).map(async (banner) => {
      if (banner instanceof File) {
        const bannerName = banner.name;
        if (!existingBanners.has(bannerName)) {
          existingBanners.add(bannerName);
          const bPath: PathStr = `/categories/banner/${crypto.randomUUID()}-${bannerName}`;
          await writeFile(
            path.join(process.cwd(), "public", bPath),
            toBytes(await banner.arrayBuffer())
          );
          bannerPaths.push(bPath);
        }
      }
    })
  );

  await CategoryModel.findOneAndUpdate(
    { _id: data._id },
    {
      $set: {
        title: data.title,
        href: data.href,
        cover: coverPath,
        icon: iconPath,
        hero: heroPaths,
        banner: bannerPaths,
      },
    },
    { new: true }
  );

  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/admin/categories");
}

// ───────────────── deleteCategory ─────────────────
export async function deleteCategory(id: string) {
  await connectToDB();
  const category = await CategoryModel.findOneAndDelete({ _id: id });
  if (!category) return notFound();

  // این‌ها آرایه‌اند: یکی‌یکی پاک کن
  const files: PathStr[] = [
    category.cover,
    category.icon,
    ...(Array.isArray(category.hero) ? category.hero : []),
    ...(Array.isArray(category.banner) ? category.banner : []),
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
  await connectToDB();
  const parsed = CategorySubmenusSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;

  const data = parsed.data;

  const newSubmenu = await SubmenuModel.create({
    title: data.title,
    href: data.href,
    categoryId: data.categoryId,
    items: [],
  });

  await CategoryModel.findOneAndUpdate(
    { _id: data.categoryId },
    { $push: { submenus: newSubmenu._id } },
    { new: true }
  ).populate("submenus");

  revalidatePath("/");
  revalidatePath("/categories/submenu");
  redirect("/admin/categories/submenu");
}

export async function deleteSubmenu(id: string) {
  await connectToDB();
  const submenu = await SubmenuModel.findOneAndDelete({ _id: id });
  if (!submenu) return notFound();
  revalidatePath("/");
  redirect("/admin/categories/submenu");
}

// ───────────────── submenu-item ─────────────────
export async function addSubmenuItem(formData: FormData) {
  await connectToDB();
  const parsed = CategorySubmenuItemSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;

  const data = parsed.data;

  const newSubmenuItem = await SubmenuItemModel.create({
    title: data.title,
    href: data.href,
    submenuId: data.submenuId,
  });

  await SubmenuModel.findOneAndUpdate(
    { _id: data.submenuId },
    { $push: { items: newSubmenuItem._id } },
    { new: true }
  ).populate("items");

  revalidatePath("/");
  revalidatePath("/categories/submenu-Item");
  redirect("/admin/categories/submenu-Item");
}

export async function deleteSubmenuItem(id: string) {
  await connectToDB();
  const submenuItem = await SubmenuItemModel.findOneAndDelete({ _id: id });
  if (!submenuItem) return notFound();
  revalidatePath("/");
  redirect("/admin/categories/submenu-Item");
}
