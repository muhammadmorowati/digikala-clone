"use server";
import { OrderSchema } from "@/src/utils/validation";
import { revalidatePath } from "next/cache";
import { promises as fs } from "fs";
import path from "path";

const ordersFile = path.join(process.cwd(), "data", "orders.json");

// Helpers
async function readOrders() {
  try {
    const data = await fs.readFile(ordersFile, "utf8");
    return JSON.parse(data) as {
      _id: string;
      productId: string;
      userId: string;
    }[];
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeOrders(data: unknown) {
  await fs.mkdir(path.dirname(ordersFile), { recursive: true });
  await fs.writeFile(ordersFile, JSON.stringify(data, null, 2), "utf8");
}

// ────────────────────────────────────────────────
export async function addOrder(formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  const result = OrderSchema.safeParse(entries);

  if (!result.success) {
    console.log("❌ Validation errors:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const orders = await readOrders();

  // check if user already ordered this product
  const exists = orders.some(
    (o) => o.productId === data.productId && o.userId === data.userId
  );

  if (!exists) {
    orders.push({
      _id: crypto.randomUUID(),
      productId: data.productId,
      userId: data.userId,
    });
    await writeOrders(orders);

    revalidatePath("/");
    revalidatePath("/orders");
  }
  return;
}

// ────────────────────────────────────────────────
export async function deleteOrder(id: string) {
  const orders = await readOrders();
  const before = orders.length;

  // try to remove by _id or productId
  const updated = orders.filter((o) => o._id !== id && o.productId !== id);

  if (updated.length !== before) {
    await writeOrders(updated);
    revalidatePath("/");
    revalidatePath("/orders");
  }
}
