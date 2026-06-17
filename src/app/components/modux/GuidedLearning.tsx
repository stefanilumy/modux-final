import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { askLLM } from '@/lib/llm.ts'

const levels = ['Nada ainda', 'Sei o básico', 'Só tenho dúvida em exercício'];

export function GuidedLearning() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [hint, setHint] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSelectLevel = async (level: string) => {
    setSelectedLevel(level);
    setLoading(true);
    setExplanation('');
    setShowHint(false);
    try {
      const response = await askLLM(
        `Você é um tutor didático. Responda sempre em português, de forma clara e acessível.
         Explique o conceito de derivadas em 3-4 frases, adaptado ao nível do aluno.
         Termine com uma analogia do cotidiano para fixar o conceito.`,
        `Nível do aluno: ${level}.`
      );
      setExplanation(response);
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleHint = async () => {
    setLoading(true);
    try {
      const response = await askLLM(
        `Você é um tutor didático. Responda sempre em português.
         Dê uma dica curta (2 frases) sobre derivadas para um aluno com o seguinte nível: ${selectedLevel}.
         Seja encorajador e objetivo.`,
        `Explique o conceito já dado: ${explanation}`
      );
      setHint(response);
      setShowHint(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    setLoading(true);
    setShowHint(false);
    try {
      const response = await askLLM(
        `Você é um tutor didático. Responda sempre em português.
         Dê um exemplo prático com um exercício simples sobre derivadas.
         Adapte ao nível: ${selectedLevel}.
         Formato: explique brevemente, depois apresente o exercício.`,
        `Contexto já explicado ao aluno: ${explanation}`
      );
      setExplanation(response);
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/study')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Aprendizado Guiado</h1>
            <p className="text-gray-600 mt-1">Passo {step} de 3</p>
          </div>
        </div>
      </header>

      <main className="px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Passo 1 — Seleção de nível */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">IA</span>
              </div>
              <div className="flex-1">
                <p className="text-lg text-gray-900 mb-6">
                  Antes da resposta: o que você já sabe sobre derivadas?
                </p>
                <div className="flex flex-wrap gap-3">
                  {levels.map((level) => (
                    <button
                      key={level}
                      onClick={() => handleSelectLevel(level)}
                      disabled={loading || !!selectedLevel}
                      className={`px-6 py-3 rounded-lg transition-colors font-medium border ${
                        selectedLevel === level
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-blue-300 hover:bg-blue-100'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-gray-500 py-4">Gerando explicação...</div>
          )}

          {/* Passo 2 — Explicação da IA */}
          {explanation && (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">IA</span>
                </div>
                <p className="text-lg text-gray-900 pt-2">Vamos começar com uma explicação.</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 mb-6">
                <div className="flex items-center justify-center h-32 mb-4">
                  <TrendingUp className="w-20 h-20 text-blue-400" />
                </div>
                <p className="text-gray-700 text-center text-sm">
                  A derivada mede a taxa de variação de uma função em um ponto
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
                <p className="text-gray-800 whitespace-pre-wrap">{explanation}</p>
              </div>

              {/* Dica */}
              {showHint && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 text-sm">{hint}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleHint}
                  disabled={loading}
                  className="px-6 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  {loading ? 'Carregando...' : 'Quero dica'}
                </button>
                {step < 3 && (
                  <button
                    onClick={handleNextStep}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {loading ? 'Carregando...' : 'Mostrar próximo passo'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}