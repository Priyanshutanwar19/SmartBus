import React, { useState, useRef, useEffect } from "react";
import BusSearchForm from "../components/BusSearchForm";
import PopularDestinations from "../components/PopularDestinations";
import TopOperators from "../components/TopOperators";
import BusList from "../components/BusList";
import HeroSlider from "../components/HeroSlider";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  const [search, setSearch] = useState(null);
  const resultsRef = useRef(null);

  const handleSearch = (params) => {
    setSearch(params);
  };

  const handleDestinationClick = (to) => {
    setSearch({ from: "Delhi", to, date: getToday() });
  };

  useEffect(() => {
    if (search && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [search]);

  return (
    <div>
      <HeroSlider />
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        <BusSearchForm onSearch={handleSearch} />
      </div>
      <div className="max-w-6xl mx-auto px-4">
        {search && (
          <div ref={resultsRef} className="scroll-mt-16">
            <BusList {...search} />
          </div>
        )}
        <PopularDestinations onDestinationClick={handleDestinationClick} />
        <TopOperators />
      </div>
    </div>
  );
} 