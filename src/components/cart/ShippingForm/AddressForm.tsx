"use client";

import { useState } from "react";
import { User, Address } from "@/src/utils/types";
import ProvinceCitySelect from "./ProvinceCitySelect";
import { Button } from "@/src/components/ui/button";

export default function AddressForm({
  user,
  initialAddress,
  loading,
  onClose,
  onSubmit,
}: {
  user: User;
  initialAddress: Address | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: Address) => void;
}) {
  const [form, setForm] = useState<Address>(
    initialAddress || {
      street: "",
      plate: "",
      city: "",
      unit: "",
      province: "",
      postalcode: "",
    }
  );

  const change = (key: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <h3 className="font-irsansb text-gray-800 dark:text-white mb-3">
        آدرس ارسال
      </h3>

      <input
        className="input"
        placeholder="خیابان"
        value={form.street}
        onChange={(e) => change("street", e.target.value)}
      />

      <input
        className="input"
        placeholder="پلاک"
        value={form.plate}
        onChange={(e) => change("plate", e.target.value)}
      />

      <input
        className="input"
        placeholder="کد پستی"
        value={form.postalcode}
        onChange={(e) => change("postalcode", e.target.value)}
      />

      <ProvinceCitySelect
        province={form.province}
        city={form.city}
        onProvinceSelect={(val) => change("province", val)}
        onCitySelect={(val) => change("city", val)}
      />

      <div className="flex justify-between gap-3 mt-5">
        <Button type="button" variant="secondary" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "در حال ذخیره..." : "ثبت آدرس"}
        </Button>
      </div>
    </form>
  );
}
