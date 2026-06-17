import { BookOpen, Code, Lightbulb, FileText, MessageCircle, Search, FileCheck, X, Clock } from 'lucide-react';
import { useState } from 'react';
import { useHistory, Conversation } from '@/app/context/HistoryContext'
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router';

const categories = {
  general: {
    label: 'Chat geral',
    icon: MessageCircle,
    color: 'bg-gray-50 text-gray-700 border-gray-200',
  },
  study: {
    label: 'Estudos',
    icon: BookOpen,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  program: {
    label: 'Programação',
    icon: Code,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  brainstorm: {
    label: 'Brainstorm',
    icon: Lightbulb,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  write: {
    label: 'Escrita',
    icon: FileText,
    color: 'bg-green-50 text-green-700 border-green-200',
  },
};

const timeFilters = ['Hoje', 'Esta semana', 'Este mês'];

export function ModuxHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Conversation | null>(null);

  const navigate = useNavigate();

  const { conversations, setActiveConversation } = useHistory();

  const matchesDateFilter = (createdAt: string | undefined, filter: string | null) => {
    if (!filter) return true;
    if (!createdAt) return false;

    const itemDate = new Date(createdAt);
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    if (filter === 'Hoje') {
      return itemDate >= startOfToday;
    }

    if (filter === 'Esta semana') {
      return itemDate >= startOfWeek;
    }

    if (filter === 'Este mês') {
      return itemDate >= startOfMonth;
    }

    return true;
  };

  const filteredItems = conversations.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;

    const matchesTime = matchesDateFilter(
      item.createdAt,
      selectedTimeFilter
    );

    return matchesSearch && matchesCategory && matchesTime;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico</h1>
        <p className="text-gray-600">
          Suas conversas organizadas por contexto.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar conversa…"
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Time Filters */}
        <div className="flex gap-2">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() =>
                setSelectedTimeFilter(selectedTimeFilter === filter ? null : filter)
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeFilter === filter
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {Object.entries(categories).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* History Items */}
      <div className="flex-1 overflow-auto bg-[#fafafa] px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredItems.map((item) => {
            const { icon: Icon, color } = categories[item.category];
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${color} border p-3 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.hasFiles && (
                          <FileCheck className="w-4 h-4 text-blue-600" />
                        )}
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                      {item.preview}
                    </p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma conversa encontrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Conversation Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                {(() => {
                  const { icon: Icon, color } = categories[selectedItem.category];
                  return (
                    <div className={`${color} border p-2 rounded-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="font-bold text-gray-900">{selectedItem.title}</h2>
                  <p className="text-xs text-gray-500">{selectedItem.time}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Conversation Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              {selectedItem.conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {message.role === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">M</span>
                    </div>
                  )}
                  <div
                    className={`flex-1 ${
                      message.role === 'user'
                        ? 'ml-auto max-w-[80%]'
                        : 'mr-auto max-w-[80%]'
                    }`}
                  >
                    <div
                      className={`rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown>{message.content ?? ''}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 text-sm font-bold">U</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick = {() => {
                  setActiveConversation(selectedItem);
                  navigate('/');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuar conversa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
