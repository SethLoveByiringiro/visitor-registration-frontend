import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem("authToken");
    const expirationTime = localStorage.getItem("tokenExpiration");

    if (token && expirationTime) {
      if (new Date().getTime() < parseInt(expirationTime)) {
        setIsAuthenticated(true);
        return true;
      } else {
        // Token has expired
        logout();
      }
    }
    setIsAuthenticated(false);
    return false;
  }, []);

  const login = useCallback((username: string) => {
    const token = "fake-jwt-token"; // In a real app, this would come from your backend
    const expirationTime = new Date().getTime() + 3600000; // 1 hour from now
    localStorage.setItem("authToken", token);
    localStorage.setItem("tokenExpiration", expirationTime.toString());
    localStorage.setItem("username", username);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      await checkAuth();
      setIsLoading(false);
    };

    initializeAuth();
  }, [checkAuth]);

  const contextValue = React.useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuth,
    }),
    [isAuthenticated, isLoading, login, logout, checkAuth]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
