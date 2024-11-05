// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
