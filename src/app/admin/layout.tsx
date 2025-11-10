import Sidebar from "@/src/components/admin/Sidebar";
import { Button } from "@/src/components/ui/button";
import Container from "@/src/components/ui/container";
import { SignoutFunction } from "@/src/components/ui/SignoutFunction";
import { User } from "@/src/utils/types";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import path from "path";
import { promises as fs } from "fs";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "پنل مدیریت",
  };
}

// ---------- Helper: mock user authentication ----------
async function mockAuthUser(): Promise<User | null> {
  try {
    const file = path.join(process.cwd(), "data", "users.json");
    const data = await fs.readFile(file, "utf8");
    const users: User[] = JSON.parse(data);

    // simulate a “logged-in” user
    const loggedUser = users.find((u) => u.role === "ADMIN") || users[0];
    return loggedUser ?? null;
  } catch (e: any) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

// ---------- Main Layout ----------
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await mockAuthUser();

  if (!user) {
    redirect("/login?redirected");
  }

  return (
    <div>
      {user.role !== "ADMIN" ? (
        <div className="relative bg-neutral-100 dark:bg-neutral-800 p-2 w-full h-screen flex flex-col gap-10 items-center justify-center">
          <Button
            asChild
            variant="link"
            className="text-sky-500 absolute left-2 top-2"
          >
            <Link href="/" className="flex items-center gap-1">
              بازگشت به صفحه اصلی
              <ArrowLeft size={15} />
            </Link>
          </Button>

          <SignoutFunction showAdminPage={true}>
            <p className="bg-red-500 text-center text-xs sm:text-sm lg:text-base rounded-lg p-2 text-white">
              برای مشاهده پنل مدیریت لطفا از حساب کاربری فعلی{" "}
              <span className="underline">خارج شوید</span>
            </p>
          </SignoutFunction>

          <Image
            src="/admin.svg"
            width={500}
            height={500}
            alt="Admin-svg"
            className="dark:bg-neutral-100 rounded-lg p-2"
          />
        </div>
      ) : (
        <Container>
          <div className="grid grid-cols-12 gap-5 pt-5">
            <div className="px-5 col-span-4 max-lg:col-span-12 xl:col-span-3">
              <Sidebar />
            </div>
            <div className="col-span-8 max-lg:col-span-12 px-5 xl:col-span-9">
              {children}
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}
