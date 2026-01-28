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
    // General
    "skipToMain": "Към основното съдържание",

    // Navbar
    "navbar.dashboard": "Dashboard",
    "navbar.tools": "Инструменти",
    "navbar.addTool": "Добави инструмент",
    "navbar.profile": "Профил",
    "navbar.logout": "Изход",
    "navbar.login": "Вход",

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
    "footer.copyright": "© 2026 AI Tools Platform. Всички права запазени.",
    "footer.rights": "Всички права запазени",
    "footer.creator": "Alexa Yunakova & Claude",

    // Auth
    "auth.loginTitle": "Вход в системата",
    "auth.email": "Email",
    "auth.password": "Парола",
    "auth.name": "Име",
    "auth.role": "Роля",
    "auth.login": "Вход",
    "auth.loggingIn": "Влизане...",
    "auth.register": "Регистрация",
    "auth.registering": "Регистриране...",
    "auth.noAccount": "Нямаш акаунт?",
    "auth.hasAccount": "Вече имаш акаунт?",
    "auth.registerLink": "Регистрирай се",
    "auth.loginLink": "Влез",
    "auth.loginSuccess": "Успешно влизане!",
    "auth.loginError": "Грешка при вход",
    "auth.registerSuccess": "Успешна регистрация!",
    "auth.registerError": "Грешка при регистрация",
    "auth.company": "Компания",
    "auth.dateOfBirth": "Дата на раждане",
    "auth.country": "Държава",
    "auth.profession": "Професия",
    "auth.companyPlaceholder": "Вашата компания",
    "auth.dateOfBirthPlaceholder": "Изберете дата",
    "auth.countryPlaceholder": "Вашата държава",
    "auth.professionPlaceholder": "Вашата професия",
    "auth.passwordConfirm": "Потвърди парола",
    "auth.passwordConfirmPlaceholder": "Въведете паролата отново",
    "auth.passwordRequirements": "Изисквания за паролата:",
    "auth.passwordMin": "Минимум 8 символа",
    "auth.passwordMax": "Максимум 12 символа",
    "auth.passwordUppercase": "Поне една главна буква",
    "auth.passwordLowercase": "Поне една малка буква",
    "auth.passwordDigit": "Поне една цифра",
    "auth.passwordNoSpecial": "Без специални символи",

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
    // General
    "skipToMain": "Skip to main content",

    // Navbar
    "navbar.dashboard": "Dashboard",
    "navbar.tools": "Tools",
    "navbar.addTool": "Add Tool",
    "navbar.profile": "Profile",
    "navbar.logout": "Logout",
    "navbar.login": "Login",

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
    "footer.copyright": "© 2026 AI Tools Platform. All rights reserved.",
    "footer.rights": "All rights reserved",
    "footer.creator": "Alexa Yunakova & Claude",

    // Auth
    "auth.loginTitle": "Login",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Name",
    "auth.role": "Role",
    "auth.login": "Login",
    "auth.loggingIn": "Logging in...",
    "auth.register": "Register",
    "auth.registering": "Registering...",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.registerLink": "Sign up",
    "auth.loginLink": "Log in",
    "auth.loginSuccess": "Login successful!",
    "auth.loginError": "Login error",
    "auth.registerSuccess": "Registration successful!",
    "auth.registerError": "Registration error",
    "auth.company": "Company",
    "auth.dateOfBirth": "Date of Birth",
    "auth.country": "Country",
    "auth.profession": "Profession",
    "auth.companyPlaceholder": "Your company",
    "auth.dateOfBirthPlaceholder": "Select date",
    "auth.countryPlaceholder": "Your country",
    "auth.professionPlaceholder": "Your profession",
    "auth.passwordConfirm": "Confirm Password",
    "auth.passwordConfirmPlaceholder": "Re-enter your password",
    "auth.passwordRequirements": "Password requirements:",
    "auth.passwordMin": "Minimum 8 characters",
    "auth.passwordMax": "Maximum 12 characters",
    "auth.passwordUppercase": "At least one uppercase letter",
    "auth.passwordLowercase": "At least one lowercase letter",
    "auth.passwordDigit": "At least one digit",
    "auth.passwordNoSpecial": "No special characters",

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
    // General
    "skipToMain": "Zum Hauptinhalt springen",

    // Navbar
    "navbar.dashboard": "Dashboard",
    "navbar.tools": "Werkzeuge",
    "navbar.addTool": "Tool hinzufügen",
    "navbar.profile": "Profil",
    "navbar.logout": "Abmelden",
    "navbar.login": "Anmelden",

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
    "footer.copyright": "© 2026 AI Tools Platform. Alle Rechte vorbehalten.",
    "footer.rights": "Alle Rechte vorbehalten",
    "footer.creator": "Alexa Yunakova & Claude",

    // Auth
    "auth.loginTitle": "Anmelden",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.name": "Name",
    "auth.role": "Rolle",
    "auth.login": "Anmelden",
    "auth.loggingIn": "Anmelden...",
    "auth.register": "Registrieren",
    "auth.registering": "Registrierung...",
    "auth.noAccount": "Kein Konto?",
    "auth.hasAccount": "Bereits ein Konto?",
    "auth.registerLink": "Registrieren",
    "auth.loginLink": "Anmelden",
    "auth.loginSuccess": "Anmeldung erfolgreich!",
    "auth.loginError": "Anmeldefehler",
    "auth.registerSuccess": "Registrierung erfolgreich!",
    "auth.registerError": "Registrierungsfehler",
    "auth.company": "Firma",
    "auth.dateOfBirth": "Geburtsdatum",
    "auth.country": "Land",
    "auth.profession": "Beruf",
    "auth.companyPlaceholder": "Ihre Firma",
    "auth.dateOfBirthPlaceholder": "Datum wählen",
    "auth.countryPlaceholder": "Ihr Land",
    "auth.professionPlaceholder": "Ihr Beruf",
    "auth.passwordConfirm": "Passwort bestätigen",
    "auth.passwordConfirmPlaceholder": "Passwort erneut eingeben",
    "auth.passwordRequirements": "Passwortanforderungen:",
    "auth.passwordMin": "Mindestens 8 Zeichen",
    "auth.passwordMax": "Maximal 12 Zeichen",
    "auth.passwordUppercase": "Mindestens ein Großbuchstabe",
    "auth.passwordLowercase": "Mindestens ein Kleinbuchstabe",
    "auth.passwordDigit": "Mindestens eine Ziffer",
    "auth.passwordNoSpecial": "Keine Sonderzeichen",

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

    if (!savedLang || !["bg", "en", "de"].includes(savedLang)) {
      setLanguageState("en");
      localStorage.setItem("language", "en");
    } else {
      setLanguageState(savedLang);
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
