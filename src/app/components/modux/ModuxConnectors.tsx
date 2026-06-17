import { Mail, Calendar, HardDrive, Github, CheckCircle2, XCircle, User, Code, BookOpen, Palette } from 'lucide-react';
import { useState } from 'react';

const connectors = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Acesse e-mails para contexto e respostas',
    icon: Mail,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    connected: true,
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    description: 'Integre agenda e compromissos',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    connected: true,
  },
  {
    id: 'drive',
    name: 'Google Drive',
    description: 'Conecte documentos e arquivos',
    icon: HardDrive,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    connected: false,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Acesse repositórios e código',
    icon: Github,
    color: 'text-gray-900',
    bgColor: 'bg-gray-50',
    connected: false,
  },
];

const memoryPreferences = [
  {
    id: 'save-preferences',
    title: 'Salvar preferências',
    description: 'Lembrar suas escolhas e configurações',
    enabled: true,
  },
  {
    id: 'context',
    title: 'Lembrar contexto das conversas',
    description: 'Manter histórico e continuidade',
    enabled: true,
  },
  {
    id: 'guided-responses',
    title: 'Priorizar respostas guiadas',
    description: 'Ensinar antes de responder',
    enabled: true,
  },
  {
    id: 'temp-memory',
    title: 'Memória temporária',
    description: 'Esquecer após cada sessão',
    enabled: false,
  },
];

const contextProfiles = [
  { id: 'student', label: 'Estudante', icon: BookOpen, color: 'text-blue-600' },
  { id: 'developer', label: 'Desenvolvedor', icon: Code, color: 'text-purple-600' },
  { id: 'researcher', label: 'Pesquisador', icon: User, color: 'text-green-600' },
  { id: 'creative', label: 'Criativo', icon: Palette, color: 'text-orange-600' },
];

export function ModuxConnectors() {
  const [connectorStates, setConnectorStates] = useState(
    connectors.reduce((acc, conn) => ({ ...acc, [conn.id]: conn.connected }), {} as Record<string, boolean>)
  );

  const [preferenceStates, setPreferenceStates] = useState(
    memoryPreferences.reduce((acc, pref) => ({ ...acc, [pref.id]: pref.enabled }), {} as Record<string, boolean>)
  );

  const [selectedProfile, setSelectedProfile] = useState<string | null>('student');

  const toggleConnector = (id: string) => {
    setConnectorStates({ ...connectorStates, [id]: !connectorStates[id] });
  };

  const togglePreference = (id: string) => {
    setPreferenceStates({ ...preferenceStates, [id]: !preferenceStates[id] });
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conectores e Contexto</h1>
        <p className="text-gray-600">
          Integre ferramentas e personalize sua experiência.
        </p>
      </div>

      <div className="flex-1 bg-[#fafafa] px-8 py-8 space-y-8">
        {/* Connectors Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Conectores Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectors.map((connector) => {
              const Icon = connector.icon;
              const isConnected = connectorStates[connector.id];
              const StatusIcon = isConnected ? CheckCircle2 : XCircle;

              return (
                <div
                  key={connector.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${connector.bgColor} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${connector.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {connector.name}
                        </h3>
                        <StatusIcon
                          className={`w-5 h-5 transition-colors ${
                            isConnected ? 'text-green-600' : 'text-gray-300'
                          }`}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {connector.description}
                      </p>
                      <button
                        onClick={() => toggleConnector(connector.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                          isConnected
                            ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border hover:border-red-300'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {isConnected ? 'Desconectar' : 'Conectar'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Memory and Preferences */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Memória e Preferências</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            {memoryPreferences.map((pref) => {
              const isEnabled = preferenceStates[pref.id];
              return (
                <div
                  key={pref.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {pref.title}
                    </h3>
                    <p className="text-sm text-gray-600">{pref.description}</p>
                  </div>
                  <button
                    onClick={() => togglePreference(pref.id)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 hover:scale-110 ${
                      isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        isEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Context Profiles */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Perfil de Contexto</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-600 mb-4">
              Escolha um perfil para personalizar as respostas da IA:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {contextProfiles.map((profile) => {
                const Icon = profile.icon;
                const isSelected = selectedProfile === profile.id;
                return (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedProfile(profile.id)}
                    className={`border-2 rounded-xl p-4 transition-all duration-300 text-center hover:scale-105 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${profile.color} mx-auto mb-2 ${isSelected ? 'scale-110' : ''} transition-transform`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                      {profile.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
