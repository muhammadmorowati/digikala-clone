"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import Logo from "../Logo";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import SidebarList from "./SidebarList";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const closeSheet = () => setOpen(false);

  return (
    <div className="border rounded-lg">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarList />
      </div>

      {/* Mobile Header */}
      <div className="flex items-center justify-between px-5 py-5 lg:hidden rtl">
        <h1 className="text-5xl font-bold">
          <Logo />
        </h1>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger onClick={handleToggle}>
            <Menu className="cursor-pointer" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="h-screen overflow-y-auto hidden-scrollbar p-0 w-[300px] sm:w-[400px]"
          >
            <SidebarList closeSheet={closeSheet} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
