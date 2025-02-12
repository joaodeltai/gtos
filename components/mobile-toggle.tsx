"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"

interface MobileToggleProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function MobileToggle({ isCollapsed, onToggle }: MobileToggleProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden p-0">
          <Image src="/logo.svg" alt="Logo" width={12} height={14} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <Sidebar isCollapsed={false} onToggle={onToggle} />
      </SheetContent>
    </Sheet>
  )
}
