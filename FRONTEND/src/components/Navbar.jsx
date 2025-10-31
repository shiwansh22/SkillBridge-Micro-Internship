"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SB</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">SkillBridge</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {!user ? (
              <>
                <Link to="/login" className="text-foreground rounded-lg hover:text-primary transition"> 
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {user.role === "student" && (
                  <>
                    <Link to="/student/dashboard" className="text-foreground hover:text-primary transition">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="text-foreground hover:text-primary transition">
                      Certificates
                    </Link>
                  </>
                )}
                {user.role === "recruiter" && (
                  <>
                    <Link to="/recruiter/dashboard" className="text-foreground hover:text-primary transition">
                      Dashboard
                    </Link>
                    <Link to="/task/create" className="text-foreground hover:text-primary transition">
                      Post Task
                    </Link>
                  </>
                )}
                <Link to="/profile" className="text-foreground hover:text-primary transition">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-foreground hover:text-primary transition">
                  Logout
                </button>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!user ? (
              <>
                <Link to="/login" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {user.role === "student" && (
                  <>
                    <Link to="/student/dashboard" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                      Certificates
                    </Link>
                  </>
                )}
                {user.role === "recruiter" && (
                  <>
                    <Link to="/recruiter/dashboard" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                      Dashboard
                    </Link>
                    <Link to="/task/create" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                      Post Task
                    </Link>
                  </>
                )}
                <Link to="/profile" className="block px-4 py-2 text-foreground hover:bg-muted rounded">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
