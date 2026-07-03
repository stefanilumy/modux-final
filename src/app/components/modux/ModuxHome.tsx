import { useLocation, useNavigate } from 'react-router';
import { BookOpen, Code, Lightbulb, FileText, Send, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { askLLM } from '@/lib/llm.ts';
import ReactMarkdown from 'react-markdown';
import { useHistory } from '@/app/context/HistoryContext';
import { toast } from 'sonner';

const modes = [
  {
    id: 'study',
    title: 'Estudar',
    description: 'Aprenda passo a passo.',
    icon: BookOpen,
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300',
    iconColor: 'text-blue-600',
    path: '/study',
  },
  {
    id: 'program',
    title: 'Programar',
    description: 'Resolva problemas técnicos.',
    icon: Code,
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-300',
    iconColor: 'text-purple-600',
    path: '/program',
  },
  {
    id: 'brainstorm',
    title: 'Brainstorm',
    description: 'Explore ideias criativas.',
    icon: Lightbulb,
    color: 'bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-300',
    iconColor: 'text-amber-600',
    path: '/brainstorm',
  },
  {
    id: 'write',
    title: 'Escrever',
    description: 'Crie textos a partir de um tema.',
    icon: FileText,
    color: 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300',
    iconColor: 'text-green-600',
    path: '/write',
  },
];

const quickSuggestions = [
  'Explicar conceito',
  'Revisar texto',
  'Gerar ideias',
  'Corrigir código',
];

export function ModuxHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const handleModeClick = (path: string) => {
    navigate(path);
  };

  const messagesRef = useRef(messages);
  const activeConversationIdRef = useRef<string | null>(null);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const { addConversation, updateConversation, activeConversation, setActiveConversation } = useHistory();

  useEffect(() => {
    if (location.state?.resetHomeChat) {
      setMessages([]);
      setQuestion('');
      setIsLoading(false);
      activeConversationIdRef.current = null;
      setActiveConversation(null);

      navigate('/', { replace: true, state: null });
    }
  }, [location.state, navigate, setActiveConversation]);

  useEffect(() => {
    if (activeConversation) {
      activeConversationIdRef.current = activeConversation.id;
      setMessages(activeConversation.conversation.map(m => ({
        role: m.role,
        content: m.content,
      })));
      setActiveConversation(null);
    }
  }, [activeConversation]);

  /* Cleanup useeffect */
  useEffect(() => {
    return () => {
      if (messagesRef.current.length > 0) {
        const conversationData = {
          title: messagesRef.current[0].content.slice(0, 50),
          preview: messagesRef.current[1]?.content.slice(0, 80) ?? '',
          category: 'general',
          hasFiles: false,
          conversation: messagesRef.current,
        };

        if (activeConversationIdRef.current) {
          updateConversation(activeConversationIdRef.current, conversationData);
          return;
        }

        addConversation(conversationData);
      }
    };
  }, [addConversation, updateConversation]);

  const handleQuickChat = async () => {
    if (!question.trim() || isLoading) return;

    const userMessage = question;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await askLLM(
        `Você é um assistente direto e conciso. Responda em português em no máximo 3 frases.
         Se a pergunta for complexa, sugira usar um dos modos específicos (Estudo, Programação, Brainstorm ou Escrita).`,
         userMessage
        );
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Não consegui responder agora. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuickChat();
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center px-8 py-8">
      <div className="flex w-full max-w-4xl flex-col gap-8">
        
        { messages.length === 0 && (
          <>
                {/* Header Text */}
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    Como você quer usar a IA hoje?
                  </h2>
                  <p className="text-lg text-gray-600">
                    Escolha um modo de interação baseado no seu objetivo.
                  </p>
                </div>
        
                {/* Mode Cards */}
                <div className="flex justify-center gap-4 flex-wrap">
                  {modes.map((mode, index) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => handleModeClick(mode.path)}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className={`${mode.color} border rounded-2xl p-6 w-44 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:scale-105 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8`}
                      >
                        <div className={`${mode.iconColor} mb-3 transition-transform group-hover:scale-110`}>
                          <Icon className="w-10 h-10" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {mode.title}
                        </h3>
                        <p className="text-xs text-gray-600">{mode.description}</p>
                      </button>
                    );
                  })}
                </div>
          </>
        )}

        {/* Quick Response */}
        {messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">M</span>
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm font-bold">U</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">M</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  activeConversationIdRef.current = null;
                  setMessages([]);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Nova conversa
              </button>
            </div>
          </div>
        )}

        {/* Quick Input */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
          <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300 p-4 flex items-center gap-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Faça uma pergunta rápida…"
              className="flex-1 resize-none outline-none text-gray-700 placeholder:text-gray-400 bg-transparent max-h-32"
              rows={1}
            />
            <button
              onClick={handleQuickChat}
              disabled={isLoading || !question.trim()}
              className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {messages.length === 0 && (
          <> 
            {/* Quick Suggestions */}
            <div className="flex justify-center gap-2 flex-wrap animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '500ms' }}>
                {quickSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-400 hover:shadow-sm hover:scale-105 transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </>
          )}
      </div>
    </div>
  );
}
