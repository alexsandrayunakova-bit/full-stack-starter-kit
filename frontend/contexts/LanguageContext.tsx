"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "bg" | "en" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  bg: {
    // Navbar
    "nav.dashboard": "Dashboard",
    "nav.tools": "Инструменти",
    "nav.addTool": "Добави инструмент",
    "nav.profile": "Профил",
    "nav.logout": "Изход",
    "nav.login": "Вход",

    // Home
    "home.title": "AI Tools Platform",
    "home.tools": "Каталог с инструменти",
    "home.login": "Вход",

    // Dashboard
    "dashboard.welcome": "Добре дошъл",
    "dashboard.role": "Роля",
    "dashboard.totalTools": "Общо инструменти",
    "dashboard.myTools": "Мои инструменти",
    "dashboard.views": "Прегледи",
    "dashboard.quickActions": "Бързи действия",
    "dashboard.addNewTool": "Добави нов инструмент",
    "dashboard.browseTools": "Разгледай инструменти",
    "dashboard.myProfile": "Моят профил",
    "dashboard.recentTools": "Последни инструменти",
    "dashboard.viewAll": "Виж всички",

    // Footer
    "footer.rights": "Всички права запазени",
    "footer.creator": "Alexa Yunakova",

    // Auth
    "auth.email": "Email",
    "auth.password": "Парола",
    "auth.name": "Име",
    "auth.role": "Роля",
    "auth.login": "Вход",
    "auth.register": "Регистрация",
    "auth.noAccount": "Нямаш акаунт?",
    "auth.hasAccount": "Вече имаш акаунт?",

    // Tools
    "tools.search": "Търси инструменти",
    "tools.category": "Категория",
    "tools.allCategories": "Всички категории",
    "tools.visitWebsite": "Посети сайта",
    "tools.noLink": "Няма линк",
    "tools.noToolsYet": "Все още няма инструменти",
    "tools.addFirst": "Добави първия инструмент",
    "tools.viewsCount": "прегледа",
  },
  en: {
    // Navbar
    "nav.dashboard": "Dashboard",
    "nav.tools": "Tools",
    "nav.addTool": "Add Tool",
    "nav.profile": "Profile",
    "nav.logout": "Logout",
    "nav.login": "Login",

    // Home
    "home.title": "AI Tools Platform",
    "home.tools": "Tools Catalog",
    "home.login": "Login",

    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.role": "Role",
    "dashboard.totalTools": "Total Tools",
    "dashboard.myTools": "My Tools",
    "dashboard.views": "Views",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.addNewTool": "Add New Tool",
    "dashboard.browseTools": "Browse Tools",
    "dashboard.myProfile": "My Profile",
    "dashboard.recentTools": "Recent Tools",
    "dashboard.viewAll": "View All",

    // Footer
    "footer.rights": "All rights reserved",
    "footer.creator": "Alexa Yunakova",

    // Auth
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Name",
    "auth.role": "Role",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",

    // Tools
    "tools.search": "Search tools",
    "tools.category": "Category",
    "tools.allCategories": "All categories",
    "tools.visitWebsite": "Visit Website",
    "tools.noLink": "No Link",
    "tools.noToolsYet": "No tools yet",
    "tools.addFirst": "Add first tool",
    "tools.viewsCount": "views",
  },
  de: {
    // Navbar
    "nav.dashboard": "Dashboard",
    "nav.tools": "Werkzeuge",
    "nav.addTool": "Tool hinzufügen",
    "nav.profile": "Profil",
    "nav.logout": "Abmelden",
    "nav.login": "Anmelden",

    // Home
    "home.title": "AI Tools Platform",
    "home.tools": "Werkzeug-Katalog",
    "home.login": "Anmelden",

    // Dashboard
    "dashboard.welcome": "Willkommen",
    "dashboard.role": "Rolle",
    "dashboard.totalTools": "Gesamt Werkzeuge",
    "dashboard.myTools": "Meine Werkzeuge",
    "dashboard.views": "Ansichten",
    "dashboard.quickActions": "Schnellaktionen",
    "dashboard.addNewTool": "Neues Tool hinzufügen",
    "dashboard.browseTools": "Werkzeuge durchsuchen",
    "dashboard.myProfile": "Mein Profil",
    "dashboard.recentTools": "Neueste Werkzeuge",
    "dashboard.viewAll": "Alle anzeigen",

    // Footer
    "footer.rights": "Alle Rechte vorbehalten",
    "footer.creator": "Alexa Yunakova",

    // Auth
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.name": "Name",
    "auth.role": "Rolle",
    "auth.login": "Anmelden",
    "auth.register": "Registrieren",
    "auth.noAccount": "Kein Konto?",
    "auth.hasAccount": "Bereits ein Konto?",

    // Tools
    "tools.search": "Werkzeuge suchen",
    "tools.category": "Kategorie",
    "tools.allCategories": "Alle Kategorien",
    "tools.visitWebsite": "Website besuchen",
    "tools.noLink": "Kein Link",
    "tools.noToolsYet": "Noch keine Werkzeuge",
    "tools.addFirst": "Erstes Tool hinzufügen",
    "tools.viewsCount": "Ansichten",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["bg", "en", "de"].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      setLanguageState("en"); // Default to English
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
