import Header from "@/src/components/header/Header";
import MobileFooter from "@/src/components/mobile-footer/MobileFooter";
import { redirect } from "next/navigation";
import { User } from "@/src/utils/types";

/** ✅ Simulated authentication (replace with real auth logic later) */
async function mockAuthUser(): Promise<User | null> {
  const isLoggedIn = true; // toggle for testing logged-in / logged-out state
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

/** ✅ Layout wrapper for all profile-related pages */
export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await mockAuthUser();

  // 🚪 Redirect to login if no user (simulate auth guard)
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Desktop header */}
      <header className="hidden max-lg:block">
        <Header />
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Mobile footer (persistent) */}
      <footer>
        <MobileFooter />
      </footer>
    </div>
  );
}
