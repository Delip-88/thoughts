// ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated , loading} = useContext(AuthContext); // Access the user from context
  const location = useLocation();

  if(loading) return <div>loading...</div>
  if (!isAuthenticated) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children; // If authenticated, render the child components
};

export default ProtectedRoute;
