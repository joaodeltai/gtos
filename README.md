# GestorOS

Sistema inteligente que auxilia Gestores de Tráfego de forma precisa e eficiente, potencializando suas vendas através de um direcionamento mais assertivo.

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Supabase (Autenticação e Banco de Dados)
- OpenAI API
- TailwindCSS
- Shadcn/ui

## Requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Chave de API da OpenAI

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` baseado no `.env.example`
   - Preencha as variáveis com suas chaves

4. Execute o projeto:
```bash
npm run dev
```

## Funcionalidades

- Autenticação completa (cadastro, login, recuperação de senha)
- Gerenciamento de perfil de usuário
- Geração de ICP (Ideal Customer Profile) via IA
- Editor de biografia com salvamento automático
- Formatação Markdown para textos gerados
