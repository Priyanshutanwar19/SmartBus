import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 pb-4 mt-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
        <div>
          <h3 className="font-bold text-lg mb-2">About SmartBus</h3>
          <p className="text-sm text-gray-400">SmartBus is your one-stop platform for booking bus tickets across India. Enjoy real-time seat selection, best offers, and a smooth travel experience.</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Quick Links</h3>
          <ul className="text-sm space-y-1">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
            <li><a href="https://github.com/Priyanshutanwar19" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/priyanshutanwarr/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Contact</h3>
          <ul className="text-sm space-y-1">
            <li>Personal: <a href="mailto:tanwarpriyanshu394@gmail.com" className="text-blue-400 hover:underline">tanwarpriyanshu394@gmail.com</a></li>
            <li>Support: <a href="mailto:support@smartbus.com" className="text-blue-400 hover:underline">support@smartbus.com</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Developed By</h3>
          <div className="text-blue-400 font-semibold">Priyanshu Tanwar</div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between pt-4 text-xs text-gray-500">
        <div>© {new Date().getFullYear()} SmartBus. All rights reserved.</div>
        <div>Developed by <a href="https://www.linkedin.com/in/priyanshutanwarr/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Priyanshu Tanwar</a></div>
      </div>
    </footer>
  );
} 