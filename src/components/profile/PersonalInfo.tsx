"use client";

import { updateUser } from "@/src/app/admin/users/action";
import { User } from "@/src/utils/types";
import { Edit2, Plus, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Modal from "../ui/Modal";

type EditableField = "email" | "name" | "phone" | "password" | "job" | "idNumber";

export default function PersonalInfo({ user }: { user: User }) {
  const [activeModal, setActiveModal] = useState<EditableField | null>(null);
  const [loading, setLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    email: user.email || "",
    name: user.name || "",
    phone: user.phone || "",
    password: "", // never pre-fill passwords
    job: user.job || "",
    idNumber: user.idNumber || "",
    role: user.role,
  });

  const closeModalHandler = () => setActiveModal(null);

  const handleInputChange = (field: EditableField, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;

    setLoading(true);

    const data = new FormData();
    data.append("_id", user._id);

    // Only update the one field being edited
    data.append(activeModal, formData[activeModal]);

    await updateUser(data);

    setLoading(false);
    closeModalHandler();
  };

  // Data-driven UI configuration
  const fieldsLeft: { label: string; value: string; field: EditableField }[] = [
    { label: "نام و نام خانوادگی", value: user.name, field: "name" },
    { label: "شماره موبایل", value: user.phone, field: "phone" },
    { label: "رمز عبور", value: "•••••••", field: "password" },
  ];

  const fieldsRight: { label: string; value: string; field: EditableField }[] = [
    { label: "کد ملی", value: user.idNumber, field: "idNumber" },
    { label: "ایمیل", value: user.email, field: "email" },
    { label: "شغل", value: user.job, field: "job" },
  ];

  const modalConfig: Record<EditableField, string> = {
    email: "پست الکترونیکی خود را وارد کنید",
    name: "نام و نام خانوادگی خود را وارد کنید",
    phone: "شماره موبایل خود را وارد کنید",
    job: "شغل خود را وارد کنید",
    idNumber: "کد ملی خود را وارد کنید",
    password: "رمز عبور جدید خود را وارد کنید",
  };

  return (
    <>
      {/* MAIN GRID */}
      <div className="flex border rounded-md px-5 flex-col lg:flex-row mx-4 lg:mx-0">
        {/* LEFT SIDE */}
        <div className="flex-1 divide-y-2 divide-neutral-100 dark:divide-neutral-900">
          {fieldsLeft.map(({ label, value, field }) => (
            <div
              key={field}
              className="p-5 h-20 flex justify-between items-center"
            >
              <div className="flex flex-col gap-3">
                <span className="text-neutral-400 text-sm">{label}</span>
                <span
                  className={`text-neutral-700 dark:text-white ${
                    field === "password" ? "opacity-50" : ""
                  }`}
                >
                  {value}
                </span>
              </div>

              <Edit2
                onClick={() => setActiveModal(field)}
                size={20}
                className={`text-neutral-500 cursor-pointer ${
                  field === "password" ? "opacity-50" : ""
                }`}
              />
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="lg:w-0.5 w-full max-lg:h-0.5 bg-neutral-100 dark:bg-neutral-900"></div>

        {/* RIGHT SIDE */}
        <div className="flex-1 divide-y-2 divide-neutral-100 dark:divide-neutral-900">
          {fieldsRight.map(({ label, value, field }) => (
            <div
              key={field}
              className="p-5 h-20 flex justify-between items-center"
            >
              <div className="flex flex-col gap-3">
                <span className="text-neutral-400 text-sm">{label}</span>
                <span className="text-neutral-700 dark:text-white">
                  {value || "—"}
                </span>
              </div>

              <span
                className="text-neutral-500 cursor-pointer"
                onClick={() => setActiveModal(field)}
              >
                {value ? <Edit2 size={20} /> : <Plus size={20} />}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      {activeModal && (
        <Modal isOpen={!!activeModal} closeModalHandler={closeModalHandler}>
          <div className="border-b dark:border-b-neutral-700 py-3 text-neutral-800 dark:text-white flex justify-between items-center">
            <h2 className="text-lg font-irsansb">{modalConfig[activeModal]}</h2>
            <Button variant="ghost" onClick={closeModalHandler}>
              <X />
            </Button>
          </div>

          <form onSubmit={submitHandler} className="flex flex-col gap-5 my-5">
            <Input
              type="text"
              value={formData[activeModal]}
              onChange={(e) => handleInputChange(activeModal, e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              disabled={loading || !formData[activeModal].trim()}
              variant={
                formData[activeModal].trim() ? "default" : "disabled"
              }
            >
              {loading ? "در حال ارسال..." : "تایید"}
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
