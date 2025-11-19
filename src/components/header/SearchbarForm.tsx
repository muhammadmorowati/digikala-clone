"use client";

import {
  ArrowRight,
  ChevronLeft,
  Flame,
  MoveUpRight,
  Search,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import SearchSkeleton from "./SearchSkeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

import type { ProductSearch } from "@/src/utils/types"; // <— YOU SHOULD CREATE THIS TYPE THERE

export default function SearchbarForm({
  placeholder,
  products,
}: {
  placeholder?: string;
  products: ProductSearch[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SearchForm
        placeholder={placeholder}
        products={products}
        isOpen={isOpen}
        openModalHandler={() => setIsOpen(true)}
        closeModalHandler={() => setIsOpen(false)}
      />

      {/* Mobile modal */}
      <div
        className={`fixed right-0 top-0 z-50 lg:hidden h-screen w-full bg-black/40 dark:bg-black/80 transition-all duration-500 
        ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={() => setIsOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed bottom-0 right-0 w-full h-full bg-white dark:bg-neutral-900 p-5 shadow transition-all duration-500
           ${isOpen ? "translate-y-0" : "translate-y-96"}`}
        >
          <SearchForm
            placeholder={placeholder}
            products={products}
            isOpen={isOpen}
            openModalHandler={() => setIsOpen(true)}
            closeModalHandler={() => setIsOpen(false)}
          />
        </div>
      </div>
    </>
  );
}

function SearchForm({
  placeholder,
  products,
  isOpen,
  openModalHandler,
  closeModalHandler,
}: {
  placeholder?: string;
  products: ProductSearch[];
  isOpen: boolean;
  openModalHandler: () => void;
  closeModalHandler: () => void;
}) {
  const searchRef = useRef<HTMLLabelElement>(null);
  const [search, setSearch] = useState("");
  const [isShowSearchMenu, setIsShowSearchMenu] = useState(false);
  const [searchResult, setSearchResult] = useState<ProductSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Auto-reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setSearchResult([]);
    }
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsShowSearchMenu(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setIsLoading(true);

    if (value.length > 1) {
      const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResult(filtered);
    } else {
      setSearchResult([]);
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${search}`);
        setIsShowSearchMenu(false);
        closeModalHandler();
      }}
      onClick={() => {
        openModalHandler();
        setIsShowSearchMenu(true);
      }}
      className="relative w-full h-12 border-0"
    >
      <label ref={searchRef} htmlFor="search" className="lg:flex items-center w-full">
        <div className="flex items-center w-full h-full bg-neutral-100 rounded-lg dark:bg-neutral-700">
          {isOpen ? (
            <ArrowRight
              size={20}
              className="text-neutral-500 mr-5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                closeModalHandler();
              }}
            />
          ) : (
            <SearchIcon size={20} className="text-neutral-400 mr-5" />
          )}

          <input
            id="search"
            type="text"
            autoComplete="off"
            value={search}
            onChange={changeHandler}
            placeholder={placeholder || "جستجو"}
            className="placeholder:text-sm text-neutral-500 bg-transparent h-full p-3 w-2/3 outline-none"
          />
        </div>

        {/* Dropdown */}
        <SearchDropdown
          searchResult={searchResult}
          isLoading={isLoading}
          isShowSearchMenu={isShowSearchMenu}
          closeModalHandler={closeModalHandler}
          products={products}
        />
      </label>
    </form>
  );
}

function SearchDropdown({
  searchResult,
  isLoading,
  isShowSearchMenu,
  closeModalHandler,
  products,
}: {
  searchResult: ProductSearch[];
  isLoading: boolean;
  isShowSearchMenu: boolean;
  closeModalHandler: () => void;
  products: ProductSearch[];
}) {
  return (
    <div
      className={`overflow-y-auto max-h-screen lg:absolute transition-all duration-700 lg:shadow top-0 right-0 w-full bg-white rounded-lg p-4
        ${isShowSearchMenu ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      {/* Search Results */}
      {searchResult.map((product) => (
        <div
          key={product._id.toString()}
          className="my-5 text-neutral-700 flex justify-between items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/products/${product._id}`}>
            <Search size={20} className="text-neutral-400" />
            {product.title.slice(0, 50)}...
          </Link>
          <MoveUpRight size={20} className="text-neutral-400" />
        </div>
      ))}

      {isLoading && (
        <>
          <SearchSkeleton />
          <SearchSkeleton />
          <SearchSkeleton />
        </>
      )}

      {searchResult.length > 0 && <div className="my-5 w-full bg-neutral-100 h-[1px]" />}

      {/* Popular Searches */}
      <h2 className="flex items-center gap-4 my-4">
        <Flame className="text-neutral-400" />
        <span className="text-[15px] font-irsansb text-neutral-600">جستجوهای پرطرفدار</span>
      </h2>

      <Carousel opts={{ align: "start", direction: "rtl" }} className="w-full">
        <CarouselContent>
          {products.slice(0, 5).map((product) => (
            <CarouselItem key={product._id.toString()} className="basis-auto p-0">
              <Card className="rounded-full">
                <CardContent className="rounded-full flex items-center justify-center p-2">
                  <Link
                    href={`/products/${product._id}`}
                    className="p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeModalHandler();
                    }}
                  >
                    <span className="flex text-sm font-irsansb text-neutral-600 items-center gap-2">
                      {product.title.slice(0, 11)} ...
                      <ChevronLeft size={15} />
                    </span>
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
    </div>
  );
}
