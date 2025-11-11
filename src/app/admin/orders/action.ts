"use server";

import { OrderSchema } from "@/src/utils/validation";
import { revalidatePath } from "next/cache";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// ─────────────────────────── Helpers ───────────────────────────
async function readOrders(): Promise<
  { _id: string; productId: string; userId: string }[]
> {
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeOrders(data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ─────────────────────────── Add Order ───────────────────────────
export async function addOrder(formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  const result = OrderSchema.safeParse(entries);

  if (!result.success) {
    console.error("❌ Validation errors:", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const orders = await readOrders();

  // Avoid duplicate orders
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
}

// ─────────────────────────── Delete Order ───────────────────────────
export async function deleteOrder(id: string) {
  const orders = await readOrders();
  const updated = orders.filter(
    (o) => o._id !== id && o.productId !== id // allows deletion by ID or product ID
  );

  if (updated.length !== orders.length) {
    await writeOrders(updated);
    revalidatePath("/");
    revalidatePath("/orders");
  }
}
