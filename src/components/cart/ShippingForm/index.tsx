"use client";

import { useState, useEffect, FormEvent } from "react";
import { User, Address } from "@/src/utils/types";
import  useScroll  from "@/src/utils/useScroll";
import { useCart } from "@/src/utils/cartItemsContext";
import { useRouter } from "next/navigation";
import AddressForm from "./AddressForm";
import AddressSummary from "./AddressSummary";
import CheckoutButton from "./CheckoutButton";
import clsx from "clsx";
import { updateUser } from "@/src/utils/mockActions";

export default function ShippingForm({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(!user.address);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address | null>(user.address || null);

  const { cart, totalPrice } = useCart();
  const { isVisible } = useScroll();
  const router = useRouter();

  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    if (cart.length === 0) router.push("/checkout/cart");
  }, [cart.length, router]);

  const handleSubmit = async (data: Address) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("_id", user._id);
      formData.append("role", user.role ?? "USER");
      formData.append("name", user.name);
      formData.append("phone", user.phone);
      formData.append("address", JSON.stringify(data));

      const result = await updateUser(formData);
      if (!result) {
        setAddress(data);
        closeModal();
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Address modal */}
      <div
        onClick={closeModal}
        className={clsx(
          "fixed inset-0 bg-black/40 transition-all duration-300 z-50",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            "bg-white dark:bg-neutral-700 max-w-lg w-full mx-auto rounded-xl shadow-lg p-6 transition-all duration-300 mt-12",
            isOpen ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          )}
        >
          <AddressForm
            user={user}
            initialAddress={address}
            loading={loading}
            onSubmit={handleSubmit}
            onClose={closeModal}
          />
        </div>
      </div>

      {/* Address Summary */}
      {address && (
        <AddressSummary address={address} onEdit={() => setIsOpen(true)} />
      )}

      {/* Checkout */}
      <CheckoutButton
        totalPrice={totalPrice}
        disabled={!address}
        isVisible={isVisible}
        loading={loading}
      />
    </>
  );
}
