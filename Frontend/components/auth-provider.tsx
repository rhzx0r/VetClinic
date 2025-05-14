"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: number
  name: string
  role: string
} | null

type AuthContextType = {
  user: User
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar si hay información de usuario en localStorage
    const userInfo = localStorage.getItem("user_info")

    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo))
      } catch (e) {
        console.error("Error parsing user info:", e)
        localStorage.removeItem("user_info")
      }
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    // Lista de rutas públicas que no requieren autenticación
    const publicRoutes = ["/login", "/register", "/patiens", "/clients", "/appointments"]

    // Redirigir a login si no hay usuario y no estamos en una ruta pública
    // if (!loading && !user && !publicRoutes.includes(pathname)) {
    //   router.push("/login")
    // }
  }, [user, loading, pathname, router])

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Limpiar información del usuario
      localStorage.removeItem("user_info")
      setUser(null)

      // Redirigir a login
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>
}
