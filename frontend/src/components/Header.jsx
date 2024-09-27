import React, { useState } from 'react'
import { BookOpen, Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
      }
      
  return (<>
    <header
    className="px-4 lg:px-6 h-16 flex items-center sticky top-0 bg-background z-50 transition-all duration-200 ease-in-out">
    <a className="flex items-center justify-center" href="#">
      <BookOpen
        className="h-6 w-6 transition-transform duration-200 ease-in-out hover:rotate-12" onClick={()=>navigate('/')}/>
      <span className="sr-only">My Blog</span>
    </a>
    <nav className="hidden md:flex ml-auto gap-4 sm:gap-6">
      {['Home', 'About', 'Archive', 'Contact'].map((item, index) => (
        <a
          key={item}
          className="text-base font-medium hover:underline underline-offset-4 transition-all duration-200 ease-in-out hover:text-primary"
          href="#"
          style={{animationDelay: `${index * 100}ms`}}>
          {item}
        </a>
      ))}
    </nav>
    <button
      className="md:hidden ml-auto transition-transform duration-200 ease-in-out hover:scale-110"
      onClick={toggleMenu}>
      {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
    </header>
    {isMenuOpen && (
        <nav
          className="md:hidden px-4 py-2 bg-gray-100 dark:bg-gray-800 animate-fadeIn">
          {['Home', 'About', 'Archive', 'Contact'].map((item, index) => (
            <a
              key={item}
              className="block py-2 text-base font-medium hover:underline underline-offset-4 transition-all duration-200 ease-in-out hover:text-primary animate-slideDown"
              href="#"
              style={{animationDelay: `${index * 100}ms`}}>
              {item}
            </a>
          ))}
        </nav>
      )}
      </>
  )
}

export default Header
