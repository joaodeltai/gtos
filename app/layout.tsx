import type { Metadata } from "next"
import { Sora } from "next/font/google"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "sonner"
import { AuthProvider } from "@/components/providers/auth-provider"

const sora = Sora({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GTOS",
  description: "Gestão de Trabalhos e Ordens de Serviço",
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={sora.className}>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
