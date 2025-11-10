import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/src/utils/zarinpal";
import path from "path";
import { promises as fs } from "fs";

type CreatePaymentResult = {
  authority: string;
  paymentUrl: string;
};

type Body = {
  totalPrice: number;
  user: { _id: string; phone?: string };
};

const filePath = path.join(process.cwd(), "data", "checkouts.json");

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as Body;
    const { totalPrice, user } = body ?? {};

    // 🔸 Validate incoming data
    if (typeof totalPrice !== "number" || !user?._id) {
      return NextResponse.json(
        { message: "Invalid payload: totalPrice (number) and user._id are required." },
        { status: 400 }
      );
    }

    // 🔹 Create Zarinpal payment request
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

    // 🔹 Read existing checkouts
    const data = await fs.readFile(filePath, "utf8").catch(() => "[]");
    const checkouts = JSON.parse(data);

    // 🔹 Create new checkout object
    const newCheckout = {
      _id: Date.now().toString(),
      totalPrice,
      authority: payment.authority,
      user: user._id,
      createdAt: new Date().toISOString(),
    };

    // 🔹 Append and save to JSON file
    checkouts.push(newCheckout);
    await fs.writeFile(filePath, JSON.stringify(checkouts, null, 2));

    // 🔹 Return success
    return NextResponse.json(
      {
        message: "Checkout created successfully :))",
        checkout: newCheckout,
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
