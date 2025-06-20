import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import offers from "../data/offers.json";
import operatorsData from "../data/operators.json";

const operators = operatorsData.default || operatorsData;

const timeSlots = [
  "06:00 AM", "07:30 AM", "09:00 AM", "10:45 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:15 PM", "06:00 PM", "07:45 PM", "09:00 PM", "10:30 PM", "11:45 PM"
];

async function getCoordinates(city) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&country=India&format=json&limit=1`);
    const data = await response.json();
    if (data.length > 0) {
      return { lat: data[0].lat, lon: data[0].lon };
    }
  } catch (error) {
    console.error(`Could not fetch coordinates for ${city}:`, error);
  }
  return null;
}

async function getLiveDistance(fromCity, toCity) {
  const fromCoords = await getCoordinates(fromCity);
  const toCoords = await getCoordinates(toCity);

  if (fromCoords && toCoords) {
    try {
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}?overview=false`);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        return Math.round(data.routes[0].distance / 1000); // convert to km
      }
    } catch (error) {
      console.error('Error fetching distance:', error);
    }
  }
  return 500; // Fallback distance
}

const OPERATOR_PRICE_FACTORS = {
  "Sharma Travels": 3.8,
  "Verma Travels": 3.9,
  "Patel Travels": 3.7,
  "KPN Travels": 4.1,
  "Neeta Travels": 4.2,
  "Parveen Travels": 3.6,
  "VRL Travels": 4.0,
  "Kallada Travels": 3.85,
  "Orange Travels": 4.05,
  "Kesineni Travels": 3.95,
  "Ram Dalal Holidays": 4.3,
  "Vijay Travels": 3.75,
};

function calculateFare(distance, operatorName) {
  const baseRate = 4; // base price per km
  const operatorFactor = OPERATOR_PRICE_FACTORS[operatorName] || baseRate;
  const fare = distance * operatorFactor;
  return Math.round(fare / 10) * 10; // Round to nearest 10
}

function getRandomTime(i) {
  return timeSlots[i % timeSlots.length];
}

function getRandomPrice() {
  return 200 + Math.floor(Math.random() * 800);
}

function addHoursAndMinutes(time, hoursToAdd) {
  // time: "06:00 AM", hoursToAdd: float
  let [h, m] = time.split(":");
  let ampm = m.split(" ")[1];
  m = parseInt(m);
  h = parseInt(h);
  if (h === 12) h = ampm === 'AM' ? 0 : 12; // convert 12 AM/PM to 0/12
  let totalMinutes = h * 60 + m + Math.round(hoursToAdd * 60);
  
  let newH = Math.floor((totalMinutes / 60) % 24);
  let newM = totalMinutes % 60;
  
  let newAmpm = newH >= 12 ? 'PM' : 'AM';
  newH = newH % 12;
  if (newH === 0) newH = 12; // 0 becomes 12 for 12-hour format

  return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")} ${newAmpm}`;
}

export default function BusList({ from, to, date }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDistance() {
      if (from && to) {
        setIsLoading(true);
        const dist = await getLiveDistance(from, to);
        setDistance(dist);
        setIsLoading(false);
      }
    }
    fetchDistance();
  }, [from, to]);

  const buses = useMemo(() => {
    if (!distance) return [];
    return Array.from({ length: 12 }, (_, i) => {
      const op = operators[i % operators.length];
      const offer = offers[Math.floor(Math.random() * offers.length)];
      const depTime = getRandomTime(i);
      const travelHours = distance / 50; // 50 km/h
      const arrTime = addHoursAndMinutes(depTime, travelHours);
      return {
        id: i + 1,
        operator: op.name,
        logo: op.logo,
        time: depTime,
        arrival: arrTime,
        price: calculateFare(distance, op.name),
        offer,
        distance // pass distance to next component
      };
    });
  }, [distance]);

  function handleCopy(code, id) {
    // Check for secure context and clipboard API availability
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopied(id);
          setTimeout(() => setCopied(null), 1200);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
          alert('Failed to copy. Please copy manually.');
        });
    } else {
      // Fallback for insecure contexts (like HTTP on a mobile device)
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";  // Avoid scrolling to bottom
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(id);
        setTimeout(() => setCopied(null), 1200);
      } catch (err) {
        console.error('Fallback: Unable to copy', err);
        alert('Failed to copy. Please copy manually.');
      }
      document.body.removeChild(textArea);
    }
  }

  if (isLoading) {
    return <div className="text-center my-10">Calculating fares based on live distance...</div>;
  }

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Available Buses ({from} → {to} on {date})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Operator</th>
              <th className="p-3 text-left">Departure</th>
              <th className="p-3 text-left">Dropping</th>
              <th className="p-3 text-left">Fare</th>
              <th className="p-3 text-left">Offer</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold flex items-center gap-2">
                  <img
                    src={`/images/${bus.operator.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "")}-logo.png`}
                    alt={bus.operator}
                    className="w-8 h-8 object-contain rounded-full border bg-white"
                    onError={e => { e.target.onerror = null; e.target.src = '/images/bus-default.png'; }}
                    loading="lazy"
                  />
                  {bus.operator}
                </td>
                <td className="p-3">{bus.time}</td>
                <td className="p-3">{bus.arrival}</td>
                <td className="p-3 font-bold">₹{bus.price}</td>
                <td className="p-3 text-green-700 font-medium flex items-center gap-2">
                  {bus.offer ? (
                    <>
                      <span title={bus.offer.desc}>{bus.offer.code}</span>
                      <button
                        className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-200"
                        onClick={() => handleCopy(bus.offer.code, bus.id)}
                        title="Copy coupon"
                      >
                        {copied === bus.id ? "Copied!" : "Copy"}
                      </button>
                    </>
                  ) : "-"}
                </td>
                <td className="p-3">
                  <button
                    className="bg-green-600 text-white rounded px-4 py-2 font-semibold hover:bg-green-700 transition"
                    onClick={() => navigate(`/book/${bus.id}`, { state: { bus, from, to, date } })}
                  >
                    Book Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { calculateFare, getLiveDistance as getDistance }; 