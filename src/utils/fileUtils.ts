import { promises as fs } from "fs";

export async function readJSON<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, "utf8");

    // Validate JSON
    const parsed = JSON.parse(data);

    // Ensure return type is always an array
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File doesn't exist → return empty array
      return [];
    }

    console.error(`❌ Failed to read JSON file: ${filePath}`, error);
    throw error;
  }
}
