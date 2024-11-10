// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  // If the user is authenticated, render the element; otherwise, redirect to /login
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
