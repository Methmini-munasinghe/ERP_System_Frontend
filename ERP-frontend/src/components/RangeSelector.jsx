// src/components/RangeSelector.jsx

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const rangeOptions = ["1d", "7d", "30d", "90d", "365d"];

export default function RangeSelector({ selectedRange, onRangeChange }) {
  const [startDate, setStartDate] = useState(null);

  return (
    <div className="inline-flex items-center gap-2 flex-wrap">
      <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
        {rangeOptions.map((range) => (
          <button
            key={range}
            type="button"
            className={`border-r border-gray-200 last:border-r-0 bg-white text-gray-500 px-2 py-2 text-xs font-semibold min-w-[38px] transition ${selectedRange === range ? "bg-gray-100 text-gray-800" : ""}`}
            onClick={() => onRangeChange(range)}
          >
            {range}
          </button>
        ))}
      </div>
      <div className="relative">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          customInput={
            <button className="border border-gray-200 bg-white text-gray-500 rounded-lg px-3 py-2 text-[0.85rem] font-semibold flex items-center gap-2 transition hover:border-violet-500 hover:text-violet-600" type="button">
              <CalendarDays size={16} />
              <span>{startDate ? startDate.toLocaleDateString() : "Select dates"}</span>
            </button>
          }
        />
      </div>
    </div>
  );
}
