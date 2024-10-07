// ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Loader from '@/components/loader/Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated , loading} = useContext(AuthContext); // Access the user from context

  if(loading) return <Loader/>
  if (!isAuthenticated) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login"  />;
  }

  return children; // If authenticated, render the child components
};

export default ProtectedRoute;
