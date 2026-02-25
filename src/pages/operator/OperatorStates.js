import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { operatorCityAPI } from '../../services/operatorApi';
import OperatorSidebar from '../../components/operator/OperatorSidebar';
import OperatorHeader from '../../components/operator/OperatorHeader';
import './OperatorStates.css';

export default function OperatorStates() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stateName, setStateName] = useState('');

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await operatorCityAPI.getStates();
      setStates(response.data?.states || []);
    } catch (error) {
      console.error('Error fetching states:', error);
      toast.error('Failed to fetch states');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await operatorCityAPI.addState(stateName.trim());
      if (response.data.success) {
        toast.success('State added successfully!');
        setShowAddModal(false);
        setStateName('');
        fetchStates();
      }
    } catch (error) {
      console.error('Error adding state:', error);
      toast.error(error.response?.data?.message || 'Failed to add state');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="operator-layout">
      <OperatorSidebar />
      <div className="operator-main">
        <OperatorHeader title="Manage States" />
        <div className="operator-content">
          <div className="operator-states-header">
            <button
              className="operator-btn-add"
              onClick={() => setShowAddModal(true)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New State
            </button>
          </div>

          {loading ? (
            <div className="operator-loading">Loading states...</div>
          ) : states.length === 0 ? (
            <div className="operator-empty-state">
              <h3>No States Added Yet</h3>
              <p>Add your first state to get started</p>
            </div>
          ) : (
            <div className="operator-states-grid">
              {states.map((state) => (
                <div key={state.id} className="operator-state-card">
                  <div className="operator-state-info">
                    <h3>{state.name}</h3>
                    <p className="operator-state-cities">
                      {state.cities?.length || 0} {state.cities?.length === 1 ? 'city' : 'cities'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add State Modal */}
          {showAddModal && (
            <div className="operator-modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="operator-modal" onClick={(e) => e.stopPropagation()}>
                <div className="operator-modal-header">
                  <h2>Add New State</h2>
                  <button
                    className="operator-modal-close"
                    onClick={() => setShowAddModal(false)}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="operator-form">
                  <div className="operator-form-group">
                    <label>State Name</label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="Enter state name"
                      required
                    />
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
                      {submitting ? 'Adding...' : 'Add State'}
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
