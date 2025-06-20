import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const seatTypes = [
  { type: "Regular", priceMultiplier: 1 },
  { type: "Sleeper", priceMultiplier: 1.4 } // Sleeper is 40% more expensive
];

function generateSeats(rows = 5, cols = 4) {
  // 2x2 layout, 20 seats
  let seats = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      seats.push({
        id: r * cols + c + 1,
        type: c < 2 ? "Regular" : "Sleeper",
        booked: Math.random() < 0.2 // 20% seats booked
      });
    }
  }
  return seats;
}

export default function SeatSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bus, from, to, date } = state || {};
  const [selected, setSelected] = useState([]);
  const seats = generateSeats();
  
  const baseFare = bus ? bus.price : 500; // The price is already calculated based on distance

  // Calculate fare
  let fare = selected.reduce((sum, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    const type = seatTypes.find(t => t.type === seat.type);
    return sum + Math.round(baseFare * (type.priceMultiplier || 1));
  }, 0);

  function handleSeatClick(seat) {
    if (seat.booked) return;
    setSelected(sel => sel.includes(seat.id) ? sel.filter(id => id !== seat.id) : [...sel, seat.id]);
  }

  return (
    <div className="max-w-3xl mx-auto my-8 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Select Your Seat ({from} → {to} on {date})</h2>
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2 w-64 mx-auto">
          {seats.map(seat => (
            <button
              key={seat.id}
              className={`h-10 rounded border text-xs font-bold ${seat.booked ? "bg-gray-300 text-gray-500" : selected.includes(seat.id) ? "bg-green-500 text-white" : seat.type === "Sleeper" ? "bg-yellow-200" : "bg-blue-200"}`}
              disabled={seat.booked}
              onClick={() => handleSeatClick(seat)}
            >
              {seat.type[0]}{seat.id}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">Blue: Regular, Yellow: Sleeper, Gray: Booked, Green: Selected</div>
      </div>
      <div className="font-bold text-lg mb-4">Total Fare: ₹{fare}</div>
      <button
        className="bg-blue-600 text-white rounded px-6 py-2 font-semibold hover:bg-blue-700 transition"
        disabled={selected.length === 0}
        onClick={() => navigate("/passenger", { state: { ...state, selected, fare } })}
      >
        Proceed
      </button>
    </div>
  );
} 