"use client";

import useScroll from "@/src/utils/useScroll";
import { ReactNode } from "react";

export default function TopbarContainer({ children }: { children: ReactNode }) {
  const { isVisible } = useScroll();

  return (
    <header
      className={`sticky top-0 w-full z-40 p-4 transition-all duration-300
        bg-white dark:bg-neutral-950
        ${isVisible ? "shadow-sm border-b" : ""}
      `}
    >
      {children}
    </header>
  );
}
