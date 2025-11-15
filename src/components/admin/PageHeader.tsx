import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface PageHeaderProps {
  title: string;
  href?: string;
}

export default function PageHeader({ title, href }: PageHeaderProps) {
  return (
    <header className="flex justify-between items-center mb-10">
      <h1 className="text-xl sm:text-2xl font-bold max-sm:leading-9">{title}</h1>

      {href && (
        <Link href={href} className="flex items-center gap-1">
          <Button variant="default" className="flex items-center gap-1">
            <Plus size={20} />
            <span>افزودن</span>
          </Button>
        </Link>
      )}
    </header>
  );
}
