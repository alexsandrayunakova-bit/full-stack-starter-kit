"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { User, LoginCredentials, RegisterData, AuthResponse } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; requires2FA?: boolean; twoFactorMethod?: string; userId?: number; message?: string }>;
  verify2FA: (userId: number, code: string) => Promise<{ success: boolean; error?: string }>;
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
    const response = await api.post<any>("/api/login", credentials);

    if (response.data) {
      // Check if 2FA is required
      if (response.data.requires_2fa) {
        return {
          success: false,
          requires2FA: true,
          twoFactorMethod: response.data.two_factor_method,
          userId: response.data.user_id,
          message: response.data.message
        };
      }

      // Normal login without 2FA
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return { success: true };
    }

    return { success: false, error: response.error };
  };

  const verify2FA = async (userId: number, code: string) => {
    const response = await api.post<AuthResponse>("/api/2fa/verify-login", {
      user_id: userId,
      code: code
    });

    if (response.data && response.data.token) {
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
        verify2FA,
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
