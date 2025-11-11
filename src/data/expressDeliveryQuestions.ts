// src/data/expressDeliveryQuestions.ts
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const expressDeliveryQuestions: FAQItem[] = [
  {
    id: "delivery-time",
    question: "تحویل اکسپرس چه زمانی انجام می‌شود؟",
    answer:
      "تحویل سفارش‌های اکسپرس در تهران و برخی شهرها معمولاً طی ۲۴ ساعت کاری انجام می‌شود.",
  },
  {
    id: "delivery-fee",
    question: "آیا ارسال اکسپرس هزینه دارد؟",
    answer: "ارسال اکسپرس برای سفارش‌های بالای ۵۰۰ هزار تومان رایگان است.",
  },
  {
    id: "coverage",
    question: "ارسال اکسپرس شامل چه مناطقی است؟",
    answer:
      "در حال حاضر سرویس اکسپرس برای تهران، کرج و مراکز استان‌ها فعال است.",
  },
];
