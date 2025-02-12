"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface IcpHistory {
  id: string
  created_at: string
  content: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<IcpHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIcp, setSelectedIcp] = useState<IcpHistory | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (!session) {
          router.replace('/auth/login')
          return
        }

        setUserId(session.user.id)
        await fetchHistory(session.user.id)
      } catch (err) {
        console.error('Error checking session:', err)
        setError('Erro ao verificar sessão. Por favor, tente novamente.')
        setLoading(false)
      }
    }

    checkUser()
  }, [router, supabase])

  // Atualizar histórico quando a página ganhar foco
  useEffect(() => {
    if (!userId) return

    const refreshHistory = () => {
      if (document.visibilityState === 'visible') {
        fetchHistory(userId)
      }
    }

    document.addEventListener('visibilitychange', refreshHistory)
    window.addEventListener('focus', () => fetchHistory(userId))

    return () => {
      document.removeEventListener('visibilitychange', refreshHistory)
      window.removeEventListener('focus', () => fetchHistory(userId))
    }
  }, [userId])

  const fetchHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('icp_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setHistory(data || [])
    } catch (err) {
      console.error('Error fetching history:', err)
      setError('Erro ao carregar o histórico. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Histórico</h2>
        <p className="text-muted-foreground">
          Veja todas as suas gerações de ICP anteriores
        </p>
      </div>

      <Card className="w-full">
        <Table>
          <TableCaption>Lista de ICPs gerados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Conteúdo</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Nenhum ICP gerado ainda
                </TableCell>
              </TableRow>
            ) : (
              history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell className="max-w-[500px] truncate">
                    {item.content}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setSelectedIcp(item)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ver detalhes
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selectedIcp} onOpenChange={() => setSelectedIcp(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do ICP</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-2">
              Gerado em: {selectedIcp && formatDate(selectedIcp.created_at)}
            </div>
            <div className="whitespace-pre-wrap">
              {selectedIcp?.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
