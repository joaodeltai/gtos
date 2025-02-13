"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import type { Database } from "@/types/supabase"

const formSchema = z.object({
  nameAndRole: z.string().min(2, {
    message: "Nome e cargo devem ter pelo menos 2 caracteres.",
  }),
  companyName: z.string().min(2, {
    message: "Nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  niche: z.string().min(2, {
    message: "O nicho deve ter pelo menos 2 caracteres.",
  }),
  helpDescription: z.string().min(10, {
    message: "Descreva com pelo menos 10 caracteres como você ajuda seus clientes.",
  }),
  services: z.string().min(10, {
    message: "Descreva seus serviços com pelo menos 10 caracteres.",
  }),
  experience: z.string().min(1, {
    message: "Informe seus anos de experiência.",
  }),
  achievements: z.string().min(10, {
    message: "Descreva suas conquistas com pelo menos 10 caracteres.",
  }),
  recognition: z.string(),
  differential: z.string().min(10, {
    message: "Descreva seu diferencial com pelo menos 10 caracteres.",
  }),
  bestClients: z.string().min(10, {
    message: "Descreva seus melhores clientes com pelo menos 10 caracteres.",
  }),
  preferredClients: z.string().min(10, {
    message: "Descreva seus clientes preferidos com pelo menos 10 caracteres.",
  }),
  avoidClients: z.string(),
  additionalInfo: z.string().max(500, {
    message: "O texto não pode ter mais de 500 caracteres.",
  }),
})

interface BiographyFormProps {
  onBiographyComplete: (biography: string) => void
  hasExistingBiography: boolean
}

const questions = [
  {
    field: 'nameAndRole' as const,
    label: 'Qual é o seu nome e cargo?',
    placeholder: 'Ex: João Silva - Gestor de Tráfego'
  },
  {
    field: 'companyName' as const,
    label: 'Qual é o nome da sua empresa?',
    placeholder: 'Ex: Agência Digital Silva'
  },
  {
    field: 'niche' as const,
    label: 'Qual seu nicho de atuação?',
    placeholder: 'Ex: E-commerce de moda ou "nicho aberto"'
  },
  {
    field: 'helpDescription' as const,
    label: 'Como você ajuda seus clientes?',
    placeholder: 'Descreva como seu trabalho impacta seus clientes'
  },
  {
    field: 'services' as const,
    label: 'Quais são os principais serviços ou produtos que você oferece?',
    placeholder: 'Liste seus principais serviços/produtos'
  },
  {
    field: 'experience' as const,
    label: 'Quantos anos de experiência você tem no mercado?',
    placeholder: 'Ex: 5 anos'
  },
  {
    field: 'achievements' as const,
    label: 'Quais são suas principais conquistas profissionais?',
    placeholder: 'Ex: Faturamento, número de clientes, prêmios, cases de sucesso'
  },
  {
    field: 'recognition' as const,
    label: 'Você já apareceu na mídia, foi premiado ou recebeu reconhecimento público?',
    placeholder: 'Se sim, descreva. Se não, deixe em branco ou escreva "não"'
  },
  {
    field: 'differential' as const,
    label: 'Tem algum diferencial que faz seu serviço ser único no mercado?',
    placeholder: 'Descreva o que torna seu serviço especial'
  },
  {
    field: 'bestClients' as const,
    label: 'Quem são seus melhores clientes hoje?',
    placeholder: 'Descreva o perfil, segmento, porte da empresa, ticket médio, etc.'
  },
  {
    field: 'preferredClients' as const,
    label: 'Que tipo de cliente você mais gosta de atender e por quê?',
    placeholder: 'Descreva seu cliente ideal'
  },
  {
    field: 'avoidClients' as const,
    label: 'Existe algum cliente ou segmento que você quer evitar?',
    placeholder: 'Se sim, descreva. Se não, deixe em branco ou escreva "não"'
  },
  {
    field: 'additionalInfo' as const,
    label: 'Preencha abaixo com informações sobre você e sua empresa que podem ser pertinentes para desenvolver seu ICP:',
    placeholder: 'Informações adicionais (máximo 500 caracteres)',
    type: 'textarea'
  }
]

export function BiographyForm({ onBiographyComplete, hasExistingBiography }: BiographyFormProps) {
  const [step, setStep] = useState(0)
  const [started, setStarted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [completed, setCompleted] = useState(hasExistingBiography)
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const supabase = createClientComponentClient<Database>()

  const currentQuestion = questions[step]
  const isLastQuestion = step === questions.length - 1

  const currentSchema = z.object({
    [currentQuestion.field]: formSchema.shape[currentQuestion.field as keyof typeof formSchema.shape]
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      nameAndRole: "",
      companyName: "",
      niche: "",
      helpDescription: "",
      services: "",
      experience: "",
      achievements: "",
      recognition: "",
      differential: "",
      bestClients: "",
      preferredClients: "",
      avoidClients: "",
      additionalInfo: "",
    },
  })

  function onSubmit(values: Partial<z.infer<typeof formSchema>>) {
    const currentValue = values[currentQuestion.field] as string

    // Salvar a resposta atual
    const updatedAnswers = {
      ...savedAnswers,
      [currentQuestion.field]: currentValue
    }
    setSavedAnswers(updatedAnswers)

    if (!isLastQuestion) {
      // Avançar para a próxima pergunta
      setStep(prev => prev + 1)
      // Limpar o campo após um pequeno delay
      setTimeout(() => {
        form.setValue(currentQuestion.field, '')
      }, 0)
    } else {
      // Formatar biografia com todas as respostas, incluindo a última
      const formattedBiography = [
        `Nome e Cargo: ${updatedAnswers.nameAndRole}`,
        `Empresa: ${updatedAnswers.companyName}`,
        `Nicho: ${updatedAnswers.niche}`,
        `Como ajuda: ${updatedAnswers.helpDescription}`,
        `Serviços: ${updatedAnswers.services}`,
        `Experiência: ${updatedAnswers.experience}`,
        `Conquistas: ${updatedAnswers.achievements}`,
        updatedAnswers.recognition ? `Reconhecimento: ${updatedAnswers.recognition}` : null,
        `Diferencial: ${updatedAnswers.differential}`,
        `Melhores clientes: ${updatedAnswers.bestClients}`,
        `Clientes preferidos: ${updatedAnswers.preferredClients}`,
        updatedAnswers.avoidClients ? `Clientes a evitar: ${updatedAnswers.avoidClients}` : null,
        updatedAnswers.additionalInfo ? `Informações adicionais: ${updatedAnswers.additionalInfo}` : null,
      ].filter(Boolean).join('\n')

      // Salvar no Supabase
      saveBiography(updatedAnswers)

      onBiographyComplete(formattedBiography)
      setStarted(false)
      setStep(0)
      setCompleted(true)
      setIsEditing(false)
      setSavedAnswers({})
      form.reset()
    }
  }

  // Resetar o formulário quando o step mudar
  useEffect(() => {
    form.reset({
      nameAndRole: "",
      companyName: "",
      niche: "",
      helpDescription: "",
      services: "",
      experience: "",
      achievements: "",
      recognition: "",
      differential: "",
      bestClients: "",
      preferredClients: "",
      avoidClients: "",
      additionalInfo: "",
    })
  }, [step, form])

  async function saveBiography(answers: Record<string, string>) {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não encontrado')

      const biographyData = {
        user_id: user.id,
        name_and_role: answers.nameAndRole,
        company_name: answers.companyName,
        niche: answers.niche,
        help_description: answers.helpDescription,
        services: answers.services,
        experience: answers.experience,
        achievements: answers.achievements,
        recognition: answers.recognition || null,
        differential: answers.differential,
        best_clients: answers.bestClients,
        preferred_clients: answers.preferredClients,
        avoid_clients: answers.avoidClients || null,
        additional_info: answers.additionalInfo || null,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('biographies')
        .upsert(biographyData)

      if (error) throw error

      toast.success('Biografia salva com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar biografia:', error)
      toast.error('Erro ao salvar biografia')
    } finally {
      setLoading(false)
    }
  }

  if ((completed || hasExistingBiography) && !isEditing) {
    return (
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setIsEditing(true)
            setStarted(true)
            setStep(0)
            setSavedAnswers({})
            form.reset()
          }}
        >
          Refazer
        </Button>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p className="text-sm text-gray-600 text-center max-w-md">
          Vamos começar a construir seu perfil profissional. Este processo é simples e rápido.
        </p>
        <Button onClick={() => setStarted(true)}>
          Começar agora
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name={currentQuestion.field}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{currentQuestion.label}</FormLabel>
              <FormControl>
                {currentQuestion.type === 'textarea' ? (
                  <Textarea 
                    placeholder={currentQuestion.placeholder} 
                    {...field} 
                    className="resize-none"
                    maxLength={500}
                  />
                ) : (
                  <Input placeholder={currentQuestion.placeholder} {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          {step > 0 && (
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setStep(prev => prev - 1)}
            >
              Voltar
            </Button>
          )}
          <div className="ml-auto">
            <Button type="submit" disabled={loading}>
              {isLastQuestion ? "Concluir" : "Próximo"}
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-500 text-center">
          Pergunta {step + 1} de {questions.length}
        </div>
      </form>
    </Form>
  )
}
