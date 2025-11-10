import ProfileMain from "@/src/components/profile/ProfileMain";
import UserInfo from "@/src/components/profile/UserInfo";
import UserList from "@/src/components/profile/UserList";
import { serializeDoc } from "@/src/utils/serializeDoc";
import { User, Product } from "@/src/utils/types";
import path from "path";
import { promises as fs } from "fs";

// ✅ Helper to safely read JSON files
async function readJSON<T>(file: string): Promise<T[]> {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
}

// ✅ Mock authentication (replaces authUser + connectToDB)
async function mockAuthUser(): Promise<User> {
  return {
    _id: "u1" as any,
    name: "کاربر نمونه",
    email: "example@test.com",
    phone: "09120000000",
    password: "hashedpassword",
    role: "USER",
    address: {
      province: "تهران",
      city: "تهران",
      street: "خیابان انقلاب",
      plate: "15",
      postalcode: "1234567890",
    },
  };
}

export default async function ProfileIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  // 🗂 Load local product data
  const productsFile = path.join(process.cwd(), "data", "products.json");
  const products = await readJSON<Product>(productsFile);

  // 👤 Mock user (like `authUser()`)
  const user = await mockAuthUser();

  const serializedProducts = serializeDoc(products);
  const serializedUser = serializeDoc(user);

  return (
    <div className="grid grid-cols-12 gap-5 lg:px-20 pb-20 lg:pt-10">
      <div className="col-span-4 border rounded-md py-5 max-lg:hidden">
        <UserInfo />
        <UserList id={id} />
      </div>
      <div className="col-span-8 max-lg:col-span-12 gap-5">
        <ProfileMain
          user={serializedUser}
          products={serializedProducts}
          id={id}
        />
      </div>
    </div>
  );
}
