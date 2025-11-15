"use client";

import { CircleUserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function ArticleComment() {
  const [extendCommentBox, setExtendCommentBox] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const commentBoxRef = useRef<HTMLDivElement>(null);

  // --- Detect outside click ---
  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (
        commentBoxRef.current &&
        !commentBoxRef.current.contains(e.target as Node)
      ) {
        setExtendCommentBox(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  // --- Form Submit ---
  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.comment.trim()) {
      console.warn("Please fill all fields");
      return;
    }

    console.log("Comment Submitted:", form);

    // Reset form
    setForm({ name: "", email: "", comment: "" });
    setExtendCommentBox(false);
  };

  return (
    <div ref={commentBoxRef}>
      <h5 className="font-irsansb">دیدگاه شما</h5>

      <div
        onClick={() => setExtendCommentBox(true)}
        className={`border border-neutral-300 rounded-sm mt-5 px-8 py-5 transition-colors ${
          extendCommentBox
            ? "bg-white dark:bg-neutral-800"
            : "bg-neutral-100 dark:bg-neutral-800"
        }`}
      >
        <div className="relative flex gap-3 items-center">
          <CircleUserRound
            className="text-neutral-600 absolute -top-1 right-0"
            size={45}
            strokeWidth={0.85}
          />

          {!extendCommentBox && (
            <span className="text-neutral-400 mr-14 mt-2">دیدگاه</span>
          )}
        </div>

        {extendCommentBox && (
          <>
            {/* NAME + EMAIL */}
            <div className="flex max-lg:flex-col gap-3 w-full lg:pr-14 max-lg:pt-14">
              <input
                type="text"
                placeholder="نام *"
                className="p-2 border flex-1 outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="email"
                placeholder="ایمیل *"
                className="p-2 border flex-1 outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* COMMENT BOX */}
            <div>
              <textarea
                placeholder="دیدگاه"
                rows={5}
                className="mt-8 w-full outline-none bg-transparent resize-none"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />

              <Separator className="my-2" />

              <div className="flex justify-end">
                <Button variant="outline" onClick={handleSubmit}>
                  ارسال دیدگاه
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
