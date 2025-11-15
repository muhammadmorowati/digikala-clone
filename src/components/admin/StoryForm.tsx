"use client";

import { addStory } from "@/src/utils/mockActions";
import { Button } from "@/src/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

export default function StoryForm() {
  const [coverName, setCoverName] = useState("");
  const [postName, setPostName] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const cover = formData.get("cover") as File;
    const post = formData.get("post") as File;

    if (!cover || !post) {
      toast.error("لطفاً هر دو تصویر را انتخاب کنید.");
      return;
    }

    try {
      await addStory(formData);
      toast.success("داستان با موفقیت اضافه شد.");
      event.currentTarget.reset();
      setCoverName("");
      setPostName("");
    } catch (error) {
      console.error(error);
      toast.error("خطایی رخ داد.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Title */}
      <div className="h-20 relative">
        <input
          type="text"
          id="title"
          name="title"
          required
          className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 
          border-neutral-300 bg-neutral-50 px-2.5 pb-2.5 pt-5 text-sm text-neutral-900
          focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-neutral-600
          dark:bg-neutral-900 dark:text-white dark:focus:border-blue-500"
        />

        <label
          htmlFor="title"
          className="absolute right-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 
          transform text-sm text-neutral-500 duration-300 peer-placeholder-shown:translate-y-0 
          peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 
          peer-focus:text-blue-600 dark:text-neutral-400 dark:peer-focus:text-blue-500"
        >
          نام داستان
        </label>
      </div>

      {/* Cover Upload */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="cover"
          className="border-b py-2 px-4 rounded-lg cursor-pointer relative w-40 flex items-center 
          text-neutral-500 dark:text-neutral-400"
        >
          {coverName || "آپلود کاور"}
          <input
            type="file"
            id="cover"
            name="cover"
            accept="image/*"
            required
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setCoverName(file ? file.name : "");
            }}
          />
          <UploadCloud size={26} className="absolute left-2" />
        </label>
      </div>

      {/* Post Upload */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="post"
          className="border-b py-2 px-4 rounded-lg cursor-pointer relative w-40 flex items-center 
          text-neutral-500 dark:text-neutral-400"
        >
          {postName || "آپلود تصویر"}
          <input
            type="file"
            id="post"
            name="post"
            accept="image/*"
            required
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPostName(file ? file.name : "");
            }}
          />
          <UploadCloud size={26} className="absolute left-2" />
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={pending}
      className="w-full text-lg font-medium my-5"
    >
      <div className="flex gap-2 items-center">
        {pending ? "در حال افزودن..." : "افزودن داستان"}
        {pending && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-dotted 
          border-neutral-800"></div>
        )}
      </div>
    </Button>
  );
};
