"use client";

import { Editor } from "@tinymce/tinymce-react";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import TagInput from "./TagInput";
import { addArticle, updateArticle } from "@/src/app/admin/articles/action";
import { Article, Category } from "@/src/utils/types";
import { Button } from "../ui/button";

interface FormState {
  success?: boolean;
  errors?: Record<string, string>;
}

export default function ArticleForm({
  article,
  categories,
}: {
  article?: Article;
  categories: Category[];
}) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(article?.cover || null);
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [content, setContent] = useState(article?.content || "");
  const [selectedCategory, setSelectedCategory] = useState(
    article?.categoryId?.toString() || ""
  );

  const [state, formAction] = useFormState<FormState>(
    (article ? updateArticle : addArticle) as any,
  {}
  );

  /** Handle File Input */
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  /** Handle Submit */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("tags", JSON.stringify(tags));
    formData.append("content", content);
    formData.append("_id", article?._id?.toString() || crypto.randomUUID());
    if (coverFile) formData.append("cover", coverFile);
    formAction();
  };

  /** Toast + Reset on success */
  useEffect(() => {
    if (state.success) {
      toast.success(
        article
          ? "مقاله با موفقیت ویرایش شد ✅"
          : "مقاله با موفقیت اضافه شد ✅"
      );
    }
  }, [state.success, article]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --- Title --- */}
      <InputField
        name="title"
        label="نام مقاله"
        defaultValue={article?.title}
        error={state.errors?.title}
      />

      {/* --- Author --- */}
      <InputField
        name="author"
        label="نام نویسنده"
        defaultValue={article?.author}
        error={state.errors?.author}
      />

      {/* --- Reading Time --- */}
      <InputField
        name="readingTime"
        label="زمان مورد نیاز برای مطالعه"
        defaultValue={article?.readingTime}
        error={state.errors?.readingTime}
      />

      {/* --- Source --- */}
      <InputField
        name="source"
        label="منبع"
        defaultValue={article?.source}
        error={state.errors?.source}
      />

      {/* --- Category Select --- */}
      <div>
        <label
          htmlFor="categoryId"
          className="block mb-2 text-sm text-neutral-800 dark:text-neutral-400"
        >
          دسته‌بندی:
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:focus:border-blue-500"
        >
          <option value="">انتخاب کنید</option>
          {categories.map((cat) => (
            <option key={cat._id.toString()} value={cat._id.toString()}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* --- Tags --- */}
      <div>
        <label className="block mb-2 text-sm text-neutral-800 dark:text-neutral-400">
          تگ‌ها:
        </label>
        <TagInput
          tags={tags}
          onTagsChange={setTags}
          placeholder="تگ را بنویسید و Enter بزنید"
        />
        {state.errors?.tags && (
          <p className="text-red-600 text-xs mt-1">{state.errors.tags}</p>
        )}
      </div>

      {/* --- Editor --- */}
      <div className="border border-neutral-300 dark:border-neutral-700 rounded-md overflow-hidden">
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
          value={content}
          init={{
            height: 400,
            menubar: false,
            plugins: [
              "link", "lists", "table", "image", "media", "codesample",
              "wordcount", "autolink", "charmap", "emoticons", "searchreplace",
            ],
            toolbar:
              "undo redo | formatselect | bold italic underline | bullist numlist | link image media | removeformat",
            content_style: `
              body { font-family: irsans, sans-serif; direction: rtl; }
            `,
          }}
          onEditorChange={setContent}
        />
      </div>

      {/* --- Cover Upload --- */}
      <div className="flex items-center gap-4">
        <label
          htmlFor="cover"
          className="cursor-pointer border rounded-lg px-4 py-2 flex items-center text-neutral-600 dark:text-neutral-400"
        >
          <UploadCloud size={20} className="ml-2" /> انتخاب کاور
          <input
            type="file"
            id="cover"
            name="cover"
            className="hidden"
            accept="image/*"
            required={!article}
            onChange={handleCoverFileChange}
          />
        </label>
        {preview && (
          <Image
            src={preview}
            width={70}
            height={70}
            alt="Cover Preview"
            className="object-cover border rounded-lg p-1"
          />
        )}
      </div>

      <SubmitButton title={article ? "ویرایش" : "افزودن"} />
    </form>
  );
}

/* --- Small Reusable Input Field --- */
function InputField({
  name,
  label,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  error?: string;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        id={name}
        name={name}
        required
        defaultValue={defaultValue || ""}
        className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-neutral-300 bg-neutral-50 px-2.5 pb-2.5 pt-5 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:focus:border-blue-500"
      />
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      <label
        htmlFor={name}
        className="absolute right-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-neutral-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-neutral-400 peer-focus:dark:text-blue-500"
      >
        {label}
      </label>
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
        <span>{pending ? `در حال ${title}...` : `${title} مقاله`}</span>
        {pending && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-dotted border-neutral-800" />
        )}
      </div>
    </Button>
  );
};
