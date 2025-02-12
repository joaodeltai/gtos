"use client"

import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "./ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export function UserProfile() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: ""
  })

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          setUser({ ...user, ...profile })
          setFormData({
            name: profile?.name || "",
            email: user.email || "",
            whatsapp: profile?.whatsapp || ""
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('Erro ao carregar dados do usuário')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Erro ao sair da conta')
    }
  }

  const handleUpdateProfile = async () => {
    if (!user) return

    setSaving(true)
    try {
      // Atualizar perfil no Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          whatsapp: formData.whatsapp,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Atualizar email se foi alterado
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        })
        if (emailError) throw emailError
      }

      // Atualizar dados locais
      const { data: { user: updatedUser } } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', updatedUser?.id)
        .single()

      setUser({ ...updatedUser, ...profile })
      setIsOpen(false)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Meu Perfil</CardTitle>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">Editar Perfil</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                  <DialogDescription>
                    Faça as alterações necessárias no seu perfil aqui.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+55 (11) 99999-9999"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? 'Salvando...' : 'Salvar alterações'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-24 w-24 sm:h-20 sm:w-20">
              <AvatarImage
                src={user.user_metadata?.avatar_url || ""}
                alt={user.name || user.email || ""}
              />
              <AvatarFallback>
                {(user.name?.[0] || user.email?.[0] || "").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-medium">{user?.name || 'Usuário'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-center sm:text-left">
              <Label className="block mb-1">WhatsApp</Label>
              <p className="text-sm text-gray-700">{user?.whatsapp || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full sm:w-auto"
        >
          Sair da conta
        </Button>
      </div>
    </div>
  )
}
