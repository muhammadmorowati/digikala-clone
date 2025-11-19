import axios from "axios";

const zarinpal = axios.create({
  baseURL: process.env.ZARINPAL_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface CreatePaymentInput {
  amountInRial: number;
  mobile?: string;
  description: string;
}

export const createPayment = async ({
  amountInRial,
  mobile,
  description,
}: CreatePaymentInput) => {
  try {
    const callbackUrl = process.env.ZARINPAL_PAYMENT_CALLBACK_URL;

    if (!callbackUrl) {
      throw new Error("Missing ZARINPAL_PAYMENT_CALLBACK_URL");
    }

    const response = await zarinpal.post("/request.json", {
      merchant_id: process.env.ZARINPAL_PAYMENT_MERCHANT_ID,
      amount: amountInRial,
      description,
      callback_url: callbackUrl,
      metadata: {
        mobile,
      },
    });

    const result = response.data;

    if (result.data?.code !== 100) {
      return {
        success: false,
        error: result.errors || "Payment request failed",
        code: result.data?.code,
      };
    }

    return {
      success: true,
      authority: result.data.authority,
      paymentUrl: `${process.env.ZARINPAL_PAYMENT_BASE_URL}/${result.data.authority}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data || err.message,
    };
  }
};

interface VerifyPaymentInput {
  amountInRial: number;
  authority: string;
}

export const verifyPayment = async ({
  amountInRial,
  authority,
}: VerifyPaymentInput) => {
  try {
    const response = await zarinpal.post("/verify.json", {
      merchant_id: process.env.ZARINPAL_PAYMENT_MERCHANT_ID,
      amount: amountInRial,
      authority,
    });

    const result = response.data;

    if (result.data?.code !== 100) {
      return {
        success: false,
        message: "Payment verification failed",
        code: result.data?.code,
        raw: result,
      };
    }

    return {
      success: true,
      refId: result.data.ref_id,
      raw: result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data || err.message,
    };
  }
};
