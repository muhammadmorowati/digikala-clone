import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";
import { User, Product } from "@/src/utils/types";
import { Bell, Check, Box, UserRound } from "lucide-react";
import { readJSON } from "@/src/utils/fileUtils";
import path from "path";

// ─────────── Helpers ───────────
async function mockAuthUser(users: User[]): Promise<User | null> {
  return users.find((u) => u.role === "ADMIN") ?? users[0] ?? null;
}

// ─────────── Component ───────────
export default async function AdminPage() {
  const dataDir = path.join(process.cwd(), "data");
  const [users, products] = await Promise.all([
    readJSON<User>(path.join(dataDir, "users.json")),
    readJSON<Product>(path.join(dataDir, "products.json")),
  ]);

  const user = await mockAuthUser(users);

  const topProducts = [...products]
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    .slice(0, 3);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        {/* Header */}
        <header className="flex h-16 items-center justify-between rounded-lg border border-neutral-100 bg-white px-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h1 className="font-semibold text-lg text-neutral-700 dark:text-neutral-100">
            پیشخوان
          </h1>

          <div className="flex items-center gap-2">
            <Bell
              size={20}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 p-2.5 dark:bg-neutral-700"
            />
            <div className="flex items-center gap-2 rounded-lg border border-neutral-100 px-3 py-1.5 font-irsansb text-neutral-600 dark:border-neutral-600 dark:text-white">
              {user?.avatar ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} className="object-cover" />
                  <AvatarFallback className="p-0.5 text-red-500">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Image
                  src="/users/avatar1.png"
                  alt="admin"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border grayscale"
                />
              )}
              {user?.name ?? "کاربر"}
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="mt-3 flex-1 space-y-6 py-6">
          {/* Summary cards */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              {
                icon: <Check className="text-green-500" size={25} />,
                label: "درآمد ماهانه",
                value: "12,345,000",
                change: "+5% نسبت به ماه قبل",
                changeColor: "text-green-500",
                borderColor: "border-green-100 dark:border-green-500",
              },
              {
                icon: <Box className="text-rose-500" size={25} />,
                label: "تعداد سفارشات",
                value: "567",
                change: "-2% نسبت به ماه قبل",
                changeColor: "text-red-500",
                borderColor: "border-rose-100 dark:border-rose-500",
              },
              {
                icon: <UserRound className="text-yellow-500" size={25} />,
                label: "تعداد کاربران",
                value: users.length.toLocaleString(),
                change: "+10% نسبت به ماه قبل",
                changeColor: "text-green-500",
                borderColor: "border-yellow-100 dark:border-yellow-500",
              },
            ].map(({ icon, label, value, change, changeColor, borderColor }) => (
              <div
                key={label}
                className={`relative flex flex-col items-start rounded-2xl border-2 border-neutral-50 bg-neutral-50/50 p-4 pt-8 shadow-md dark:border-neutral-900 dark:bg-neutral-900/20 ${borderColor}`}
              >
                <span className="absolute left-0 right-0 top-[-20px] mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white shadow dark:bg-neutral-950">
                  {icon}
                </span>
                <div className="text-neutral-400">{label}</div>
                <div className="flex items-center gap-1 text-2xl font-semibold">
                  {value}
                </div>
                <span className={`${changeColor} text-sm`}>{change}</span>
              </div>
            ))}
          </section>

          {/* Top Products */}
          <section className="rounded-lg border-2 border-neutral-100 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="mb-2 text-xl font-semibold">محصولات برتر هفته</h3>
              <p className="text-sm text-neutral-400">برترین ها از نگاه شما</p>
            </div>

            <Table className="max-sm:overflow-x-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">تصویر</TableHead>
                  <TableHead className="text-right">عنوان</TableHead>
                  <TableHead className="text-right">
                    میزان رضایت کاربران
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((p) => (
                  <TableRow key={String(p._id)}>
                    <TableCell>
                      <Image
                        src={p.thumbnail}
                        alt={p.title}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <p className="max-w-96">{p.title}</p>
                    </TableCell>
                    <TableCell>
                      <div className="relative flex h-2 w-36 items-center">
                        <div className="absolute right-0 top-0 h-full w-28 rounded bg-neutral-300">
                          <div
                            className="h-full rounded bg-green-500"
                            style={{
                              width: `${p.recommended_percent ?? 0}%`,
                            }}
                          />
                        </div>
                        <p className="absolute -top-1.5 -left-2">
                          {p.recommended_percent ?? 0}%
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </main>
      </div>
    </div>
  );
}
