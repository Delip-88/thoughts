import { useState, createContext, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load the theme from localStorage on mount
  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    if (storedMode) {
      setIsDarkMode(storedMode === "true"); // Convert the string to boolean
    }
  }, []);

  // Apply the dark class and update CSS variables whenever isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      // Remove any custom background color set for light mode
      document.documentElement.style.removeProperty('--light-background');
    } else {
      document.documentElement.classList.remove("dark");
      // Set a slightly darker background for light mode
      document.documentElement.style.setProperty('--light-background', 'hsl(0, 50%, 20%)');
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