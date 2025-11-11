"use client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { LoginFormState } from "@/src/utils/types";
import { LoginSchemaType, LoginSchema } from "@/src/utils/validation";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signin } from "@/src/utils/auth"; // ✅ local mock auth
import Logo from "@/src/components/Logo";

const initialState: LoginFormState = {
  errors: {},
  success: false,
};

export default function Login() {
  const searchParams = useSearchParams();
  const redirectedLogin = searchParams.has("redirected");
  const router = useRouter();
  const [state, setState] = useState<LoginFormState>(initialState);

  const validateForm = (formData: FormData) => {
    const formObject = Object.fromEntries(formData.entries()) as LoginSchemaType;
    const validation = LoginSchema.safeParse(formObject);

    if (validation.success) return {};

    const errors: Partial<Record<"email" | "password" | "general", string[]>> = {};
    validation.error.errors.forEach((err) => {
      const key = err.path[0];
      if (key === "email" || key === "password" || key === "general") {
        errors[key] = [...(errors[key] ?? []), err.message];
      }
    });
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setState({ ...state, errors: validationErrors, success: false });
      return;
    }

    try {
      const result = await signin(state, formData);

      if (result.success) {
        toast.success("خوشحالیم که می‌بینیمت :)");
        router.replace(redirectedLogin ? "/admin" : "/");
      } else {
        setState({ ...state, errors: result.errors, success: false });
        toast.error(result.errors.general?.[0] ?? "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setState({
        ...state,
        errors: { general: ["An unexpected error occurred. Please try again."] },
        success: false,
      });
    }
  };

  return (
    <>
      {redirectedLogin && (
        <div className="m-3 bg-white p-4 border text-sm rounded-lg shadow-md text-red-500 w-80 max-lg:mx-auto">
          برای مشاهده پنل مدیریت آدرس ایمیل و رمز کاربری زیر را وارد کنید.
          <p className="mt-5 text-left text-gray-500">
            Email: negar.karimnejad@gmail.com <br /> Password: admin123456
          </p>
        </div>
      )}

      <div className={`items-center justify-center ${redirectedLogin ? "md:flex" : "flex"}`}>
        <div
          className={`md:w-[410px] w-full flex flex-col gap-3 md:border rounded-lg ${
            redirectedLogin ? "mt-0 px-8 py-2" : "mt-16 p-8"
          }`}
        >
          <h1 className="font-bold pb-5 mx-auto text-5xl">
            <Link href="/">
              <Logo width={100} height={80} />
            </Link>
          </h1>

          <p className="text-xl font-medium text-right">
            ورود |{" "}
            <Link className="hover:text-red-500" href="/register">
              ثبت نام
            </Link>
          </p>
          <p className="text-xs text-right mt-5">سلام!</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="text-xs">
              لطفا ایمیل خود را وارد کنید
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              aria-invalid={!!state.errors.email}
              aria-describedby="email-error"
              className={`bg-transparent py-5 border rounded-lg ${
                state.errors.email ? "border-red-500" : ""
              }`}
            />
            {state.errors.email && (
              <div id="email-error" className="text-destructive text-xs">
                {state.errors.email}
              </div>
            )}

            <label htmlFor="password" className="text-xs">
              لطفا پسورد خود را وارد کنید
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              aria-invalid={!!state.errors.password}
              aria-describedby="password-error"
              className={`bg-transparent py-5 border rounded-lg ${
                state.errors.password ? "border-red-500" : ""
              }`}
            />
            {state.errors.password && (
              <div id="password-error" className="text-destructive text-xs">
                {state.errors.password}
              </div>
            )}

            <Button type="submit" className="rounded-lg mt-8">
              ورود
            </Button>
          </form>

          <small className="text-gray-600 dark:text-gray-300 mx-auto text-[10px] sm:text-xs mt-1">
            ورود شما به معنای پذیرش{" "}
            <Link href="#" className="text-blue-500">
              شرایط دیجی‌کالا
            </Link>{" "}
            و{" "}
            <Link href="#" className="text-blue-500">
              قوانین حریم‌خصوصی
            </Link>{" "}
            است
          </small>
        </div>
      </div>
    </>
  );
}
