"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
              <p>© 2026 AI Tools Platform. Всички права запазени.</p>
            </div>
          </footer>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
