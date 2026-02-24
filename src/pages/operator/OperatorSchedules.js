import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { operatorScheduleAPI, operatorBusAPI, operatorRouteAPI } from '../../services/operatorApi';
import OperatorSidebar from '../../components/operator/OperatorSidebar';
import OperatorHeader from '../../components/operator/OperatorHeader';
import './OperatorSchedules.css';

export default function OperatorSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schedulesRes, busesRes, routesRes] = await Promise.all([
        operatorScheduleAPI.getSchedules(),
        operatorBusAPI.getBuses(),
        operatorRouteAPI.getRoutes(),
      ]);

      setSchedules(schedulesRes.data?.schedules || []);
      setBuses(busesRes.data?.buses || []);
      setRoutes(routesRes.data?.routes || []);
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
        ...formData,
        price: parseFloat(formData.price),
      };

      const response = await operatorScheduleAPI.addSchedule(scheduleData);
      if (response.data.success) {
        toast.success('Schedule added successfully!');
        setShowAddModal(false);
        setFormData({
          busId: '',
          routeId: '',
          departureTime: '',
          arrivalTime: '',
          price: '',
          status: 'ACTIVE',
        });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add schedule');
    } finally {
      setSubmitting(false);
    }
  };

  const getRouteName = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    return route ? `${route.startCity} - ${route.endCity}` : 'Unknown Route';
  };

  const getBusModel = (busId) => {
    const bus = buses.find(b => b.id === busId);
    return bus ? bus.model : 'Unknown Bus';
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
                  {schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{getRouteName(schedule.routeId)}</td>
                      <td>{getBusModel(schedule.busId)}</td>
                      <td>{schedule.departureTime}</td>
                      <td>{schedule.arrivalTime}</td>
                      <td>₹{schedule.price}</td>
                      <td>
                        <span className={`operator-status ${schedule.status?.toLowerCase()}`}>
                          {schedule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
                        <option key={bus.id} value={bus.id}>
                          {bus.model} - {bus.registrationNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="operator-form-group">
                    <label>Select Route</label>
                    <select
                      name="routeId"
                      value={formData.routeId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose a route...</option>
                      {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                          {route.routeName} ({route.startCity} - {route.endCity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="operator-form-row">
                    <div className="operator-form-group">
                      <label>Departure Time</label>
                      <input
                        type="time"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="operator-form-group">
                      <label>Arrival Time</label>
                      <input
                        type="time"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="operator-form-row">
                    <div className="operator-form-group">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="e.g., 500"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="operator-form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
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
