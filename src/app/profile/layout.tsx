import Header from "@/src/components/header/Header";
import MobileFooter from "@/src/components/mobile-footer/MobileFooter";
import { redirect } from "next/navigation";
import { User } from "@/src/utils/types";

// ✅ Mock authentication (instead of authUser + DB)
async function mockAuthUser(): Promise<User | null> {
  // You can extend this later with cookie/session logic
  const isLoggedIn = true; // toggle to false to simulate logged-out user
  if (!isLoggedIn) return null;

  return {
    _id: "u1" as any,
    name: "کاربر نمونه",
    email: "example@test.com",
    phone: "09120000000",
    password: "hashed_password",
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

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await mockAuthUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="max-lg:hidden">
        <Header />
      </div>
      {children}
      <MobileFooter />
    </div>
  );
}
