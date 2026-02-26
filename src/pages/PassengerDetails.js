import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PassengerDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [paymentOption, setPaymentOption] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  function validate() {
    return "";
  }

  function handleApplyCoupon(e) {
    e.preventDefault();
    setCouponError("");
    
    // The offer specifically for the selected bus
    const validOffer = state?.bus?.offer;

    // Check if the bus even has an offer
    if (!validOffer) {
      return setCouponError("No coupon available for this bus.");
    }

    // Check if the entered coupon matches the bus's specific offer
    if (coupon.trim().toLowerCase() !== validOffer.code.toLowerCase()) {
      return setCouponError("Invalid coupon code for this bus.");
    }
    
    const currentFare = state?.fare || 0;
    if (currentFare < validOffer.minFare) {
      return setCouponError(`Minimum fare for this offer is ₹${validOffer.minFare}.`);
    }
    
    setApplied(validOffer);
  }

  function getFinalFare() {
    const currentFare = state?.fare || 0;
    if (!applied) return currentFare;
    let discount = 0;
    if (applied.type === "flat" && currentFare >= applied.minFare) discount = applied.value;
    if (applied.type === "percent" && currentFare >= applied.minFare) discount = Math.min(Math.round(currentFare * applied.value / 100), applied.code === "SAVE20" ? 100 : 50);
    return Math.max(currentFare - discount, 0);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!paymentOption) {
      setError("Please select a payment option.");
      return;
    }
    setBookingLoading(true);
    setBookingMessage("");
    // Prepare booking payload
    const bookingPayload = {
      scheduleId: state?.scheduleId,
      seatNumbers: state?.selected,
      totalPrice: getFinalFare(),
      paymentOption,
      status: 'CONFIRMED', // Use correct enum value
    };
    import("../services/bookingsApi").then(({ bookingsAPI }) => {
      bookingsAPI.createBooking(bookingPayload)
        .then(response => {
          if (response.success) {
            if (paymentOption === "PAY_LATER") {
              setBookingMessage("Booking created! Please pay within 2 hours or your booking will be cancelled automatically.");
            } else {
              setBookingMessage("Booking created! Proceed to payment.");
            }
            // Navigate to ticket summary
            const pnr = response.pnr || `SB${Math.floor(100000 + Math.random() * 900000)}`;
            navigate("/ticket", { state: { ...state, appliedCoupon: applied, finalFare: getFinalFare(), pnr, paymentOption } });
          } else {
            setError(response.message || "Booking failed.");
          }
        })
        .catch(err => {
          setError(err.message || "Booking failed.");
        })
        .finally(() => setBookingLoading(false));
    });
  }

  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="font-semibold mb-2">Choose Payment Option</div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded font-semibold border ${paymentOption === "PAY_NOW" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-600"}`}
                      onClick={() => setPaymentOption("PAY_NOW")}
                      disabled={bookingLoading}
                    >
                      Book & Pay Now
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded font-semibold border ${paymentOption === "PAY_LATER" ? "bg-green-600 text-white" : "bg-white text-green-600 border-green-600"}`}
                      onClick={() => setPaymentOption("PAY_LATER")}
                      disabled={bookingLoading}
                    >
                      Book Now, Pay Later
                    </button>
                  </div>
                  {paymentOption === "PAY_LATER" && (
                    <div className="mt-2 text-yellow-700 font-medium">Pay within 2 hours or booking will be cancelled automatically.</div>
                  )}
                </div>
        <div className="border-t pt-4 mt-4">
          <div className="font-semibold mb-2">Apply Coupon</div>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 border rounded p-2"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              disabled={!!applied}
            />
            <button
              className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
              onClick={handleApplyCoupon}
              disabled={!!applied}
              type="button"
            >
              {applied ? "Applied" : "Apply"}
            </button>
          </div>
          {applied && <div className="text-green-700 mb-2">Offer {applied.code} applied! {applied.desc}</div>}
          {couponError && <div className="text-red-600 mb-2">{couponError}</div>}
          <div className="font-bold text-lg mb-2">Total Fare: ₹{getFinalFare()} {applied && <span className="text-green-700 text-base">(Saved ₹{(state?.fare || 0) - getFinalFare()})</span>}</div>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700 transition" type="submit" disabled={bookingLoading}>
          {bookingLoading ? "Booking..." : "Book Ticket"}
        </button>
        {bookingMessage && <div className="text-green-700 text-sm mt-2">{bookingMessage}</div>}
      </form>
    </div>
  );
} 