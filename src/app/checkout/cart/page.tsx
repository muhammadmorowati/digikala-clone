import CartContainer from "@/src/components/cart/CartContainer";
import FreeShipping from "@/src/components/cart/FreeShipping";
import RecentViews from "@/src/components/cart/RecentViews";
import ShoppincartItems from "@/src/components/cart/ShoppincartItems";
import { serializeDoc } from "@/src/utils/serializeDoc";
import { Product, User } from "@/src/utils/types";
import path from "path";
import { promises as fs } from "fs";

async function readJSON<T>(file: string): Promise<T[]> {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
}

async function mockAuthUser(): Promise<User> {
  // You can replace this mock with localStorage or cookie-based logic if needed.
  return {
    _id: "u1" as any,
    name: "کاربر آزمایشی",
    email: "test@example.com",
    phone: "09120000000",
    password: "hashed_password",
    role: "USER",
    address: {
      city: "تهران",
      street: "خیابان آزادی",
      plate: "10",
      postalcode: "1234567890",
    },
  };
}

export default async function Cart() {
  // 🔹 Read mock product data instead of fetching from database
  const filePath = path.join(process.cwd(), "data", "products.json");
  const products = await readJSON<Product>(filePath);

  const user = await mockAuthUser();

  const serializedProducts = serializeDoc(products);
  const serializedUser = serializeDoc(user);

  return (
    <CartContainer>
      <div className="border-b">
        <h5 className="text-red-500 border-b-4 px-2 w-1/2 lg:w-fit font-irsansb text-center border-b-red-500 pb-2">
          سبد خرید
        </h5>
      </div>

      <FreeShipping />
      <ShoppincartItems user={serializedUser} />
      <div className="border-b-8"></div>

      <div className="border rounded-lg max-lg:mx-4 py-5">
        <h5 className="border-b-2 text-sm mx-5 w-fit font-irsansb border-b-red-500 pb-2">
          بازدیدهای اخیر
        </h5>
        <RecentViews products={serializedProducts} />
      </div>
    </CartContainer>
  );
}
