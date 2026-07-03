import { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export interface GeneratedFile {
  id: string;
  name: string;
  type: 'Texto' | 'Código' | 'Resumo' | 'PDF' | 'Imagem' | 'Planilha' | 'Apresentação';
  date: string;
  category: 'general' | 'study' | 'program' | 'brainstorm' | 'write';
  preview: string;
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  category: 'general' | 'study' | 'program' | 'brainstorm' | 'write';
  time: string;
  createdAt: string;
  hasFiles: boolean;
  generatedFiles?: GeneratedFile[];
  conversation: Message[];
}

interface HistoryContextType {
  conversations: Conversation[];
  addConversation: (conv: Omit<Conversation, 'id' | 'time' | 'createdAt'>) => string;
  updateConversation: (id: string, conv: Omit<Conversation, 'id' | 'time' | 'createdAt'>) => void;
  appendMessage: (id: string, message: Message) => void;
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
}

const HistoryContext = createContext<HistoryContextType | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const addConversation = (conv: Omit<Conversation, 'id' | 'time' | 'createdAt'>) => {
    const now = new Date();

    const newConv: Conversation = {
      ...conv,
      id: Date.now().toString(),
      time: 'Agora',
      createdAt: now.toISOString(),
      generatedFiles: conv.generatedFiles ?? [],
    };

    setConversations((prev) => [newConv, ...prev]);
    return newConv.id;
  };

  const updateConversation = (id: string, conv: Omit<Conversation, 'id' | 'time' | 'createdAt'>) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              ...conv,
              generatedFiles: conv.generatedFiles ?? [],
            }
          : conversation
      )
    );
  };

  const appendMessage = (id: string, message: Message) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id
          ? { ...conv, conversation: [...conv.conversation, message] }
          : conv
      )
    );
  };

  return (
    <HistoryContext.Provider value={{ conversations, addConversation, updateConversation, appendMessage, activeConversation, setActiveConversation }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
}