import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { useSelector, useDispatch } from "react-redux";
import { store, persistor } from "./store";
import { selectIsAdminLoggedIn, loginAdmin, logoutAdmin, clearAdminState } from "./store/slices/adminSlice";
import BookingFlow from "./components/BookingFlow";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

function AppRoutes() {
  const isAdminLoggedIn = useSelector(selectIsAdminLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Listen to isAdminLoggedIn and automatically navigate to dashboard
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleAdminLogin = (loginStatus) => {
    if (loginStatus) {
      dispatch(loginAdmin());
    }
  };

  const handleAdminLogout = () => {
    dispatch(logoutAdmin());
    dispatch(clearAdminState());
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BookingFlow />} />
        <Route 
          path="/admin" 
          element={
              <AdminLogin onLogin={handleAdminLogin} />
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            isAdminLoggedIn ? 
              <AdminDashboard onLogout={handleAdminLogout} /> : 
              <Navigate to="/admin" replace />
          } 
        />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <Router>
          <AppRoutes />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;