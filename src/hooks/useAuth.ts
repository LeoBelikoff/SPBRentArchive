import { useState, useCallback, useEffect } from "react";

export interface AuthCredentials {
  username: string;
  password: string;
}

interface AuthState {
  isAuthenticated: boolean;
  credentials: AuthCredentials;
}

const AUTH_STORAGE_KEY = "apartment-rental-auth";
const DEFAULT_CREDENTIALS: AuthCredentials = {
  username: "admin",
  password: "admin",
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    credentials: DEFAULT_CREDENTIALS,
  });

  // Load saved credentials on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);
        setAuthState((prev) => ({
          ...prev,
          credentials: parsedAuth.credentials || DEFAULT_CREDENTIALS,
        }));
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
    }
  }, []);

  const login = useCallback(
    (username: string, password: string): boolean => {
      if (
        username === authState.credentials.username &&
        password === authState.credentials.password
      ) {
        setAuthState((prev) => ({ ...prev, isAuthenticated: true }));
        return true;
      }
      return false;
    },
    [authState.credentials],
  );

  const logout = useCallback(() => {
    setAuthState((prev) => ({ ...prev, isAuthenticated: false }));
  }, []);

  const updateCredentials = useCallback(
    (newCredentials: AuthCredentials): boolean => {
      try {
        const authData = {
          credentials: newCredentials,
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        setAuthState((prev) => ({
          ...prev,
          credentials: newCredentials,
        }));
        return true;
      } catch (error) {
        console.error("Error updating credentials:", error);
        return false;
      }
    },
    [],
  );

  const checkCurrentPassword = useCallback(
    (password: string): boolean => {
      return password === authState.credentials.password;
    },
    [authState.credentials.password],
  );

  return {
    isAuthenticated: authState.isAuthenticated,
    credentials: authState.credentials,
    login,
    logout,
    updateCredentials,
    checkCurrentPassword,
  };
}
