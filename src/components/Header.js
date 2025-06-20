import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header({ onHelpClick }) {
  const location = useLocation();

  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-blue-100 text-blue-700";
  const inactiveLinkClasses = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2" title="Go to Homepage">
          <img src="/images/smartbus-logo.png" alt="SmartBus Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-blue-700">SmartBus</span>
        </Link>
        
        {/* Center: Slogan */}
        <div className="hidden md:block text-gray-500 font-semibold italic">
          Connecting Every Corner of India
        </div>

        {/* Right: Nav Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/" 
            className={`${navLinkClasses} ${location.pathname === '/' ? activeLinkClasses : inactiveLinkClasses}`}
          >
            Home
          </Link>
          <Link 
            to="/manage-booking" 
            className={`${navLinkClasses} ${location.pathname === '/manage-booking' ? activeLinkClasses : inactiveLinkClasses}`}
          >
            Manage Booking
          </Link>
          <button 
            onClick={onHelpClick}
            className={`${navLinkClasses} ${inactiveLinkClasses}`}
          >
            Help
          </button>
        </div>
      </nav>
    </header>
  );
} 