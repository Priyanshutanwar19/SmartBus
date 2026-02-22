import React, { useState, useEffect } from 'react';
import { adminUserAPI } from '../../services/adminApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import './AdminUsers.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminUserAPI.getAllUsers();
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const response = await adminUserAPI.deleteUser(id);
      if (response.data.success) {
        alert(response.data.message);
        fetchUsers();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleChangeRole = async (newRole) => {
    try {
      const response = await adminUserAPI.changeUserRole(selectedUser.id, newRole);
      if (response.data.success) {
        alert(response.data.message);
        setShowRoleModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'admin-badge-admin';
      case 'OPERATOR': return 'admin-badge-operator';
      default: return 'admin-badge-user';
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="User Management" />
        <div className="admin-content">
          <div className="admin-filters-section">
            <div className="admin-search-box">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="admin-role-filter">
              {['ALL', 'USER', 'OPERATOR', 'ADMIN'].map(role => (
                <button
                  key={role}
                  className={`admin-filter-btn ${selectedRole === role ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="admin-loading">Loading users...</div>
          ) : (
            <div className="admin-users-table-container">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td className="admin-user-name">{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`admin-role-badge ${getRoleBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="admin-action-buttons">
                            <button
                              className="admin-btn-edit"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRoleModal(true);
                              }}
                              title="Change Role"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              className="admin-btn-delete"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              title="Delete User"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Role Change Modal */}
          {showRoleModal && selectedUser && (
            <div className="admin-modal-overlay" onClick={() => setShowRoleModal(false)}>
              <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Change User Role</h2>
                <p>Select new role for <strong>{selectedUser.name}</strong></p>
                <div className="admin-role-options">
                  {['USER', 'OPERATOR', 'ADMIN'].map(role => (
                    <button
                      key={role}
                      className={`admin-role-option ${selectedUser.role === role ? 'current' : ''}`}
                      onClick={() => handleChangeRole(role)}
                      disabled={selectedUser.role === role}
                    >
                      <span className={`admin-role-badge ${getRoleBadgeClass(role)}`}>
                        {role}
                      </span>
                      {selectedUser.role === role && <span className="admin-current-label">(Current)</span>}
                    </button>
                  ))}
                </div>
                <button className="admin-btn-cancel" onClick={() => setShowRoleModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
