import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import bookingsAPI from "../services/bookingsApi";

export default function MyBookings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all"); // all, upcoming, completed, cancelled
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingsAPI.getMyBookings();

        let fetchedBookings = [];
        if (Array.isArray(response)) {
          fetchedBookings = response;
        } else if (response?.bookings?.data && Array.isArray(response.bookings.data)) {
          fetchedBookings = response.bookings.data;
        } else if (response?.data && Array.isArray(response.data)) {
          fetchedBookings = response.data;
        } else if (response?.bookings && Array.isArray(response.bookings)) {
          fetchedBookings = response.bookings;
        }

        // Map backend fields to frontend expected ones
        const mappedBookings = fetchedBookings.map(b => {
          let derivedStatus = "upcoming";
          const statusStr = (b.status || "upcoming").toUpperCase();
          if (statusStr === "CANCELLED" || statusStr === "CANCELED") {
            derivedStatus = "cancelled";
          } else if (b.departureTime && new Date(b.departureTime) < new Date()) {
            derivedStatus = "completed";
          }
          return {
            ...b,
            uiStatus: derivedStatus
          };
        });

        setBookings(mappedBookings);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const getFilteredBookings = () => {
    if (filter === "all") return bookings;
    return bookings.filter(booking => (booking.uiStatus || booking.status) === filter);
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

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await bookingsAPI.cancelBooking(bookingId);
        const updatedBookings = bookings.map(booking =>
          (booking.id === bookingId || booking._id === bookingId || booking.bookingId === bookingId)
            ? { ...booking, uiStatus: "cancelled", status: "CANCELLED" }
            : booking
        );
        setBookings(updatedBookings);
      } catch (err) {
        console.error("Cancel failed:", err);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  const filteredBookings = getFilteredBookings();

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl max-w-md text-center">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
              className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === tab.key
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
            {filteredBookings.map(booking => {
              const bookingId = booking.id || booking._id || booking.bookingId;
              const busName = booking.busName || booking.busNumber || (booking.bus?.name) || (booking.schedule?.bus?.name) || "Bus Details";
              const seats = booking.seats || booking.seatNumbers || [];
              const totalAmount = booking.totalAmount || booking.totalPrice || booking.amount || 0;
              const date = booking.date || booking.departureTime || booking.journeyDate || new Date().toISOString();

              let time = booking.time || booking.journeyTime;
              if (!time && booking.departureTime) {
                time = new Date(booking.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
              } else if (!time) {
                time = "12:00 PM";
              }

              const fromStr = booking.from || booking.source || (booking.schedule?.route?.source?.name) || "Source";
              const toStr = booking.to || booking.destination || (booking.schedule?.route?.destination?.name) || "Destination";
              const uiStatus = booking.uiStatus || booking.status || "upcoming";

              return (
                <div key={bookingId} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{busName}</h3>
                          {getStatusBadge(uiStatus)}
                        </div>
                        <p className="text-sm text-gray-500">Booking ID: {bookingId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">₹{totalAmount}</p>
                        <p className="text-sm text-gray-500">{seats.length} seat(s)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">From</p>
                        <p className="font-semibold text-gray-900">{fromStr}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">To</p>
                        <p className="font-semibold text-gray-900">{toStr}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Journey Date & Time</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })} • {time}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Seat Numbers</p>
                        <p className="font-semibold text-gray-900">{seats.join(", ")}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                        >
                          View Details
                        </button>
                        {uiStatus === "upcoming" && (
                          <button
                            onClick={() => handleCancelBooking(bookingId)}
                            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        )}
                        {uiStatus === "completed" && (
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
