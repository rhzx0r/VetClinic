"use client"

import { create } from "zustand"
import { useEffect } from "react"

interface MobileState {
  isMobile: boolean
  isSidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  openSidebar: () => void
}

export const useMobileStore = create<MobileState>((set) => ({
  isMobile: false,
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),
}))

export function useMobile() {
  const { isMobile, isSidebarOpen, toggleSidebar, closeSidebar, openSidebar } = useMobileStore()

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768
      useMobileStore.setState({ isMobile: isMobileView })

      // Si cambia a desktop, asegurarse que el sidebar esté cerrado
      if (!isMobileView) {
        useMobileStore.setState({ isSidebarOpen: false })
      }
    }

    // Comprobar al montar
    checkMobile()

    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return { isMobile, isSidebarOpen, toggleSidebar, closeSidebar, openSidebar }
}
