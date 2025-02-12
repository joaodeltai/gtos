"use client"

import { UserProfile } from "@/components/user-profile"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
        </div>

        <UserProfile />
      </div>
    </div>
  )
}
