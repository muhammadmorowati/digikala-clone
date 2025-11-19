import { Article } from "@/src/utils/types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ArticlesProps {
  title: string;
  articles: Article[];
}

export default function Articles({ title, articles }: ArticlesProps) {
  const displayedArticles = articles?.slice(0, 4) ?? [];

  return (
    <section className="mx-3 my-10">
      <header className="flex justify-between items-center mb-5">
        <h3 className="font-irsansb">{title}</h3>

        <Link
          href="/articles"
          className="text-xs text-sky-500 flex items-center"
        >
          مقالات بیشتر در دیجی‌کالا
          <ChevronLeft size={15} />
        </Link>
      </header>

      <div className="grid grid-cols-4 max-lg:grid-cols-1 gap-3">
        {displayedArticles.map((article) => (
          <Link
            key={article._id.toString()}
            href={`/articles/${article._id}`}
            className="block"
          >
            <article className="rounded-xl border overflow-hidden lg:h-64 xl:h-72 bg-white dark:bg-neutral-900">
              <Image
                alt={article.title}
                width={1000}
                height={1000}
                src={article.cover}
                className="object-cover h-40 w-full"
              />
              <p className="text-[12.5px] mt-4 px-3 h-14 leading-6 line-clamp-3">
                {article.title}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
