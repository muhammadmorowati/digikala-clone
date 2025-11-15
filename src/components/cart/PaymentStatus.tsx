"use client";

import { useCart } from "@/src/utils/cartItemsContext";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface PaymentStatusProps {
  param: { success: boolean };
}

export default function PaymentStatus({ param }: PaymentStatusProps) {
  return param.success ? <SuccessfulPayment /> : <FailedPayment />;
}

/* ---------------- SUCCESS COMPONENT ---------------- */

const SuccessfulPayment = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <StatusWrapper>
      <SuccessSVG />
      <StatusMessage
        message="پرداخت شما با موفقیت انجام شد."
        color="text-green-600"
      />
    </StatusWrapper>
  );
};

/* ---------------- FAILED COMPONENT ---------------- */

const FailedPayment = () => {
  return (
    <StatusWrapper>
      <FailedSVG />
      <StatusMessage
        message="متاسفانه پرداخت شما ناموفق بود!"
        color="text-red-700"
      />
    </StatusWrapper>
  );
};

/* ---------------- SHARED COMPONENTS ---------------- */

const StatusWrapper = ({ children }) => (
  <>
    {children}
    <div className="text-center font-irsansb">
      <Button asChild variant="link" className="text-xs">
        <Link href="/checkout/cart">
          بازگشت
          <ArrowLeft size={15} />
        </Link>
      </Button>
    </div>
  </>
);

const StatusMessage = ({
  message,
  color,
}: {
  message: string;
  color: string;
}) => (
  <p className={`${color} text-lg text-center font-irsansb`}>{message}</p>
);

/* ---------------- SVGs (unchanged) ---------------- */

const SuccessSVG = () => (
  <> 
    {/* your success SVG unchanged */} 
  </>
);

const FailedSVG = () => (
  <> 
    {/* your failed SVG unchanged */} 
  </>
);
