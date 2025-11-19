import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { Category, Submenu, SubmenuItem } from "@/src/utils/types";
import React from "react";

interface BreadcrumbContainerProps {
  category: Category;
  submenu: Submenu;
  item?: SubmenuItem;
  title?: string;
}

interface Crumb {
  label: string;
  href?: string;
}

export default function BreadcrumbContainer({
  category,
  submenu,
  item,
  title,
}: BreadcrumbContainerProps) {
  const breadcrumbs: Crumb[] = [
    { label: "دیجی‌کالا", href: "/" },
    { label: category.title, href: category.href },
    { label: submenu.title, href: submenu.href },
  ];

  if (item) {
    breadcrumbs.push({ label: item.title, href: item.href });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1 && !title;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className="text-xs">
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href ?? "#"}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}

        {title && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-xs">
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
