import NotFound from "@/src/app/not-found";
import { Category, Product, Submenu } from "@/src/utils/types";
import BreadcrumbContainer from "../product/BreadcrumbContainer";
import SubmenuProductsMain from "./SubmenuProductsMain";

export default function SubmenuProductsContainer({ id }: { id: string }) {
  // 🧩 Mock Category
  const mockCategory: Category = {
    _id: "cat1",
    title: "لوازم تحریر",
    href: `/category/${id}`,
    cover: ["/banners/category-cover.jpg"],
    hero: ["/banners/category-hero.jpg"],
    banner: ["/banners/banner1.jpg"],
    submenus: [
      {
        _id: "submenu1",
        title: "دفتر و کاغذ",
        href: `/category/stationery/paper`,
        items: [
          { _id: "item1", title: "دفتر", href: "/category/stationery/paper/notebook" },
          { _id: "item2", title: "کاغذ", href: "/category/stationery/paper/sheet" },
        ],
      },
      {
        _id: "submenu2",
        title: "نوشت‌افزار",
        href: `/category/stationery/pen`,
        items: [
          { _id: "item3", title: "خودکار", href: "/category/stationery/pen/ballpen" },
          { _id: "item4", title: "مداد", href: "/category/stationery/pen/pencil" },
        ],
      },
    ],
  };

  // 🧩 Mock Submenu (simulate /category/stationery/pen)
  const mockSubmenu: Submenu | undefined = mockCategory.submenus.find(
    (submenu) => submenu.href === `/category/${id[0]}/${id[1]}`
  );

  if (!mockSubmenu) return NotFound();

  // 🛍️ Mock Products
  const mockProducts: Product[] = [
    {
      _id: "p1",
      title: "دفتر 80 برگ",
      price: 25000,
      discount: 10,
      thumbnail: "/products/notebook.jpg",
      category: mockCategory,
      submenuId: "submenu1",
      description: "",
      submenuItemId: ""
    },
    {
      _id: "p2",
      title: "خودکار آبی",
      price: 12000,
      discount: 0,
      thumbnail: "/products/pen.jpg",
      category: mockCategory,
      submenuId: "submenu2",
      description: "",
      submenuItemId: ""
    },
  ];

  // Filter products by submenuId
  const submenuProducts = mockProducts.filter(
    (product) => product.submenuId === mockSubmenu._id
  );

  return (
    <div className="lg:py-5">
      <div className="px-4 breadcrumb-container flex overflow-x-auto overflow-y-hidden hide-scrollbar">
        <BreadcrumbContainer category={mockCategory} submenu={mockSubmenu} />
      </div>

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
