// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

import { Spin } from "antd";
import { useAuth } from "../contexts/auth-context";

type ProtectedRouteProps = {
  requiredPermissions?: string[];
  redirectTo?: string;
  loadingElement?: React.ReactNode;
};

export const ProtectedRoute = ({
  requiredPermissions = [],
  redirectTo = "/login",
  loadingElement = <Spin size="large" />,
}: ProtectedRouteProps) => {
  const { isAuthenticated, userPermissions, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      return <Navigate to="/not-authorized" replace />;
    }
  }

  return <Outlet />;
};