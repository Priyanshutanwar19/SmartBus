import React, { useState } from 'react';

export default function ManageBooking() {
  const [pnr, setPnr] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFindBooking = (e) => {
    e.preventDefault();
    if (pnr && email) {
      // Simulate API call
      setMessage(`Booking details for PNR ${pnr} have been sent to ${email}. Please check your inbox.`);
    } else {
      setMessage('Please enter both PNR Number and Email.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Manage Your Booking</h2>
      <p className="text-center text-gray-500 mb-8">Enter your PNR number and email address to view your ticket details.</p>
      <form onSubmit={handleFindBooking}>
        <div className="mb-4">
          <label htmlFor="pnr" className="block text-gray-700 font-medium mb-2">PNR Number</label>
          <input
            type="text"
            id="pnr"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., SB123456"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Find Booking
        </button>
      </form>
      {message && (
        <div className="mt-6 p-4 text-center text-sm rounded-lg bg-blue-50 text-blue-800">
          {message}
        </div>
      )}
    </div>
  );
} 