"use client";

import React from 'react';
import { Filters } from './types';

interface FilterSectionProps {
  isFilterOpen: boolean;
  toggleFilters: () => void;
  filters: Filters;
  toggleFilter: (type: keyof Filters) => void;
  selectedSort: string;
  setSelectedSort: React.Dispatch<React.SetStateAction<string>>;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  isFilterOpen,
  toggleFilters,
  filters,
  toggleFilter,
  selectedSort,
  setSelectedSort
}) => {
  return (
    <div className="px-8 py-0 mx-auto my-0 max-w-[1200px]">
      <button
        className="flex gap-2 items-center px-6 py-3 bg-gray-100 rounded-xl transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease]"
        onClick={toggleFilters}
        aria-expanded={isFilterOpen}
        style={{
          marginBottom: isFilterOpen ? "1rem" : "0",
        }}
      >
        <span className="text-xl font-semibold">🔍 Filters</span>
        <span
          className="transition-transform duration-[0.2s] ease-[ease]"
          style={{
            transform: isFilterOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>
      <div
        className="flex-col gap-4 p-4 mb-8 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
        style={{
          display: isFilterOpen ? "flex" : "none",
        }}
      >
        <div className="flex gap-4 items-center max-sm:flex-col">
          <label htmlFor="sortSelect" className="text-sm text-gray-600 max-sm:text-xl">
            Sort by:
          </label>
          <select
            id="sortSelect"
            className="p-3 w-auto text-base text-gray-700 rounded-lg border border-solid cursor-pointer max-sm:p-4 max-sm:w-full max-sm:text-lg"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="Mood">Mood (Default)</option>
            <option value="Rating">Rating</option>
            <option value="DeliveryTime">Delivery Time</option>
            <option value="Distance">Distance</option>
          </select>
        </div>
        <div className="flex gap-3 mt-4 max-sm:justify-between max-sm:w-full">
          <button
            className="px-5 py-3 text-base rounded-xl transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] min-w-[80px] max-sm:flex-1 max-sm:p-4 max-sm:text-lg"
            onClick={() => toggleFilter("veg")}
            aria-pressed={filters.veg}
            style={{
              background: filters.veg ? "#22c55e" : "#e5e7eb",
              color: filters.veg ? "white" : "#374151",
            }}
          >
            Veg
          </button>
          <button
            className="px-5 py-3 text-base rounded-xl transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] min-w-[80px] max-sm:flex-1 max-sm:p-4 max-sm:text-lg"
            onClick={() => toggleFilter("egg")}
            aria-pressed={filters.egg}
            style={{
                background: filters.egg ? "#fbbf24" : "#e5e7eb",
                color: filters.egg ? "white" : "#374151",
            }}
            >
            Egg
            </button>
          <button
            className="px-5 py-3 text-base rounded-xl transition-all cursor-pointer border-[none] duration-[0.2s] ease-[ease] min-w-[80px] max-sm:flex-1 max-sm:p-4 max-sm:text-lg"
            onClick={() => toggleFilter("nonVeg")}
            aria-pressed={filters.nonVeg}
            style={{
              background: filters.nonVeg ? "#ef4444" : "#e5e7eb",
              color: filters.nonVeg ? "white" : "#374151",
            }}
          >
            Non-veg
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;