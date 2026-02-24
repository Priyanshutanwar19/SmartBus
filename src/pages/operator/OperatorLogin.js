import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { operatorAuthAPI } from '../../services/operatorApi';
import './OperatorLogin.css';

export default function OperatorLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await operatorAuthAPI.login(loginForm.email, loginForm.password);
      
      if (response.data.success) {
        localStorage.setItem('operatorToken', response.data.token);
        localStorage.setItem('operatorUser', JSON.stringify(response.data.user));
        toast.success('Login successful!');
        navigate('/operator/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="operator-login-container">
      <div className="operator-login-card">
        <div className="operator-login-header">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h1>SmartBus Operator Portal</h1>
          <p>Login to manage your buses and schedules</p>
        </div>

        <form onSubmit={handleLogin} className="operator-login-form">
          <div className="operator-form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="operator-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="operator-login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="operator-login-footer">
          <p className="operator-help-text">
            Don't have an account? Contact your system administrator to create an operator account.
          </p>
        </div>
      </div>
    </div>
  );
}
