import React from 'react';
import './OperatorHeader.css';

export default function OperatorHeader({ title }) {
  const operatorUser = JSON.parse(localStorage.getItem('operatorUser') || '{}');

  return (
    <div className="operator-header">
      <h1>{title}</h1>
      <div className="operator-header-user">
        <div className="operator-user-info">
          <span className="operator-user-name">{operatorUser.name || 'Operator'}</span>
          <span className="operator-user-role">OPERATOR</span>
        </div>
        <div className="operator-user-avatar">
          {operatorUser.imageUrl ? (
            <img src={operatorUser.imageUrl} alt={operatorUser.name} />
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
