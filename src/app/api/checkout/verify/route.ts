import { verifyPayment } from "@/src/utils/zarinpal";
import { NextRequest, NextResponse } from "next/server";
import { readJSON } from "@/src/utils/fileUtils";
import path from "path";
import { promises as fs } from "fs";

interface Checkout {
  _id: string;
  authority: string;
  totalPrice: number;
}

const filePath = path.join(process.cwd(), "data", "checkouts.json");

// ─────────────────────────── GET /api/verify
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    if (!authority || !status) {
      return NextResponse.json(
        { message: "پارامترهای پرداخت نامعتبر هستند." },
        { status: 400 }
      );
    }

    // 🔹 Load all checkouts
    const checkouts = await readJSON<Checkout>(filePath);
    const checkout = checkouts.find((c) => c.authority === authority);

    if (!checkout) {
      return NextResponse.json(
        { message: "سفارش مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    // 🔹 Verify payment via Zarinpal
    const payment = await verifyPayment({
      amountInRial: checkout.totalPrice,
      authority,
    });

    const isVerified = [100, 101].includes(payment.data.code);

    // 🔹 Prepare redirect URL
    const redirectUrl = new URL("/checkout/payment", req.nextUrl.origin);

    if (!isVerified) {
      redirectUrl.searchParams.set("error", "تأیید پرداخت ناموفق بود.");
      return NextResponse.redirect(redirectUrl);
    }

    // 🔹 Remove verified checkout from storage
    const updated = checkouts.filter((c) => c._id !== checkout._id);
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf8");

    // 🔹 Redirect to success
    redirectUrl.searchParams.set(
      "success",
      "پرداخت با موفقیت تأیید و سفارش ثبت شد."
    );
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    return NextResponse.json(
      { message: "خطای داخلی سرور", error: (err as Error).message },
      { status: 500 }
    );
  }
};
