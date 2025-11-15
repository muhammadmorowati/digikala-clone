"use client";

import { updateUser } from "@/src/utils/mockActions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

export default function UserUpdateForm({ user }) {
  const router = useRouter();

  const [role, setRole] = useState(user.role ?? "USER");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ----------------------------
  // Handle Avatar File Upload
  // ----------------------------
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  // ----------------------------
  // Handle Form Submit (final)
  // ----------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement
    
    const formData = new FormData();
    formData.append("_id", user._id);
    formData.append("name", nameInput?.value || user.name);
    formData.append("phone", phoneInput?.value || user.phone);
    formData.append("role", role);

    if (file) {
      formData.append("avatar", file);
    }

    try {
      await updateUser(formData);
      toast.success("کاربر با موفقیت به‌روزرسانی شد.");
      router.push("/admin/users");
    } catch (error) {
      console.error(error);
      toast.error("خطایی رخ داد! دوباره تلاش کنید.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* NAME */}
      <div className="h-20 relative">
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={user.name}
          required
          className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2
          border-neutral-300 bg-neutral-50 px-2.5 pb-2.5 pt-5 text-sm text-neutral-900
          focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-neutral-600
          dark:bg-neutral-900 dark:text-white dark:focus:border-blue-500"
        />

        <label
          htmlFor="name"
          className="absolute right-2.5 top-4 text-sm text-neutral-500 
          duration-300 transform -translate-y-4 scale-75 peer-placeholder-shown:translate-y-0 
          peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
        >
          نام و نام خانوادگی
        </label>
      </div>

      {/* EMAIL (disabled) */}
      <div className="h-24">
        <input
          type="email"
          id="email"
          name="email"
          disabled
          defaultValue={user.email}
          className="disabled:cursor-not-allowed disabled:opacity-80 
          block w-full border-0 border-b-2 border-neutral-300 bg-neutral-50 
          px-2.5 pb-2.5 pt-5 text-sm text-neutral-900"
        />

        <label
          htmlFor="email"
          className="absolute right-2.5 top-4 text-sm text-neutral-500 
          duration-300 transform -translate-y-4 scale-75"
        >
          ایمیل
        </label>
      </div>

      {/* PHONE */}
      <div className="h-20 relative">
        <input
          type="text"
          id="phone"
          name="phone"
          defaultValue={user.phone}
          required
          className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2
          border-neutral-300 bg-neutral-50 px-2.5 pb-2.5 pt-5 text-sm text-neutral-900 
          focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-neutral-600
          dark:bg-neutral-900 dark:text-white dark:focus:border-blue-500"
        />

        <label
          htmlFor="phone"
          className="absolute right-2.5 top-4 text-sm text-neutral-500 
          duration-300 transform -translate-y-4 scale-75 peer-placeholder-shown:translate-y-0
          peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
        >
          شماره موبایل
        </label>
      </div>

      {/* ROLE */}
      <div className="mb-5 text-right">
        <Select dir="rtl" defaultValue={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="نقش کاربر" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="USER">کاربر عادی</SelectItem>
              <SelectItem value="ADMIN">مدیر</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* AVATAR */}
      <div className="mb-5 text-right">
        <label htmlFor="avatar" className="pb-2 text-sm pr-1 text-neutral-500">
          پروفایل
        </label>

        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          onChange={handleAvatarChange}
          className="h-full w-full dark:border-neutral-700 dark:bg-neutral-900 
          rounded-lg p-1"
        />
      </div>

      {user.avatar && (
        <Image
          src={user.avatar}
          width={100}
          height={100}
          alt="User Avatar"
          className="object-cover border rounded-lg mx-auto"
        />
      )}

      <SubmitButton loading={loading} />
    </form>
  );
}

const SubmitButton = ({ loading }: { loading: boolean }) => {
  return (
    <Button
      type="submit"
      variant="destructive"
      className="my-5 w-full text-lg font-medium"
      disabled={loading}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{loading ? "در حال ویرایش ..." : "ویرایش اطلاعات کاربر"}</span>

        {loading && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-dotted border-neutral-800"></div>
        )}
      </div>
    </Button>
  );
};
