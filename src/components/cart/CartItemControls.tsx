"use client";

import { deleteOrder } from "@/src/app/admin/orders/action";
import { useCart } from "@/src/utils/cartItemsContext";
import { CartItem } from "@/src/utils/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCallback } from "react";

interface CartItemControlsProps {
  product: CartItem;
  vertical?: boolean;
}

export default function CartItemControls({ product, vertical }: CartItemControlsProps) {
  const { decreaseCount, increaseCount, deleteFromCart } = useCart();

  const productId = String(product._id);

  const handleIncrease = useCallback(() => {
    increaseCount(product);
  }, [increaseCount, product]);

  const handleDecrease = useCallback(() => {
    decreaseCount(product);
  }, [decreaseCount, product]);

  const handleDelete = useCallback(() => {
    deleteFromCart(productId);

    // ❗ Only call deleteOrder if this is really intended!
    deleteOrder(productId);
  }, [deleteFromCart, productId]);

  return (
    <div
      className={`border shadow flex items-center justify-between gap-5 rounded-md text-red-500 p-2 ${
        vertical ? "flex-col" : ""
      }`}
    >
      <button onClick={handleIncrease} aria-label="Add one">
        <Plus size={20} />
      </button>

      <span className="font-bold">{product.count}</span>

      <button
        onClick={product.count > 1 ? handleDecrease : handleDelete}
        aria-label={product.count > 1 ? "Remove one" : "Delete item"}
      >
        {product.count > 1 ? <Minus size={20} /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}
