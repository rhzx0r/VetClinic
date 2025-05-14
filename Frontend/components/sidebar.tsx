"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/components/auth-provider"
import { useMobile } from "@/hooks/use-mobile"
import { Home, Users, Calendar, Stethoscope, Dog, ClipboardList, BarChart, Settings } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const { isMobile, isSidebarOpen, closeSidebar } = useMobile()

  // Si es móvil y el sidebar no está abierto, no renderizar
  if (isMobile && !isSidebarOpen) {
    return null
  }

  // Si no hay usuario autenticado, no mostrar sidebar
  if (!user) {
    return null
  }

  const isAdmin = user.role === "Admin"

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Citas",
      href: "/appointments",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Clientes",
      href: "/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Pacientes",
      href: "/patients",
      icon: <Dog className="h-5 w-5" />,
    },
    {
      title: "Registros Médicos",
      href: "/medical-records",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Procedimientos",
      href: "/procedures",
      icon: <Stethoscope className="h-5 w-5" />,
    },
    {
      title: "Estadísticas",
      href: "/stats",
      icon: <BarChart className="h-5 w-5" />,
    },
  ]

  // Solo mostrar usuarios y configuración para administradores
  if (isAdmin) {
    sidebarItems.push(
      {
        title: "Usuarios",
        href: "/users",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Configuración",
        href: "/settings",
        icon: <Settings className="h-5 w-5" />,
      },
    )
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r bg-background transition-transform md:relative md:translate-x-0",
        isMobile && "shadow-lg",
        className,
      )}
    >
      <div className="border-b px-3 py-4">
        <h2 className="mb-2 text-lg font-semibold tracking-tight">Sistema Veterinario</h2>
      </div>
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={isMobile ? closeSidebar : undefined}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href ? "bg-secondary font-medium" : "font-normal",
                )}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
