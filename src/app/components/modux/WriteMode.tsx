import { useState } from 'react';
import { FileText, Loader2, Send, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askLLM } from '@/lib/llm.ts';
import { useHistory } from '@/app/context/HistoryContext';
import { toast } from 'sonner';

export function WriteMode() {
  const [theme, setTheme] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);

  const { addConversation } = useHistory();

  const handleGenerateText = async () => {
    if (!theme.trim() || loading) return;

    setLoading(true);
    setGeneratedText('');

    try {
      const response = await askLLM(
        `Você é um assistente de escrita.
Responda em português.
Crie um texto bem estruturado com introdução, desenvolvimento e conclusão.
O texto deve ser claro, coeso e adequado ao tema informado pelo usuário.`,
        `Tema do texto: ${theme}`
      );

      setGeneratedText(response);

      addConversation({
        title: `Texto sobre ${theme.slice(0, 40)}`,
        preview: response.slice(0, 80),
        category: 'write',
        hasFiles: true,
        generatedFiles: [
            {
            id: crypto.randomUUID(),
            name: `Texto - ${theme.slice(0, 40)}`,
            type: 'Texto',
            date: new Date().toISOString(),
            category: 'write',
            preview: response.slice(0, 120),
            content: response,
            },
        ],
        conversation: [
            {
            role: 'user',
            content: `Tema do texto: ${theme}`,
            },
            {
            role: 'ai',
            content: response,
            },
        ],
    });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = async () => {
    if (!generatedText) return;

    try {
      await navigator.clipboard.writeText(generatedText);
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateText();
    }
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modo Escrever</h1>
        <p className="text-gray-600">
          Informe um tema e gere um texto estruturado com a IA.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#fafafa] px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Theme Input */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Tema do texto</h2>
                <p className="text-sm text-gray-600">
                  Digite o assunto sobre o qual você quer que a IA escreva.
                </p>
              </div>
            </div>

            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Exemplo: A importância da tecnologia na educação"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none transition-all"
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleGenerateText}
                disabled={loading || !theme.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {loading ? 'Gerando texto...' : 'Gerar texto'}
              </button>
            </div>
          </div>

          {/* Generated Text */}
          {generatedText && (
            <div className="bg-white border border-green-300 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Texto gerado</h3>
                  <p className="text-sm text-gray-600">
                    Resultado criado com base no tema informado.
                  </p>
                </div>

                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </button>
              </div>

              <div className="prose prose-sm max-w-none text-gray-800">
                <ReactMarkdown>{generatedText}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}