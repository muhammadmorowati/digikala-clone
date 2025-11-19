import path from "path";

// Base directory for all JSON data files
const DATA_DIR = path.join(process.cwd(), "data");

// Explicit file paths (direct exports — useful for imports in actions)
export const ARTICLES_FILE_PATH = path.join(DATA_DIR, "articles.json");
export const CATEGORIES_FILE_PATH = path.join(DATA_DIR, "categories.json");
export const SUBMENUS_FILE_PATH = path.join(DATA_DIR, "submenus.json");

// Centralized collection of paths (useful when iterating or building dynamic operations)
export const PATHS = {
  DATA_DIR,
  articles: ARTICLES_FILE_PATH,
  categories: CATEGORIES_FILE_PATH,
  submenus: SUBMENUS_FILE_PATH,
  submenuItems: path.join(DATA_DIR, "submenuItems.json"),
  products: path.join(DATA_DIR, "products.json"),
  users: path.join(DATA_DIR, "users.json"),
};
