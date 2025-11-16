"use client";

import { province, cities } from "@/src/data/data";

export default function ProvinceCitySelect({
  province: selectedProvince,
  city: selectedCity,
  onProvinceSelect,
  onCitySelect,
}: {
  province: string;
  city: string;
  onProvinceSelect: (val: string) => void;
  onCitySelect: (val: string) => void;
}) {
  const filteredCities = cities.filter(
    (c) => c.province_id.toString() === selectedProvince
  );

  return (
    <div className="space-y-4">
      <select
        value={selectedProvince}
        onChange={(e) => onProvinceSelect(e.target.value)}
        className="input"
      >
        <option value="">استان را انتخاب کنید</option>
        {province.map((p) => (
          <option key={p.id} value={p.id.toString()}>
            {p.title}
          </option>
        ))}
      </select>

      {selectedProvince && (
        <select
          value={selectedCity}
          onChange={(e) => onCitySelect(e.target.value)}
          className="input"
        >
          <option value="">شهر را انتخاب کنید</option>
          {filteredCities.map((c) => (
            <option key={c.id} value={c.title}>
              {c.title}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
