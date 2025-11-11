import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/src/utils/zarinpal";
import { readJSON } from "@/src/utils/fileUtils";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";

interface Checkout {
  _id: string;
  totalPrice: number;
  authority: string;
  user: string;
  createdAt: string;
}

interface Body {
  totalPrice: number;
  user: { _id: string; phone?: string };
}

interface CreatePaymentResult {
  authority: string;
  paymentUrl: string;
}

const filePath = path.join(process.cwd(), "data", "checkouts.json");

// ─────────────────────────── POST /api/payment
export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as Body;
    const { totalPrice, user } = body ?? {};

    // 🔸 Validate input
    if (typeof totalPrice !== "number" || !user?._id) {
      return NextResponse.json(
        { message: "پارامترهای ارسالی معتبر نیستند." },
        { status: 400 }
      );
    }

    // 🔹 Request payment from Zarinpal
    const payment = (await createPayment({
      amountInRial: totalPrice,
      description: "پرداخت با شناسه 99812",
      mobile: user.phone ?? "",
    })) as CreatePaymentResult;

    if (!payment?.authority || !payment?.paymentUrl) {
      return NextResponse.json(
        { message: "پاسخ نامعتبر از درگاه پرداخت دریافت شد." },
        { status: 502 }
      );
    }

    // 🔹 Read existing checkouts (or start empty)
    const checkouts = await readJSON<Checkout>(filePath);

    // 🔹 Create new checkout
    const newCheckout: Checkout = {
      _id: crypto.randomUUID(),
      totalPrice,
      authority: payment.authority,
      user: user._id,
      createdAt: new Date().toISOString(),
    };

    // 🔹 Append and save
    checkouts.push(newCheckout);
    await fs.writeFile(filePath, JSON.stringify(checkouts, null, 2), "utf8");

    // 🔹 Respond
    return NextResponse.json(
      {
        message: "پرداخت با موفقیت ایجاد شد.",
        checkout: newCheckout,
        paymentUrl: payment.paymentUrl,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Payment creation failed:", err);
    return NextResponse.json(
      {
        message: "خطای داخلی سرور",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
};
