import React, { useEffect, useRef, useState } from "react";

const defaultImage = "/images/destination-default.jpg";
const CARD_WIDTH = 264;
const VISIBLE_CARDS = 4;

export default function PopularDestinations({ onDestinationClick }) {
  const [destinations, setDestinations] = useState([]);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const intervalRef = useRef();
  const resettingRef = useRef(false);

  // Prepare seamless data
  const extendedDestinations = destinations.length > 0
    ? [...destinations, ...destinations.slice(0, VISIBLE_CARDS)]
    : [];

  useEffect(() => {
    import("../data/destinations.json").then((data) => setDestinations(data.default || data));
  }, []);

  useEffect(() => {
    if (destinations.length <= VISIBLE_CARDS) return;
    intervalRef.current = setInterval(() => {
      // Prevent advancing during reset
      if (!resettingRef.current) {
        setIndex(prev => prev + 1);
        setIsTransitioning(true);
      }
    }, 1500);
    return () => clearInterval(intervalRef.current);
  }, [destinations.length]);

  // Handle seamless reset
  useEffect(() => {
    if (destinations.length === 0) return;
    if (index === destinations.length) {
      resettingRef.current = true;
      // After transition ends, reset index to 0 without animation
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
        // Next tick, restore transition for next scroll
        setTimeout(() => {
          setIsTransitioning(true);
          resettingRef.current = false;
        }, 20);
      }, 500); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [index, destinations.length]);

  // Calculate translateX
  const getTranslateX = () => {
    if (extendedDestinations.length <= VISIBLE_CARDS) return 0;
    return index * CARD_WIDTH;
  };

  function handleClick(dest) {
    if (resettingRef.current) return; // Prevent click during reset
    if (onDestinationClick) {
      onDestinationClick(dest.name);
    }
  }

  return (
    <section className="my-8 bg-gradient-to-r from-indigo-50 via-white to-pink-50 rounded-3xl px-2 py-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Popular Destinations</h2>
      <div className="overflow-hidden px-2">
        <div
          className="flex gap-3 sm:gap-6"
          style={{
            width: `${CARD_WIDTH * extendedDestinations.length}px`,
            transform: `translateX(-${getTranslateX()}px)`,
            transition: isTransitioning ? "transform 0.5s" : "none"
          }}
        >
          {extendedDestinations.map((dest, i) => (
            <button
              key={dest.name + i}
              className="w-48 sm:w-60 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl shadow-lg p-3 sm:p-4 flex flex-col items-center border border-transparent focus:outline-none transition transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 duration-300 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-pink-200"
              onClick={() => handleClick(dest)}
              title={`Book bus to ${dest.name}`}
              disabled={resettingRef.current}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl mb-2 border"
                onError={e => e.target.src = defaultImage}
              />
              <div className="font-bold text-lg sm:text-xl mt-2 text-center">{dest.name}</div>
              <div className="text-gray-500 text-xs sm:text-sm text-center">{dest.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
} 