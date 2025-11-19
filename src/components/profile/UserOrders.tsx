import { Order } from "@/src/utils/types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import React from "react";

/**
 * Temporary mock data — later replace with real orders fetched from API.
 */
const MOCK_USER_ID = "1";

const MOCK_ORDERS: Order[] = [
  {
    _id: "order1",
    userId: MOCK_USER_ID,
    productIds: ["product1"],
    totalAmount: 120000,
    status: "processing",
    date: new Date().toISOString(),
  },
];

/**
 * Order status definitions used for the summary UI section.
 * Centralized mapping → easily expandable later.
 */
const ORDER_STATUS_CONFIG = [
  { key: "processing", title: "جاری", src: "/profile/status-processing.svg" },
  { key: "delivered", title: "تحویل شده", src: "/profile/status-delivered.svg" },
  { key: "returned", title: "مرجوع شده", src: "/profile/status-returned.svg" },
] as const;

export default function UserOrders() {
  // Count the number of orders per status
  const orderSummary = ORDER_STATUS_CONFIG.map((item) => ({
    ...item,
    value: MOCK_ORDERS.filter((o) => o.status === item.key).length,
  }));

  return (
    <div className="flex flex-col gap-10 lg:border rounded-md lg:p-5 max-lg:mx-4">
      {/* HEADER */}
      <div className="flex items-center justify-between text-xs font-irsansb">
        <p className="whitespace-nowrap border-b-2 border-b-red-500 pb-3">
          سفارش‌های من
        </p>

        <button className="flex items-center gap-1 text-sky-500">
          مشاهده همه
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* ORDER STATUS SUMMARY */}
      <div className="flex items-center justify-between max-lg:px-10 max-sm:px-2">
        {orderSummary.map((status, index) => (
          <React.Fragment key={status.key}>
            <div className="px-4 text-center lg:flex items-center">
              {/* ICON + mobile count badge */}
              <div className="relative">
                <Image
                  src={status.src}
                  alt={status.title}
                  width={60}
                  height={60}
                />
                {status.value > 0 && (
                  <span className="lg:hidden w-5 h-5 text-xs flex items-center justify-center bg-neutral-200 text-black absolute bottom-0 -left-1 rounded-sm">
                    {status.value}
                  </span>
                )}
              </div>

              {/* LABELS */}
              <div>
                <p className="max-lg:hidden">{status.value} سفارش</p>
                <p className="text-xs mt-1">{status.title}</p>
              </div>
            </div>

            {/* Vertical divider between items */}
            {index < orderSummary.length - 1 && (
              <div className="w-0.5 h-20 bg-neutral-100 dark:bg-neutral-800"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
