import React, { useState, useEffect, useContext } from 'react'
import { BookOpen, Menu, X, User, Sun, Moon, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '@/middleware/ThemeContext'

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isDropdownOpen) setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
    if (isMenuOpen) setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <a className="flex items-center justify-center" href="#" onClick={() => navigate('/')}>
          <BookOpen className="h-6 w-6 transition-transform duration-200 ease-in-out hover:rotate-12 text-gray-800 dark:text-gray-200" />
          <span className="ml-2 text-lg font-semibold text-gray-800 dark:text-gray-200">My Blog</span>
        </a>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          {['Home', 'About', 'Archive', 'Contact'].map((item, index) => (
            <a
              key={item}
              className="text-base font-medium hover:underline underline-offset-4 transition-all duration-200 ease-in-out hover:text-primary text-gray-700 dark:text-gray-300"
              href="#"
              style={{animationDelay: `${index * 100}ms`}}>
              {item}
            </a>
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
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => navigate('/profile')}
                >
                  View Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    console.log('Logging out...')
                    navigate('/login')
                  }}
                >
                  Logout
                </a>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? (
                    <span className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" /> Light Mode
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" /> Dark Mode
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
          <button
            className="md:hidden ml-4 transition-transform duration-200 ease-in-out hover:scale-110 text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>
      {(isMenuOpen || isDropdownOpen) && (
        <div className="md:hidden bg-white dark:bg-gray-700 shadow-md">
          {isMenuOpen && (
            <nav className="px-4 py-2 animate-fadeIn">
              {['Home', 'About', 'Archive', 'Contact'].map((item, index) => (
                <a
                  key={item}
                  className="block py-2 text-base font-medium hover:underline underline-offset-4 transition-all duration-200 ease-in-out hover:text-primary dark:hover:text-primary-dark text-gray-700 dark:text-gray-200 animate-slideDown"
                  href="#"
                  style={{animationDelay: `${index * 100}ms`}}>
                  {item}
                </a>
              ))}
            </nav>
          )}
          {isDropdownOpen && (
            <div className="px-4 py-2 animate-fadeIn">
              <a
                href="#"
                className="block py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-dark"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </a>
              <a
                href="#"
                className="block py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-dark"
                onClick={() => {
                  console.log('Logging out...')
                  navigate('/login')
                }}
              >
                Logout
              </a>
              <button
                className="w-full text-left py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-dark"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <span className="flex items-center">
                    <Sun className="h-4 w-4 mr-2" /> Light Mode
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Moon className="h-4 w-4 mr-2" /> Dark Mode
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Header