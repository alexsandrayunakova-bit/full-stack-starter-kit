"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { User, LoginCredentials, RegisterData, AuthResponse } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const response = await api.get<{ user: User }>("/api/me");

    if (response.data && response.data.user) {
      setUser(response.data.user);
    } else {
      localStorage.removeItem("token");
    }

    setLoading(false);
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>("/api/login", credentials);

    if (response.data) {
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return { success: true };
    }

    return { success: false, error: response.error };
  };

  const register = async (data: RegisterData) => {
    const response = await api.post<AuthResponse>("/api/register", data);

    if (response.data) {
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return { success: true };
    }

    return { success: false, error: response.error };
  };

  const logout = async () => {
    await api.post("/api/logout", {});
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
