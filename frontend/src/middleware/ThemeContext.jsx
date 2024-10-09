import { useState, createContext, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load the theme from localStorage on mount
  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    if (storedMode) {
      setIsDarkMode(storedMode === "true"); // Convert the string to boolean
    }
  }, []);

  // Apply the dark class to the document whenever isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Update localStorage whenever isDarkMode changes
  useEffect(() => {
    localStorage.setItem("mode", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ toggleDarkMode, isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
