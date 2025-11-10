import CategoryProducts from "@/src/components/category/CategoryProducts";
import SubmenuProductsContainer from "@/src/components/category/SubmenuProductsContainer";
import { Metadata } from "next";

// 🧩 Mock categories & submenus (example data)
const mockCategories = [
  {
    title: "موبایل",
    href: "/category/mobile",
  },
  {
    title: "لپ‌تاپ",
    href: "/category/laptop",
  },
  {
    title: "تلویزیون",
    href: "/category/tv",
  },
];

const mockSubmenus = [
  {
    title: "گوشی سامسونگ",
    href: "/category/mobile/samsung",
  },
  {
    title: "گوشی اپل",
    href: "/category/mobile/apple",
  },
  {
    title: "لپ‌تاپ ایسوس",
    href: "/category/laptop/asus",
  },
];

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string | string[] };
}): Promise<Metadata> {
  const slugArray = Array.isArray(id) ? id : [id];

  // Find category or submenu from mock data
  const category =
    slugArray.length === 1
      ? mockCategories.find((cat) => cat.href === `/category/${slugArray[0]}`)
      : null;

  const submenu =
    slugArray.length > 1
      ? mockSubmenus.find(
          (sub) =>
            sub.href === `/category/${slugArray[0]}/${slugArray[1]}`
        )
      : null;

  return {
    title: category?.title || submenu?.title || "دسته‌بندی",
  };
}

export default async function CategoryPage({
  params: { id },
}: {
  params: { id: string | string[] };
}) {
  const slugArray = Array.isArray(id) ? id : [id];

  return (
    <>
      {slugArray.length === 1 ? (
        <CategoryProducts id={slugArray[0]} />
      ) : (
        <SubmenuProductsContainer id={slugArray[1]} />
      )}
    </>
  );
}
