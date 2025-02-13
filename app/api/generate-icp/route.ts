import { NextResponse } from "next/server"
import { openai } from "@/lib/openai"
import { ICP_SYSTEM_PROMPT } from "@/lib/prompts"

export async function POST(req: Request) {
  try {
    // Verificar se a API key está configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key não está configurada")
      return NextResponse.json(
        { error: "OpenAI API key não está configurada" },
        { status: 500 }
      )
    }

    const { biography } = await req.json()

    if (!biography) {
      return NextResponse.json(
        { error: "Biography is required" },
        { status: 400 }
      )
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: ICP_SYSTEM_PROMPT
          },
          {
            role: "user",
            content: `Aqui está a biografia do usuário para você gerar o ICP:\n\n${biography}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      })

      const icp = completion.choices[0].message.content

      if (!icp) {
        throw new Error("OpenAI não retornou conteúdo")
      }

      // Garantir que a resposta seja um JSON válido
      return NextResponse.json({ 
        success: true,
        icp: icp.trim() 
      })
    } catch (openaiError: any) {
      console.error("Erro na chamada da OpenAI:", openaiError)
      return NextResponse.json(
        { 
          success: false, 
          error: openaiError?.message || "Erro ao gerar ICP" 
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Erro geral:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || "Erro interno do servidor" 
      },
      { status: 500 }
    )
  }
}
