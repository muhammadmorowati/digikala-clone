import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { Order } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

export default async function AdminOrdersPage() {
  const ordersPath = path.join(process.cwd(), "data", "orders.json");

  let orders: Order[] = [];

  try {
    const data = await fs.readFile(ordersPath, "utf8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) orders = parsed;
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("❌ Failed to read orders.json:", error);
    }
  }

  return (
    <>
      <PageHeader title="سفارشات" />
      {orders.length > 0 ? (
        <AdminTable orders={orders} />
      ) : (
        <div className="text-neutral-500 text-center p-5">
          هیچ سفارشی برای نمایش وجود ندارد.
        </div>
      )}
    </>
  );
}
