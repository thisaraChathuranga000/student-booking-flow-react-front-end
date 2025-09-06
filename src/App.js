import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import BookingFlow from "./components/BookingFlow";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = (loginStatus) => {
    setIsAdminLoggedIn(loginStatus);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <BookingProvider>
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
    </BookingProvider>
  );
}

export default App;
