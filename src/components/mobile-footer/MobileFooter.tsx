"use client";

import { mobileFooterLinks } from "@/src/data/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import CartLengthPseudo from "../cart/CartLengthPseudo";

export default function MobileFooter() {
  const [activeLink, setActiveLink] = useState<string>("");

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  return (
    <div className="lg:hidden bg-white dark:bg-neutral-900 py-1 w-full fixed bottom-0 right-0 shadow-lg border-t z-20">
      <div className="flex justify-between items-center sm:px-5 px-1">
        {mobileFooterLinks.map((link) => {
          const isActive = activeLink === link.href;

          return (
            <div key={link.id}>
              {link.href ? (
                <Link
                  href={link.href}
                  onClick={() => setActiveLink(link.href)}
                  className={`flex relative items-center flex-col gap-1.5 justify-center transition-all 
                  hover:text-neutral-800 dark:hover:text-neutral-50 
                  ${isActive ? "text-neutral-800 dark:text-neutral-50" : "text-neutral-400"}`}
                >
                  {link.title === "سبد خرید" && (
                    <CartLengthPseudo className="w-5 h-5 top-0 right-7" />
                  )}

                  {/* Icon */}
                  <span className="flex items-center justify-center">
                    {isActive ? link.activeIcon : link.icon}
                  </span>

                  <small className="text-xs max-sm:text-[10px]">{link.title}</small>
                </Link>
              ) : (
                <button
                  onClick={() => setActiveLink(link.href ?? "")}
                  className="flex items-center text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-50"
                >
                  {link.icon}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
