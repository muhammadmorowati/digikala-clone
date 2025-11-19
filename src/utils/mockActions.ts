// src/utils/mockActions.ts
import { mockCategories } from "@/src/data/categoriesData";
import { mockSubmenus } from "@/src/data/submenus";
import { mockSubmenuItems } from "@/src/data/submenuItems";
import { mockProducts } from "@/src/data/products";
import { mockStories } from "@/src/data/stories";
import { mockArticles } from "@/src/data/articles";
import { mockUsers } from "@/src/data/users";
import { productsData } from "@/src/data/productsData";

import { Product, Story, User } from "@/src/utils/types";

/* -------------------------------------------------------
   Generic item remover
------------------------------------------------------- */
function removeById<T extends { _id: string }>(collection: T[], id: string) {
  const index = collection.findIndex((item) => item._id === id);
  if (index !== -1) collection.splice(index, 1);
}

/* -------------------------------------------------------
   Category / Submenu / Product / Story / Article / User
   Delete operations (clean + reusable)
------------------------------------------------------- */

export const removeCategory = (id: string) => removeById(mockCategories, id);
export const removeSubmenu = (id: string) => removeById(mockSubmenus, id);
export const removeSubmenuItem = (id: string) => removeById(mockSubmenuItems, id);
export const removeProduct = (id: string) => removeById(mockProducts, id);
export const removeStory = (id: string) => removeById(mockStories, id);
export const removeArticle = (id: string) => removeById(mockArticles, id);
export const removeUser = (id: string) => removeById(mockUsers, id);

/* -------------------------------------------------------
   Product Add / Update (mock DB)
------------------------------------------------------- */

export async function addProductMock(product: Product) {
  productsData.push(product);
  return { success: true, product };
}

export async function updateProductMock(product: Product) {
  const index = productsData.findIndex((p) => p._id === product._id);
  if (index === -1) {
    return { success: false, error: "Product not found" };
  }

  productsData[index] = product;
  return { success: true, product };
}

/* -------------------------------------------------------
   Mock Story storage
------------------------------------------------------- */

let localStories: Story[] = [];

export async function addStory(formData: FormData) {
  const title = formData.get("title") as string;
  const cover = formData.get("cover") as File | null;
  const post = formData.get("post") as File | null;

  if (!title || !cover || !post) return { success: false };

  const newStory: Story = {
    _id: crypto.randomUUID(),
    title,
    cover: URL.createObjectURL(cover),
    post: URL.createObjectURL(post),
  };

  localStories.push(newStory);
  return { success: true, story: newStory };
}

export const getStories = () => localStories;
export const deleteStory = (id: string) => {
  localStories = localStories.filter((s) => s._id !== id);
};

/* -------------------------------------------------------
   Update User (mock DB)
------------------------------------------------------- */

export async function updateUser(formData: FormData) {
  const id = formData.get("_id") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as User["role"];
  const avatar = formData.get("avatar") as File | null;

  const user = mockUsers.find((u) => u._id === id);
  if (!user) return { success: false, error: "User not found" };

  let avatarUrl = user.avatar;

  if (avatar instanceof File) {
    const base64 = Buffer.from(await avatar.arrayBuffer()).toString("base64");
    avatarUrl = `data:${avatar.type};base64,${base64}`;
  }

  Object.assign(user, {
    name,
    phone,
    role,
    avatar: avatarUrl,
    updatedAt: new Date().toISOString(),
  });

  return { success: true, user };
}
 