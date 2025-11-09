import Header from "@/components/header/Header";
import MobileFooter from "@/components/mobile-footer/MobileFooter";
import { authUser } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await authUser();

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
