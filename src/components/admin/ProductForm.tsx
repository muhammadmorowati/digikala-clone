"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Category,
  Submenu,
  SubmenuItem,
  Color,
  Feature,
  Product,
} from "@/src/utils/types";
import { addProductMock, updateProductMock } from "@/src/utils/mockActions";
import toast from "react-hot-toast";

export default function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    product?.categoryId || ""
  );
  const [selectedSubmenu, setSelectedSubmenu] = useState(product?.submenuId);
  const [selectedSubmenuItem, setSelectedSubmenuItem] = useState(
    product?.submenuItemId
  );

  const [thumbnail, setThumbnail] = useState(product?.thumbnail || "");
  const [images, setImages] = useState<string[]>(product?.images || []);

  const [colors, setColors] = useState<Color[]>(
    product?.colors || [{ name: "", hex: "" }]
  );

  const [features, setFeatures] = useState<Feature[]>(
    product?.features || [{ key: "", value: "" }]
  );

  const submenus =
    categories.find((c) => c._id === selectedCategory)?.submenus || [];

  const submenuItems =
    submenus.find((sm) => sm._id === selectedSubmenu)?.items || [];

  const handleAddFeature = () =>
    setFeatures((prev) => [...prev, { key: "", value: "" }]);

  const handleAddColor = () =>
    setColors((prev) => [...prev, { name: "", hex: "" }]);

  const handleAddImage = () =>
    setImages((prev) => [...prev, ""]); // empty string for manual URL input

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      _id: product?._id || crypto.randomUUID(),
      title: (e.target as any).title.value,
      en_title: (e.target as any).en_title.value,
      price: Number((e.target as any).price.value),
      discount: Number((e.target as any).discount.value),
      discount_price: Number((e.target as any).discount_price.value),
      rating: Number((e.target as any).rating.value),
      sizes: [(e.target as any).sizes.value],
      guarantee: (e.target as any).guarantee.value,
      categoryId: selectedCategory,
      submenuId: selectedSubmenu,
      submenuItemId: selectedSubmenuItem,
      description: (e.target as any).description.value,
      thumbnail,
      images,
      features,
      colors,
      recommended_percent: Number(
        (e.target as any).recommended_percent.value
      ),
      likes: Number((e.target as any).likes.value),
      voter: Number((e.target as any).voter.value),
    };

    if (product) {
      await updateProductMock(newProduct);
      toast.success("محصول با موفقیت ویرایش شد!");
    } else {
      await addProductMock(newProduct);
      toast.success("محصول با موفقیت اضافه شد!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-5">

      {/* TITLE */}
      <div className="relative">
        <input
          name="title"
          defaultValue={product?.title || ""}
          required
          className="input"
        />
        <label>نام محصول</label>
      </div>

      {/* EN TITLE */}
      <div className="relative">
        <input
          name="en_title"
          defaultValue={product?.en_title || ""}
          required
          className="input"
        />
        <label>نام انگلیسی محصول</label>
      </div>

      {/* NUMERIC FIELDS */}
      <div className="grid grid-cols-2 gap-3">
        {[
          ["price", "قیمت"],
          ["discount", "تخفیف"],
          ["discount_price", "قیمت با تخفیف"],
          ["recommended_percent", "درصد پیشنهاد"],
          ["likes", "رضایت"],
          ["rating", "امتیاز"],
          ["voter", "تعداد امتیازدهنده"],
        ].map(([name, label]) => (
          <div key={name} className="relative">
            <input
              name={name}
              type="number"
              step="0.1"
              defaultValue={product?.[name] || ""}
              className="input"
            />
            <label>{label}</label>
          </div>
        ))}
      </div>

      {/* GUARANTEE */}
      <div className="relative">
        <input
          name="guarantee"
          defaultValue={product?.guarantee || ""}
          className="input"
        />
        <label>نام شرکت گارانتی</label>
      </div>

      {/* SIZES */}
      <select name="sizes" className="input-select">
        <option value="-1">سایز را انتخاب کنید</option>
        {Array.from({ length: 100 }).map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

      {/* CATEGORY */}
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setSelectedSubmenu(undefined);
        }}
        className="input-select"
      >
        <option value="">انتخاب دسته‌بندی</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>

      {/* SUBMENU */}
      <select
        disabled={!submenus.length}
        value={selectedSubmenu}
        onChange={(e) => setSelectedSubmenu(e.target.value)}
        className="input-select"
      >
        <option value="">انتخاب زیرمجموعه</option>
        {submenus.map((s) => (
          <option key={s._id} value={s._id}>
            {s.title}
          </option>
        ))}
      </select>

      {/* SUBMENU ITEM */}
      <select
        disabled={!submenuItems.length}
        value={selectedSubmenuItem}
        onChange={(e) => setSelectedSubmenuItem(e.target.value)}
        className="input-select"
      >
        <option value="">انتخاب آیتم زیرمجموعه</option>
        {submenuItems.map((si) => (
          <option key={si._id} value={si._id}>
            {si.title}
          </option>
        ))}
      </select>

      {/* THUMBNAIL URL */}
      <div className="relative">
        <input
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="input"
        />
        <label>آدرس تصویر کاور</label>
      </div>

      {/* IMAGES URLS */}
      <div className="space-y-2">
        <label>تصاویر محصول (URL)</label>
        {images.map((img, i) => (
          <input
            key={i}
            value={img}
            onChange={(e) =>
              setImages((prev) =>
                prev.map((v, idx) => (idx === i ? e.target.value : v))
              )
            }
            className="input"
          />
        ))}
        <button type="button" onClick={handleAddImage} className="text-blue-500">
          افزودن تصویر
        </button>
      </div>

      {/* FEATURES */}
      <div>
        <label>ویژگی‌ها</label>
        {features.map((f, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input
              value={f.key}
              onChange={(e) =>
                setFeatures((prev) =>
                  prev.map((v, idx) =>
                    idx === i ? { ...v, key: e.target.value } : v
                  )
                )
              }
              className="input"
              placeholder="ویژگی"
            />
            <input
              value={f.value}
              onChange={(e) =>
                setFeatures((prev) =>
                  prev.map((v, idx) =>
                    idx === i ? { ...v, value: e.target.value } : v
                  )
                )
              }
              className="input"
              placeholder="مقدار"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddFeature} className="text-blue-500">
          افزودن ویژگی
        </button>
      </div>

      {/* COLORS */}
      <div>
        <label>رنگ‌ها</label>
        {colors.map((c, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input
              value={c.name}
              onChange={(e) =>
                setColors((prev) =>
                  prev.map((v, idx) =>
                    idx === i ? { ...v, name: e.target.value } : v
                  )
                )
              }
              className="input"
              placeholder="نام رنگ"
            />
            <input
              value={c.hex}
              onChange={(e) =>
                setColors((prev) =>
                  prev.map((v, idx) =>
                    idx === i ? { ...v, hex: e.target.value } : v
                  )
                )
              }
              className="input"
              placeholder="کد HEX"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddColor} className="text-blue-500">
          افزودن رنگ
        </button>
      </div>

      {/* DESCRIPTION */}
      <textarea
        name="description"
        defaultValue={product?.description || ""}
        className="input h-24"
      />

      <Button type="submit" className="w-full mt-4" variant="destructive">
        {product ? "ویرایش محصول" : "افزودن محصول"}
      </Button>
    </form>
  );
}
