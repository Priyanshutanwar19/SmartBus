import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header({ onHelpClick }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-blue-100 text-blue-700";
  const inactiveLinkClasses = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2" title="Go to Homepage">
          <img src="/images/smartbus-logo.png" alt="SmartBus Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-blue-700">SmartBus</span>
        </Link>
        
        {/* Center: Slogan - Hidden on mobile */}
        <div className="hidden md:block text-gray-500 font-semibold italic">
          Connecting Every Corner of India
        </div>

        {/* Right: Desktop Nav Links */}
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

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? activeLinkClasses : inactiveLinkClasses}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/manage-booking" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/manage-booking' ? activeLinkClasses : inactiveLinkClasses}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Manage Booking
            </Link>
            <button 
              onClick={() => {
                onHelpClick();
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${inactiveLinkClasses}`}
            >
              Help
            </button>
          </div>
        </div>
      )}
    </header>
  );
} 