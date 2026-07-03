# Modux - Interface Inteligente para Modelos de Linguagem

Um projeto de pesquisa em **IHC/UX** que reimagina como interagimos com modelos de linguagem (LLMs), criando interfaces contextualizadas para diferentes tipos de tarefas e reduzindo a dependência indiscriminada de IA.

## 🔗 Acesso Rápido

- **Projeto online:** https://modux-final.vercel.app/

## 🎯 Objetivo

Replanejar a interface de LLMs (como ChatGPT, Claude, Gemini) explorando diferentes interfaces para diferentes tarefas. O Modux diferencia contextos de uso como:

- **Pesquisa Rápida** - Buscas diretas e respostas imediatas
- **Pesquisa Acadêmica** - Investigação profunda com referências
- **Conversa** - Diálogo natural e exploração de ideias
- **Brainstorming** - Geração criativa de conceitos
- **Programação** - Resolução de problemas técnicos
- **Aprendizado Guiado** - Educação passo a passo

O projeto busca criar uma interface que **não encoraje a dependência** aos modelos de linguagem, promovendo uso consciente e intencional da IA.

## 📊 Metodologia

### Análise Comparativa
Realizamos análise profunda das interfaces de:
- Claude
- ChatGPT
- Gemini
- Mistral
- Qwen
- Outras plataformas de LLM

### Pesquisa de Usuários
Coletamos dados através de pesquisa qualitativa sobre:
- Preocupações e limitações dos usuários com IA
- Padrões de uso diário de LLMs
- Percepção de funcionalidades disponíveis e ausentes
- Necessidades específicas por contexto de uso

## 🎨 Funcionalidades

### Modos de Operação
O Modux oferece interfaces especializadas para diferentes contextos:

- **📚 Estudar** - Aprendizado passo a passo com explicações estruturadas
- **💻 Programar** - Resolução de problemas técnicos e debugging
- **💡 Brainstorm** - Exploração criativa e geração de ideias
- **✍️ Escrever** - Revisão e organização de textos
- **🎓 Aprendizado Guiado** - Tutoriais estruturados e progressivos

### Recursos Adicionais
- **📋 Histórico** - Acompanhamento de conversas anteriores
- **📁 Arquivos** - Gerenciamento de documentos e contextos
- **🔗 Conectores** - Integração com outras ferramentas e plataformas
- **⚙️ Configurações** - Personalização da experiência do usuário

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **TypeScript** - Interface robusta e type-safe
- **Vite** - Build tool rápido e otimizado
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** (Radix UI) - Componentes acessíveis e reutilizáveis
- **React Router** - Navegação entre modos

### Backend/API
- **Groq API** - Integração com modelos de linguagem (llama-3.1-8b-instant)
- **Context API** - Gerenciamento de estado (histórico de conversas)

### Design & UX
- **Lucide React** - Ícones consistentes
- **Motion** - Animações suaves
- **Canvas Confetti** - Efeitos visuais

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Chave de API do Groq (obtenha em https://console.groq.com)

### Instalação e Setup

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd modux-final
```

2. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com sua chave de API:
```env
VITE_GROQ_API_KEY=sua_chave_de_api_aqui
```

3. **Instale as dependências**
```bash
npm install
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

O servidor será iniciado em `http://localhost:5173`

### Build para Produção
```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── modux/          # Componentes dos diferentes modos
│   │   │   ├── ModuxHome.tsx
│   │   │   ├── StudyMode.tsx
│   │   │   ├── ProgramMode.tsx
│   │   │   ├── BrainstormMode.tsx
│   │   │   ├── GuidedLearning.tsx
│   │   │   ├── ModuxHistory.tsx
│   │   │   ├── ModuxFiles.tsx
│   │   │   ├── ModuxSettings.tsx
│   │   │   └── ...
│   │   ├── ui/             # Componentes UI reutilizáveis
│   │   └── figma/          # Componentes Figma
│   ├── context/
│   │   └── HistoryContext.tsx  # Gerenciamento de histórico
│   ├── routes.tsx          # Definição de rotas
│   └── App.tsx
├── lib/
│   └── llm.ts              # Integração com API Groq
└── styles/
    └── ...
```

## 🎓 Insights Principais

Este projeto evidencia que a interação com LLMs não é one-size-fits-all. Diferentes tarefas requerem diferentes abordagens de interface:

- **Aprendizado** necessita de progressão estruturada
- **Programação** demanda clareza técnica e debugging
- **Criatividade** beneficia de exploração aberta
- **Pesquisa acadêmica** requer fontes e referências

Ao diferenciar essas experiências, promovemos uso mais intencional e consciente da IA.

## 📝 Licença

Projeto acadêmico de IHC/UX
