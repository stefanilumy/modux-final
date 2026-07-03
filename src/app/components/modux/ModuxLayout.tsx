import { Outlet, useLocation, Link } from 'react-router';
import { Home, History, FileText, Plug, Settings, User, ChevronRight, ChevronLeft, HelpCircle, BookOpen, Code, Lightbulb, PenLine } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/study', icon: BookOpen, label: 'Estudar' },
  { path: '/program', icon: Code, label: 'Programar' },
  { path: '/brainstorm', icon: Lightbulb, label: 'Brainstorm' },
  { path: '/write', icon: PenLine, label: 'Escrever' },
  { path: '/history', icon: History, label: 'Histórico' },
  { path: '/files', icon: FileText, label: 'Arquivos' },
  { path: '/connectors', icon: Plug, label: 'Conectores' },
  { path: '/settings', icon: Settings, label: 'Configurações' },
  { path: '/help', icon: HelpCircle, label: 'Ajuda' },
];

export function ModuxLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#fafafa]">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu lateral"
          className="fixed top-4 left-4 z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="px-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MODUX
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Recolher menu lateral"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                state={item.path === '/' ? { resetHomeChat: Date.now() } : undefined}
                onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => toast('Em breve', { description: 'O perfil ainda não está disponível no protótipo.' })}
            aria-label="Abrir perfil"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Usuário
              </p>
              <p className="text-xs text-gray-500">Perfil</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 overflow-auto transition-[padding-left] duration-300 ${sidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}>
        <Outlet />
      </main>
    </div>
  );
}
