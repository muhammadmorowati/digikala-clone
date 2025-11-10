import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { User } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

type PublicUser = Pick<User, "_id" | "name" | "email" | "role">
// ---------- Helpers ----------
async function readJSON<T>(file: string): Promise<T[]> {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data) as T[];
  } catch (e: any) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

// ---------- Component ----------
export default async function AdminUsersPage() {
  const usersFile = path.join(process.cwd(), "data", "users.json");
  const users = await readJSON<PublicUser>(usersFile)

  return (
    <>
      <PageHeader title="کاربران" />
      {users.length ? (
        <AdminTable users={users  as unknown as User[]} />
      ) : (
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
      )}
    </>
  );
}
