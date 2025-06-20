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

function App() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-screen flex flex-col">
        <Header onHelpClick={() => setIsSupportOpen(true)} />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:busId" element={<SeatSelection />} />
            <Route path="/passenger" element={<PassengerDetails />} />
            <Route path="/ticket" element={<TicketSummary />} />
            <Route path="/manage-booking" element={<ManageBooking />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
        <SupportButton isOpen={isSupportOpen} setIsOpen={setIsSupportOpen} />
      </div>
    </BrowserRouter>
  );
}

export default App;
