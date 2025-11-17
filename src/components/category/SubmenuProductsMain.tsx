"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { sortingMenuItems } from "@/src/data/data";
import { Category, Product, Submenu } from "@/src/utils/types";
import {
  ArrowDownWideNarrow,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Label } from "../ui/label";
import Switch from "../ui/switch";
import PriceSlider from "./PriceSlider";
import SubmenuProducts from "./SubmenuProducts";

/* ------------------ Helpers ------------------ */
const roundUpToCeil = (value: number): number =>
  Math.ceil(value / 1_000_000) * 1_000_000;

export default function SubmenuProductsMain({
  category,
  submenu,
  products,
  searchParams,
}: {
  category: Category;
  submenu: Submenu;
  products: Product[];
  searchParams?: any;
}) {
  /* ------------------ Derived Values ------------------ */

  // Safe max price
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 10_000_000; // fallback
    const highest = Math.max(...products.map((p) => p.price));
    return roundUpToCeil(highest);
  }, [products]);

  /* ------------------ States ------------------ */
  const [sortingMenu, setSortingMenu] = useState("relevant");

  // Filters
  const [activeSubmenu] = useState(submenu.title);
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(maxPrice);

  const [isAvailableOnly, setIsAvailableOnly] = useState(false);
  const [isDigikalaOnly, setIsDigikalaOnly] = useState(false);

  // Modals
  const [sortingModal, setSortingModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [priceModal, setPriceModal] = useState(false);

  /* ------------------ Reset Filters ------------------ */
  const handleResetFilters = () => {
    setMinVal(0);
    setMaxVal(maxPrice);
    setIsAvailableOnly(false);
    setIsDigikalaOnly(false);
  };

  /* ------------------ Filter Products ------------------ */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const inPriceRange = p.price >= minVal && p.price <= maxVal;

      const availableMatch = isAvailableOnly ? p.inStock === true : true;
      const digikalaMatch = isDigikalaOnly ? p.isDKWarehouse === true : true;

      return inPriceRange && availableMatch && digikalaMatch;
    });
  }, [minVal, maxVal, products, isAvailableOnly, isDigikalaOnly]);

  /* ------------------ Disable Scroll on Modal ------------------ */
  useEffect(() => {
    document.body.style.overflow =
      sortingModal || filterModal || priceModal ? "hidden" : "auto";
  }, [sortingModal, filterModal, priceModal]);

  /* ------------------ Component ------------------ */
  return (
    <>
      {/* Desktop Sidebar Filters */}
      <div className="col-span-3 max-lg:hidden border rounded-lg p-5">
        <div className="flex items-center justify-between pb-5">
          <h3 className="text-neutral-700 dark:text-neutral-100 text-xl font-irsansb">
            فیلترها
          </h3>

          {(minVal !== 0 ||
            maxVal !== maxPrice ||
            isAvailableOnly ||
            isDigikalaOnly) && (
            <button onClick={handleResetFilters} className="text-xs text-sky-500">
              حذف فیلترها
            </button>
          )}
        </div>

        <FilterAccordion
          category={category}
          activeSubmenu={activeSubmenu}
          minVal={minVal}
          maxVal={maxVal}
          maxPrice={maxPrice}
          setMinVal={setMinVal}
          setMaxVal={setMaxVal}
          isAvailableOnly={isAvailableOnly}
          setIsAvailableOnly={setIsAvailableOnly}
          isDigikalaOnly={isDigikalaOnly}
          setIsDigikalaOnly={setIsDigikalaOnly}
        />
      </div>

      {/* Mobile Sorting Buttons */}
      <MobileHeader
        openSorting={() => setSortingModal(true)}
        openFilter={() => setFilterModal(true)}
        openPrice={() => setPriceModal(true)}
      />

      {/* Product List */}
      <SubmenuProducts
        sortingMenu={sortingMenu}
        setSortingMenu={setSortingMenu}
        products={filteredProducts}
        searchParams={searchParams}
      />

      {/* Sorting Modal */}
      <Modal isOpen={sortingModal} close={() => setSortingModal(false)}>
        <div className="grow whitespace-nowrap dark:text-neutral-100 text-neutral-800 text-body2-strong">
          <p className="mb-5">مرتب سازی براساس:</p>
        </div>

        <div className="flex flex-col">
          {sortingMenuItems.map((item, index) => (
            <Link
              key={index}
              shallow
              href={
                searchParams
                  ? `/search?q=${searchParams.q}&sort=${item.label}`
                  : `?sort=${item.label}`
              }
              className={`border-b py-5 cursor-pointer text-body-2 ${
                sortingMenu === item.label
                  ? "text-red-500 dark:text-red-500"
                  : "text-neutral-500 dark:text-neutral-300"
              }`}
              onClick={() => {
                setSortingMenu(item.label);
                setSortingModal(false);
              }}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal isOpen={filterModal} close={() => setFilterModal(false)}>
        <h3 className="text-neutral-700 dark:text-neutral-100 text-xl font-irsansb mb-5">
          فیلترها
        </h3>

        <FilterAccordion
          category={category}
          activeSubmenu={activeSubmenu}
          minVal={minVal}
          maxVal={maxVal}
          maxPrice={maxPrice}
          setMinVal={setMinVal}
          setMaxVal={setMaxVal}
          isAvailableOnly={isAvailableOnly}
          setIsAvailableOnly={setIsAvailableOnly}
          isDigikalaOnly={isDigikalaOnly}
          setIsDigikalaOnly={setIsDigikalaOnly}
        />

        <ModalButtons
          count={filteredProducts.length}
          onClose={() => setFilterModal(false)}
          onReset={handleResetFilters}
        />
      </Modal>

      {/* Price Modal */}
      <Modal isOpen={priceModal} close={() => setPriceModal(false)}>
        <p className="mb-5">محدوده قیمت</p>

        <PriceSlider
          min={0}
          max={maxPrice}
          minVal={minVal}
          maxVal={maxVal}
          setMinVal={setMinVal}
          setMaxVal={setMaxVal}
        />

        <ModalButtons
          count={filteredProducts.length}
          onClose={() => setPriceModal(false)}
          onReset={handleResetFilters}
        />
      </Modal>
    </>
  );
}

/* --------------------------------------------------------------- */
/* ------------------ CHILD COMPONENTS REFACTORED ---------------- */
/* --------------------------------------------------------------- */

function MobileHeader({
  openSorting,
  openFilter,
  openPrice,
}: {
  openSorting: () => void;
  openFilter: () => void;
  openPrice: () => void;
}) {
  return (
    <div className="lg:hidden sticky px-4 col-span-12 top-20 w-full border-b bg-white dark:bg-neutral-950 py-4 flex items-center gap-2 z-10">
      <MobileButton onClick={openSorting}>
        <ArrowDownWideNarrow size={15} />
        مرتبط‌ترین
      </MobileButton>

      <MobileButton onClick={openFilter}>
        <SlidersHorizontal size={15} />
        فیلتر
      </MobileButton>

      <MobileButton onClick={openPrice}>
        محدوده قیمت
        <ChevronDown size={15} />
      </MobileButton>
    </div>
  );
}

function MobileButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="text-sm sm:text-base border rounded-full px-3 py-1.5 flex gap-2 items-center"
    >
      {children}
    </button>
  );
}

/* ------------------ Filter Accordion ------------------ */
function FilterAccordion({
  category,
  activeSubmenu,
  maxPrice,
  minVal,
  maxVal,
  setMinVal,
  setMaxVal,
  isAvailableOnly,
  setIsAvailableOnly,
  isDigikalaOnly,
  setIsDigikalaOnly,
}: {
  category: Category;
  activeSubmenu: string;
  maxPrice: number;
  minVal: number;
  maxVal: number;
  setMinVal: (v: number) => void;
  setMaxVal: (v: number) => void;
  isAvailableOnly: boolean;
  setIsAvailableOnly: (v: boolean) => void;
  isDigikalaOnly: boolean;
  setIsDigikalaOnly: (v: boolean) => void;
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {/* Categories */}
      <AccordionItem value="cat">
        <AccordionTrigger>
          دسته‌بندی
          <ChevronDown className="h-4 w-4" />
        </AccordionTrigger>

        {category.submenus.map((sub) => (
          <AccordionContent key={sub._id}>
            <Link
              href={sub.href}
              className={`mr-3 text-sm flex items-center gap-2 ${
                activeSubmenu === sub.title
                  ? "text-red-500"
                  : "text-neutral-500 dark:text-neutral-300"
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full ${
                  activeSubmenu === sub.title ? "bg-red-500" : "bg-neutral-500"
                }`}
              />
              {sub.title}
            </Link>
          </AccordionContent>
        ))}
      </AccordionItem>

      {/* Price Range */}
      <AccordionItem value="price">
        <AccordionTrigger>
          محدوده قیمت
          <ChevronDown className="h-4 w-4" />
        </AccordionTrigger>

        <AccordionContent>
          <PriceSlider
            min={0}
            max={maxPrice}
            minVal={minVal}
            maxVal={maxVal}
            setMinVal={setMinVal}
            setMaxVal={setMaxVal}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Availability */}
      <AccordionItem value="exists">
        <AccordionTrigger>
          <Label>فقط کالاهای موجود</Label>
          <Switch checked={isAvailableOnly} onChange={setIsAvailableOnly} />
        </AccordionTrigger>
      </AccordionItem>

      <AccordionItem value="dkstore">
        <AccordionTrigger>
          <Label>فقط کالاهای موجود در انبار دیجی‌کالا</Label>
          <Switch checked={isDigikalaOnly} onChange={setIsDigikalaOnly} />
        </AccordionTrigger>
      </AccordionItem>
    </Accordion>
  );
}

/* ------------------ Modal Buttons ------------------ */
function ModalButtons({
  count,
  onClose,
  onReset,
}: {
  count: number;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex gap-5 mt-5 text-sm pt-3">
      <button className="w-full p-2 bg-rose-500 rounded-md text-white" onClick={onClose}>
        مشاهده {count} محصول
      </button>

      <button
        className="w-full border p-2 border-rose-500 rounded-md text-red-500"
        onClick={onReset}
      >
        حذف فیلتر
      </button>
    </div>
  );
}

/* ------------------ Modal Component ------------------ */
function Modal({
  children,
  isOpen,
  close,
}: {
  children: ReactNode;
  isOpen: boolean;
  close: () => void;
}) {
  return (
    <div
      onClick={close}
      className={`fixed inset-0 z-50 lg:hidden flex h-screen w-full bg-black/40 dark:bg-black/80 transition-all duration-500 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`fixed bottom-0 right-0 w-full max-h-[90vh] overflow-auto rounded-lg bg-white dark:bg-neutral-900 px-5 pb-5 shadow transition-all duration-500 ${
          isOpen ? "translate-y-0" : "translate-y-96"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="relative w-full" onClick={close}>
          <X size={20} className="absolute left-0 top-0" />
        </button>

        {children}
      </div>
    </div>
  );
}
 