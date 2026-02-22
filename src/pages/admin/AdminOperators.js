import React, { useState } from 'react';
import { adminOperatorAPI } from '../../services/adminApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import './AdminOperators.css';

export default function AdminOperators() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactInfo: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('contactInfo', formData.contactInfo);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await adminOperatorAPI.addOperator(data);
      if (response.data.success) {
        alert(response.data.message);
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', contactInfo: '' });
        setImageFile(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add operator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Operator Management" />
        <div className="admin-content">
          <div className="admin-operators-header">
            <button 
              className="admin-btn-add-operator"
              onClick={() => setShowAddModal(true)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Operator
            </button>
          </div>

          <div className="admin-info-card">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3>Operator Management</h3>
              <p>Here you can add new bus operators to the system. Operators will receive login credentials and can manage their bus routes.</p>
            </div>
          </div>

          {/* Add Operator Modal */}
          {showAddModal && (
            <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="admin-modal-content admin-modal-large" onClick={(e) => e.stopPropagation()}>
                <h2>Add New Operator</h2>
                <form onSubmit={handleSubmit} className="admin-operator-form">
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label htmlFor="name">Operator Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., RedBus Travels"
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="operator@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label htmlFor="password">Password *</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 6 characters"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="contactInfo">Contact Info</label>
                      <input
                        type="text"
                        id="contactInfo"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleChange}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="image">Operator Logo</label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="admin-file-input"
                    />
                    {imageFile && (
                      <span className="admin-file-name">{imageFile.name}</span>
                    )}
                  </div>

                  <div className="admin-modal-actions">
                    <button
                      type="button"
                      className="admin-btn-cancel"
                      onClick={() => setShowAddModal(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="admin-btn-submit"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Operator'}
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
