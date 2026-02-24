import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OperatorProtectedRoute({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('operatorToken');
  const user = localStorage.getItem('operatorUser');

  React.useEffect(() => {
    if (!token || !user) {
      navigate('/operator/login');
    }
  }, [token, user, navigate]);

  if (!token || !user) {
    return null;
  }

  return children;
}
