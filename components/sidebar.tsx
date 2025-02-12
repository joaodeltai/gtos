"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Home, User, ChevronLeft, ChevronRight, History } from "lucide-react"
import { useState } from "react"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "Perfil",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    label: "Histórico",
    icon: History,
    href: "/dashboard/history",
  },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="relative flex flex-col h-full bg-white border-r">
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        variant="ghost"
        className="absolute -right-4 top-6 h-8 w-8 rounded-full border bg-white p-0 hover:bg-gray-100"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="flex flex-col h-full">
        <div className={cn(
          "flex-1 space-y-4 py-4",
          isCollapsed ? "items-center" : "px-3"
        )}>
          <Link 
            href="/dashboard" 
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "pl-3",
              "mb-14"
            )}
          >
            <div className="relative w-6 h-7 mr-4">
              <Image fill alt="Logo" src="/logo.svg" />
            </div>
            {!isCollapsed && (
              <h1 className="text-2xl font-bold text-gray-900">
                gestorOS
              </h1>
            )}
          </Link>
          <div className={cn(
            "space-y-1",
            isCollapsed && "flex flex-col items-center w-full px-2"
          )}>
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex p-3 w-full rounded-lg transition",
                  isCollapsed ? "justify-center" : "justify-start",
                  pathname === route.href 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                title={isCollapsed ? route.label : undefined}
              >
                <route.icon className={cn(
                  "h-5 w-5",
                  !isCollapsed && "mr-3"
                )} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">
                    {route.label}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className={cn(
          "border-t",
          isCollapsed ? "px-2" : "px-3"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed ? "justify-center py-4" : "px-3 py-4"
          )}>
            <Avatar className="h-8 w-8 rounded-full bg-gray-200" />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">Minha Conta</span>
                <Link href="/dashboard/profile" className="text-xs text-gray-600 hover:text-gray-900 transition">
                  Ver perfil
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
