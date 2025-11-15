"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import { GuaranteeQuestion } from "@/src/utils/types"; // ✅ add type safety
import { guaranteeQuestions } from "@/src/data/data"; // ✅ import from proper dataset

interface GuaranteeAccordionProps {
  data?: GuaranteeQuestion[]; // optional dynamic data prop
}

export default function GuaranteeAccordion({
  data = guaranteeQuestions,
}: GuaranteeAccordionProps) {
  if (!data?.length) {
    return (
      <p className="text-center text-sm text-neutral-500 py-5">
        هیچ پرسشی برای نمایش وجود ندارد.
      </p>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {data.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger className="text-neutral-900 dark:text-white py-6 text-right text-xs lg:text-sm leading-7 font-irsansb">
            {item.q}
            <ChevronDown className="h-4 w-4 text-neutral-600 dark:text-neutral-200 shrink-0 transition-transform duration-200" />
          </AccordionTrigger>
          <AccordionContent className="text-neutral-600 dark:text-neutral-400 text-base leading-7">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
