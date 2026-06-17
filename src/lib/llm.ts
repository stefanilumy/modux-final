const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

interface GroqResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
  error?: {
    message?: string;
  };
}

export async function askLLM(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Chave da Groq não encontrada. Verifique se o arquivo .env contém VITE_GROQ_API_KEY.'
    );
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  const data: GroqResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message ?? 'Erro ao chamar a API da Groq.');
  }

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('A API respondeu, mas não retornou conteúdo.');
  }

  return content;
}