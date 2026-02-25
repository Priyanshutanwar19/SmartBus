import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { operatorRouteAPI, operatorCityAPI } from '../../services/operatorApi';
import OperatorSidebar from '../../components/operator/OperatorSidebar';
import OperatorHeader from '../../components/operator/OperatorHeader';
import './OperatorRoutes.css';

export default function OperatorRoutes() {
  const [routes, setRoutes] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cityAId: '',
    cityBId: '',
    distanceKm: '',
    durationMinutes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [routesRes, citiesRes] = await Promise.all([
        operatorRouteAPI.getRoutes(),
        operatorCityAPI.getCities(),
      ]);
      setRoutes(routesRes.data?.routes || []);
      setCities(citiesRes.data?.cities || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
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
      const routeData = {
        cityAId: parseInt(formData.cityAId),
        cityBId: parseInt(formData.cityBId),
        distanceKm: parseFloat(formData.distanceKm),
        durationMinutes: parseInt(formData.durationMinutes),
      };

      const response = await operatorRouteAPI.addRoute(routeData);
      if (response.data.success) {
        toast.success('Route added successfully!');
        setShowAddModal(false);
        setFormData({
          cityAId: '',
          cityBId: '',
          distanceKm: '',
          durationMinutes: '',
        });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add route');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="operator-layout">
      <OperatorSidebar />
      <div className="operator-main">
        <OperatorHeader title="Manage Routes" />
        <div className="operator-content">
          <div className="operator-routes-header">
            <button
              className="operator-btn-add"
              onClick={() => setShowAddModal(true)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Route
            </button>
          </div>

          {loading ? (
            <div className="operator-loading">Loading routes...</div>
          ) : routes.length === 0 ? (
            <div className="operator-empty-state">
              <h3>No Routes Added Yet</h3>
              <p>Create your first route to get started</p>
            </div>
          ) : (
            <div className="operator-routes-list">
              {routes.map((route) => (
                <div key={route.id} className="operator-route-card">
                  <div className="operator-route-header">
                    <h3>{route.cityA} ↔ {route.cityB}</h3>
                  </div>
                  <div className="operator-route-content">
                    <div className="operator-route-path">
                      <div className="operator-route-city">
                        <div className="operator-city-dot"></div>
                        <div>
                          <div className="operator-city-label">Start</div>
                          <div className="operator-city-name">{route.cityA}</div>
                        </div>
                      </div>
                      <div className="operator-route-line">
                        <div className="operator-route-distance">{route.distanceKm} km</div>
                      </div>
                      <div className="operator-route-city">
                        <div className="operator-city-dot"></div>
                        <div>
                          <div className="operator-city-label">End</div>
                          <div className="operator-city-name">{route.cityB}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="operator-route-details">
                    <div className="operator-route-detail">
                      <span className="label">Duration:</span>
                      <span className="value">{route.estimatedDuration ? `${route.estimatedDuration} min` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Route Modal */}
          {showAddModal && (
            <div className="operator-modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="operator-modal" onClick={(e) => e.stopPropagation()}>
                <div className="operator-modal-header">
                  <h2>Add New Route</h2>
                  <button
                    className="operator-modal-close"
                    onClick={() => setShowAddModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="operator-modal-form">
                  <div className="operator-form-row">
                    <div className="operator-form-group">
                      <label>Start City</label>
                      <select
                        name="cityAId"
                        value={formData.cityAId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Start City</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="operator-form-group">
                      <label>End City</label>
                      <select
                        name="cityBId"
                        value={formData.cityBId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select End City</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="operator-form-row">
                    <div className="operator-form-group">
                      <label>Distance (km)</label>
                      <input
                        type="number"
                        name="distanceKm"
                        value={formData.distanceKm}
                        onChange={handleChange}
                        placeholder="e.g., 120"
                        step="0.1"
                        min="0"
                        required
                      />
                    </div>

                    <div className="operator-form-group">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        name="durationMinutes"
                        value={formData.durationMinutes}
                        onChange={handleChange}
                        placeholder="e.g., 150"
                        min="0"
                        required
                      />
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
                      {submitting ? 'Adding...' : 'Add Route'}
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
