"use client";

import { useCart } from "@/src/utils/cartItemsContext";
import { ReactNode } from "react";

interface CartContainerProps {
  children: ReactNode;
}

export default function CartContainer({ children }: CartContainerProps) {
  const { cart } = useCart();

  const hasItems = cart?.length > 0;

  return (
    <div
      className={`flex flex-col gap-5 lg:px-20 pt-5 ${
        hasItems ? "pb-36 lg:pb-16" : "pb-20 lg:pb-16"
      }`}
    >
      {children}
    </div>
  );
}
