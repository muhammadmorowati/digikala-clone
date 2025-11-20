import ProfileMain from "@/src/components/profile/ProfileMain";
import UserInfo from "@/src/components/profile/UserInfo";
import UserList from "@/src/components/profile/UserList";
import { serializeDoc } from "@/src/utils/serializeDoc";
import { User, Product } from "@/src/utils/types";
import path from "path";
import { promises as fs } from "fs";
import { ProfileSectionId } from "@/src/components/profile/ProfileScreenSize";

/** Read JSON safely */
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

/** Convert dynamic route param → ProfileSectionId */
function toProfileSectionId(id: string): ProfileSectionId {
  const allowed: ProfileSectionId[] = [
  "orders",
   "lists",
   "comments",
   "addresses",
   "gift-cards",
   "notification",
   "user-history",
   "personal-info"
  ];

  return allowed.includes(id as ProfileSectionId) ?
    (id as ProfileSectionId) : "orders";
}

/** Mock user auth (replace with real version later) */
async function mockAuthUser(): Promise<User> {
  return {
    _id: "u1",
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

/** Main Profile Page */
export default async function ProfileIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const products = await readJSON<Product>("products.json");
  const user = await mockAuthUser();

  // Serialize (good for server → client)
  const serializedUser = serializeDoc(user);
  const serializedProducts = serializeDoc(products);

  // Convert URL param to safe enum
  const safeId = toProfileSectionId(id);

  return (
    <div className="grid grid-cols-12 gap-5 lg:px-20 pb-20 lg:pt-10">
      {/* Sidebar – Desktop only */}
      <aside className="col-span-4 hidden border rounded-md py-5 lg:block">
        <UserInfo user={serializedUser} />
        <UserList id={safeId} />
      </aside>

      {/* Main content */}
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
