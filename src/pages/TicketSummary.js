import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function TicketSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef();

  if (!state || !state.passenger) return <div className="text-center mt-10">No ticket found. Please book a ticket first.</div>;

  const handleDownload = () => {
    setIsDownloading(true);
    setShowPreview(true);

    setTimeout(() => {
      const input = ticketRef.current;
      if (!input) {
        setIsDownloading(false);
        setShowPreview(false);
        return;
      }
      
      const originalShadow = input.style.boxShadow;
      input.style.boxShadow = 'none';

      html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: true,
        width: input.scrollWidth,
        height: input.scrollHeight,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        
        pdf.save(`SmartBus-Ticket-${pnr}.pdf`);
        
        input.style.boxShadow = originalShadow;
        setIsDownloading(false);
        setShowPreview(false);
      });
    }, 300);
  };

  const openPreview = () => {
    setShowPreview(true);
  };

  const { from, to, date, bus, passenger, selected, finalFare, pnr } = state;

  function formatSeatNumbers(selected) {
    if (!selected?.length) return "-";
    return selected.join(", ");
  }

  function TicketPreview({ pnr }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 overflow-y-auto p-4 md:p-8">
        <div className="relative w-full max-w-lg">
          {isDownloading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
              <span className="text-indigo-600 font-semibold">Generating PDF...</span>
            </div>
          )}
          <div ref={ticketRef} className="bg-white rounded-lg shadow-xl p-6 w-full relative overflow-hidden">
            <div className="hidden print:block text-center mb-6">
              <h1 className="text-4xl font-bold text-indigo-700">SmartBus</h1>
              <p className="text-sm text-gray-500">Your Trusted Travel Partner</p>
            </div>
            <img
              src="/images/smartbus-logo.png"
              alt="SmartBus Watermark"
              className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-w-lg opacity-10 z-0"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none select-none absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 w-full text-center z-0"
              aria-hidden="true"
            >
              <span className="text-4xl md:text-6xl font-extrabold tracking-wider text-indigo-400 opacity-10">SmartBus</span>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 print:hidden z-10"
              onClick={() => setShowPreview(false)}
              aria-label="Close"
            >✖</button>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`/images/${bus.operator.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "")}-logo.png`}
                  alt={bus.operator}
                  className="w-16 h-16 object-contain rounded-full border bg-white"
                  onError={e => { e.target.onerror = null; e.target.src = '/images/bus-default.png'; }}
                />
                <div>
                  <div className="font-bold text-xl">{bus?.operator}</div>
                  <div className="text-gray-500 text-sm">PNR: {pnr}</div>
                </div>
              </div>
              <div className="mb-4 border rounded-lg p-4 bg-gray-50 grid grid-cols-2 gap-4">
                <div><span className="font-semibold">From:</span> {from}</div>
                <div><span className="font-semibold">To:</span> {to}</div>
                <div><span className="font-semibold">Date:</span> {date}</div>
                <div><span className="font-semibold">Departure:</span> {bus?.time}</div>
                <div><span className="font-semibold">Seat No.:</span> {formatSeatNumbers(selected)}</div>
                <div><span className="font-semibold">Fare:</span> ₹{finalFare || bus?.price}</div>
              </div>
              <div className="mb-4 border rounded-lg p-4 bg-gray-50">
                <div className="font-semibold mb-1">Passenger Details</div>
                <div>Name: {passenger.name}</div>
                <div>Age: {passenger.age}</div>
                <div>Email: {passenger.email}</div>
                <div>Phone: {passenger.phone}</div>
                <div>Gender: {passenger.gender}</div>
              </div>
              <div className="mb-4 border rounded-lg p-4 bg-gray-50">
                <div className="font-semibold mb-2">Amenities Provided</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-2"><span className="text-green-500">✓</span> WiFi</div>
                  <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Water Bottle</div>
                  <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Blanket</div>
                  <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Charging Point</div>
                  <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Live Tracking</div>
                  <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Emergency SOS</div>
                </div>
              </div>
              <div className="mt-6 text-xs text-gray-500 border-t pt-4">
                <div className="font-bold mb-1">TERMS & CONDITIONS</div>
                <div className="font-semibold mb-1">RESPONSIBILITIES OF THE USERS</div>
                <ul className="list-disc pl-5 mb-2">
                  <li>Users are advised to call the vehicle operator to find out the exact boarding point, or any information which they may need for the purpose of boarding or travel in that trip.</li>
                  <li>At the time of boarding the bus, Users shall furnish a copy of the confirmation booking voucher, and any valid identity proof issued by a government authority.</li>
                  <li>Users are advised to check the booking confirmation SMS or email and re-initiate a booking in case of incorrect details immediately. Any loss, consequences and damages for any delay that may be caused to the User due to this shall be borne by the User.</li>
                </ul>
                <div className="font-semibold mb-1">CANCELLATION OF BOOKING</div>
                <ul className="list-disc pl-5">
                  <li>Cancellation of bookings can be done either through the User's login in the SmartBus website or mobile application, or by calling on the customer care number;</li>
                  <li>Any cancellation is subject to such cancellation charges as mentioned on the booking details.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="max-w-lg mx-auto my-8 bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Your Ticket</h2>
        <div className="mb-4 border-b pb-4">
          <div className="font-semibold">Passenger Details</div>
          <div>Name: {passenger.name}</div>
          <div>Age: {passenger.age}</div>
          <div>Email: {passenger.email}</div>
          <div>Phone: {passenger.phone}</div>
          <div>Gender: {passenger.gender}</div>
        </div>
        <div className="mb-4 border-b pb-4">
          <div className="font-semibold">Journey Details</div>
          <div>PNR: <span className="font-bold">{pnr}</span></div>
          <div>From: {from}</div>
          <div>To: {to}</div>
          <div>Date: {date}</div>
          <div>Operator: {bus?.operator}</div>
          <div>Departure: {bus?.time}</div>
          <div>Seat No.: {formatSeatNumbers(selected)}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold">Fare</div>
          <div>Total: ₹{finalFare || bus?.price}</div>
        </div>
        <button
          className="w-full bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700 transition"
          onClick={openPreview}
        >
          Preview Ticket
        </button>
        <button
          className="w-full mt-2 bg-green-600 text-white rounded p-2 font-semibold hover:bg-green-700 transition flex items-center justify-center"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            'Generating...'
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Ticket
            </>
          )}
        </button>
        <button
          className="w-full mt-2 bg-gray-200 text-gray-700 rounded p-2 font-semibold hover:bg-gray-300 transition"
          onClick={() => navigate("/")}
        >
          Book Another Ticket
        </button>
      </div>
      {showPreview && <TicketPreview pnr={pnr} />}
    </>
  );
} 