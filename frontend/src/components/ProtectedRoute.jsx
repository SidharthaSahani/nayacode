import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getDashboardData } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = loading, true/false = result

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getDashboardData(); // backend checks cookie automatically
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>; // show while checking

  if (!isAuth) return <Navigate to="/login" replace />; // not authenticated

  return children;
};

export default ProtectedRoute;