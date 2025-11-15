"use client";

import { useCart } from "@/src/utils/cartItemsContext";
import React from "react";

interface CartLengthPseudoProps {
  className?: string;
}

export default function CartLengthPseudo({ className }: CartLengthPseudoProps) {
  const { cart } = useCart();
  const cartLength = cart.length;

  if (cartLength === 0) return null;

  return (
    <span
      className={`flex items-center justify-center text-xs rounded-sm absolute w-4 h-3 bg-red-500 -bottom-1 -right-2 text-white ${className}`}
    >
      {cartLength}
    </span>
  );
}
