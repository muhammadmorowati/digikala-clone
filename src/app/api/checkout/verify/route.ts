import { verifyPayment } from "@/src/utils/zarinpal";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

interface Checkout {
  _id: string;
  authority: string;
  totalPrice: number;
}

const filePath = path.join(process.cwd(), "data", "checkouts.json");

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    if (!authority || !status) {
      return NextResponse.json(
        { message: "Invalid payment parameters" },
        { status: 400 }
      );
    }

    // 🔹 Load all checkouts from a local JSON file
    const data = await fs.readFile(filePath, "utf8").catch(() => "[]");
    const checkouts: Checkout[] = JSON.parse(data);

    // 🔹 Find matching checkout
    const checkout = checkouts.find((c) => c.authority === authority);
    if (!checkout) {
      return NextResponse.json(
        { message: "Checkout not found!" },
        { status: 404 }
      );
    }

    // 🔹 Verify payment with Zarinpal
    const payment = await verifyPayment({
      amountInRial: checkout.totalPrice,
      authority,
    });

    // 🔹 Handle failed payment
    if (![100, 101].includes(payment.data.code)) {
      const errorUrl = new URL("/checkout/payment", req.nextUrl.origin);
      errorUrl.searchParams.set("error", "Payment not verified");
      return NextResponse.redirect(errorUrl);
    }

    // 🔹 Remove verified checkout (simulate deletion)
    const updatedCheckouts = checkouts.filter((c) => c._id !== checkout._id);
    await fs.writeFile(filePath, JSON.stringify(updatedCheckouts, null, 2));

    // 🔹 Redirect to success page
    const successUrl = new URL("/checkout/payment", req.nextUrl.origin);
    successUrl.searchParams.set(
      "success",
      "Payment verified and order created successfully!"
    );
    return NextResponse.redirect(successUrl);
  } catch (err: any) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: err?.message,
      },
      { status: 500 }
    );
  }
};
