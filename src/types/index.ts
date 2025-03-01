export interface LLMModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'amazon' | 'google' | 'meta';
  description: string;
  maxTokens: number;
  defaultTokens?: number;
  defaultTemperature?: number;
  capabilities: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  modelId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
  content?: string; // For text-based files
}

export type FileType = 'pdf' | 'csv' | 'excel' | 'image' | 'text' | 'other';

export interface ChatStateData {
  chats: Chat[];
  currentChatId: string | null;
  models: LLMModel[];
  selectedModelId: string;
  maxTokens: number;
  temperature: number;
  isLoading: boolean;
  error: string | null;
}

export interface ChatStateActions {
  createChat: () => string;
  deleteChat: (chatId: string) => void;
  setCurrentChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  addMessage: (chatId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  addAttachment: (messageId: string, attachment: Omit<Attachment, 'id'>) => string;
  removeAttachment: (messageId: string, attachmentId: string) => void;
  setSelectedModel: (modelId: string) => void;
  setMaxTokens: (tokens: number) => void;
  setTemperature: (temp: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearState: () => void;
}

export type ChatState = ChatStateData & ChatStateActions;