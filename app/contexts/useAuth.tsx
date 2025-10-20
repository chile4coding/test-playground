import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthUser {
  firstname?: string;
  lastname?: string;
  middlename?: string;
  emailaddress: string;
  phonenumber?: string;
  role?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (emailaddress: string, password: string) => Promise<void>;
  register: (
    data: Omit<AuthUser, "role"> & { password: string; role: number }
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const createAuthProvider = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (emailaddress: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real API call
      setUser({ emailaddress });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    data: Omit<AuthUser, "role"> & { password: string; role: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real API call
      setUser({ ...data });
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, register, logout, loading, error, isAuthenticated };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
