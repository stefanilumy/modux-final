import { useState } from 'react';
import { Lightbulb, Plus, Sparkles, Link2, TrendingUp, X } from 'lucide-react';
import { askLLM } from '@/lib/llm';
import { useHistory } from '@/app/context/HistoryContext'

const categories = ['Produto', 'Marketing', 'Conteúdo', 'Design', 'Tecnologia'];
const techniques = ['Mind Map', 'SCAMPER', 'Brainstorming Reverso', '6 Chapéus'];

interface Idea {
  id: number;
  text: string;
  category: string;
  connections: number[];
}

export function BrainstormMode() {
  const [topic, setTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Produto');
  const [selectedTechnique, setSelectedTechnique] = useState('Mind Map');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const { addConversation } = useHistory();

  const handleAddIdea = () => {
    if (!newIdea.trim()) return;

    const idea: Idea = {
      id: Date.now(),
      text: newIdea,
      category: selectedCategory,
      connections: [],
    };

    setIdeas([...ideas, idea]);
    setNewIdea('');
  };

  const handleGenerateSuggestions = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setShowSuggestions(false);
    try {
      const response = await askLLM(
        `Você é um assistente de brainstorming criativo. Responda sempre em português. 
        Gere exatamente 5 ideias criativas e distintas, uma por linha, sem numeração, sem explicações extras.`,
        `Tema: ${topic}. Categoria: ${selectedCategory}. Técnica: ${selectedTechnique}.`
        );
      setAiResponse(response);

      addConversation({
        title: topic,
        preview: response.split('\n')[0],
        category: 'brainstorm',
        hasFiles: false,
        conversation: [
          { role: 'user', content: `Tema: ${topic}. Categoria: ${selectedCategory}. Técnica: ${selectedTechnique}.` },
          { role: 'ai', content: response },
        ]
      });

      setShowSuggestions(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestion = (suggestion: string) => {
    const idea: Idea = {
      id: Date.now(),
      text: suggestion,
      category: selectedCategory,
      connections: [],
    };
    setIdeas([...ideas, idea]);
  };

  const handleRemoveIdea = (id: number) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modo Brainstorm</h1>
        <p className="text-gray-600">Explore ideias criativas e conexões inovadoras.</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#fafafa] px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Topic Input */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="block font-medium text-gray-900 mb-3">
              Sobre o que você quer gerar ideias?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Aplicativo de produtividade para estudantes"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
            />
          </div>

          {/* Options */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-900 mb-3">Categoria</label>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedCategory === cat
                          ? 'bg-amber-600 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-900 mb-3">Técnica</label>
                <div className="flex gap-2 flex-wrap">
                  {techniques.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setSelectedTechnique(tech)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedTechnique === tech
                          ? 'bg-amber-600 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
            <button
              onClick={handleGenerateSuggestions}
              className="flex items-center justify-center gap-2 py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
              disabled={loading}
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Gerando...' : 'Gerar sugestões'}
            </button>
            <button className="py-4 bg-white text-gray-700 border-2 border-amber-500 rounded-xl font-semibold hover:bg-amber-50 hover:scale-105 transition-all duration-300">
              <Link2 className="w-5 h-5 inline mr-2" />
              Conectar ideias
            </button>
          </div>

          {/* AI Suggestions */}
          {showSuggestions && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-2">Sugestões da IA</h3>
                  <p className="text-amber-800 text-sm mb-4">
                    Baseado no tema "{topic || 'Aplicativo de produtividade para estudantes'}", aqui estão algumas ideias:
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                {aiResponse.split('\n').filter(l => l.trim()).map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-white border border-amber-200 rounded-lg p-4 hover:shadow-md hover:scale-102 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleAddSuggestion(suggestion)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900 group-hover:text-amber-700 transition-colors">{suggestion}</p>
                      <Plus className="w-5 h-5 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Idea */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
            <label className="block font-medium text-gray-900 mb-3">
              Adicionar nova ideia
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddIdea()}
                placeholder="Digite sua ideia..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
              />
              <button
                onClick={handleAddIdea}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar
              </button>
            </div>
          </div>

          {/* Ideas Board */}
          {ideas.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Suas Ideias ({ideas.length})</h3>
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ideas.map((idea, index) => (
                  <div
                    key={idea.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group relative"
                  >
                    <button
                      onClick={() => handleRemoveIdea(idea.id)}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                    >
                      <X className="w-4 h-4 text-gray-600 hover:text-red-600" />
                    </button>
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">{idea.text}</p>
                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                          {idea.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '400ms' }}>
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Dica para Brainstorming</h3>
                <p className="text-blue-800 text-sm">
                  Não julgue ideias no início! Gere o máximo de ideias possível primeiro,
                  depois refine e conecte as melhores. Quantidade gera qualidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
