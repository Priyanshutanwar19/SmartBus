import React, { useState } from "react";
import CityDropdown from "./CityDropdown";

export default function BusSearchForm({ onSearch }) {
  const [from, setFrom] = useState("Delhi");
  const [to, setTo] = useState("Mumbai");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (from && to && date) {
      onSearch({ from, to, date });
    }
  };

  return (
    <form className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-10 gap-4 items-end" onSubmit={handleSubmit}>
      {/* From */}
      <div className="md:col-span-3">
        <CityDropdown label="From" value={from} onChange={setFrom} />
      </div>

      {/* Swap Button */}
      <div className="text-center">
        <button type="button" onClick={handleSwap} className="bg-white p-2 rounded-full shadow hover:bg-indigo-100 transition transform hover:rotate-180 duration-300">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
        </button>
      </div>
      
      {/* To */}
      <div className="md:col-span-3">
        <CityDropdown label="To" value={to} onChange={setTo} />
      </div>

      {/* Date */}
      <div className="md:col-span-2">
        <label className="text-sm font-medium text-gray-600 block mb-1">Date</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <input
              type="date"
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-3 pl-10 text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
        </div>
      </div>
      
      {/* Search Button */}
      <div className="md:col-span-1">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
          disabled={!from || !to || !date}
        >
          Search
        </button>
      </div>
    </form>
  );
} 