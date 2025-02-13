"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/useDebounce"
import ReactMarkdown from "react-markdown"
import { toast } from "sonner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BiographyForm } from "@/components/biography-form"
import { Card } from "@/components/ui/card"
import { saveIcpToHistory } from "@/lib/icp-history"

export default function DashboardPage() {
  const [icp, setIcp] = useState("")
  const [biography, setBiography] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<string[]>(["biography"])
  const [generatingIcp, setGeneratingIcp] = useState(false)
  
  const supabase = createClientComponentClient()

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Obter ID do usuário
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUserId(user.id)

        // Carregar perfil e biografia
        const [profileResult, biographyResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("icp")
            .eq("id", user.id)
            .single(),
          supabase
            .from("biographies")
            .select()
            .eq("user_id", user.id)
            .maybeSingle()
        ])

        if (profileResult.error) throw profileResult.error
        if (profileResult.data) {
          setIcp(profileResult.data.icp || "")
        }

        if (biographyResult.error && biographyResult.error.code !== 'PGRST116') {
          throw biographyResult.error
        }

        if (biographyResult.data) {
          const data = biographyResult.data
          const formattedBiography = [
            `Nome e Cargo: ${data.name_and_role}`,
            `Empresa: ${data.company_name}`,
            `Nicho: ${data.niche}`,
            `Como ajuda: ${data.help_description}`,
            `Serviços: ${data.services}`,
            `Experiência: ${data.experience}`,
            `Conquistas: ${data.achievements}`,
            data.recognition ? `Reconhecimento: ${data.recognition}` : null,
            `Diferencial: ${data.differential}`,
            `Melhores clientes: ${data.best_clients}`,
            `Clientes preferidos: ${data.preferred_clients}`,
            data.avoid_clients ? `Clientes a evitar: ${data.avoid_clients}` : null,
            data.additional_info ? `Informações adicionais: ${data.additional_info}` : null,
          ].filter(Boolean).join('\n')
          
          setBiography(formattedBiography)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        toast.error("Erro ao carregar dados do usuário")
      }
    }

    loadUserData()
  }, [])

  const generateIcp = async () => {
    try {
      setGeneratingIcp(true)

      // Primeiro, buscar a biografia mais recente
      const { data: biographyData, error: biographyError } = await supabase
        .from("biographies")
        .select()
        .eq("user_id", userId)
        .maybeSingle()

      if (biographyError) throw biographyError
      if (!biographyData) {
        toast.error("Por favor, preencha sua biografia antes de gerar o ICP")
        return
      }

      // Formatar a biografia
      const formattedBiography = [
        `Nome e Cargo: ${biographyData.name_and_role}`,
        `Empresa: ${biographyData.company_name}`,
        `Nicho: ${biographyData.niche}`,
        `Como ajuda: ${biographyData.help_description}`,
        `Serviços: ${biographyData.services}`,
        `Experiência: ${biographyData.experience}`,
        `Conquistas: ${biographyData.achievements}`,
        biographyData.recognition ? `Reconhecimento: ${biographyData.recognition}` : null,
        `Diferencial: ${biographyData.differential}`,
        `Melhores clientes: ${biographyData.best_clients}`,
        `Clientes preferidos: ${biographyData.preferred_clients}`,
        biographyData.avoid_clients ? `Clientes a evitar: ${biographyData.avoid_clients}` : null,
        biographyData.additional_info ? `Informações adicionais: ${biographyData.additional_info}` : null,
      ].filter(Boolean).join('\n')

      // Fazer a chamada para a API do OpenAI
      const response = await fetch("/api/generate-icp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          biography: formattedBiography
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao gerar ICP")
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || "Erro ao gerar ICP")
      }
      
      // Salvar o ICP gerado no perfil do usuário
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ icp: data.icp })
        .eq("id", userId)

      if (updateError) throw updateError

      console.log('Saving ICP to history...')
      
      // Salvar no histórico
      const { success: historySaved, error: historyError, data: historyData } = await saveIcpToHistory(data.icp, supabase)
      
      if (historyError) {
        console.error("Error saving to history:", historyError)
        toast.error("O ICP foi gerado mas houve um erro ao salvar no histórico")
      } else {
        console.log('ICP saved to history successfully:', historyData)
      }

      setIcp(data.icp)
      toast.success("ICP gerado com sucesso!")
    } catch (error) {
      console.error("Error generating ICP:", error)
      toast.error("Erro ao gerar ICP")
    } finally {
      setGeneratingIcp(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(icp)
    toast.success("ICP copiado para a área de transferência")
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Meu Radar</h1>
        <p className="text-lg font-light text-gray-600">Seu radar para encontrar clientes que realmente compram.</p>
      </div>

      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="space-y-4 max-w-4xl mx-auto">
          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-4">
            <AccordionItem value="biography" className="border rounded-lg bg-white shadow-sm">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <h2 className="text-xl font-medium">Biografia</h2>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {biography && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="whitespace-pre-wrap">{biography}</p>
                    </div>
                    <BiographyForm 
                      onBiographyComplete={(bio) => setBiography(bio)} 
                      hasExistingBiography={true}
                    />
                  </div>
                )}
                {!biography && (
                  <BiographyForm 
                    onBiographyComplete={(bio) => setBiography(bio)}
                    hasExistingBiography={false}
                  />
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="icp" className="border rounded-lg bg-white shadow-sm">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <h2 className="text-xl font-medium">Perfil de Cliente Ideal (ICP)</h2>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Aqui é onde você descreve o seu cliente ideal em detalhes. Esta é a informação que alimentará quase todos os agentes.
                  </p>
                  <div className="flex justify-end">
                    <Button
                      onClick={generateIcp}
                      disabled={generatingIcp || !biography}
                    >
                      {generatingIcp ? "Gerando..." : "Gerar"}
                    </Button>
                  </div>

                  {icp && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 prose max-w-none">
                        <ReactMarkdown>{icp}</ReactMarkdown>
                      </div>
                      <Button
                        variant="outline"
                        onClick={copyToClipboard}
                      >
                        Copiar texto
                      </Button>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}
