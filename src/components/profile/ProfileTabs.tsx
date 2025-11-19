import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useCart } from "@/src/utils/cartItemsContext";
import { CartItem, Product, User } from "@/src/utils/types";
import {
  ArrowRight,
  Mail,
  Milestone,
  Phone,
  Search,
  ShoppingCart,
  Trash2,
  User2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import CartItemControls from "../cart/CartItemControls";
import ProductCard from "../category/ProductCard";
import { Button } from "../ui/button";

// Helper — Safe localStorage getter
const getLocalArray = (key: string): string[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(key) || "[]");
};

// Helper — update localStorage
const updateLocalStorage = (key: string, ids: string[]) => {
  localStorage.setItem(key, JSON.stringify(ids));
};

export default function ProfileTabs({
  tabsArray,
  src,
  title,
  searchbar,
  products,
  user,
}: {
  tabsArray?: string[];
  src: string;
  title: string;
  searchbar?: boolean;
  products?: Product[];
  user?: User;
}) {
  const router = useRouter();
  const { cart, deleteFromCart } = useCart();

  const [recentViewProducts, setRecentViewProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  // Load favorites & recent views
  useEffect(() => {
    if (!products) return;

    const recentIds = getLocalArray("recentViews");
    const favIds = getLocalArray("favorites");

    setRecentViewProducts(products.filter(p => recentIds.includes(p._id)));
    setFavoriteProducts(products.filter(p => favIds.includes(p._id)));
  }, [products]);

  const confirmDelete = (
    productId: string,
    productList: Product[],
    setList: (list: Product[]) => void,
    key: string,
    message: string
  ) => {
    toast((t) => (
      <DeleteToast
        onCancel={() => toast.dismiss(t.id)}
        onConfirm={() => {
          const updated = productList.filter(p => p._id !== productId);
          updateLocalStorage(key, updated.map(p => p._id));
          setList(updated);
          toast.dismiss(t.id);
          toast.success(message);
        }}
      />
    ));
  };

  return (
    <div className="lg:border rounded-lg py-5">
      {/* Header */}
      <Header title={title} searchbar={searchbar} onBack={() => router.push("/profile")} />

      {/* Tabs (when empty) */}
      {isAllEmpty({ recentViewProducts, favoriteProducts, cart }) && tabsArray && (
        <EmptyTabs src={src} title={title} tabsArray={tabsArray} />
      )}

      {/* Content */}
      <div className="grid grid-cols-12 mt-10">
        {title === "تاریخچه سفارشات" &&
          <ProductGrid products={cart} removeHandler={(id) => deleteFromCart(id)} />}

        {title === "بازدیدهای اخیر" &&
          <ProductGrid
            products={recentViewProducts}
            removeHandler={(id) =>
              confirmDelete(
                id,
                recentViewProducts,
                setRecentViewProducts,
                "recentViews",
                "محصول از بازدیدهای اخیر حذف شد."
              )
            }
          />}

        {title === "لیست‌ها" &&
          <ProductGrid
            products={favoriteProducts}
            removeHandler={(id) =>
              confirmDelete(
                id,
                favoriteProducts,
                setFavoriteProducts,
                "favorites",
                "محصول از لیست علاقه‌مندی‌ها حذف شد."
              )
            }
          />}

        {title === "آدرس‌" && user?.address?.city && <UserAddress user={user} />}
      </div>
    </div>
  );
}

/* -----------------------
   SUB COMPONENTS BELOW
----------------------- */

const Header = ({
  title,
  searchbar,
  onBack,
}: {
  title: string;
  searchbar?: boolean;
  onBack: () => void;
}) => (
  <>
    <div className="flex justify-between items-center sm:px-5 px-2">
      <h5 className="gap-2 text-neutral-800 dark:text-white font-irsansb flex items-center">
        <span className="lg:hidden cursor-pointer" onClick={onBack}>
          <ArrowRight size={20} />
        </span>
        {title}
      </h5>

      {searchbar && (
        <Search size={20} className="dark:text-neutral-300 text-neutral-600" />
      )}
    </div>

    <div className="w-full h-2 dark:bg-neutral-700 bg-neutral-100 lg:hidden my-3"></div>
  </>
);

const EmptyTabs = ({
  src,
  title,
  tabsArray,
}: {
  src: string;
  title: string;
  tabsArray: string[];
}) => (
  <Tabs defaultValue={tabsArray[0]} className="lg:mt-10" style={{ direction: "rtl" }}>
    <TabsList className="flex sm:gap-7 gap-1 border-b sm:px-5 px-2">
      {tabsArray.map((tab) => (
        <TabsTrigger key={tab} value={tab}>
          {tab}
        </TabsTrigger>
      ))}
    </TabsList>

    {tabsArray.map((tab) => (
      <TabsContent key={tab} value={tab}>
        <div className="min-h-96 flex flex-col gap-4 items-center justify-center">
          <Image src={src} alt="empty-state" width={180} height={200} />
          <p className="text-sm">هنوز هیچ {title}ی ندارید</p>
        </div>
      </TabsContent>
    ))}
  </Tabs>
);

const ProductGrid = ({
  products,
  removeHandler,
}: {
  products: (Product | CartItem)[];
  removeHandler: (id: string) => void;
}) => (
  <>
    {products.map((product) => (
      <SingleProductCard key={product._id} product={product} removeHandler={removeHandler} />
    ))}
  </>
);

const SingleProductCard = ({
  product,
  removeHandler,
}: {
  product: Product | CartItem;
  removeHandler: (id: string) => void;
}) => (
  <div className="group relative lg:col-span-6 col-span-12">
    <ProductCard product={product} />

    <div className="flex items-center justify-center flex-col absolute top-4 sm:-left-1 left-2 group-hover:left-2 transition-all sm:opacity-0 group-hover:opacity-100 text-red-500">
      <Trash2
        onClick={() => removeHandler(product._id)}
        size={20}
        className="mb-3 cursor-pointer"
      />
      <ShoppingCartButton product={product} />
    </div>
  </div>
);

/* Delete confirmation toast */
const DeleteToast = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <div>
    آیا از حذف محصول مطمئنید؟
    <div className="flex justify-end mt-3">
      <Button variant="secondary" className="ml-1 mr-5" onClick={onCancel}>
        انصراف
      </Button>
      <Button variant="destructive" onClick={onConfirm}>
        حذف
      </Button>
    </div>
  </div>
);

/* Address block */
const UserAddress = ({ user }: { user: User }) => (
  <>
    <div className="px-4 sm:col-span-6 col-span-12 space-y-3 text-sm text-neutral-400">
      <p className="font-irsansb dark:text-white text-neutral-700">{user.address.street}</p>

      <InfoRow icon={<Milestone size={18} />} text={user.address.city} />
      <InfoRow icon={<Mail size={18} />} text={user.address.postalcode} />
      <InfoRow icon={<Phone size={18} />} text={user.phone} />
      <InfoRow icon={<User2 size={18} />} text={user.name} />
    </div>

    <div className="px-4 sm:col-span-6 col-span-12">
      <Image
        alt="emptyAddress"
        width={400}
        height={400}
        src="/profile/emptyAddress.webp"
        className="dark:hidden"
      />
    </div>
  </>
);

const InfoRow = ({ icon, text }: { icon: ReactNode; text: string }) => (
  <p className="flex items-center gap-1">
    {icon}
    {text}
  </p>
);

/* Cart Button */
const ShoppingCartButton = ({ product }: { product: Product | CartItem }) => {
  const { cart, setCart } = useCart();
  const router = useRouter();

  const exists = cart.find((item) => item._id === product._id);

  const add = (product: Product | CartItem) => {
    const updatedCart = [...cart];

    updatedCart.push({
      _id: product._id,
      title: product.title,
      thumbnail: product.thumbnail,
      guarantee: product.guarantee,
      price: product.price,
      discount_price: product.discount_price,
      discount: product.discount,
      count: 1,
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    Swal.fire({
      html: `
        <div>
          <div style="display: flex; align-items: center; gap:10px; padding-bottom: 20px;">
            <svg ... /> 
            <h2 style="color:rgb(57,170,0)">این کالا به سبد خرید اضافه شد!</h2>
          </div>
          <div style="display: flex; border-top: 1px solid #e7e7e7;padding-top: 20px; gap:20px">
            <img src="${product.thumbnail}" width="100" height="100" style="border-radius: 8px;" />
            <p style="font-weight:bold; color:#272727;">${product.title}</p>
          </div>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: "برو به سبد خرید",
      confirmButtonColor: "#e11d48",
    }).then((res) => {
      if (res.isConfirmed) router.push("/checkout/cart");
    });
  };

  return exists ? (
    <CartItemControls vertical product={exists} />
  ) : (
    <ShoppingCart size={20} className="cursor-pointer" onClick={() => add(product)} />
  );
};

/* Utility */
const isAllEmpty = ({
  recentViewProducts,
  favoriteProducts,
  cart,
}: {
  recentViewProducts: Product[];
  favoriteProducts: Product[];
  cart: CartItem[];
}) =>
  recentViewProducts.length === 0 &&
  favoriteProducts.length === 0 &&
  cart.length === 0;
