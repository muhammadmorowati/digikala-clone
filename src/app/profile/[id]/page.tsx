import ProfileMain from "@/src/components/profile/ProfileMain";
import UserInfo from "@/src/components/profile/UserInfo";
import UserList from "@/src/components/profile/UserList";
import { serializeDoc } from "@/src/utils/serializeDoc";
import { User, Product } from "@/src/utils/types";
import path from "path";
import { promises as fs } from "fs";

/** ✅ Reusable JSON loader */
async function readJSON<T>(relativePath: string): Promise<T[]> {
  const filePath = path.join(process.cwd(), "data", relativePath);
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`❌ Failed to read JSON: ${relativePath}`, error);
    return [];
  }
}

/** ✅ Mock user authentication (replace later with real `authUser`) */
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

/** ✅ Main page component */
export default async function ProfileIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  // 📦 Load local data
  const products = await readJSON<Product>("products.json");
  const user = await mockAuthUser();

  const serializedUser = serializeDoc(user);
  const serializedProducts = serializeDoc(products);

  return (
    <div className="grid grid-cols-12 gap-5 lg:px-20 pb-20 lg:pt-10">
      {/* Sidebar (Desktop) */}
      <aside className="col-span-4 hidden border rounded-md py-5 lg:block">
        <UserInfo />
        <UserList id={id} />
      </aside>

      {/* Main Content */}
      <main className="col-span-12 lg:col-span-8 flex flex-col gap-5">
        <ProfileMain
          user={serializedUser}
          products={serializedProducts}
          id={id}
        />
      </main>
    </div>
  );
}
