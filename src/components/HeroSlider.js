import React, { useEffect, useRef, useState } from "react";

const images = [
  "/images/bus1.jpg",
  "/images/city1.jpg",
  "/images/bus2.jpg",
  "/images/city2.jpg"
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  return (
    <div className="relative h-80 md:h-[28rem] flex items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-400 animate-gradient-x">
      <img
        src={images[index]}
        alt="Travel"
        className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-700"
        style={{ zIndex: 1 }}
        onError={e => e.target.style.display = 'none'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
      <div className="relative z-20 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-2xl animate-fade-in">Book Your Next Journey with SmartBus</h1>
        <p className="text-lg md:text-xl text-indigo-200 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>Fast, Safe, and Reliable Online Bus Ticket Booking</p>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Lowest Price Guarantee</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg animate-fade-in" style={{ animationDelay: '600ms' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.76a11.024 11.024 0 006.25 6.25l.76-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="font-semibold">24/7 Customer Support</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg animate-fade-in" style={{ animationDelay: '800ms' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-3 2a5 5 0 00-5 5v1h10v-1a5 5 0 00-5-5zM16 6a3 3 0 11-6 0 3 3 0 016 0zm-3 2a5 5 0 00-4.545 3.003A5.974 5.974 0 0115 13v1h4v-1a5 5 0 00-5-5z" />
            </svg>
            <span className="font-semibold">Millions of Happy Customers</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {images.map((_, i) => (
          <span key={i} className={`w-3 h-3 rounded-full border border-white block ${i === index ? 'bg-white' : 'bg-pink-200'}`} />
        ))}
      </div>
    </div>
  );
} 