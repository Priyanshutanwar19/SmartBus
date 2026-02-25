import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { operatorCityAPI } from '../../services/operatorApi';
import OperatorSidebar from '../../components/operator/OperatorSidebar';
import OperatorHeader from '../../components/operator/OperatorHeader';
import './OperatorCities.css';

export default function OperatorCities() {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cityName: '',
    stateId: '',
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [citiesRes, statesRes] = await Promise.all([
        operatorCityAPI.getCities(),
        operatorCityAPI.getStates(),
      ]);
      setCities(citiesRes.data?.cities || []);
      setStates(statesRes.data?.states || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch cities and states');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('cityName', formData.cityName);
      formDataToSend.append('stateId', formData.stateId);
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await operatorCityAPI.addCity(formDataToSend);
      if (response.data.success) {
        toast.success('City added successfully!');
        setShowAddModal(false);
        setFormData({ cityName: '', stateId: '' });
        setImage(null);
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add city');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="operator-layout">
      <OperatorSidebar />
      <div className="operator-main">
        <OperatorHeader title="Manage Cities" />
        <div className="operator-content">
          <div className="operator-cities-header">
            <button
              className="operator-btn-add"
              onClick={() => setShowAddModal(true)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New City
            </button>
          </div>

          {loading ? (
            <div className="operator-loading">Loading cities...</div>
          ) : cities.length === 0 ? (
            <div className="operator-empty-state">
              <h3>No Cities Added Yet</h3>
              <p>Add your first city to get started</p>
            </div>
          ) : (
            <div className="operator-cities-grid">
              {cities.map((city) => (
                <div key={city.id} className="operator-city-card">
                  {city.imageUrl && (
                    <img src={city.imageUrl} alt={city.name} className="operator-city-image" />
                  )}
                  <div className="operator-city-info">
                    <h3>{city.name}</h3>
                    <p className="operator-city-state">{city.state || 'N/A'}</p>
                    {city.caption && <p className="operator-city-caption">{city.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add City Modal */}
          {showAddModal && (
            <div className="operator-modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="operator-modal" onClick={(e) => e.stopPropagation()}>
                <div className="operator-modal-header">
                  <h2>Add New City</h2>
                  <button
                    className="operator-modal-close"
                    onClick={() => setShowAddModal(false)}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="operator-form">
                  <div className="operator-form-group">
                    <label>City Name</label>
                    <input
                      type="text"
                      name="cityName"
                      value={formData.cityName}
                      onChange={handleChange}
                      placeholder="Enter city name"
                      required
                    />
                  </div>

                  <div className="operator-form-group">
                    <label>State</label>
                    <select
                      name="stateId"
                      value={formData.stateId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="operator-form-group">
                    <label>City Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {image && <p className="file-name">{image.name}</p>}
                  </div>

                  <div className="operator-form-actions">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="operator-btn-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="operator-btn-submit"
                    >
                      {submitting ? 'Adding...' : 'Add City'}
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
