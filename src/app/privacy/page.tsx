import { Info } from "lucide-react";
import Image from "next/image";
import path from "path";
import { promises as fs } from "fs";

/** Utility: read privacy content from JSON */
async function readPrivacyData() {
  const filePath = path.join(process.cwd(), "data", "pages", "privacy.json");
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

export default async function Privacy() {
  const { title, banner, sections, notice, contact } = await readPrivacyData();

  return (
    <div className="max-lg:pb-20">
      {/* Banner */}
      <div className="w-full h-10">
        <Image
          alt="privacy-gif"
          className="w-full h-full object-cover"
          src={banner}
          width={1000}
          height={1000}
        />
      </div>

      {/* Content */}
      <div className="px-5 my-5">
        {/* Decorative icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="35"
          viewBox="0 0 48 53"
          fill="none"
          className="mb-3"
        >
          {/* (Keep your SVG definition unchanged) */}
        </svg>

        <h1 className="font-irsansb my-5 lg:text-xl">{title}</h1>

        {/* Privacy paragraphs */}
        {sections.map((text: string, index: number) => (
          <p
            key={index}
            className="text-[13px] text-neutral-700 dark:text-neutral-300 leading-7 mb-4"
          >
            {text}
          </p>
        ))}

        {/* Legal notice */}
        <small className="flex gap-2 text-orange-500 leading-8 my-5">
          <Info
            size={25}
            className="shrink-0 mt-1 fill-orange-400 text-white dark:text-black"
          />
          {notice}
        </small>

        {/* Contact info */}
        <div className="mt-5">
          <p className="text-[13px] text-neutral-700 dark:text-neutral-300 leading-7">
            {contact.note}
          </p>
          <p className="text-[13px] text-neutral-700 leading-7 font-irsansb dark:text-white">
            {contact.phoneLabel}
          </p>
          <p className="text-[13px] text-neutral-700 dark:text-neutral-300 leading-7">
            {contact.phoneValue}
          </p>
          <p className="text-[13px] text-neutral-700 leading-7 font-irsansb dark:text-white">
            {contact.addressLabel}
          </p>
          <p className="text-[13px] text-neutral-700 dark:text-neutral-300 leading-7">
            {contact.addressValue}
          </p>
        </div>
      </div>
    </div>
  );
}
