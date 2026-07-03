import {
  FileText,
  Image,
  Code2,
  FileSpreadsheet,
  Presentation,
  Calendar,
  Search,
  X,
  Download,
  Share2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useHistory, GeneratedFile } from '@/app/context/HistoryContext';
import { toast } from 'sonner';

const fileCategories = [
  'Todos',
  'Texto',
  'Código',
  'Resumo',
  'PDF',
  'Imagem',
  'Planilha',
  'Apresentação',
];

const filterOptions = [
  { label: 'Hoje', value: 'today' },
  { label: 'Esta semana', value: 'week' },
  { label: 'Este mês', value: 'month' },
];

const categoryLabels = {
  general: 'Chat geral',
  study: 'Estudos',
  program: 'Programação',
  brainstorm: 'Brainstorm',
  write: 'Escrita',
};

const getFileVisual = (type: GeneratedFile['type']) => {
  if (type === 'Código') {
    return {
      icon: Code2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    };
  }

  if (type === 'Imagem') {
    return {
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    };
  }

  if (type === 'Planilha') {
    return {
      icon: FileSpreadsheet,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    };
  }

  if (type === 'Apresentação') {
    return {
      icon: Presentation,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    };
  }

  if (type === 'PDF') {
    return {
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    };
  }

  return {
    icon: FileText,
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
  };
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const matchesDateFilter = (date: string, filter: string | null) => {
  if (!filter) return true;

  const fileDate = new Date(date);
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

  if (filter === 'today') {
    return fileDate >= startOfToday;
  }

  if (filter === 'week') {
    return fileDate >= startOfWeek;
  }

  if (filter === 'month') {
    return fileDate >= startOfMonth;
  }

  return true;
};

export function ModuxFiles() {
  const { conversations } = useHistory();

  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const generatedFiles = useMemo(() => {
    return conversations.flatMap((conversation) =>
      (conversation.generatedFiles ?? []).map((file) => ({
        ...file,
        conversationTitle: conversation.title,
      }))
    );
  }, [conversations]);

  const filteredFiles = generatedFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todos' || file.type === selectedCategory;

    const matchesDate = matchesDateFilter(file.date, selectedDateFilter);

    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleDownload = (file: GeneratedFile) => {
    const blob = new Blob([file.content], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const safeName = file.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    link.href = url;
    link.download = `${safeName}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleShare = async (file: GeneratedFile) => {
    try {
      await navigator.clipboard.writeText(file.content);
      toast.success('Copiado para a área de transferência');
    } catch (error) {
      console.error('Erro ao copiar arquivo:', error);
      toast.error('Não foi possível copiar.');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-8 pl-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Arquivos Gerados</h1>
        <p className="text-gray-600">
          Tudo o que foi criado durante suas interações.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar arquivo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() =>
                  setSelectedDateFilter(
                    selectedDateFilter === filter.value ? null : filter.value
                  )
                }
                className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                  selectedDateFilter === filter.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          {fileCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                category === selectedCategory
                  ? 'bg-gray-900 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="flex-1 overflow-auto bg-[#fafafa] px-8 py-8">
        {filteredFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => {
              const visual = getFileVisual(file.type);
              const Icon = visual.icon;

              return (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-2 hover:scale-105 hover:border-blue-400 transition-all duration-300 cursor-pointer group"
                >
                  {/* File Icon */}
                  <div className={`${visual.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${visual.color}`} />
                  </div>

                  {/* File Info */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {file.name}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {file.preview}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                      {categoryLabels[file.category]}
                    </span>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">{formatDate(file.date)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Nenhum arquivo encontrado
            </h3>
            <p className="text-gray-600 text-sm">
              Os conteúdos gerados nos chats aparecerão aqui automaticamente.
            </p>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                {(() => {
                  const visual = getFileVisual(selectedFile.type);
                  const Icon = visual.icon;

                  return (
                    <div className={`${visual.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${visual.color}`} />
                    </div>
                  );
                })()}

                <div>
                  <h2 className="font-bold text-gray-900">{selectedFile.name}</h2>
                  <p className="text-xs text-gray-500">
                    {selectedFile.type} • {formatDate(selectedFile.date)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh]">
              {selectedFile.type === 'Código' ? (
                <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                  <code>{selectedFile.content}</code>
                </pre>
              ) : selectedFile.type === 'Imagem' ? (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-12 flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <Image className="w-24 h-24 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600">{selectedFile.preview}</p>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedFile.content}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3">
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Fechar
              </button>

              <button
                onClick={() => handleDownload(selectedFile)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar
              </button>

              <button
                onClick={() => handleShare(selectedFile)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}