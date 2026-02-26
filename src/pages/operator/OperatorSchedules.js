import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { operatorScheduleAPI, operatorBusAPI, operatorCityAPI } from '../../services/operatorApi';
import OperatorSidebar from '../../components/operator/OperatorSidebar';
import OperatorHeader from '../../components/operator/OperatorHeader';
import './OperatorSchedules.css';

export default function OperatorSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    busId: '',
    fromCityId: '',
    toCityId: '',
    departureTime: '',
    arrivalTime: '',
    basePrice: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schedulesRes, busesRes, citiesRes] = await Promise.all([
        operatorScheduleAPI.getSchedules(),
        operatorBusAPI.getBuses(),
        operatorCityAPI.getCities(),
      ]);

      setSchedules(schedulesRes.data?.schedules || []);
      setBuses(busesRes.data?.buses?.buses || []);
      setCities(citiesRes.data?.cities || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const scheduleData = {
        busId: parseInt(formData.busId),
        fromCityId: parseInt(formData.fromCityId),
        toCityId: parseInt(formData.toCityId),
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        basePrice: parseFloat(formData.basePrice),
      };

      const response = await operatorScheduleAPI.addSchedule(scheduleData);
      if (response.data.success) {
        toast.success('Schedule added successfully!');
        setShowAddModal(false);
        setFormData({
          busId: '',
          fromCityId: '',
          toCityId: '',
          departureTime: '',
          arrivalTime: '',
          basePrice: '',
        });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add schedule');
    } finally {
      setSubmitting(false);
    }
  };

  const getBusInfo = (busId) => {
    const bus = buses.find(b => b.busId === busId);
    if (!bus) return { number: 'N/A', model: 'Unknown Bus' };
    return { number: bus.busNumber, model: bus.busModel };
  };

  return (
    <div className="operator-layout">
      <OperatorSidebar />
      <div className="operator-main">
        <OperatorHeader title="Bus Schedules" />
        <div className="operator-content">
          <div className="operator-schedules-header">
            <button
              className="operator-btn-add"
              onClick={() => setShowAddModal(true)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Schedule
            </button>
          </div>

          {loading ? (
            <div className="operator-loading">Loading schedules...</div>
          ) : schedules.length === 0 ? (
            <div className="operator-empty-state">
              <h3>No Schedules Added Yet</h3>
              <p>Create your first schedule to start offering trips</p>
            </div>
          ) : (
            <div className="operator-schedules-table">
              <table>
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Bus</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => {
                    const busInfo = getBusInfo(schedule.busId);
                    return (
                    <tr key={schedule.id}>
                      <td>{schedule.from} → {schedule.to}</td>
                      <td>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{busInfo.model}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{busInfo.number}</div>
                      </td>
                      <td>{new Date(schedule.departureTime).toLocaleString()}</td>
                      <td>{new Date(schedule.arrivalTime).toLocaleString()}</td>
                      <td>₹{schedule.basePrice}</td>
                      <td>
                        <span className={`operator-status ${schedule.status?.toLowerCase()}`}>
                          {schedule.status}
                        </span>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Schedule Modal */}
          {showAddModal && (
            <div className="operator-modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="operator-modal" onClick={(e) => e.stopPropagation()}>
                <div className="operator-modal-header">
                  <h2>Add New Schedule</h2>
                  <button
                    className="operator-modal-close"
                    onClick={() => setShowAddModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="operator-modal-form">
                  <div className="operator-form-group">
                    <label>Select Bus</label>
                    <select
                      name="busId"
                      value={formData.busId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose a bus...</option>
                      {buses.map((bus) => (
                        <option key={bus.busId} value={bus.busId}>
                          {bus.busModel} - {bus.busNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="operator-form-group">
                    <label>From City</label>
                    <select
                      name="fromCityId"
                      value={formData.fromCityId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select departure city...</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="operator-form-group">
                    <label>To City</label>
                    <select
                      name="toCityId"
                      value={formData.toCityId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select arrival city...</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="operator-form-row">
                    <div className="operator-form-group">
                      <label>Departure Time</label>
                      <input
                        type="datetime-local"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="operator-form-group">
                      <label>Arrival Time</label>
                      <input
                        type="datetime-local"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="operator-form-group">
                    <label>Base Price (₹)</label>
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleChange}
                      placeholder="e.g., 500"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="operator-modal-actions">
                    <button
                      type="button"
                      className="operator-btn-cancel"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="operator-btn-save"
                      disabled={submitting}
                    >
                      {submitting ? 'Adding...' : 'Add Schedule'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
