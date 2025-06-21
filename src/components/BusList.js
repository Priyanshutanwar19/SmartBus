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
  const [sortBy, setSortBy] = useState('price'); // 'price', 'time', 'operator'
  const [filterOperator, setFilterOperator] = useState('all');

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
    let busList = Array.from({ length: 12 }, (_, i) => {
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

    // Filter by operator
    if (filterOperator !== 'all') {
      busList = busList.filter(bus => bus.operator === filterOperator);
    }

    // Sort buses
    busList.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'time':
          return a.time.localeCompare(b.time);
        case 'operator':
          return a.operator.localeCompare(b.operator);
        default:
          return 0;
      }
    });

    return busList;
  }, [distance, sortBy, filterOperator]);

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
      
      {/* Desktop Controls */}
      <div className="hidden md:flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="price">Price (Low to High)</option>
              <option value="time">Departure Time</option>
              <option value="operator">Operator Name</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter by:</label>
            <select 
              value={filterOperator} 
              onChange={(e) => setFilterOperator(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Operators</option>
              {Array.from(new Set(buses.map(bus => bus.operator))).map(operator => (
                <option key={operator} value={operator}>{operator}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {buses.length} bus{buses.length !== 1 ? 'es' : ''} found
        </div>
      </div>
      
      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {buses.map(bus => (
          <div key={bus.id} className="bg-white rounded-lg shadow-md p-4 border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={`/images/${bus.operator.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "")}-logo.png`}
                  alt={bus.operator}
                  className="w-10 h-10 object-contain rounded-full border bg-white"
                  onError={e => { e.target.onerror = null; e.target.src = '/images/bus-default.png'; }}
                  loading="lazy"
                />
                <div>
                  <div className="font-semibold text-gray-900">{bus.operator}</div>
                  <div className="text-sm text-gray-500">{distance} km</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">₹{bus.price}</div>
                <div className="text-sm text-gray-500">per seat</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">Departure</div>
                <div className="font-semibold">{bus.time}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Arrival</div>
                <div className="font-semibold">{bus.arrival}</div>
              </div>
            </div>
            
            {bus.offer && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-700 font-medium">Special Offer</div>
                    <div className="text-xs text-green-600">{bus.offer.desc}</div>
                  </div>
                  <button
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                    onClick={() => handleCopy(bus.offer.code, bus.id)}
                  >
                    {copied === bus.id ? "Copied!" : bus.offer.code}
                  </button>
                </div>
              </div>
            )}
            
            <button
              className="w-full bg-green-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-green-700 transition"
              onClick={() => navigate(`/book/${bus.id}`, { state: { bus, from, to, date } })}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Operator</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Departure</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Dropping</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Fare</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Offer</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {buses.map((bus, index) => (
              <tr 
                key={bus.id} 
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-md border-l-4 border-l-transparent hover:border-l-blue-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="p-4 font-semibold flex items-center gap-3 group">
                  <div className="relative">
                    <img
                      src={`/images/${bus.operator.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "")}-logo.png`}
                      alt={bus.operator}
                      className="w-10 h-10 object-contain rounded-full border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-300 shadow-sm group-hover:shadow-md"
                      onError={e => { e.target.onerror = null; e.target.src = '/images/bus-default.png'; }}
                      loading="lazy"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <div className="text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{bus.operator}</div>
                    <div className="text-xs text-gray-500">{distance} km • {Math.round(distance/50)}h journey</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-900">{bus.time}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{bus.arrival}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors duration-300">₹{bus.price}</div>
                    <div className="text-xs text-gray-500">per seat</div>
                  </div>
                </td>
                <td className="p-4 text-green-700 font-medium flex items-center gap-2">
                  {bus.offer ? (
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200 hover:bg-green-200 transition-colors duration-300">
                        <span title={bus.offer.desc}>{bus.offer.code}</span>
                      </div>
                      <button
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 border border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-sm flex items-center gap-1"
                        onClick={() => handleCopy(bus.offer.code, bus.id)}
                        title="Copy coupon"
                      >
                        {copied === bus.id ? (
                          <>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-4">
                  <button
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg px-6 py-3 font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 group"
                    onClick={() => navigate(`/book/${bus.id}`, { state: { bus, from, to, date } })}
                  >
                    <span>Book Now</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
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