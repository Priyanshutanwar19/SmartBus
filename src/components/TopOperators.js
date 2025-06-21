import React, { useEffect, useState } from "react";

const defaultLogo = "/images/bus-default.png";
const TOP_OPERATOR_NAMES = [
  "Vijay Travels",
  "Ram Dalal Holidays",
  "Kissan Travels",
  "Neeta Travels",
  "Sharma Travels"
];

export default function TopOperators() {
  const [operators, setOperators] = useState([]);

  useEffect(() => {
    import("../data/operators.json").then((data) => {
      const all = data.default || data;
      setOperators(all.filter(op => TOP_OPERATOR_NAMES.includes(op.name)));
    });
  }, []);

  return (
    <section className="my-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Top Bus Operators</h2>
      <div className="flex gap-3 sm:gap-6 overflow-x-auto px-2 scrollbar-hide">
        {operators.map((op) => (
          <div
            key={op.name}
            className="min-w-[160px] sm:min-w-[220px] max-w-xs bg-white rounded-lg shadow p-3 sm:p-4 flex flex-col items-center transition-transform duration-300 hover:scale-105"
          >
            <img
              src={`/images/${op.name.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "")}-logo.png`}
              alt={op.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border bg-white mb-2"
              onError={e => { e.target.onerror = null; e.target.src = defaultLogo; }}
            />
            <div className="font-semibold text-base sm:text-lg text-center">{op.name}</div>
            <div className="text-yellow-500 text-sm sm:text-base">★ {op.rating}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 