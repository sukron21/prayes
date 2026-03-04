"use client";

import { useState } from "react";

interface Option {
  id: string;
  lokasi: string;
}

interface SearchableDropdownProps {
  options?: Option[];
  placeholder?: string;
  onSelect: (option: Option) => void;
}

export function SearchableDropdown({
  options = [],
  placeholder = "Select...",
  onSelect,
}: SearchableDropdownProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.lokasi.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (option: Option) => {
    onSelect(option);
    setSearch(option.lokasi);
    setIsOpen(false);
  };

  return (
    <div className="relative w-64">
      <input
        type="text"
        className="w-full border-none text-center rounded-md px-3 py-2 h-10 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <ul className="absolute z-10 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
          {filteredOptions.length === 0 && (
            <li className="px-3 py-2 text-gray-500">No results</li>
          )}
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option.lokasi}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
