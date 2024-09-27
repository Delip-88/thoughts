'use client'

import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, PenTool, Bell, User, Menu, X } from 'lucide-react'

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
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className={`bg-background shadow-sm sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          <NavLink className="flex items-center justify-center" to="/Home">
            <BookOpen className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">My Blog</span>
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
            <Button variant="outline" className="p-2" onClick={() => navigate('/profile')}>
              <img
                alt="User avatar"
                className="rounded-full w-6 h-6"
                src="/placeholder.svg?height=50&width=50"
              />
              <span className="sr-only">User menu</span>
            </Button>
          </nav>
          <Button
            variant="outline"
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden px-4 py-2 bg-background border-t">
          <Button
            variant="outline"
            className="w-full justify-start mb-2"
            onClick={() => { navigate('/create-post'); toggleMenu(); }}
          >
            <PenTool className="mr-2 h-4 w-4" />
            New Post
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start mb-2"
            onClick={() => { navigate('/notifications'); toggleMenu(); }}
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => { navigate('/profile'); toggleMenu(); }}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
      )}
    </header>
  )
}