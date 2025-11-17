"use client";

import classnames from "classnames";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef } from "react";

export default function PriceSlider({
  min,
  max,
  minVal,
  maxVal,
  setMinVal,
  setMaxVal,
}) {
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);

  /** Convert raw number → percentage */
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  /** Update left + width when minVal changes */
  useEffect(() => {
    if (!range.current || !maxValRef.current) return;

    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(Number(maxValRef.current.value));

    range.current.style.left = `${minPercent}%`;
    range.current.style.width = `${maxPercent - minPercent}%`;
  }, [minVal, getPercent]);

  /** Update width when maxVal changes */
  useEffect(() => {
    if (!range.current || !minValRef.current) return;

    const minPercent = getPercent(Number(minValRef.current.value));
    const maxPercent = getPercent(maxVal);

    range.current.style.width = `${maxPercent - minPercent}%`;
  }, [maxVal, getPercent]);

  /** Helpers */
  const formatNumber = (v) => v.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const unformatNumber = (v) => v.replace(/,/g, "");

  return (
    <div>
      {/* MIN INPUT */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[15px] text-neutral-600 dark:text-neutral-300">
          از
        </span>

        <input
          value={formatNumber(minVal.toString())}
          onChange={(e) => setMinVal(Number(unformatNumber(e.target.value)))}
          type="text"
          className="text-left text-2xl font-bold text-gray-800 dark:text-white w-40 border-b p-3 outline-none bg-transparent"
        />

        {/* Nothing changed: SVG AS IS */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-neutral-600 dark:fill-neutral-300"
        >
          <path d="M9.696 17.76L9.48 16.776C9.96 16.712 10.4 16.62 ..." />
        </svg>
      </div>

      {/* MAX INPUT */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[15px] text-neutral-600 dark:text-neutral-300">
          تا
        </span>

        <input
          value={formatNumber(maxVal.toString())}
          onChange={(e) => setMaxVal(Number(unformatNumber(e.target.value)))}
          type="text"
          className="text-left text-2xl font-bold text-gray-800 dark:text-white w-40 border-b p-3 outline-none bg-transparent"
        />

        <svg
          width="20"
          height="20"
          viewBox="0 0 18 18"
          className="fill-neutral-600 dark:fill-neutral-300"
        >
          <path d="M9.696 17.76L9.48 16.776C9.96 ..." />
        </svg>
      </div>

      {/* SLIDER */}
      <div className="slider_container">
        {/* MIN RANGE */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          ref={minValRef}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxVal - 1);
            setMinVal(value);
            e.target.value = value.toString()
          }}
          className={classnames("thumb thumb--zindex-3", {
            "thumb--zindex-5": minVal > max - 100,
          })}
        />

        {/* MAX RANGE */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          ref={maxValRef}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minVal + 1);
            setMaxVal(value);
            e.target.value = value.toString()
          }}
          className="thumb thumb--zindex-4"
        />

        {/* RANGE VISUAL */}
        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />
          <div className="slider__left-value dark:text-neutral-300">
            گرانترین
          </div>
          <div className="slider__right-value dark:text-neutral-300">
            ارزانترین
          </div>
        </div>
      </div>
    </div>
  );
}

/** FIXED PropTypes */
PriceSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  minVal: PropTypes.number.isRequired,
  maxVal: PropTypes.number.isRequired,
  setMinVal: PropTypes.func.isRequired,
  setMaxVal: PropTypes.func.isRequired,
};
