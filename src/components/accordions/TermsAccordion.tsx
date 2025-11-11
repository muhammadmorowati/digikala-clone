// src/components/accordions/TermsAccordion.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";

interface TermsAccordionProps {
  sections: { id: string; title: string; content: string }[];
}

export default function TermsAccordion({ sections }: TermsAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger className="font-irsansb text-sm text-neutral-900 dark:text-white py-4">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="text-[13px] text-neutral-700 dark:text-neutral-300 leading-7">
            {section.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
