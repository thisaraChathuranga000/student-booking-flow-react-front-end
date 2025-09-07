import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

  const handleAdminLogin = (loginStatus) => {
    if (loginStatus) {
      dispatch(loginAdmin());
    }
  };

  const handleAdminLogout = () => {
    dispatch(logoutAdmin());
    dispatch(clearAdminState());
    // Optional: Also purge the persist storage completely
    // persistor.purge();
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Student booking flow - default route */}
          <Route path="/" element={<BookingFlow />} />
          
          {/* Admin login route */}
          <Route 
            path="/admin" 
            element={
              isAdminLoggedIn ? 
                <Navigate to="/admin/dashboard" replace /> : 
                <AdminLogin onLogin={handleAdminLogin} />
            } 
          />
          
          {/* Admin dashboard route - protected */}
          <Route 
            path="/admin/dashboard" 
            element={
              isAdminLoggedIn ? 
                <AdminDashboard onLogout={handleAdminLogout} /> : 
                <Navigate to="/admin" replace />
            } 
          />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppRoutes />
      </PersistGate>
    </Provider>
  );
}

export default App;
