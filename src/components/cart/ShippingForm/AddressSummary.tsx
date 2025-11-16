"use client";

import { Address } from "@/src/utils/types";

export default function AddressSummary({
  address,
  onEdit,
}: {
  address: Address;
  onEdit: () => void;
}) {
  return (
    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg mt-6">
      <div className="flex justify-between items-center">
        <h4 className="font-irsansb">آدرس شما</h4>
        <button
          onClick={onEdit}
          className="text-sky-500 text-xs underline"
        >
          ویرایش
        </button>
      </div>

      <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2 leading-6">
        {address.province}، {address.city} — {address.street}، پلاک{" "}
        {address.plate}
      </p>
      {address.unit && (
        <p className="text-xs mt-1 opacity-70">واحد: {address.unit}</p>
      )}
      <p className="text-xs opacity-70 mt-2">
        کد پستی: {address.postalcode}
      </p>
    </div>
  );
}
