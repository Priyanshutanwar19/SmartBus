import React, { useEffect, useState } from "react";
import { citiesAPI } from "../services/citiesApi";

// Fallback cities if API fails
const fallbackCities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad", "Mysore", "Tiruchirappalli", "Bareilly", "Aligarh", "Tiruppur", "Gurgaon", "Moradabad", "Jalandhar", "Bhubaneswar", "Salem", "Warangal", "Guntur", "Noida", "Kochi", "Dehradun", "Goa", "Rishikesh"];

export default function CityDropdown({ label, value, onChange }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await citiesAPI.getAllCities();
        if (response.success && response.cities) {
          // Store full city objects with id and name
          const cityList = response.cities.sort((a, b) => a.name.localeCompare(b.name));
          setCities(cityList);
        } else {
          // Use fallback cities (convert to objects)
          setCities(fallbackCities.map((name, index) => ({ id: `fallback-${index}`, name })));
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        // Use fallback cities on error (convert to objects)
        setCities(fallbackCities.map((name, index) => ({ id: `fallback-${index}`, name })));
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <div>
      <label className="text-sm font-medium text-gray-600 block mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <select
          className="w-full bg-white border border-gray-300 rounded-lg p-3 pl-10 text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:border-transparent appearance-none"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={loading}
        >
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city.id} value={city.name}>{city.name}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
           <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
} 