
import { verifyPayment } from "@/utils/zarinpal";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;
    const { Authority: authority, Status } = Object.fromEntries(
      searchParams.entries()
    );

    const successUrl = new URL("/checkout/payment", req.nextUrl.origin);
    successUrl.searchParams.set(
      "success",
      "Payment verified and order created successfully!"
    );

    return NextResponse.redirect(successUrl);
  } catch (err) {
    const error = err as Error
    return NextResponse.json(
      {
        message: "Internal Server Error !!",
        error: error?.message,
      },
      { status: 500 }
    );
  }
};
