import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
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
import path from "path";
import { promises as fs } from "fs";

// ---- helpers ----
async function readJSON<T>(file: string): Promise<T[]> {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data) as T[];
  } catch (e: any) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

// simulate an authenticated user
async function mockAuthUser(users: User[]): Promise<User | null> {
  return users.find((u) => u.role === "ADMIN") ?? users[0] ?? null;
}

export default async function AdminPage() {
  // Load data from /data/users.json and /data/products.json
  const usersFile = path.join(process.cwd(), "data", "users.json");
  const productsFile = path.join(process.cwd(), "data", "products.json");

  const users = await readJSON<User>(usersFile);
  const products = await readJSON<Product>(productsFile);

  const user = await mockAuthUser(users);
  const topProducts = products
    .slice()
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    .slice(0, 3);

  return (
    <div className="h-screen flex">
      <div className="flex-1">
        {/* Header */}
        <header className="h-16 border border-neutral-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-between px-4">
          <div className="text-lg text-neutral-700 dark:text-neutral-100 font-semibold">
            پیشخوان
          </div>
          <div className="flex items-center gap-2">
            <Bell
              size={20}
              className="p-2.5 dark:bg-neutral-700 bg-neutral-100 w-10 h-10 rounded-full flex items-center justify-center"
            />
            <div className="border dark:border-neutral-600 rounded-lg px-3 py-1.5 flex items-center gap-2 dark:text-white font-irsansb text-neutral-600 border-neutral-100">
              {user?.avatar ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} className="object-cover" />
                  <AvatarFallback className="text-red-500 p-0.5">
                    {user.name.split(" ")[0]?.slice(0, 1)}
                    {user.name.split(" ")[1]?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Image
                  width={100}
                  height={100}
                  src="/users/avatar1.png"
                  alt="admin"
                  className="grayscale rounded-full w-8 h-8 border"
                />
              )}
              {user?.name ?? "کاربر"}
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="flex-1 mt-3">
          <main className="py-6 space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="dark:shadow-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20 border-neutral-50 dark:border-neutral-900 border-2 relative p-4 pt-8 rounded-2xl shadow-md flex flex-col items-start">
                <span className="absolute right-0 left-0 mx-auto -top-5 bg-white dark:bg-neutral-950 rounded-full w-10 h-10 shadow flex items-center justify-center border-2 border-green-100 dark:border-green-500">
                  <Check className="text-green-500" size={25} />
                </span>
                <div className="text-neutral-400">درآمد ماهانه</div>
                <div className="text-2xl font-semibold items-center gap-1 flex">
                  12,345,000
                </div>
                <span className="text-green-500 text-sm">
                  +5% نسبت به ماه قبل
                </span>
              </div>

              <div className="dark:shadow-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20 border-neutral-50 dark:border-neutral-900 border-2 relative p-4 pt-8 rounded-2xl shadow-md flex flex-col items-start">
                <span className="absolute right-0 left-0 mx-auto -top-5 bg-white dark:bg-neutral-950 rounded-full w-10 h-10 shadow flex items-center justify-center border-2 border-rose-100 dark:border-rose-500">
                  <Box className="text-rose-500" size={25} />
                </span>
                <div className="text-neutral-400">تعداد سفارشات</div>
                <div className="text-2xl font-semibold">567</div>
                <span className="text-red-500 text-sm">
                  -2% نسبت به ماه قبل
                </span>
              </div>

              <div className="dark:shadow-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20 border-neutral-50 dark:border-neutral-900 border-2 relative p-4 pt-8 rounded-2xl shadow-md flex flex-col items-start">
                <span className="absolute right-0 left-0 mx-auto -top-5 bg-white dark:bg-neutral-950 rounded-full w-10 h-10 shadow flex items-center justify-center border-2 border-yellow-100 dark:border-yellow-500">
                  <UserRound className="text-yellow-500" size={25} />
                </span>
                <div className="text-neutral-400">تعداد کاربران</div>
                <div className="text-2xl font-semibold">
                  {users.length.toLocaleString()}
                </div>
                <span className="text-green-500 text-sm">
                  +10% نسبت به ماه قبل
                </span>
              </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md border-2 border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  محصولات برتر هفته
                </h3>
                <p className="text-neutral-400 text-sm">
                  برترین ها از نگاه شما
                </p>
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
                  {topProducts.map((product) => (
                    <TableRow key={String(product._id)}>
                      <TableCell>
                        <div className="w-20">
                          <Image
                            alt={product.title}
                            height={100}
                            width={100}
                            className="w-16 h-16 object-cover"
                            src={product.thumbnail}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-96">{product.title}</p>
                      </TableCell>
                      <TableCell>
                        <div className="w-36 relative flex items-center h-2">
                          <div className="w-28 absolute top-0 h-full right-0 bg-neutral-300 rounded">
                            <div
                              className="bg-green-500 rounded h-full"
                              style={{
                                width: `${product.recommended_percent ?? 0}%`,
                              }}
                            ></div>
                          </div>
                          <p className="absolute -top-1.5 -left-2">
                            {product.recommended_percent ?? 0}%
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
