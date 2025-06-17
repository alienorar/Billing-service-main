// src/contexts/AuthContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query';

type AuthContextType = {
  isAuthenticated: boolean;
  userPermissions: string[];
  login: (token: string, refreshToken: string, permissions: string[]) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
    
    if (token && permissions.length > 0) {
      setIsAuthenticated(true);
      setUserPermissions(permissions);
    } else if (location.pathname !== "/") {
      navigate("/");
    }
  }, [navigate, location]);

  const login = (token: string, refreshToken: string, permissions: string[]) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("permissions", JSON.stringify(permissions));
    setIsAuthenticated(true);
    setUserPermissions(permissions);
    navigate("/super-admin-panel");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("permissions");
    setIsAuthenticated(false);
    setUserPermissions([]);
    queryClient.clear(); 
    navigate("/");
  };

  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userPermissions,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};