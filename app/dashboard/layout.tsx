"use client"

import { redirect } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Sidebar } from "@/components/sidebar"
import { MobileToggle } from "@/components/mobile-toggle"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClientComponentClient()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="h-full relative">
      <div className="h-[64px] md:hidden fixed inset-y-0 w-full z-50 px-4 border-b bg-white">
        <div className="flex h-full items-center">
          <MobileToggle 
            isCollapsed={isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
          />
        </div>
      </div>
      <div className={cn(
        "hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80]",
        isCollapsed ? "md:w-16" : "md:w-72",
        "transition-all duration-300"
      )}>
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      <main className={cn(
        "h-full transition-all duration-300",
        "pt-[64px] md:pt-0",
        isCollapsed ? "md:pl-16" : "md:pl-72"
      )}>
        <div className="h-full p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
