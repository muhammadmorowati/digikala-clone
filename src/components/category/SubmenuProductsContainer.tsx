import NotFound from "@/src/app/not-found";
import { Category, Product, Submenu } from "@/src/utils/types";
import BreadcrumbContainer from "../product/BreadcrumbContainer";
import SubmenuProductsMain from "./SubmenuProductsMain";

export default function SubmenuProductsContainer({ id }: { id: string }) {

  // 🧩 Split dynamic route id:  /category/[a]/[b]/[c]
  const parts = id.split("/");

  // 🧩 Mock Category (matches your types perfectly now)
  const mockCategory: Category = {
    _id: "cat1",
    title: "لوازم تحریر",
    href: "/category/stationery",
    cover: ["/banners/category-cover.jpg"],
    hero: ["/banners/category-hero.jpg"],
    banner: ["/banners/banner1.jpg"],
    submenus: [
      {
        _id: "submenu1",
        title: "دفتر و کاغذ",
        href: "/category/stationery/paper",
        items: [
          { _id: "item1", title: "دفتر", href: "/category/stationery/paper/notebook" },
          { _id: "item2", title: "کاغذ", href: "/category/stationery/paper/sheet" },
        ],
      },
      {
        _id: "submenu2",
        title: "نوشت‌افزار",
        href: "/category/stationery/pen",
        items: [
          { _id: "item3", title: "خودکار", href: "/category/stationery/pen/ballpen" },
          { _id: "item4", title: "مداد", href: "/category/stationery/pen/pencil" },
        ],
      },
    ],
  };

  // 🧩 Find correct submenu
  const mockSubmenu: Submenu | undefined = mockCategory.submenus.find(
    (submenu) => submenu.href.split("/").slice(-1)[0] === parts[1]
  );

  if (!mockSubmenu) return NotFound();

  // 🛍️ Mock Products (FULLY TYPE-COMPATIBLE NOW)
  const mockProducts: Product[] = [
    {
      _id: "p1",
      title: "دفتر 80 برگ",
      price: 25000,
      discount: 10,
      discount_price: 22500,
      thumbnail: "/products/notebook.jpg",
      images: ["/products/notebook.jpg"],
      categoryId: mockCategory._id,
      submenuId: "submenu1",
      submenuItemId: "",
      description: "",
      features: [],
      colors: [],
      likes: 12,
      rating: 4.1,
          inStock: true,
    isDKWarehouse: false,
    },
    {
      _id: "p2",
      title: "خودکار آبی",
      price: 12000,
      discount: 0,
      discount_price: 12000,
      thumbnail: "/products/pen.jpg",
      images: ["/products/pen.jpg"],
      categoryId: mockCategory._id,
      submenuId: "submenu2",
      submenuItemId: "",
      description: "",
      features: [],
      colors: [],
      likes: 19,
      rating: 4.5,

    inStock: true,
    isDKWarehouse: true,
    },
  ];

  // 🛍 Filter products by submenu
  const submenuProducts = mockProducts.filter(
    (product) => product.submenuId === mockSubmenu._id
  );

  return (
    <div className="lg:py-5">

      {/* Breadcrumb */}
      <div className="px-4 breadcrumb-container flex overflow-x-auto overflow-y-hidden hide-scrollbar">
        <BreadcrumbContainer category={mockCategory} submenu={mockSubmenu} />
      </div>

      {/* Products Section */}
      <div className="grid grid-cols-12 gap-5 lg:mt-10">
        <SubmenuProductsMain
          category={mockCategory}
          submenu={mockSubmenu}
          products={submenuProducts}
        />
      </div>

    </div>
  );
}
