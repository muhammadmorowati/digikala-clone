import Sidebar from "@/src/components/admin/Sidebar";
import { Button } from "@/src/components/ui/button";
import Container from "@/src/components/ui/container";
import { SignoutFunction } from "@/src/components/ui/SignoutFunction";
import { User } from "@/src/utils/types";
import { readJSON } from "@/src/utils/fileUtils";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import path from "path";

export const metadata: Metadata = {
  title: "پنل مدیریت",
};

// ---------- Helper: mock user authentication ----------
async function mockAuthUser(): Promise<User | null> {
  try {
    const usersFile = path.join(process.cwd(), "data", "users.json");
    const users = await readJSON<User>(usersFile);
    // simulate a “logged-in” admin or fallback user
    return users.find((u) => u.role === "ADMIN") ?? users[0] ?? null;
  } catch {
    return null;
  }
}

// ---------- Main Layout ----------
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await mockAuthUser();
  if (!user) redirect("/login?redirected");

  const isAdmin = user.role === "ADMIN";

  if (!isAdmin) {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center gap-10 bg-neutral-100 p-2 dark:bg-neutral-800">
        <Button asChild variant="link" className="absolute left-2 top-2 text-sky-500">
          <Link href="/" className="flex items-center gap-1">
            بازگشت به صفحه اصلی
            <ArrowLeft size={15} />
          </Link>
        </Button>

        <SignoutFunction showAdminPage>
          <p className="rounded-lg bg-red-500 p-2 text-center text-xs text-white sm:text-sm lg:text-base">
            برای مشاهده پنل مدیریت لطفا از حساب کاربری فعلی{" "}
            <span className="underline">خارج شوید</span>
          </p>
        </SignoutFunction>

        <Image
          src="/admin.svg"
          width={500}
          height={500}
          alt="Admin panel illustration"
          className="rounded-lg p-2 dark:bg-neutral-100"
        />
      </div>
    );
  }

  return (
    <Container>
      <div className="grid grid-cols-12 gap-5 pt-5">
        <aside className="col-span-4 px-5 max-lg:col-span-12 xl:col-span-3">
          <Sidebar />
        </aside>
        <main className="col-span-8 px-5 max-lg:col-span-12 xl:col-span-9">
          {children}
        </main>
      </div>
    </Container>
  );
}
