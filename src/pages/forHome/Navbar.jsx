"use client"

import { useState } from "react"
import { Menu, X, LogIn } from "lucide-react"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-gray-900 hover:text-orange-500 transition-colors">
              Dern-Support
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Bosh Sahifa
            </a>
            <a href="#about" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Biz haqimizda
            </a>
            <a href="#services" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Xizmatlarimiz
            </a>
            <a href="#blog" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Blog
            </a>
            <a href="#contact" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Bog'lanish
            </a>
          </div>

          <div className="hidden md:flex items-center">
            <a
              href="/login"
              className="inline-flex items-center border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium"
            >
              Kirish <LogIn className="ml-2 w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 text-gray-700 hover:text-orange-500 transition-colors">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500 font-medium"
                onClick={toggleMenu}
              >
                Homepage
              </a>
              <a
                href="#about"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500 font-medium"
                onClick={toggleMenu}
              >
                About us
              </a>
              <a
                href="#services"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500 font-medium"
                onClick={toggleMenu}
              >
                Services
              </a>
              <a
                href="#blog"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500 font-medium"
                onClick={toggleMenu}
              >
                Blog
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500 font-medium"
                onClick={toggleMenu}
              >
                Contact
              </a>
              <div className="px-3 py-2">
                <a
                  href="/login"
                  className="inline-flex items-center w-full justify-center border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                >
                  Kirish <LogIn className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
