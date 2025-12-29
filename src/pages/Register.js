import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('${API}/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    .register-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #e6f8ed, #d0f1d8);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem 1rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .form-container {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 10px 28px rgba(0, 120, 50, 0.12);
      max-width: 420px;
      width: 100%;
      padding: 2.4rem 2.2rem 3rem 2.2rem;
    }
    h2 {
      color: #2d5a27;
      text-align: center;
      margin-bottom: 1.8rem;
      font-weight: 700;
      font-size: 1.8rem;
    }
    label {
      display: block;
      font-weight: 600;
      color: #24682e;
      margin-bottom: 0.5rem;
      user-select: none;
    }
    input {
      width: 100%;
      padding: 12px 14px;
      margin-bottom: 1.4rem;
      border-radius: 10px;
      border: 1.8px solid #a9d5a4;
      font-size: 1rem;
      transition: border-color 0.25s ease;
    }
    input:focus {
      border-color: #29ab55;
      outline: none;
      box-shadow: 0 0 8px #4fcc6eaa;
    }
    .error-message {
      color: #dc3545;
      font-weight: 600;
      margin-bottom: 1rem;
      text-align: center;
    }
    button {
      width: 100%;
      background: #28a745;
      color: white;
      border: none;
      padding: 14px 0;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 16px #22863aaa;
      transition: background 0.3s ease, transform 0.2s ease;
      user-select: none;
    }
    button:disabled {
      background: #8dd498;
      cursor: not-allowed;
      box-shadow: none;
    }
    button:hover:not(:disabled) {
      background: #218838;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px #1b6b2fbb;
    }
    .login-link {
      margin-top: 1.2rem;
      text-align: center;
      color: #3c8037;
      font-weight: 600;
    }
    .login-link a {
      color: #1d5e16;
      text-decoration: none;
      font-weight: 700;
    }
    .login-link a:hover {
      text-decoration: underline;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="register-container">
        <div className="form-container" role="form" aria-label="Register form">
          <h2>Join PlantShop</h2>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="name">Full Name</label>
            <input 
              id="name"
              type="text" 
              name="name" 
              placeholder="Enter your full name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              autoComplete="name"
            />

            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              autoComplete="email"
            />

            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              name="password" 
              placeholder="Create a password" 
              minLength={6}
              value={formData.password} 
              onChange={handleChange} 
              required 
              autoComplete="new-password"
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm your password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
              autoComplete="new-password"
            />

            {error && <div className="error-message" role="alert">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          <p className="login-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
