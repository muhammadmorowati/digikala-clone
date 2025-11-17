"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { footerLinks } from "@/src/data/data";
import { validateEmail } from "@/src/lib/validators";
import { Instagram, Linkedin, Twitter, ChevronDown } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export default function FooterLinks({ user }) {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  const submitHandler = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!user) {
        toast.error("برای ثبت ایمیل، ابتدا باید وارد حساب کاربری خود شوید.");
        return;
      }

      toast.success("ایمیل شما با موفقیت ثبت شد.");
      setEmail("");
      setIsValidEmail(false);
    },
    [user]
  );

  useEffect(() => {
    setIsValidEmail(validateEmail(email));
  }, [email]);

  const socials = [
    { href: "https://www.instagram.com/digikalacom/", icon: <Instagram size={32} /> },
    { href: "https://twitter.com/digikalacom", icon: <Twitter size={32} /> },
    { href: "https://www.linkedin.com/company/digikala/mycompany/", icon: <Linkedin size={32} /> },
    { href: "https://www.aparat.com/digikala/" },
  ];

  return (
    <>
      {/* Desktop version */}
      <div className="max-lg:hidden flex w-full justify-between my-14">

        {/* 3 columns of footer links */}
        {footerLinks.slice(0, 3).map((link) => (
          <div key={link.id} className="w-4/12">
            <p className="text-neutral-700 mb-5 font-irsansb dark:text-white">{link.title}</p>

            {link.links.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="text-sm text-neutral-500 mb-4 block dark:text-neutral-400"
                shallow
                scroll={false}
              >
                {item.title}
              </Link>
            ))}
          </div>
        ))}

        {/* Social + Newsletter */}
        <div className="w-4/12">
          {/* Social icons */}
          <h4 className="mb-5 text-neutral-700 font-irsansb dark:text-white">
            همراه ما باشید!
          </h4>

          <div className="flex items-center">
            {socials.map((s, i) => (
              <Link key={i} className="ml-6 lg:ml-10" href={s.href}>
                <div className="flex text-neutral-400 dark:text-neutral-500">
                  {s.icon}
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div className="w-full flex flex-col items-start mt-12">
            <h4 className="hidden md:block font-irsansb dark:text-white text-neutral-700 mb-5">
              با ثبت ایمیل، از تخفیف‌ها با‌خبر شوید
            </h4>

            <form className="w-full flex" onSubmit={submitHandler}>
              <label className="w-full">
                <div className="px-2 flex items-center bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                  <input
                    type="email"
                    name="email"
                    placeholder="ایمیل شما"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-2 py-3 w-full bg-neutral-100 dark:bg-neutral-700 outline-none"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={!isValidEmail}
                className={`text-white w-16 rounded-lg ml-1 mr-2 flex items-center justify-center transition ${
                  isValidEmail
                    ? "bg-rose-500 cursor-pointer"
                    : "bg-neutral-300 dark:bg-neutral-800 cursor-not-allowed"
                }`}
              >
                ثبت
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <Accordion type="single" collapsible className="w-full lg:hidden mb-5">
        {footerLinks.map((link, index) => (
          <AccordionItem key={link.id} value={`item-${index + 1}`}>
            <AccordionTrigger className="hover:no-underline text-neutral-800 dark:text-neutral-100 text-xs font-irsansb">
              {link.title}
              <ChevronDown className="h-4 w-4 text-neutral-600 dark:text-neutral-200 shrink-0" />
            </AccordionTrigger>

            <div>
              {link.links.map((item, i) => (
                <AccordionContent
                  key={i}
                  className="text-sm text-neutral-700 dark:text-neutral-300"
                >
                  {item.href ? <Link href={item.href}>{item.title}</Link> : <div>{item.title}</div>}
                </AccordionContent>
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
