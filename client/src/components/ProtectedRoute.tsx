import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { ROUTES } from "../utils/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
}

