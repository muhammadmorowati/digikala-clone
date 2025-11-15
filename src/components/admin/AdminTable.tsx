// src/components/admin/AdminTable.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/src/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/src/components/ui/dropdown-menu";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/src/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Edit2, Eye, MoreVertical } from "lucide-react";
import ProductDetails from "./ProductDetails";
import { DeleteDropdownItem } from "./DeleteDropdownItem";
import {
  Product, User, Category, Submenu, SubmenuItem, Story, Article, Order,
} from "@/src/utils/types";

/* ---------- Types ---------- */
type TableType =
  | "products"
  | "users"
  | "categories"
  | "submenus"
  | "submenuItems"
  | "stories"
  | "articles"
  | "orders";

interface AdminTableProps {
  type: TableType;
  data:
    | Product[]
    | User[]
    | Category[]
    | Submenu[]
    | SubmenuItem[]
    | Story[]
    | Article[]
    | Order[];
}

/* ---------- Headers ---------- */
function getHeaders(type: TableType): string[] {
  switch (type) {
    case "products":
      return ["تصویر", "عنوان", "امتیاز", "قیمت", "تخفیف", ""];
    case "users":
      return ["آواتار", "نام", "ایمیل", "نقش", ""];
    case "categories":
      return ["کاور", "نام", "آیکون", "آدرس لینک", ""];
    case "submenus":
    case "submenuItems":
      return ["نام", "آدرس لینک", ""];
    case "stories":
      return ["نام", "کاور", "تصویر", ""];
    case "orders":
      return ["تعداد", "شناسه سفارش", "شناسه محصول", "شناسه کاربر", ""];
    case "articles":
      return ["کاور", "عنوان", "نویسنده", "منبع", "زمان مطالعه", ""];
    default:
      return [];
  }
}

/* ---------- Inline Row Components ---------- */
function ProductRow({ product }: { product: Product }) {
  return (
    <TableRow key={product._id.toString()}>
      <TableCell>
        <div className="w-20">
          <Image alt={product.title} height={100} width={100} className="w-16 h-16 object-cover" src={product.thumbnail} />
        </div>
      </TableCell>
      <TableCell><p className="w-52 max-w-64">{product.title}</p></TableCell>
      <TableCell><p>{product.rating}</p></TableCell>
      <TableCell>
        <p className="font-iransans text-center whitespace-nowrap">
          {product.price?.toLocaleString()} تومان
        </p>
      </TableCell>
      <TableCell className="max-sm:hidden">
        <div className="bg-red-500 text-white rounded-full text-center px-0.5">{product.discount}%</div>
      </TableCell>
      <TableCell>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Actions">
              <MoreVertical />
              <span className="sr-only">Actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <DialogTrigger className="flex w-full justify-end items-center">
                  مشاهده
                  <Eye size={15} className="text-gray-400 mx-4" />
                </DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className="flex w-full justify-end items-center" href={`/admin/products/${product._id}/edit`}>
                  ویرایش
                  <Edit2 size={15} className="text-gray-400 mx-4" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteDropdownItem productId={product._id.toString()} />
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="w-4/6 mx-auto text-center text-red-500 mb-5 mt-10 leading-8">
                {product.title}
              </DialogTitle>
              <DialogDescription>
                <ProductDetails product={product} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

function UserRow({ user }: { user: User }) {
  const initials = (() => {
    const parts = user.name?.split(" ") ?? [];
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`;
  })();

  return (
    <TableRow key={user._id.toString()}>
      <TableCell>
        <div className="w-20">
          {user.avatar ? (
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} className="object-cover" />
              <AvatarFallback className="text-red-500 p-0.5">{initials}</AvatarFallback>
            </Avatar>
          ) : (
            <Image width={100} height={100} src="/users/avatar1.png" alt="avatar" className="grayscale rounded-full w-16 h-16 border" />
          )}
        </div>
      </TableCell>
      <TableCell><p className="whitespace-nowrap">{user.name}</p></TableCell>
      <TableCell><p>{user.email}</p></TableCell>
      <TableCell><p>{user.role === "USER" ? "کاربر" : "ادمین"}</p></TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Actions">
            <MoreVertical />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link className="flex w-full justify-end items-center" href={`/admin/users/${user._id}/edit`}>
                ویرایش
                <Edit2 size={15} className="text-gray-400 mx-4" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteDropdownItem userId={user._id.toString()} />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function CategoryRow({ category }: { category: Category }) {
  return (
    <TableRow key={category._id.toString()}>
      <TableCell>
        <div className="w-20">
          <Image alt={category.title} height={100} width={100} className="rounded-full w-16 h-16 object-cover" src={category.cover[0]} />
        </div>
      </TableCell>
      <TableCell><p className="whitespace-nowrap">{category.title}</p></TableCell>
      <TableCell>
        <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center">
          <Image alt={category.title} height={100} width={100} className="w-8 h-8 object-cover" src={category.icon!} />
        </div>
      </TableCell>
      <TableCell><p className="whitespace-nowrap">{category.href}</p></TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Actions">
            <MoreVertical />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link className="flex w-full justify-end items-center" href={`/admin/categories/${category._id}/edit`}>
                ویرایش
                <Edit2 size={15} className="text-gray-400 mx-4" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteDropdownItem categoryId={category._id.toString()} />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function SubmenuRow({ submenu }: { submenu: Submenu }) {
  return (
    <TableRow key={submenu._id.toString()}>
      <TableCell><p className="whitespace-nowrap">{submenu.title}</p></TableCell>
      <TableCell><p className="whitespace-nowrap">{submenu.href}</p></TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Actions">
            <MoreVertical />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DeleteDropdownItem submenuId={submenu._id.toString()} />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function SubmenuItemRow({ item }: { item: SubmenuItem }) {
  return (
    <TableRow key={item._id.toString()}>
      <TableCell><p className="whitespace-nowrap">{item.title}</p></TableCell>
      <TableCell><p className="whitespace-nowrap">{item.href}</p></TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Actions">
            <MoreVertical />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DeleteDropdownItem itemId={item._id.toString()} />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function StoryRow({ story }: { story: Story }) {
  return (
    <TableRow key={story._id.toString()}>
      <TableCell><p className="whitespace-nowrap">{story.title}</p></TableCell>
      <TableCell>
        <div className="w-20">
          <Image alt={story.title} height={100} width={100} className="rounded-full w-16 h-16 object-cover" src={story.cover} />
        </div>
      </TableCell>
      <TableCell>
        <div className="w-20">
          <Image alt={story.title} height={100} width={100} className="rounded-full w-16 h-16 object-cover" src={story.post} />
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Actions">
            <MoreVertical />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DeleteDropdownItem storyId={story._id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function ArticleRow({ article }: { article: Article }) {
  return (
    <TableRow key={article._id.toString()}>
      <TableCell>
        <div className="w-20">
          <Image alt={article.title} height={100} width={100} className="w-16 h-16 object-cover" src={article.cover} />
        </div>
      </TableCell>
      <TableCell><p className="whitespace-nowrap">{article.title}</p></TableCell>
      <TableCell><p className="whitespace-nowrap">{article.author}</p></TableCell>
      <TableCell><p className="whitespace-nowrap">{article.source}</p></TableCell>
      <TableCell><p className="whitespace-nowrap">{article.readingTime} دقیقه</p></TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Actions">
            <MoreVertical />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link className="flex w-full justify-end items-center" href={`/admin/articles/${article._id}/edit`}>
                ویرایش
                <Edit2 size={15} className="text-gray-400 mx-4" />
              </Link>
            </DropdownMenuItem>
            <DeleteDropdownItem articleId={article._id.toString()} />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function OrderRow({ order, index }: { order: Order; index: number }) {
  return (
    <TableRow key={order._id.toString()}>
      <TableCell>{index + 1}</TableCell>
      <TableCell><p className="whitespace-nowrap font-sans">{order._id.toString()}</p></TableCell>
      <TableCell><p className="whitespace-nowrap font-sans">{order.productId.toString()}</p></TableCell>
      <TableCell><p className="whitespace-nowrap font-sans">{order.userId.toString()}</p></TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Actions">
            <MoreVertical />
            <span className="sr-only">Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DeleteDropdownItem order={order} />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

/* ---------- Renderer Dispatcher ---------- */
function renderRows(type: TableType, data: any[]) {
  switch (type) {
    case "products":
      return (data as Product[]).map((product) => <ProductRow key={product._id.toString()} product={product} />);
    case "users":
      return (data as User[]).map((user) => <UserRow key={user._id.toString()} user={user} />);
    case "categories":
      return (data as Category[]).map((category) => <CategoryRow key={category._id.toString()} category={category} />);
    case "submenus":
      return (data as Submenu[]).map((submenu) => <SubmenuRow key={submenu._id.toString()} submenu={submenu} />);
    case "submenuItems":
      return (data as SubmenuItem[]).map((item) => <SubmenuItemRow key={item._id.toString()} item={item} />);
    case "stories":
      return (data as Story[]).map((story) => <StoryRow key={story._id.toString()} story={story} />);
    case "articles":
      return (data as Article[]).map((article) => <ArticleRow key={article._id.toString()} article={article} />);
    case "orders":
      return (data as Order[]).map((order, i) => <OrderRow key={order._id.toString()} order={order} index={i} />);
  }
}

/* ---------- Main Component ---------- */
export default function AdminTable({ type, data }: AdminTableProps) {
  if (!data?.length) {
    return (
      <div className="text-center text-sm text-neutral-500 py-10">
        داده‌ای برای نمایش وجود ندارد.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {getHeaders(type).map((head) => (
              <TableHead key={head} className="text-right whitespace-nowrap">
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows(type, data)}</TableBody>
      </Table>
    </div>
  );
}
