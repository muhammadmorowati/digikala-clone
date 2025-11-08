
import { verifyPayment } from "@/src/utils/zarinpal";
import { NextRequest, NextResponse } from "next/server";
import CheckoutModel from "@/models/Checkout"

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;
    const { Authority: authority, Status } = Object.fromEntries(
      searchParams.entries()
    );

    const checkout = await CheckoutModel.findOne({ authority });
    if (!checkout) {
      return NextResponse.json(
        { message: "Checkout not found !!" },
        { status: 404 }
      );
    }

    const payment = await verifyPayment({
      amountInRial: checkout.totalPrice,
      authority,
    });

    if (![100, 101].includes(payment.data.code)) {
      const errorUrl = new URL("/checkout/payment", req.nextUrl.origin);
      errorUrl.searchParams.set("error", "Payment not verified");

      return NextResponse.redirect(errorUrl);
    }

    await CheckoutModel.deleteOne({
      _id: checkout._id,
    });

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
