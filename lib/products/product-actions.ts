"use server";

import { auth } from "@clerk/nextjs/server";
import { safeParse } from "zod";
import { productSchema } from "./product-validation";

type FormState = {
  success: boolean;
  error?: Record<string, string[]>;
  message: string;
};
export async function addProductAction(
  prevState: FormState,
  formData: FormData,
) {
  // console.log(formData);

  try {
    // const { userId } = await auth();
    // if (!userId) {
    //   return {
    //     success: false,
    //     error: {},
    //     message: "You must be logged in",
    //   };
    // }

    //data
    const rawFormData = Object.fromEntries(formData.entries());
    // validate the data
    const validatedData = productSchema.safeParse(rawFormData);

    if (!validatedData.success) {
      console.log(validatedData.error.flatten().fieldErrors);
      return {
        success: false,
        error: validatedData.error.flatten().fieldErrors,
        message: "Invalid data",
      };
    }

    const data = validatedData.data;

    // create product
    // const product = await prisma.product.create({
    //   data: validatedData.data,
    // });
  } catch (err) {
    console.log(err);

    return {
      success: false,
      error: { err },
      message: "Something went wrong",
    };
  }
}
