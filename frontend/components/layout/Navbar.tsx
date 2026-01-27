"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, type Language } from "@/contexts/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  // Close language menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }

    if (langMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [langMenuOpen]);

  // Navigation links based on role
  const getNavLinks = () => {
    const baseLinks = [
      { href: "/dashboard", label: t("navbar.dashboard"), icon: "📊" },
      { href: "/tools", label: t("navbar.tools"), icon: "🛠️" },
    ];

    if (isAuthenticated) {
      baseLinks.push({ href: "/tools/new", label: t("navbar.addTool"), icon: "➕" });
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-gradient-to-r from-white via-primary-50 to-secondary-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 shadow-lg sticky top-0 z-40 border-b-2 border-primary-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:from-primary-700 hover:to-secondary-700 transition-all">
            <span className="text-2xl">🤖</span>
            <span className="hidden sm:inline">AI Tools</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${isActive(link.href)
                    ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setLangMenuOpen(false);
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLangMenuOpen(!langMenuOpen);
                  }
                }}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all font-semibold"
                aria-label="Change language"
                aria-expanded={langMenuOpen}
                aria-haspopup="true"
              >
                {language.toUpperCase()}
              </button>
              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    onClick={() => { setLanguage("bg"); setLangMenuOpen(false); }}
                    onKeyDown={(e) => e.key === "Escape" && setLangMenuOpen(false)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${language === "bg" ? "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300" : "text-gray-700 dark:text-gray-300"}`}
                    role="menuitem"
                    aria-current={language === "bg" ? "true" : undefined}
                  >
                    🇧🇬 Български
                  </button>
                  <button
                    onClick={() => { setLanguage("en"); setLangMenuOpen(false); }}
                    onKeyDown={(e) => e.key === "Escape" && setLangMenuOpen(false)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${language === "en" ? "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300" : "text-gray-700 dark:text-gray-300"}`}
                    role="menuitem"
                    aria-current={language === "en" ? "true" : undefined}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => { setLanguage("de"); setLangMenuOpen(false); }}
                    onKeyDown={(e) => e.key === "Escape" && setLangMenuOpen(false)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${language === "de" ? "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300" : "text-gray-700 dark:text-gray-300"}`}
                    role="menuitem"
                    aria-current={language === "de" ? "true" : undefined}
                  >
                    🇩🇪 Deutsch
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                    ${isActive("/profile")
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold">{user.name || user.email}</span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="px-4 py-2 text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-gray-700 rounded-lg transition-all font-semibold"
                >
                  {t("navbar.logout")}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                {t("navbar.login")}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all
                    ${isActive(link.href)
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      px-4 py-3 rounded-lg font-medium transition-all
                      ${isActive("/profile")
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    👤 {t("navbar.profile")} ({user.name || user.email})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    🚪 {t("navbar.logout")}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg text-center"
                >
                  {t("navbar.login")}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
