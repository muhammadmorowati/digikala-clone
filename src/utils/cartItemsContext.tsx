"use client";

import { CartItem } from "@/src/utils/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type CartContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  totalPrice: number;
  totalDiscountPrice: number;
  totalDiscount: number;
  decreaseCount: (product: CartItem) => void;
  increaseCount: (product: CartItem) => void;
  deleteFromCart: (productID: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscountPrice, setTotalDiscountPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  // Load cart from localStorage once
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Recalculate totals when cart changes
  useEffect(() => {
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    const totalDiscountPrice = cart.reduce(
      (sum, item) => sum + item.discount_price * item.count,
      0
    );

    const totalDiscount = cart.reduce(
      (sum, item) =>
        sum + (item.price - item.discount_price) * item.count,
      0
    );

    setTotalPrice(totalPrice);
    setTotalDiscountPrice(totalDiscountPrice);
    setTotalDiscount(totalDiscount);
  }, [cart]);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const updateCart = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const decreaseCount = (product: CartItem) => {
    const updated = cart.map((item) =>
      item._id === product._id && item.count > 1
        ? { ...item, count: item.count - 1 }
        : item
    );
    updateCart(updated);
  };

  const increaseCount = (product: CartItem) => {
    const updated = cart.map((item) =>
      item._id === product._id
        ? { ...item, count: item.count + 1 }
        : item
    );
    updateCart(updated);
  };

  const deleteFromCart = (productID: string) => {
    const updated = cart.filter((item) => item._id !== productID);
    updateCart(updated);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        totalPrice,
        totalDiscountPrice,
        totalDiscount,
        decreaseCount,
        increaseCount,
        deleteFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { CartProvider, useCart };
