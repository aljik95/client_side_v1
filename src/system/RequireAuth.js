import { useLocation, Navigate, Outlet } from "react-router-dom";
import React from 'react';
import useAuth from "./customHooks/useAuth";

const RequireAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();
    return (
      auth?.user ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />   
    );
}
export default RequireAuth;