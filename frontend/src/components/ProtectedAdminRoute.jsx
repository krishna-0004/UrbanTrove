import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {

    const { user, loading } = useAuthContext();

    if (loading) return <p>Checking access...</p>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

export default ProtectedAdminRoute;