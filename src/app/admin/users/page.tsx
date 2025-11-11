import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { User } from "@/src/utils/types";
import { readJSON } from "@/src/utils/fileUtils";
import path from "path";

type PublicUser = Pick<User, "_id" | "name" | "email" | "role">;

export default async function AdminUsersPage() {
  const usersFile = path.join(process.cwd(), "data", "users.json");
  const users = await readJSON<PublicUser>(usersFile);

  return (
    <>
      <PageHeader title="کاربران" />
      {users.length > 0 ? (
        // Ensure AdminTable receives correctly typed props
        <AdminTable users={users as User[]} />
      ) : (
        <div className="text-neutral-500 text-center p-5">
          آیتمی برای نمایش وجود ندارد.
        </div>
      )}
    </>
  );
}
