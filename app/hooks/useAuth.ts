import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem("authToken");
    if (token) {
      // TODO: Validate token with backend
      setAuthState({
        user: { id: "1", email: "user@example.com" },
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = { id: "1", email, name: "User" };
      localStorage.setItem("authToken", "dummy-token");

      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      setAuthState((prev) => ({ ...prev, loading: false }));
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    login,
    logout,
  };
};
