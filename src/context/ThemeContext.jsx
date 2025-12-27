import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_KEY = "fs_pdv_theme";
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState(() => {
    try {
      const raw = localStorage.getItem(THEME_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.primaryColor || "#4F39F6";
    } catch {
      return "#4F39F6";
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      const raw = localStorage.getItem(THEME_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.theme === "light" || parsed?.theme === "dark") return parsed.theme;
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    try {
      const raw = localStorage.getItem(THEME_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      localStorage.setItem(THEME_KEY, JSON.stringify({ ...parsed, primaryColor }));
    } catch {}
  }, [primaryColor]);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    try {
      const raw = localStorage.getItem(THEME_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      localStorage.setItem(THEME_KEY, JSON.stringify({ ...parsed, theme }));
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const value = useMemo(
    () => ({ primaryColor, setPrimaryColor, theme, setTheme, toggleTheme }),
    [primaryColor, theme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
