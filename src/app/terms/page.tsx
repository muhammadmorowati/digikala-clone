import Image from "next/image";
import TermsAccordion from "@/src/components/accordions/TermsAccordion";
import { termsData } from "@/src/data/terms";

const paragraphClass =
  "text-[13px] text-neutral-700 dark:text-neutral-300 leading-7";

/** ✅ Dynamic Terms & Conditions Page */
export default function Terms() {
  const { title, intro, sections } = termsData;

  return (
    <div className="max-lg:pb-20">
      {/* Hero Banner */}
      <div className="w-full h-10 bg-red-500">
        <Image
          src="/privacy-page.gif"
          alt="terms-banner"
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="px-5 lg:px-20 my-5">
        {/* Icon (unchanged SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="34"
          viewBox="0 0 49 48"
          fill="none"
          aria-hidden="true"
          className="mb-2"
        >
          {/* ...existing SVG content... */}
        </svg>

        {/* Title */}
        <h1 className="font-irsansb my-5 text-lg lg:text-xl">{title}</h1>

        {/* Intro Paragraphs */}
        <section className="space-y-4">
          {intro.map((text, i) => (
            <p key={i} className={paragraphClass}>
              {text}
            </p>
          ))}
        </section>

        {/* Dynamic Accordion */}
        <section className="mt-10">
          <TermsAccordion sections={sections} />
        </section>
      </div>
    </div>
  );
}
