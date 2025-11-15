import { Article } from "@/src/utils/types";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function getRelativeTime(dateInput: string | Date): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const now = new Date();

  if (isNaN(date.getTime())) return "تاریخ نامعتبر";

  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "چند ثانیه قبل";
  if (minutes < 60) return `${minutes} دقیقه قبل`;
  if (hours < 24) return `${hours} ساعت قبل`;
  return `${days} روز قبل`;
}

export default function ArticleCard({ article }: { article: Article }) {
  const { _id, title, author, cover, publishedAt } = article;

  const slugAuthor = author.trim().replace(/\s+/g, "-");

  return (
    <div className="shadow border rounded-md w-64 overflow-hidden flex-grow sm:flex-grow-0">
      <Link href={`/articles/${_id}`}>
        <Image
          src={cover}
          width={600}
          height={600}
          alt={title}
          className="object-cover"
        />
      </Link>

      <div className="p-3 pb-6 flex flex-col justify-between h-40">
        <Link
          href={`/articles/${_id}`}
          className="font-irsansb leading-7 text-neutral-600 dark:text-neutral-100 text-sm line-clamp-2"
        >
          {title}
        </Link>

        <div className="text-neutral-400 dark:text-neutral-300 mt-3 flex gap-5 justify-between items-center">
          <Link
            href={`/articles/user/${slugAuthor}`}
            className="flex items-center gap-1"
          >
            <Image
              alt="author avatar"
              width={30}
              height={30}
              src="/default_author.jpg"
              className="rounded-full grayscale"
            />
            <p className="text-xs">{author}</p>
          </Link>

          <span className="flex text-xs items-center gap-2">
            <Clock size={16} />
            {getRelativeTime(publishedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
