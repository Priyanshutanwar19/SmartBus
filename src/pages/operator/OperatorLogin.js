import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { operatorAuthAPI } from '../../services/operatorApi';
import './OperatorLogin.css';

export default function OperatorLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    contactInfo: '',
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await operatorAuthAPI.register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
        registerForm.contactInfo
      );
      
      if (response.data.success) {
        toast.success('Registration successful! Please login.');
        setShowRegister(false);
        setLoginForm({ email: registerForm.email, password: registerForm.password });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="operator-login-container">
      <div className="operator-login-card">
        <div className="operator-login-header">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-4m6 4l6-4" />
          </svg>
          <h1>SmartBus Operator</h1>
          <p>{showRegister ? 'Create Account' : 'Login to Your Account'}</p>
        </div>

        {!showRegister ? (
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
              <div className="operator-password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="operator-password-toggle"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="operator-login-btn">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="operator-login-form">
            <div className="operator-form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="name"
                value={registerForm.name}
                onChange={handleRegisterChange}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="operator-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="operator-form-group">
              <label>Contact Information</label>
              <input
                type="text"
                name="contactInfo"
                value={registerForm.contactInfo}
                onChange={handleRegisterChange}
                placeholder="Enter contact info"
                required
              />
            </div>

            <div className="operator-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="Create a password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="operator-login-btn">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="operator-login-footer">
          <p>
            {showRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setShowRegister(!showRegister)}
              className="operator-toggle-form-btn"
            >
              {showRegister ? 'Login here' : 'Register here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
