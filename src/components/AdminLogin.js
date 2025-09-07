import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUsername,
  selectPassword,
  selectLoginError,
  selectIsLoginLoading,
  setUsername,
  setPassword,
  loginStart,
  loginSuccess,
  loginFailure
} from '../store/slices/adminLoginSlice';
import { userAPI } from '../services/api';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const username = useSelector(selectUsername);
  const password = useSelector(selectPassword);
  const error = useSelector(selectLoginError);
  const isLoading = useSelector(selectIsLoginLoading);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const data = await userAPI.login({
        username,
        password,
      });

      if (data.success) {
        dispatch(loginSuccess());
        onLogin(true);
      } else {
        dispatch(loginFailure('Invalid username or password'));
      }
    } catch (error) {
      dispatch(loginFailure('Login failed. Please try again.'));
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>Admin Login</h2>
          <p>International Sugar Studio and Campus</p>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => dispatch(setUsername(e.target.value))}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => dispatch(setPassword(e.target.value))}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
