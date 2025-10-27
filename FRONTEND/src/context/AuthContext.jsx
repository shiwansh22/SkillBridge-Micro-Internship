"use client"

import { createContext, useState, useContext, useEffect } from "react"
import api from "../api/axios"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  const login = async (email, password, role) => {
    try {
      setError(null)
      const response = await api.post("/users/login", { email, password, role })
      const { token, user: userData } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(userData)
      return userData
    } catch (err) {
      const message = err.response?.data?.message || "Login failed"
      setError(message)
      throw new Error(message)
    }
  }

  const register = async (email, password, name, role) => {
    try {
      setError(null)
      const response = await api.post("/users/register", { email, password, name, role })
      const { token, user: userData } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(userData)
      return userData
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed"
      setError(message)
      throw new Error(message)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
