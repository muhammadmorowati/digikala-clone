
import connectToDB from "@/config/mongodb";
import Header from "@/src/components/header/Header";
import MobileFooter from "@/src/components/mobile-footer/MobileFooter";
import { authUser } from "@/src/utils/auth";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectToDB();
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
