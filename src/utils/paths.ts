import path from "path";
export const ARTICLES_FILE_PATH = path.join(process.cwd(), "data", "articles.json");
export const CATEGORIES_FILE_PATH = path.join(process.cwd(), "data", "categories.json");
export const SUBMENUS_FILE_PATH = path.join(process.cwd(), "data", "submenus.json");
const dataDir = path.join(process.cwd(), "data");

export const PATHS = {
  dataDir,
  categories: path.join(dataDir, "categories.json"),
  submenus: path.join(dataDir, "submenus.json"),
  submenuItems: path.join(dataDir, "submenuItems.json"),
};