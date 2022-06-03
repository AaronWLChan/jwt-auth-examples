import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from '../redux';

interface ProtectedRouteProps {
  redirectTo?: string
}

function ProtectedRoute({ redirectTo }: ProtectedRouteProps) {

  const loggedIn = useAppSelector((state) => state.auth.accessToken)

  return (
    loggedIn ? <Outlet/> : <Navigate to={redirectTo ? redirectTo : "/"} replace />
  )
}

export default ProtectedRoute