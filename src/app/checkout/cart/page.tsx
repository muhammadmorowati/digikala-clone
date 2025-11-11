import CartContainer from "@/src/components/cart/CartContainer";
import FreeShipping from "@/src/components/cart/FreeShipping";
import RecentViews from "@/src/components/cart/RecentViews";
import ShoppingCartItems from "@/src/components/cart/ShoppincartItems"; // corrected name
import { serializeDoc } from "@/src/utils/serializeDoc";
import { Product, User } from "@/src/utils/types";
import { readJSON } from "@/src/utils/fileUtils";
import path from "path";

// ─────────────────────────── Mock Auth (replaceable later) ───────────────────────────
async function mockAuthUser(): Promise<User> {
  // Replace with cookie / token logic in future
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

// ─────────────────────────── Component ───────────────────────────
export default async function CartPage() {
  const filePath = path.join(process.cwd(), "data", "products.json");

  // Read all products in parallel (only one file now, but scalable)
  const [products, user] = await Promise.all([
    readJSON<Product>(filePath),
    mockAuthUser(),
  ]);

  const serializedProducts = serializeDoc(products);
  const serializedUser = serializeDoc(user);

  return (
    <CartContainer>
      {/* Header */}
      <div className="border-b">
        <h5 className="w-1/2 border-b-4 border-b-red-500 px-2 pb-2 text-center font-irsansb text-red-500 lg:w-fit">
          سبد خرید
        </h5>
      </div>

      {/* Sections */}
      <FreeShipping />
      <ShoppingCartItems user={serializedUser} />

      <div className="border-b-8" />

      {/* Recently Viewed */}
      <div className="max-lg:mx-4 rounded-lg border py-5">
        <h5 className="mx-5 w-fit border-b-2 border-b-red-500 pb-2 text-sm font-irsansb">
          بازدیدهای اخیر
        </h5>
        <RecentViews products={serializedProducts} />
      </div>
    </CartContainer>
  );
}
