import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SeatSelection from "./pages/SeatSelection";
import SupportButton from "./components/SupportButton";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PassengerDetails from "./pages/PassengerDetails";
import TicketSummary from "./pages/TicketSummary";
import ManageBooking from "./pages/ManageBooking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOperators from "./pages/admin/AdminOperators";
import ProtectedRoute from "./components/admin/ProtectedRoute";

function App() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes - No Header/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/operators" element={<ProtectedRoute><AdminOperators /></ProtectedRoute>} />

        {/* Main App Routes - With Header/Footer */}
        <Route
          path="/*"
          element={
            <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen flex flex-col">
              <Header onHelpClick={() => setIsSupportOpen(true)} />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/book/:busId" element={<SeatSelection />} />
                  <Route path="/passenger" element={<PassengerDetails />} />
                  <Route path="/ticket" element={<TicketSummary />} />
                  <Route path="/manage-booking" element={<ManageBooking />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-bookings" element={<MyBookings />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </div>
              <Footer />
              <SupportButton isOpen={isSupportOpen} setIsOpen={setIsSupportOpen} />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
