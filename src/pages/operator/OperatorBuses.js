import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { operatorBusAPI } from '../../services/operatorApi';
import OperatorSidebar from '../../components/operator/OperatorSidebar';
import OperatorHeader from '../../components/operator/OperatorHeader';
import './OperatorBuses.css';

export default function OperatorBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    model: '',
    totalSeats: '',
    type: 'AC', // AC or Non-AC
    features: '',
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await operatorBusAPI.getBuses();
      setBuses(response.data?.buses || []);
    } catch (error) {
      console.error('Error fetching buses:', error);
      toast.error('Failed to fetch buses');
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
      const busData = {
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
      };

      const response = await operatorBusAPI.addBus(busData);
      if (response.data.success) {
        toast.success('Bus added successfully!');
        setShowAddModal(false);
        setFormData({
          registrationNumber: '',
          model: '',
          totalSeats: '',
          type: 'AC',
          features: '',
        });
        fetchBuses();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add bus');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        const response = await operatorBusAPI.removeBus(busId);
        if (response.data.success) {
          toast.success('Bus deleted successfully!');
          fetchBuses();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete bus');
      }
    }
  };

  return (
    <div className="operator-layout">
      <OperatorSidebar />
      <div className="operator-main">
        <OperatorHeader title="Manage Buses" />
        <div className="operator-content">
          <div className="operator-buses-header">
            <button
              className="operator-btn-add"
              onClick={() => setShowAddModal(true)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Bus
            </button>
          </div>

          {loading ? (
            <div className="operator-loading">Loading buses...</div>
          ) : buses.length === 0 ? (
            <div className="operator-empty-state">
              <h3>No Buses Added Yet</h3>
              <p>Add your first bus to get started</p>
            </div>
          ) : (
            <div className="operator-buses-grid">
              {buses.map((bus) => (
                <div key={bus.id} className="operator-bus-card">
                  <div className="operator-bus-header">
                    <h3>{bus.model}</h3>
                    <span className={`operator-bus-type ${bus.type?.toLowerCase()}`}>
                      {bus.type}
                    </span>
                  </div>
                  <div className="operator-bus-details">
                    <div className="operator-bus-detail">
                      <span className="label">Registration:</span>
                      <span className="value">{bus.registrationNumber}</span>
                    </div>
                    <div className="operator-bus-detail">
                      <span className="label">Total Seats:</span>
                      <span className="value">{bus.totalSeats}</span>
                    </div>
                    {bus.features && (
                      <div className="operator-bus-detail">
                        <span className="label">Features:</span>
                        <span className="value">{bus.features}</span>
                      </div>
                    )}
                  </div>
                  <button
                    className="operator-delete-btn"
                    onClick={() => handleDeleteBus(bus.id)}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Bus Modal */}
          {showAddModal && (
            <div className="operator-modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="operator-modal" onClick={(e) => e.stopPropagation()}>
                <div className="operator-modal-header">
                  <h2>Add New Bus</h2>
                  <button
                    className="operator-modal-close"
                    onClick={() => setShowAddModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="operator-modal-form">
                  <div className="operator-form-group">
                    <label>Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="e.g., KA-01-AB-1234"
                      required
                    />
                  </div>

                  <div className="operator-form-group">
                    <label>Bus Model</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g., Volvo B9R"
                      required
                    />
                  </div>

                  <div className="operator-form-row">
                    <div className="operator-form-group">
                      <label>Total Seats</label>
                      <input
                        type="number"
                        name="totalSeats"
                        value={formData.totalSeats}
                        onChange={handleChange}
                        placeholder="e.g., 48"
                        min="1"
                        required
                      />
                    </div>

                    <div className="operator-form-group">
                      <label>Bus Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                      </select>
                    </div>
                  </div>

                  <div className="operator-form-group">
                    <label>Features (Optional)</label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleChange}
                      placeholder="e.g., WiFi, Charging Ports, Reading Lights"
                      rows="3"
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
                      {submitting ? 'Adding...' : 'Add Bus'}
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
