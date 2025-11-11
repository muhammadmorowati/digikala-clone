import PaymentStatus from "@/src/components/cart/PaymentStatus";

interface VerifyPaymentPageProps {
  searchParams: {
    success?: string;
    error?: string;
  };
}

export default async function VerifyPaymentPage({
  searchParams,
}: VerifyPaymentPageProps) {
  return (
    <main className="mt-20 flex flex-col items-center justify-center gap-5">
      <PaymentStatus param={searchParams} />
    </main>
  );
}
