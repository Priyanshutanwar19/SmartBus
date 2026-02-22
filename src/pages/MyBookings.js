import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function MyBookings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all"); // all, upcoming, completed, cancelled

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(userData));
    
    // Load bookings from localStorage (or fetch from API in real app)
    const savedBookings = localStorage.getItem("userBookings");
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      // Sample bookings for demonstration
      const sampleBookings = [
        {
          id: "BK001",
          busName: "Volvo Multi-Axle",
          from: "Delhi",
          to: "Manali",
          date: "2026-03-10",
          time: "22:00",
          seats: ["A1", "A2"],
          totalAmount: 2400,
          status: "upcoming"
        },
        {
          id: "BK002",
          busName: "Mercedes Sleeper",
          from: "Mumbai",
          to: "Goa",
          date: "2026-02-15",
          time: "20:30",
          seats: ["B3"],
          totalAmount: 1200,
          status: "completed"
        }
      ];
      setBookings(sampleBookings);
      localStorage.setItem("userBookings", JSON.stringify(sampleBookings));
    }
  }, [navigate]);

  const getFilteredBookings = () => {
    if (filter === "all") return bookings;
    return bookings.filter(booking => booking.status === filter);
  };

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.upcoming}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
      );
      setBookings(updatedBookings);
      localStorage.setItem("userBookings", JSON.stringify(updatedBookings));
    }
  };

  const filteredBookings = getFilteredBookings();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your bus ticket bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: "All Bookings" },
            { key: "upcoming", label: "Upcoming" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === tab.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {filter === "all" 
                ? "You haven't made any bookings yet."
                : `You don't have any ${filter} bookings.`}
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
            >
              Search Buses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{booking.busName}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{booking.totalAmount}</p>
                      <p className="text-sm text-gray-500">{booking.seats.length} seat(s)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">From</p>
                      <p className="font-semibold text-gray-900">{booking.from}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">To</p>
                      <p className="font-semibold text-gray-900">{booking.to}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Journey Date & Time</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })} • {booking.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Seat Numbers</p>
                      <p className="font-semibold text-gray-900">{booking.seats.join(", ")}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                      >
                        View Details
                      </button>
                      {booking.status === "upcoming" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      )}
                      {booking.status === "completed" && (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Download Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
