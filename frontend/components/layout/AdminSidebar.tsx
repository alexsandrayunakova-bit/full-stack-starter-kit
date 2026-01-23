"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const menuItems = [
    {
      title: "Dashboard",
      icon: "📊",
      path: "/admin",
      exact: true,
    },
    {
      title: "Manage Tools",
      icon: "🛠️",
      path: "/admin/tools",
    },
    {
      title: "Manage Users",
      icon: "👥",
      path: "/admin/users",
    },
    {
      title: "Audit Logs",
      icon: "📋",
      path: "/admin/audit-logs",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-slate-800 border-r-2 border-slate-200 dark:border-slate-700 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:top-16
          w-64 overflow-y-auto
        `}
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Admin Panel
            </h2>
            <button
              onClick={onClose}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const active = item.exact
                ? pathname === item.path
                : isActive(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => onClose()}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                    ${
                      active
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-l-4 border-transparent"
                    }
                  `}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-6 border-t border-slate-200 dark:border-slate-700" />

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 px-4">
              Quick Links
            </h3>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <span>🏠</span>
              <span className="text-sm">User Dashboard</span>
            </Link>
            <Link
              href="/tools"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <span>🔍</span>
              <span className="text-sm">Browse Tools</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <span>👤</span>
              <span className="text-sm">My Profile</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
