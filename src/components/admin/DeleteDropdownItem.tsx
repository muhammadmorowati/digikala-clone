"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useCart } from "@/src/utils/cartItemsContext";
import { Order } from "@/src/utils/types";
import {
  removeCategory,
  removeSubmenu,
  removeSubmenuItem,
  removeProduct,
  removeStory,
  removeUser,
  removeArticle,
} from "@/src/utils/mockActions"; // ✅ new local utility functions

export function DeleteDropdownItem({
  categoryId,
  productId,
  userId,
  submenuId,
  itemId,
  storyId,
  articleId,
  order,
}: {
  categoryId?: string;
  productId?: string;
  userId?: string;
  submenuId?: string;
  itemId?: string;
  storyId?: string;
  articleId?: string;
  order?: Order;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { deleteFromCart } = useCart();

  const deleteHandler = () => {
    toast((t) => (
      <div>
        حذف{" "}
        {productId
          ? "محصول"
          : categoryId
          ? "دسته‌بندی"
          : userId
          ? "کاربر"
          : submenuId
          ? "زیرمجموعه"
          : itemId
          ? "آیتم زیرمجموعه"
          : storyId
          ? "داستان"
          : articleId
          ? "مقاله"
          : order
          ? "سفارش"
          : ""}
        :
        <Button
          className="ml-1 mr-5"
          variant="secondary"
          onClick={() => toast.dismiss(t.id)}
        >
          انصراف
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            startTransition(() => {
              toast.dismiss(t.id);

              // ✅ use local data actions
              if (userId) removeUser(userId);
              else if (productId) removeProduct(productId);
              else if (categoryId) removeCategory(categoryId);
              else if (submenuId) removeSubmenu(submenuId);
              else if (itemId) removeSubmenuItem(itemId);
              else if (storyId) removeStory(storyId);
              else if (articleId) removeArticle(articleId);
              else if (order) deleteFromCart(order.productId.toString());

              router.refresh();
              toast.success(
                productId
                  ? "محصول با موفقیت حذف شد!"
                  : categoryId
                  ? "دسته‌بندی با موفقیت حذف شد!"
                  : userId
                  ? "کاربر با موفقیت حذف شد!"
                  : submenuId
                  ? "زیرمجموعه با موفقیت حذف شد!"
                  : itemId
                  ? "آیتم زیرمجموعه با موفقیت حذف شد!"
                  : storyId
                  ? "داستان با موفقیت حذف شد!"
                  : articleId
                  ? "مقاله با موفقیت حذف شد!"
                  : order
                  ? "سفارش با موفقیت حذف شد!"
                  : ""
              );
            });
          }}
        >
          حذف
        </Button>
      </div>
    ));
  };

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={deleteHandler}
      asChild
    >
      <div className="flex w-full justify-end">
        حذف
        <Trash2 size={15} className="mx-4" />
      </div>
    </DropdownMenuItem>
  );
}
