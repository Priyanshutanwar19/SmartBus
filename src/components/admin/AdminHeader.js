import React from 'react';
import './AdminHeader.css';

export default function AdminHeader({ title }) {
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <div className="admin-header">
      <h1>{title}</h1>
      <div className="admin-header-user">
        <div className="admin-user-info">
          <span className="admin-user-name">{adminUser.name || 'Admin'}</span>
          <span className="admin-user-role">{adminUser.role || 'ADMIN'}</span>
        </div>
        <div className="admin-user-avatar">
          {adminUser.imageUrl ? (
            <img src={adminUser.imageUrl} alt={adminUser.name} />
          ) : (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
