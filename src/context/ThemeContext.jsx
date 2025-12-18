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

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify({ primaryColor }));
    } catch {}
  }, [primaryColor]);

  const value = useMemo(() => ({ primaryColor, setPrimaryColor }), [primaryColor]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
