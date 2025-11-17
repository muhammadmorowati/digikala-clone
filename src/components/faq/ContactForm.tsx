"use client";

import { User } from "@/src/utils/types";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SUBJECT_OPTIONS = [
  "پیشنهاد",
  "انتقاد یا شکایات",
  "پیگیری سفارش",
  "خدمات پس از فروش",
  "استعلام گارانتی",
  "مدیریت",
  "حسابداری و امورمالی",
  "سایر موضوعات",
  "کارت هدیه و گیفت کارت",
] as const;

export default function ContactForm({ user }: { user: User }) {
  const [form, setForm] = useState({
    subject: "-1",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    orderNumber: "",
    message: "",
  });

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      subject: "-1",
      name: "",
      email: "",
      phone: "",
      orderNumber: "",
      message: "",
    });
  };

  const isValid =
    form.subject !== "-1" &&
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.message.trim();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("پیام شما با موفقیت ارسال شد.");
    resetForm();
  };

  return (
    <form onSubmit={submitHandler} className="grid grid-cols-12 gap-5">
      {/* Subject */}
      <label className="col-span-12 lg:col-span-6">
        <span className="text-sm">موضوع</span>
        <span className="text-red-500">*</span>
        <select
          name="subject"
          value={form.subject}
          onChange={(e) => updateField("subject", e.target.value)}
          className="text-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 mt-2 w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="-1">موضوع را انتخاب کنید</option>
          {SUBJECT_OPTIONS.map((sub, idx) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </label>

      {/* Name */}
      <label className="col-span-12 lg:col-span-6" htmlFor="name">
        <span className="text-sm">نام و نام خانوادگی</span>
        <span className="text-red-500">*</span>
        <Input
          id="name"
          name="name"
          className="mt-2 py-6 dark:bg-neutral-900"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </label>

      {/* Email */}
      <label className="col-span-12 lg:col-span-6" htmlFor="email">
        <span className="text-sm">ایمیل</span>
        <span className="text-red-500">*</span>
        <Input
          id="email"
          name="email"
          className="mt-2 py-6 dark:bg-neutral-900"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
      </label>

      {/* Phone */}
      <label className="col-span-12 lg:col-span-6" htmlFor="phone">
        <span className="text-sm">تلفن تماس</span>
        <span className="text-red-500">*</span>
        <Input
          id="phone"
          name="phone"
          className="mt-2 py-6 dark:bg-neutral-900"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
        />
      </label>

      {/* Order Number */}
      <label className="col-span-12 lg:col-span-6" htmlFor="orderNumber">
        <span className="text-sm">شماره سفارش</span>
        <Input
          id="orderNumber"
          name="orderNumber"
          className="mt-2 py-6 dark:bg-neutral-900"
          value={form.orderNumber}
          onChange={(e) => updateField("orderNumber", e.target.value)}
        />
      </label>

      {/* Message */}
      <label className="col-span-12 flex flex-col" htmlFor="message">
        <p>
          <span className="text-sm">متن پیام</span>
          <span className="text-red-500">*</span>
        </p>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="dark:bg-neutral-900 resize-none mt-2 w-full rounded-md border px-3 py-2 text-sm"
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
        ></textarea>
      </label>

      {/* Submit */}
      <div className="col-span-12 flex justify-end">
        <Button
          className="max-lg:w-full"
          disabled={!isValid}
          variant={isValid ? "default" : "disabled"}
        >
          ثبت و ارسال
        </Button>
      </div>
    </form>
  );
}
