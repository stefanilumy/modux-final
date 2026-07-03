import { useState } from 'react';
import { Code, Terminal, CheckCircle, Lightbulb, Play, Copy, AlertCircle } from 'lucide-react';
import { askLLM } from '@/lib/llm';
import { useHistory } from '@/app/context/HistoryContext';
import { toast } from 'sonner';

const languages = ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go'];
const helpTypes = ['Erro/Bug', 'Otimização', 'Nova Feature', 'Code Review'];

export function ProgramMode() {
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [selectedHelpType, setSelectedHelpType] = useState('Erro/Bug');
  const [code, setCode] = useState(`File "app.py", line 12, in calculate\n  result = x / y\nZeroDivisionError: division by zero`);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [solutionText, setSolutionText] = useState('');

  const { addConversation } = useHistory();

  const handleAnalyze = async (
    actionType: 'Analisar código' | 'Sugerir correção' | 'Explicar conceito' = 'Analisar código'
  ) => {
    if (!code.trim()) return;

    setLoading(true);
    setShowAnalysis(false);
    setShowSolution(false);

    try {
      const prompts = {
        'Analisar código': `Você é um assistente técnico de programação.
  Responda sempre em português, de forma direta e objetiva.
  Explique o problema identificado em 2-3 frases.
  Depois forneça a solução corrigida.`,

        'Sugerir correção': `Você é um assistente técnico de programação.
  Analise o código ou erro enviado e sugira uma correção prática.
  Explique brevemente por que a correção resolve o problema.
  Use exatamente o formato:
  ANÁLISE: <o que precisa ser corrigido>
  | SOLUÇÃO: <código corrigido ou sugestão de correção>`,

        'Explicar conceito': `Você é um professor de programação.
  Explique o conceito principal relacionado ao código ou erro enviado.
  Use uma explicação didática, com exemplo se necessário.
  Use exatamente o formato:
  ANÁLISE: <conceito identificado>
  | SOLUÇÃO: <explicação didática do conceito>`,
      };

      const response = await askLLM(
        prompts[actionType],
        `Linguagem: ${selectedLanguage}.
  Tipo de ajuda: ${actionType}.

  Código/Erro:
  ${code}`
      );

      const [rawAnalysis, rawSolution] = response.split('| SOLUÇÃO:');

      const formattedAnalysis = rawAnalysis.replace('ANÁLISE:', '').trim();
      const formattedSolution = rawSolution?.trim() ?? '';

      setAnalysisText(formattedAnalysis);
      setSolutionText(formattedSolution);
      setShowAnalysis(true);
      setShowSolution(Boolean(formattedSolution));

      addConversation({
        title: `${actionType} em ${selectedLanguage}`,
        preview: formattedAnalysis.slice(0, 80),
        category: 'program',
        hasFiles: Boolean(formattedSolution),
        generatedFiles: formattedSolution
          ? [
              {
                id: crypto.randomUUID(),
                name: `Código - ${selectedLanguage}`,
                type: 'Código',
                date: new Date().toISOString(),
                category: 'program',
                preview: formattedAnalysis.slice(0, 120),
                content: formattedSolution,
              },
            ]
          : [],
        conversation: [
          {
            role: 'user',
            content: `Linguagem: ${selectedLanguage}. Tipo: ${actionType}.\n${code}`,
          },
          {
            role: 'ai',
            content: response,
          },
        ],
      });
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Não consegui responder agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySolution = async () => {
    if (!solutionText) return;

    try {
      await navigator.clipboard.writeText(solutionText);
      toast.success('Copiado para a área de transferência');
    } catch (error) {
      console.error('Erro ao copiar solução:', error);
      toast.error('Não foi possível copiar.');
    }
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-8 pl-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modo Programação</h1>
        <p className="text-gray-600">Resolva bugs e desenvolva código com precisão.</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#fafafa] px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Options */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-900 mb-3">Linguagem</label>
                <div className="flex gap-2 flex-wrap">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedLanguage === lang
                          ? 'bg-purple-600 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-900 mb-3">Tipo de Ajuda</label>
                <div className="flex gap-2 flex-wrap">
                  {helpTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedHelpType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedHelpType === type
                          ? 'bg-purple-600 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Code Input */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{selectedLanguage}</span>
              </div>
              <button className="p-1.5 hover:bg-gray-800 rounded transition-colors">
                <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 px-4 py-3 bg-gray-900 text-green-400 font-mono text-sm focus:outline-none resize-none"
              placeholder="Cole o código ou erro aqui..."
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
            <button
              onClick={() => handleAnalyze('Analisar código')}
              disabled={loading || !code.trim()}
              className="flex items-center justify-center gap-2 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              {loading ? 'Analisando...' : 'Analisar código'}
            </button>

            <button
              onClick={() => handleAnalyze('Sugerir correção')}
              disabled={loading || !code.trim()}
              className="py-4 bg-white text-gray-700 border-2 border-purple-500 rounded-xl font-semibold hover:bg-purple-50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sugerir correção
            </button>

            <button
              onClick={() => handleAnalyze('Explicar conceito')}
              disabled={loading || !code.trim()}
              className="py-4 bg-white text-gray-700 border-2 border-purple-500 rounded-xl font-semibold hover:bg-purple-50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Explicar conceito
            </button>
          </div>

          {/* Analysis Result */}
          {showAnalysis && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-2">Erro Identificado</h3>
                  <p className="text-red-800 mb-4">{analysisText}</p>
                </div>
              </div>
            </div>
          )}

          {/* Solution */}
          {showSolution && (
            <div className="bg-green-50 border border-green-300 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">Solução Sugerida</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                      <code>{solutionText}</code>
                    </pre>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleCopySolution}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar solução
                    </button>
                    <button className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                      Ver alternativas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">Dica</h3>
                <p className="text-purple-800 text-sm">
                  Sempre valide entradas críticas antes de realizar operações que podem gerar erros.
                  No caso de divisões, verificar se o divisor é diferente de zero é uma boa prática.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
