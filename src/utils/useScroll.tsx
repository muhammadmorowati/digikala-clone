"use client";

import { useEffect, useRef, useState } from "react";

export default function useScroll() {
  const [isVisible, setIsVisible] = useState(true);

  // Using ref avoids re-rendering and stale closures
  const prevScrollPosRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    prevScrollPosRef.current = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPosRef.current < currentScrollPos;

      setIsVisible(!isScrollingDown);
      prevScrollPosRef.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { isVisible };
}
