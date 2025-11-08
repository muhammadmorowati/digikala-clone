import connectToDB from "@/config/mongodb";
import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { serializeDoc } from "@/src/utils/serializeDoc";
import OrderModel from "@/models/Order"

export default async function AdminUsersPage() {
  await connectToDB();
  const orders = await OrderModel.find({}).lean();
  const serializedOrders = serializeDoc(orders);

  return (
    <>
      <PageHeader title="سفارشات" />
      {orders.length ? (
        <AdminTable orders={serializedOrders} />
      ) : (
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
      )}
    </>
  );
}
