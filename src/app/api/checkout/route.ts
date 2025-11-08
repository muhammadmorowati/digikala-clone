import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/mongodb";
import CheckoutModel from "@/models/Checkout";
import { createPayment } from "@/src/utils/zarinpal";

type CreatePaymentResult = {
  authority: string;
  paymentUrl: string;
};

type Body = {
  totalPrice: number;
  user: { _id: string; phone?: string };
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    const body = (await req.json()) as Body;
    const { totalPrice, user } = body ?? {};

  
    if (typeof totalPrice !== "number" || !user?._id) {
      return NextResponse.json(
        { message: "Invalid payload: totalPrice (number) and user._id are required." },
        { status: 400 }
      );
    }

    const payment = (await createPayment({
      amountInRial: totalPrice,
      description: "پرداخت با شناسه 99812",
      mobile: user.phone ?? "",
    })) as CreatePaymentResult; 

    if (!payment?.authority || !payment?.paymentUrl) {
      return NextResponse.json(
        { message: "Invalid payment response from gateway." },
        { status: 502 }
      );
    }

    const checkout = await CheckoutModel.create({
      totalPrice,
      authority: payment.authority,
      user: user._id,
    });

    return NextResponse.json(
      {
        message: "Checkout created successfully :))",
        checkout,
        paymentUrl: payment.paymentUrl,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Internal Server Error !!",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
};
