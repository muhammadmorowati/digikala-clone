// src/components/accordions/TermsAccordion.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { ChevronDown } from "lucide-react"; // ✅ optional: for visual consistency with other accordions

export interface TermsSection {
  id: string;
  title: string;
  content: string;
}

interface TermsAccordionProps {
  sections?: TermsSection[]; // ✅ optional for flexibility
}

export default function TermsAccordion({ sections = [] }: TermsAccordionProps) {
  if (!sections.length) {
    return (
      <p className="text-center text-sm text-neutral-500 py-5">
        هیچ بخش یا محتوایی برای نمایش وجود ندارد.
      </p>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger className="font-irsansb text-sm lg:text-base text-neutral-900 dark:text-white py-4 flex justify-between items-center">
            <span>{section.title}</span>
            <ChevronDown className="h-4 w-4 text-neutral-600 dark:text-neutral-200 shrink-0 transition-transform duration-200" />
          </AccordionTrigger>
          <AccordionContent className="text-[13px] text-neutral-700 dark:text-neutral-300 leading-7 text-justify">
            {section.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
