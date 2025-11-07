import connectToDB from "@/config/mongodb";
import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { serializeDoc } from "@/src/utils/serializeDoc";
import UserModel from "@/models/User"

export default async function AdminUsersPage() {
  await connectToDB();
  const users = await UserModel.find({}).lean();
  const serializedUsers = serializeDoc(users);

  return (
    <>
      <PageHeader title="کاربران" />
      {users.length ? (
        <AdminTable users={serializedUsers} />
      ) : (
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
      )}
    </>
  );
}
