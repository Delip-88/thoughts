"use client";

import React, { useState, useEffect, useContext } from "react";
import { BookOpen, Menu, X, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@/middleware/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { NavLink } from "react-router-dom";

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (isDropdownOpen || isMenuOpen) &&
        !event.target.closest(".dropdown-container")
      ) {
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isMenuOpen]);

  const navlinks = ["Home", "About", "Archive", "Contact"];

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <a
          className="flex items-center justify-center"
          href="/"
          onClick={() => navigate("/")}
        >
          <BookOpen className="h-6 w-6 transition-transform duration-200 ease-in-out hover:rotate-12 text-gray-800 dark:text-gray-200" />
          <span className="ml-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
            My Blog
          </span>
        </a>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          {navlinks.map((item, index) => (
            <NavLink
              key={item}
              className="text-base font-medium hover:underline underline-offset-4 transition-all duration-200 ease-in-out hover:text-primary text-gray-700 dark:text-gray-300"
              to={`/${item !== "Home" ? item : ""}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {item}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center">
          <div className="dropdown-container relative">
            <button
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors duration-200"
              onClick={toggleDropdown}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <User className="h-5 w-5" />
              <ChevronDown className="h-4 w-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                {/* Login Link */}
                <NavLink
                  to="/login"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Login
                </NavLink>

                {/* Sign Up Link */}
                <NavLink
                  to="/register"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Sign Up
                </NavLink>

                {/* Dark Mode Switch */}
                <div className="px-4 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600">
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    Dark Mode
                  </span>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                    className="ml-2"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="dropdown-container relative md:hidden">
            <button
              className="ml-4 transition-transform duration-200 ease-in-out hover:scale-110 text-gray-700 dark:text-gray-300"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                <nav className="animate-fadeIn">
                  {navlinks.map((item, index) => (
                    <NavLink
                      key={item}
                      className="block px-4 py-2 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 ease-in-out hover:text-primary dark:hover:text-primary-dark text-gray-700 dark:text-gray-200 animate-slideDown"
                      to="#"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item}
                    </NavLink>
                  ))}
                  <div className="px-4 py-2 flex items-center justify-between animate-slideDown">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Dark Mode
                    </span>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                      className="ml-2"
                    />
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
