import { useState } from 'react';
import { BarChart3, CheckCircle2, Bell, Palette, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface Setting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function ModuxSettings() {
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: 'guided',
      label: 'Priorizar respostas guiadas',
      description: 'A IA sempre tentará ensinar antes de dar a resposta direta',
      enabled: true,
    },
    {
      id: 'confirm',
      label: 'Pedir confirmação antes da resposta completa',
      description: 'Você será perguntado antes de ver a solução final',
      enabled: true,
    },
    {
      id: 'sources',
      label: 'Mostrar fontes automaticamente',
      description: 'Exibir referências e links de onde a informação veio',
      enabled: false,
    },
    {
      id: 'limit',
      label: 'Limitar respostas automáticas no modo estudo',
      description: 'Evita que a IA responda sem primeiro fazer perguntas',
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">
          Personalize sua experiência com a MODUX.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#fafafa] px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Uso Consciente */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Uso Consciente</h2>
            <div className="space-y-3">
              {settings.map((setting) => (
                <div
                  key={setting.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {setting.label}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {setting.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSetting(setting.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        setting.enabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          setting.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Statistics Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Estatísticas de Uso</h2>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Seu progresso esta semana
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <p className="text-gray-700">
                        Modo estudo: <span className="font-bold">12 vezes</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <p className="text-gray-700">
                        Respostas guiadas: <span className="font-bold">85%</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <p className="text-gray-700">
                        Média de <span className="font-bold">4 perguntas</span> antes da resposta
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Other Settings */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Preferências Gerais</h2>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Notificações</h3>
                    <p className="text-sm text-gray-600">Receber alertas e atualizações</p>
                  </div>
                </div>
                <button
                  onClick={() => toast('Em breve', { description: 'Esta opção ainda não está disponível no protótipo.' })} 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Configurar
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Palette className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Aparência</h3>
                    <p className="text-sm text-gray-600">Tema claro</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast('Em breve', { description: 'Esta opção ainda não está disponível no protótipo.' })}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Alterar
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Idioma</h3>
                    <p className="text-sm text-gray-600">Português (Brasil)</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast('Em breve', { description: 'Esta opção ainda não está disponível no protótipo.' })}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Mudar
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
