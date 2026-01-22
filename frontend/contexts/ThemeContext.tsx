"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Check localStorage on mount
    const savedTheme = localStorage.getItem("theme") as Theme;
    console.log("ThemeContext - Saved theme from localStorage:", savedTheme);

    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      console.log("ThemeContext - Set to dark mode");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      console.log("ThemeContext - Set to light mode");
    }
  }, []);

  const toggleTheme = () => {
    console.log("ThemeContext - Toggling theme from:", theme);
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      console.log("ThemeContext - Toggled to dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      console.log("ThemeContext - Toggled to light");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
