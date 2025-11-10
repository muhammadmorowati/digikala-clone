import { promises as fs } from "fs";

export async function readJSON<T>(file: string): Promise<T[]> {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data) as T[];
  } catch (e: any) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}
