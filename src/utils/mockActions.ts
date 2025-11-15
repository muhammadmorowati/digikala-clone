// src/utils/mockActions.ts
import { mockCategories } from "@/src/data/categoriesData";
import { mockSubmenus } from "@/src/data/submenus";
import { mockSubmenuItems } from "@/src/data/submenuItems";
import { mockProducts } from "@/src/data/products";
import { mockStories } from "@/src/data/stories";
import { mockArticles } from "@/src/data/articles";
import { mockUsers } from "@/src/data/users";
import { productsData } from "@/src/data/productsData";
import { Product } from "@/src/utils/types";
import { Story } from "./types";
import { User } from "@/src/utils/types";

/** Remove a category by ID */
export function removeCategory(id: string) {
  const index = mockCategories.findIndex(c => c._id === id);
  if (index !== -1) mockCategories.splice(index, 1);
}

/** Remove a submenu by ID */
export function removeSubmenu(id: string) {
  const index = mockSubmenus.findIndex(s => s._id === id);
  if (index !== -1) mockSubmenus.splice(index, 1);
}

/** Remove a submenu item by ID */
export function removeSubmenuItem(id: string) {
  const index = mockSubmenuItems.findIndex(i => i._id === id);
  if (index !== -1) mockSubmenuItems.splice(index, 1);
}

/** Remove a product by ID */
export function removeProduct(id: string) {
  const index = mockProducts.findIndex(p => p._id === id);
  if (index !== -1) mockProducts.splice(index, 1);
}

/** Remove a story by ID */
export function removeStory(id: string) {
  const index = mockStories.findIndex(story => story._id === id);
  if (index !== -1) mockStories.splice(index, 1);
}

/** Remove an article by ID */
export function removeArticle(id: string) {
  const index = mockArticles.findIndex(a => a._id === id);
  if (index !== -1) mockArticles.splice(index, 1);
}

/** Remove a user by ID */
export function removeUser(id: string) {
  const index = mockUsers.findIndex(u => u._id === id);
  if (index !== -1) mockUsers.splice(index, 1);
}

export const addProductMock = async (product: Product) => {
  productsData.push(product);
};

export const updateProductMock = async (product: Product) => {
  const index = productsData.findIndex((p) => p._id === product._id);
  if (index !== -1) productsData[index] = product;
};


// Mock story storage (replace with real DB later)
let stories: Story[] = [];

export async function addStory(formData: FormData): Promise<{ success: boolean }> {
  const title = formData.get("title") as string;
  const cover = formData.get("cover") as File;
  const post = formData.get("post") as File;

  if (!title || !cover || !post) {
    return { success: false };
  }

  // Convert files to fake URLs (mock mode)
  const coverUrl = URL.createObjectURL(cover);
  const postUrl = URL.createObjectURL(post);

  const newStory: Story = {
    _id: crypto.randomUUID(),
    title,
    cover: coverUrl,
    post: postUrl,
  };

  stories.push(newStory);

  return { success: true };
}

// Optional: export these to show the data
export function getStories() {
  return stories;
}

export function deleteStory(id: string) {
  stories = stories.filter((s) => s._id !== id);
}

// ✅ Update a user in flat-file storage
export async function updateUser(formData: FormData) {
  const id = formData.get("_id") as string;

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const avatar = formData.get("avatar") as File | null;

  const index = mockUsers.findIndex((u) => u._id === id);
  if (index === -1) {
    return { success: false, error: "User not found" };
  }

  let avatarUrl = mockUsers[index].avatar;

  // If new avatar uploaded → convert to base64 (file-based systems need this)
  if (avatar instanceof File) {
    const arrayBuffer = await avatar.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    avatarUrl = `data:${avatar.type};base64,${base64}`;
  }

  mockUsers[index] = {
    ...mockUsers[index],
    name,
    phone,
    role: role as User["role"],
    avatar: avatarUrl,
    updatedAt: new Date().toISOString(),
  };

  return { success: true, user: mockUsers[index] };
}
