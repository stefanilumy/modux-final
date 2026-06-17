import { useState } from "react";
import {
  Lightbulb,
  ArrowRight,
  X,
  CheckCircle,
} from "lucide-react";
import { askLLM } from "@/lib/llm.ts";
import ReactMarkdown from 'react-markdown';
import { useHistory } from '@/app/context/HistoryContext'

const knowledgeLevels = [
  "Nada ainda",
  "Sei o básico",
  "Tenho dúvida em exercícios",
];

interface LearningStep {
  number: number;
  title: string;
  description: string;
  content: string;
}

export function StudyMode() {
  const [question, setQuestion] = useState("");
  const [showGuided, setShowGuided] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showFullAnswer, setShowFullAnswer] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [learningSteps, setLearningSteps] = useState<LearningStep[]>([]);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [aiFullAnswer, setAiFullAnswer] = useState<string | null>(null);

  const { addConversation } = useHistory();

  const handleStartGuided = () => {
    setShowGuided(true);
    setSelectedLevel(null);
    setCurrentStep(0);
    setCompletedSteps([]);
    setLearningSteps([]);
    setAiHint(null);
    setShowHint(false);
    setAiFullAnswer(null);
    setShowFullAnswer(false);
  };

  const handleSelectLevel = async (level: string) => {
    setSelectedLevel(level);
    setLoading(true);
    setLearningSteps([]);
    try {
      const response = await askLLM(
        `Você é um tutor didático. Responda APENAS com um array JSON válido, sem texto antes ou depois, sem markdown, sem blocos de código.
         O array deve ter exatamente 3 objetos com os campos: number (1, 2 ou 3), title (string), description (string curta), content (explicação em 2-3 frases).
         Adapte o conteúdo ao nível do aluno.`,
        `Pergunta do aluno: ${question}. Nível: ${level}.`
      );
      const parsed = JSON.parse(response);
      setLearningSteps(parsed);
      addConversation({
        title: question,
        preview: parsed[0]?.title ?? question,
        category: 'study',
        hasFiles: false,
        conversation: [
          { role: 'user', content: `${question}. Nível: ${level}.` },
          { role: 'ai', content: response },
        ]
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < learningSteps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
      setShowHint(false);
      setAiHint(null);
    }
  };

  const handleShowHint = async () => {
    if (showHint) {
      setShowHint(false);
      return;
    }
    setLoading(true);
    try {
      const currentContent = learningSteps[currentStep]?.content ?? '';
      const response = await askLLM(
        `Você é um tutor didático. Dê uma dica curta em 1-2 frases em português para ajudar o aluno a entender melhor o conteúdo atual. Seja encorajador.`,
        `Nível do aluno: ${selectedLevel}. Conteúdo atual: ${currentContent}`
      );
      setAiHint(response);
      setShowHint(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShowFullAnswer = async () => {
    setLoading(true);
    try {
      const response = await askLLM(
        `Você é um tutor didático. Responda em português de forma completa e didática, cobrindo definição, exemplo prático e regras principais. Use no máximo 4 parágrafos.`,
        `Pergunta do aluno: ${question}. Nível: ${selectedLevel ?? 'não informado'}.`
      );
      setAiFullAnswer(response);
      setShowFullAnswer(true);
      addConversation({
        title: question,
        preview: response.slice(0, 80),
        category: 'study',
        hasFiles: true,
        generatedFiles: [
          {
            id: crypto.randomUUID(),
            name: `Resumo - ${question.slice(0, 40)}`,
            type: 'Resumo',
            date: new Date().toISOString(),
            category: 'study',
            preview: response.slice(0, 120),
            content: response,
          },
        ],
        conversation: [
          {
            role: 'user',
            content: question,
          },
          {
            role: 'ai',
            content: response,
          },
        ],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modo Estudo</h1>
        <p className="text-gray-600">Aprender antes de responder.</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#fafafa] px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Question Input */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="block font-medium text-gray-900 mb-3">
              Qual é sua pergunta?
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Como funcionam derivadas?"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "100ms" }}>
            <button
              onClick={handleStartGuided}
              disabled={loading || !question.trim()}
              className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              Me guie
            </button>
            <button
              onClick={handleShowFullAnswer}
              disabled={loading || !question.trim()}
              className="flex-1 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Carregando...' : 'Resposta direta'}
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-gray-500 py-4">Gerando conteúdo...</div>
          )}

          {/* Guided Learning Section */}
          {showGuided && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Level Selection */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 mb-3">
                      Antes da resposta: o que você já sabe sobre o assunto?
                    </p>
                    <div className="space-y-2">
                      {knowledgeLevels.map((level) => (
                        <button
                          key={level}
                          onClick={() => handleSelectLevel(level)}
                          disabled={loading}
                          className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                            selectedLevel === level
                              ? "bg-blue-600 text-white shadow-md scale-105"
                              : "bg-white text-gray-700 hover:bg-blue-100 hover:scale-102"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Path */}
              {learningSteps.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="font-bold text-gray-900 mb-6">Fluxo de aprendizado</h3>
                  <div className="space-y-4">
                    {learningSteps.map((step, index) => (
                      <div key={step.number}>
                        <div
                          className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
                            index === currentStep
                              ? "bg-blue-50 border-2 border-blue-400 shadow-md"
                              : completedSteps.includes(index)
                                ? "bg-green-50 border border-green-300"
                                : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-all ${
                              completedSteps.includes(index)
                                ? "bg-green-600 text-white"
                                : index === currentStep
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {completedSteps.includes(index) ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              step.number
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                            {index === currentStep && (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                                <p className="text-sm text-gray-700 leading-relaxed">{step.content}</p>
                              </div>
                            )}
                          </div>
                          {index === currentStep && (
                            <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 animate-pulse" />
                          )}
                        </div>
                        {index < learningSteps.length - 1 && (
                          <div className="w-px h-4 bg-gray-300 ml-8" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3 flex-wrap">
                    <button
                      onClick={handleShowHint}
                      disabled={loading}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 hover:scale-105"
                    >
                      💡 Quero dica
                    </button>
                    {currentStep < learningSteps.length - 1 && (
                      <button
                        onClick={handleNextStep}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        Próximo passo →
                      </button>
                    )}
                    <button
                      onClick={handleShowFullAnswer}
                      disabled={loading}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                    >
                      Ver resposta completa
                    </button>
                  </div>
                </div>
              )}

              {/* Hint Panel */}
              {showHint && aiHint && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 animate-in fade-in slide-in-from-right-4 duration-300 relative">
                  <button
                    onClick={() => setShowHint(false)}
                    className="absolute top-4 right-4 p-1 hover:bg-amber-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-amber-700" />
                  </button>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-3">Dica:</h3>
                      <p className="text-amber-800">{aiHint}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Answer */}
              {showFullAnswer && aiFullAnswer && (
                <div className="bg-white border-2 border-purple-300 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">Resposta Completa</h3>
                    <button
                      onClick={() => setShowFullAnswer(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <ReactMarkdown>{aiFullAnswer ?? ''}</ReactMarkdown>
                </div>
              )}
        </div>
      </div>
    </div>
  );
}