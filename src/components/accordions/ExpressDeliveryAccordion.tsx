"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import { expressDeliveryQuestions, type FAQItem } from "@/src/data/expressDeliveryQuestions";

interface ExpressDeliveryAccordionProps {
  data?: FAQItem[]; // optional override for future API or CMS data
}

export default function ExpressDeliveryAccordion({
  data = expressDeliveryQuestions,
}: ExpressDeliveryAccordionProps) {
  if (!data?.length)
    return (
      <p className="text-neutral-500 text-sm text-center py-6">
        هیچ پرسشی برای نمایش وجود ندارد.
      </p>
    );

  return (
    <Accordion type="single" collapsible className="w-full">
      {data.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-neutral-900 py-6 text-right text-xs lg:text-sm leading-7 font-irsansb">
            <span>{item.question}</span>
            <ChevronDown
              className="h-4 w-4 text-neutral-600 dark:text-neutral-200 shrink-0 transition-transform duration-200"
              aria-hidden="true"
            />
          </AccordionTrigger>
          <AccordionContent className="text-neutral-500 text-[13px] lg:text-base leading-7">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
