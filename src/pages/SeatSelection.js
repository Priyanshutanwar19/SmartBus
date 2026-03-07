import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import bookingsAPI from "../services/bookingsApi";
import { getSocket, disconnectSocket } from "../services/socket";

export default function SeatSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bus, from, to, date, scheduleId } = state || {};
  const [selected, setSelected] = useState([]);
  const [seats, setSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState({ rows: 0, cols: 0 });
  const [loading, setLoading] = useState(true);
  const [baseFare, setBaseFare] = useState(0);

  // Ref for debouncing seat selections
  const debounceTimerRef = React.useRef(null);
  const pendingAddedSeatsRef = React.useRef([]);

  // Keep a ref of the selected seats so the debounce timeout can access the latest state
  const selectedRef = React.useRef(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  // Fetch seat plan from backend
  const fetchSeatPlan = React.useCallback(async () => {
    if (!scheduleId) {
      toast.error("Schedule ID is missing");
      navigate(-1);
      return;
    }
    try {
      setLoading(true);
      const response = await bookingsAPI.getSeatPlan(scheduleId);
      const seatPlan = response.seatPlan || {};
      const { seats: seatData, rows, cols, basePrice, busNumber, busModel, busType, route } = seatPlan;
      const mappedSeats = (seatData || []).map(seat => ({
        ...seat,
        isBooked: seat.status === 'BOOKED' || seat.status === 'LOCKED',
      }));
      setSeats(mappedSeats);
      setSeatLayout({ rows, cols });
      setBaseFare(basePrice || bus?.price || 0);
    } catch (error) {
      console.error("Error fetching seat plan:", error);
      toast.error(error.message || "Failed to load seat plan");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [scheduleId, navigate, bus]);

  useEffect(() => {
    fetchSeatPlan();
  }, [fetchSeatPlan]);

  // Socket connection and event listeners
  useEffect(() => {
    if (!scheduleId) return;

    const socket = getSocket();
    socket.connect(); // Actually trigger connect ifautoConnect is false
    socket.emit("joinScheduleRoom", scheduleId);

    const handleSeatLocked = (data) => {
      // { seatNumber, userId }
      setSeats(prevSeats =>
        prevSeats.map(seat =>
          seat.seatNumber === data.seatNumber
            ? { ...seat, isBooked: true, lockedBySessionId: data.userId }
            : seat
        )
      );
    };

    const handleSeatUnlocked = (data) => {
      // { seatNumber }
      setSeats(prevSeats =>
        prevSeats.map(seat =>
          seat.seatNumber === data.seatNumber
            ? { ...seat, isBooked: false, lockedBySessionId: null }
            : seat
        )
      );
    };

    socket.on("seatLockedBroadcast", handleSeatLocked);
    socket.on("seatUnlockedBroadcast", handleSeatUnlocked);

    return () => {
      socket.off("seatLockedBroadcast", handleSeatLocked);
      socket.off("seatUnlockedBroadcast", handleSeatUnlocked);
    };
  }, [scheduleId]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate fare
  const fare = selected.reduce((sum, seatNumber) => {
    const seat = seats.find(s => s.seatNumber === seatNumber);
    return sum + (seat ? baseFare : 0);
  }, 0);

  function handleSeatClick(seat) {
    if (seat.isBooked) return;
    let newSelected;
    if (selected.includes(seat.seatNumber)) {
      newSelected = selected.filter(num => num !== seat.seatNumber);
    } else {
      newSelected = [...selected, seat.seatNumber];
    }
    setSelected(newSelected);

    // Debounce the lock request
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only emit lock event if we are actually adding seats
    // We send only the newly added seats to the backend to avoid "already locked" errors
    if (!selected.includes(seat.seatNumber)) {
      if (!pendingAddedSeatsRef.current.includes(seat.seatNumber)) {
        pendingAddedSeatsRef.current.push(seat.seatNumber);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        const seatsToLock = [...pendingAddedSeatsRef.current];
        pendingAddedSeatsRef.current = []; // Reset for the next batch
        
        if (seatsToLock.length > 0) {
          const socket = getSocket();
          socket.emit("lockSeatRequest", { scheduleId, seatNumbers: seatsToLock }, (response) => {
             if (response.success) {
               toast.success('Seats locked for 5 minutes');
               // We rely on the broadcast events to update the UI
             } else {
               toast.error(response.error || 'Failed to lock seats');
             }
          });
        }
      }, 500); // 500ms debounce
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto my-8 bg-white rounded shadow p-6">
        <div className="text-center py-10">
          <div className="text-xl font-semibold">Loading seat plan...</div>
        </div>
      </div>
    );
  }

  if (!seats || seats.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-8 bg-white rounded shadow p-6">
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-gray-700">No seats available</h3>
          <button
            className="mt-4 bg-blue-600 text-white rounded px-6 py-2 font-semibold hover:bg-blue-700 transition"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Select Your Seat</h2>
      <div className="text-gray-600 mb-4">{from} → {to} on {date}</div>
      <div className="text-sm text-gray-500 mb-6">
        {bus?.operator} • {bus?.busNumber} • {bus?.busType}
      </div>

      <div className="mb-6">
        <div className="grid gap-2 w-fit mx-auto" style={{ gridTemplateColumns: `repeat(${seatLayout.cols || 4}, minmax(0, 1fr))` }}>
          {seats.map(seat => (
            <button
              key={seat.seatNumber}
              className={`h-10 w-10 rounded border text-xs font-bold ${seat.isBooked
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : selected.includes(seat.seatNumber)
                    ? "bg-green-500 text-white"
                    : "bg-blue-200 hover:bg-blue-300"
                }`}
              disabled={seat.isBooked}
              onClick={() => handleSeatClick(seat)}
              title={`Seat ${seat.seatNumber}${seat.isBooked ? ' (Booked)' : ''}`}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 border rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 border rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 border rounded"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="font-bold text-lg">Selected Seats: {selected.length > 0 ? selected.join(', ') : 'None'}</div>
        <div className="font-bold text-xl text-green-600">Total Fare: ₹{fare}</div>
      </div>

      <div className="flex gap-4">
        <button
          className="bg-gray-500 text-white rounded px-6 py-2 font-semibold hover:bg-gray-600 transition"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="bg-blue-600 text-white rounded px-6 py-2 font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={selected.length === 0}
          onClick={() => navigate("/passenger", { state: { ...state, selected, fare, scheduleId } })}
        >
          Proceed ({selected.length} seat{selected.length !== 1 ? 's' : ''})
        </button>
      </div>
    </div>
  );
} 