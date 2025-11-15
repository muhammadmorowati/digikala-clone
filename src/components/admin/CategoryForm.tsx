"use client";

import { addCategory, updateCategory } from "@/src/app/admin/categories/action";
import { Button } from "@/src/components/ui/button";
import { Category } from "@/src/utils/types";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";

interface FormState {
  success?: boolean;
  errors?: Record<string, string[]>;
}

export default function CategoryForm({ category }: { category?: Category }) {
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [heroFiles, setHeroFiles] = useState<File[]>([]);
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);

  // make TS happy with server actions signature
  const action = (category ? updateCategory : addCategory) as (
    prevState: FormState,
    formData: FormData
  ) => Promise<FormState>;

  const [state, formAction] = useFormState<FormState>(
    (category ? updateCategory : addCategory) as any,
    {}
  );

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<File[]> | React.SetStateAction<File | null>>,
    multiple = false
  ) => {
    if (!e.target.files) return;
    if (multiple) {
      const files = Array.from(e.target.files);
      (setState as React.Dispatch<React.SetStateAction<File[]>>)((prev) => [
        ...prev,
        ...files,
      ]);
    } else {
      (setState as React.Dispatch<React.SetStateAction<File | null>>)(
        e.target.files[0]
      );
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append("_id", category?._id?.toString() || crypto.randomUUID());

    if (coverFile) formData.append("cover", coverFile);
    if (iconFile) formData.append("icon", iconFile);

    const appendUnique = (files: File[], key: string) => {
      const seen = new Set<string>();
      files.forEach((file) => {
        if (!seen.has(file.name)) {
          seen.add(file.name);
          formData.append(key, file);
        } else {
          console.warn(`Duplicate ${key} file:`, file.name);
        }
      });
    };

    appendUnique(heroFiles, "hero");
    appendUnique(bannerFiles, "banner");

    formAction();
  };

  useEffect(() => {
    if (state.success) {
      toast.success(
        category
          ? "دسته‌بندی با موفقیت ویرایش شد ✅"
          : "دسته‌بندی با موفقیت اضافه شد ✅"
      );
    }
  }, [state.success, category]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        id="title"
        name="title"
        label="نام دسته‌بندی"
        defaultValue={category?.title}
        error={state.errors?.title?.[0]}
      />

      <InputField
        id="href"
        name="href"
        label="آدرس لینک"
        defaultValue={category?.href}
        error={state.errors?.href?.[0]}
      />

      <FileUpload
        id="cover"
        label="آپلود تصویر کاور"
        required={!category}
        file={coverFile}
        onChange={(e) => handleFileSelect(e, setCoverFile)}
        previewUrl={category?.cover?.[0]}
      />

      <FileUpload
        id="icon"
        label="آپلود تصویر آیکون"
        required={!category}
        file={iconFile}
        onChange={(e) => handleFileSelect(e, setIconFile)}
        previewUrl={category?.icon}
        whiteBg
      />

      <MultiImageUpload
        id="hero"
        label="آپلود تصاویر Hero"
        files={heroFiles}
        onChange={(e) => handleFileSelect(e, setHeroFiles, true)}
        existing={category?.hero}
      />

      <MultiImageUpload
        id="banner"
        label="آپلود تصاویر بنر"
        files={bannerFiles}
        onChange={(e) => handleFileSelect(e, setBannerFiles, true)}
        existing={category?.banner}
      />

      <SubmitButton title={category ? "ویرایش" : "افزودن"} />
    </form>
  );
}

/* --- Small Reusable Input Field --- */
function InputField({
  id,
  name,
  label,
  defaultValue,
  error,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        name={name}
        defaultValue={defaultValue || ""}
        required
        className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-neutral-300 bg-neutral-50 px-2.5 pb-2.5 pt-5 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
      />
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      <label
        htmlFor={id}
        className="absolute right-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-neutral-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100"
      >
        {label}
      </label>
    </div>
  );
}

/* --- Single Image Upload --- */
function FileUpload({
  id,
  label,
  required,
  onChange,
  previewUrl,
  whiteBg,
}: {
  id: string;
  label: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string;
  whiteBg?: boolean;
  file?: File | null;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label
        htmlFor={id}
        className="border-b py-2 px-4 rounded-lg cursor-pointer relative w-40 flex items-center text-neutral-500 dark:text-neutral-400"
      >
        {label}
        <input
          type="file"
          id={id}
          name={id}
          required={required}
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <UploadCloud size={24} className="absolute left-2" />
      </label>
      {previewUrl && (
        <Image
          src={previewUrl}
          height={70}
          width={70}
          alt={`${id} preview`}
          className={`object-cover border rounded-lg p-1 ${
            whiteBg ? "bg-white" : ""
          }`}
        />
      )}
    </div>
  );
}

/* --- Multi Image Upload --- */
function MultiImageUpload({
  id,
  label,
  files,
  onChange,
  existing,
}: {
  id: string;
  label: string;
  files: File[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  existing?: string[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={id}
        className="border-b py-2 px-4 rounded-lg cursor-pointer relative w-40 flex items-center text-neutral-500 dark:text-neutral-400"
      >
        {label}
        <input
          type="file"
          id={id}
          name={id}
          multiple
          accept="image/*"
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <UploadCloud size={24} className="absolute left-2" />
      </label>

      <div className="flex flex-wrap gap-2">
        {files.map((file, i) => (
          <Image
            key={i}
            src={URL.createObjectURL(file)}
            alt={`${id}-${i}`}
            width={60}
            height={60}
            className="object-cover border rounded-md"
          />
        ))}
      </div>

      {existing && existing.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {existing.map((url, i) => (
            <Image
              key={i}
              src={url}
              width={60}
              height={60}
              alt={`${id}-existing-${i}`}
              className="object-cover border rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* --- Submit Button --- */
const SubmitButton = ({ title }: { title: string }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      className="my-5 w-full text-lg font-medium"
      disabled={pending}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{pending ? `در حال ${title}...` : `${title} دسته‌بندی`}</span>
        {pending && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-dotted border-neutral-800"></div>
        )}
      </div>
    </Button>
  );
};
