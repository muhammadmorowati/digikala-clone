"use server";
import { OrderSchema } from "@/utils/validation";
import { revalidatePath } from "next/cache";

export async function addOrder(formData: FormData) {
  const entries = Object.fromEntries(formData.entries());

  const result = OrderSchema.safeParse(entries);
  if (!result.success) {
    console.log("❌❌❌", result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

    // Revalidate paths and redirect
    revalidatePath("/");
    revalidatePath("/orders");
  }
