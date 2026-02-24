import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './OperatorSidebar.css';

export default function OperatorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const operatorUser = JSON.parse(localStorage.getItem('operatorUser') || '{}');

  const menuItems = [
    { path: '/operator/dashboard', label: 'Dashboard', icon: 'grid' },
    { path: '/operator/buses', label: 'Manage Buses', icon: 'bus' },
    { path: '/operator/routes', label: 'Manage Routes', icon: 'map' },
    { path: '/operator/schedules', label: 'Bus Schedules', icon: 'calendar' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('operatorToken');
    localStorage.removeItem('operatorUser');
    navigate('/operator/login');
  };

  return (
    <div className="operator-sidebar">
      <div className="operator-sidebar-header">
        <div className="operator-logo">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-4m6 4l6-4" />
          </svg>
          <span>SmartBus Operator</span>
        </div>
      </div>

      <nav className="operator-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`operator-menu-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="operator-menu-icon">
              {item.icon === 'grid' && (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
                </svg>
              )}
              {item.icon === 'bus' && (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {item.icon === 'map' && (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l6-6m0 0l6-6m-6 6l-6-6m6 6l6 6M9 7h6m0 0V3m0 4v4" />
                </svg>
              )}
              {item.icon === 'calendar' && (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </span>
            <span className="operator-menu-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="operator-sidebar-footer">
        <div className="operator-user-section">
          <div className="operator-user-name">{operatorUser.name || 'Operator'}</div>
          <div className="operator-user-email">{operatorUser.email || 'operator@example.com'}</div>
        </div>
        <button className="operator-logout-btn" onClick={handleLogout}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
