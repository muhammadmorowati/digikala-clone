"use client";

import { addSubmenuItem } from "@/src/app/admin/categories/action";
import { Button } from "../ui/button";
import { Submenu } from "@/src/utils/types";
import { mockSubmenus } from "@/src/data/submenus"; // ✅ import your static submenu data

export default function CategorySubmenuItemForm() {
  return (
    <form action={addSubmenuItem as any} className="space-y-4">
      {/* hidden id field */}
      <input type="hidden" name="_id" value={crypto.randomUUID()} />

      {/* Item title */}
      <div className="relative">
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder=" "
          className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-neutral-300 bg-neutral-50 
                     px-2.5 pb-2.5 pt-5 text-sm text-neutral-900 
                     focus:border-blue-600 focus:outline-none 
                     dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
        />
        <label
          htmlFor="title"
          className="absolute right-2.5 top-4 z-10 origin-[0] 
                     -translate-y-4 scale-75 transform text-sm text-neutral-500 duration-300 
                     peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                     peer-focus:-translate-y-4 peer-focus:scale-75 
                     peer-focus:text-blue-600 dark:text-neutral-400 peer-focus:dark:text-blue-500"
        >
          نام آیتم زیرمجموعه
        </label>
      </div>

      {/* Item href */}
      <div className="relative">
        <input
          type="text"
          id="href"
          name="href"
          required
          autoComplete="off"
          placeholder=" "
          className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-neutral-300 bg-neutral-50 
                     px-2.5 pb-2.5 pt-5 text-sm text-neutral-900 
                     focus:border-blue-600 focus:outline-none 
                     dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
        />
        <label
          htmlFor="href"
          className="absolute right-2.5 top-4 z-10 origin-[0] 
                     -translate-y-4 scale-75 transform text-sm text-neutral-500 duration-300 
                     peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                     peer-focus:-translate-y-4 peer-focus:scale-75 
                     peer-focus:text-blue-600 dark:text-neutral-400 peer-focus:dark:text-blue-500"
        >
          آدرس لینک
        </label>
      </div>

      {/* Submenu selector */}
      <div>
        <label
          htmlFor="submenuId"
          className="block mb-1 text-sm text-neutral-700 dark:text-neutral-300"
        >
          انتخاب زیرمجموعه:
        </label>
        <select
          required
          name="submenuId"
          id="submenuId"
          className="w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 
                     px-3 py-2 text-sm text-neutral-900 
                     focus:border-blue-600 focus:outline-none 
                     dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
        >
          <option value="">انتخاب زیرمجموعه</option>
          {mockSubmenus.map((submenu: Submenu) => (
            <option key={submenu._id} value={submenu._id}>
              {submenu.title}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        variant="destructive"
        className="my-5 w-full text-lg font-medium"
      >
        افزودن آیتم زیرمجموعه
      </Button>
    </form>
  );
}
