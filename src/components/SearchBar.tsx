import { Search } from "lucide-react";
import { useState } from "react";
import { searchCities } from "../api";
import type { GeocodingResult } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface SearchBarProps {
  onSelect: (city: GeocodingResult) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length >= 2) {
      setIsLoading(true);
      const res = await searchCities(val);
      setResults(res);
      setIsOpen(true);
      setIsLoading(false);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (city: GeocodingResult) => {
    onSelect(city);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-50">
      <div className="relative flex items-center w-full h-12 rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
        <div className="grid place-items-center h-full w-12 text-slate-400">
          <Search size={20} />
        </div>
        <input
          className="peer h-full w-full outline-none text-sm text-slate-700 bg-transparent pr-2"
          type="text"
          id="search"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto"
          >
            {results.map((city) => (
              <li
                key={city.id}
                onClick={() => handleSelect(city)}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex flex-col transition-colors"
              >
                <span className="text-sm font-medium text-slate-800">{city.name}</span>
                <span className="text-xs text-slate-500">
                  {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
