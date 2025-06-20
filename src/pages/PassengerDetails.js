import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PassengerDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    gender: ""
  });
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const [couponError, setCouponError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.name || !form.age || !form.email || !form.phone || !form.gender) return "All fields are required.";
    if (!/^\d{10}$/.test(form.phone)) return "Phone must be 10 digits.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email.";
    if (isNaN(form.age) || form.age < 1 || form.age > 120) return "Invalid age.";
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
    const err = validate();
    if (err) return setError(err);
    setError("");
    const pnr = `SB${Math.floor(100000 + Math.random() * 900000)}`;
    navigate("/ticket", { state: { ...state, passenger: form, appliedCoupon: applied, finalFare: getFinalFare(), pnr } });
  }

  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Passenger Details</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Age</label>
          <input name="age" value={form.age} onChange={handleChange} className="w-full border rounded p-2" required type="number" min="1" max="120" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2" required type="email" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded p-2" required type="tel" maxLength="10" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
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
        <button className="w-full bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700 transition" type="submit">Preview Ticket</button>
      </form>
    </div>
  );
} 