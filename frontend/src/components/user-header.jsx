'use client'

import React, { useState, useEffect, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, PenTool, Bell, User, Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { AuthContext } from '@/middleware/AuthContext'
import { ThemeContext } from '@/middleware/ThemeContext'
import { Switch } from "@/components/ui/switch"

const Button = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
  }
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function UserHeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  const {logout, user} = useContext(AuthContext)
  const {isDarkMode, toggleDarkMode} = useContext(ThemeContext)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    const handleClickOutside = (event) => {
      if ((isDropdownOpen || isMenuOpen) && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, isMenuOpen])

  return (
    <div className={`sticky top-0 z-50 bg-background dark:bg-gray-800 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <header className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          <NavLink className="flex items-center justify-center" to="/Home">
            <BookOpen className="h-6 w-6 mr-2 text-gray-800 dark:text-gray-200" />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">My Blog</span>
          </NavLink>
          <nav className="hidden md:flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/create-post')}>
              <PenTool className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Post</span>
            </Button>
            <Button
              variant="outline"
              className="p-2"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="dropdown-container relative">
              <Button variant="outline" className="p-3" onClick={toggleDropdown}>
                <img
                  alt={user.username[0].toUpperCase()}
                  className="rounded-full w-7 h-7 mr-1 object-cover"
                  src={user.image && user.image?.secure_url ? user.image?.secure_url : "https://res.cloudinary.com/dduky37gb/image/upload/v1728969091/4213460-account-avatar-head-person-profile-user_115386_o1rutg.png"}
                />
                <ChevronDown className="h-4 w-4" />
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => {
                      navigate('/profile')
                      setIsDropdownOpen(false)
                    }}
                  >
                    View Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => {
                      if(!confirm("You are about to logout.")) return ;
                      logout()
                      setTimeout(() => {
                        navigate('/login')
                      }, 500);
                      setIsDropdownOpen(false)
                    }}
                  >
                    Logout
                  </a>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-200">Dark Mode</span>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                      className="ml-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </nav>
          <div className="dropdown-container relative md:hidden">
            <Button
              variant="outline"
              className="p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    navigate('/create-post')
                    toggleMenu()
                  }}
                >
                  <PenTool className="inline-block mr-2 h-4 w-4" />
                  New Post
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    navigate('/notifications')
                    toggleMenu()
                  }}
                >
                  <Bell className="inline-block mr-2 h-4 w-4" />
                  Notifications
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    navigate('/profile')
                    toggleMenu()
                  }}
                >
                  <User className="inline-block mr-2 h-4 w-4" />
                  View Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    console.log('Logging out...')
                    logout()
                    navigate('/login')
                    toggleMenu()
                  }}
                >
                  <LogOut className="inline-block mr-2 h-4 w-4" />
                  Logout
                </a>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-200">Dark Mode</span>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={() => {
                      toggleDarkMode()
                      toggleMenu()
                    }}
                    className="ml-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}