import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('${API}/api/auth/login', formData);

      // ✅ Save token + user globally
      login(response.data.user, response.data.token);

      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    .login-page { min-height: 100vh; background: linear-gradient(135deg, #e8f8f1, #c6f1d9);
      display: flex; justify-content: center; align-items: center; padding: 2rem 1rem; font-family: 'Segoe UI', sans-serif; }
    .login-card { background: #fff; padding: 2.8rem 2.4rem; max-width: 400px; width: 100%;
      border-radius: 14px; box-shadow: 0 10px 30px rgba(0, 130, 65, 0.15); }
    .login-title { text-align: center; font-weight: 700; font-size: 1.9rem; color: #2d5a27; margin-bottom: 2rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #24682e; }
    input { width: 100%; padding: 14px 16px; font-size: 1rem; border-radius: 10px; border: 1.8px solid #b7d1b0;
      margin-bottom: 1.6rem; transition: border-color 0.3s ease; }
    input:focus { border-color: #329b5e; box-shadow: 0 0 10px #51c05a88; outline: none; }
    .error-message { text-align: center; font-weight: 600; margin-bottom: 1rem; color: #dc3545; }
    button { width: 100%; background: #28a745; padding: 14px 0; border-radius: 30px; border: none;
      font-size: 1.1rem; font-weight: 700; color: #fff; cursor: pointer; box-shadow: 0 7px 18px #229630cc;
      transition: background 0.3s ease, transform 0.2s ease; }
    button:disabled { background: #8bd598; cursor: not-allowed; box-shadow: none; }
    button:hover:not(:disabled) { background: #218838; transform: translateY(-3px); box-shadow: 0 9px 22px #1b6c29cc; }
    .register-text { text-align: center; margin-top: 1.4rem; font-weight: 600; color: #3e7f37; }
    .register-text a { color: #1d5720; font-weight: 700; text-decoration: none; }
    .register-text a:hover { text-decoration: underline; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">
        <div className="login-card">
          <h2 className="login-title">Login to PlantShop</h2>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" placeholder="Enter your email"
              value={formData.email} onChange={handleChange} required autoComplete="email" />

            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" placeholder="Enter your password"
              value={formData.password} onChange={handleChange} required autoComplete="current-password" />

            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="register-text">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
