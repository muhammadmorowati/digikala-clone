import PageHeader from "@/src/components/admin/PageHeader";
import UserUpdateForm from "@/src/components/admin/UserUpdateForm";
import path from "path";
import { readJSON } from "@/src/utils/fileUtils";
import { User } from "@/src/utils/types";

export default async function EditUserPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const usersFile = path.join(process.cwd(), "data", "users.json");

  let users: User[] = [];
  try {
    users = await readJSON<User>(usersFile);
  } catch (error) {
    console.error("❌ Failed to read users.json:", error);
  }

  const user = users.find((u) => u._id === id);

  if (!user) {
    return (
      <div className="text-red-600 text-center p-5">
        کاربر یافت نشد.
      </div>
    );
  }

  return (
    <>
      <PageHeader title="ویرایش اطلاعات کاربر" />
      <UserUpdateForm user={user} />
    </>
  );
}
