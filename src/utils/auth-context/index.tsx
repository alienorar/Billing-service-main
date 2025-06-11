import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAccessToken, setAccessToken } from '../token-service';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for access token on mount
    const token = getAccessToken();
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string) => {
    setAccessToken(token); // Use your token-service function
    setIsAuthenticated(true);
  };

  const logout = () => {
    logout(); // Use your token-service logout
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};