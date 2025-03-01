import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, ChatStateData, Chat, ChatMessage, Attachment, LLMModel, ParameterPreset } from '../types';

// Parameter presets
export const parameterPresets: ParameterPreset[] = [
  {
    name: 'Precise',
    description: 'Highly deterministic with minimal randomness (best for factual Q&A)',
    temperature: 0.1,
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0
  },
  {
    name: 'Balanced',
    description: 'Default middle-ground settings for general use',
    temperature: 0.7,
    topP: 0.95,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0
  },
  {
    name: 'Creative',
    description: 'High variability for more novel and diverse outputs',
    temperature: 0.9,
    topP: 1.0,
    frequencyPenalty: 0.3,
    presencePenalty: 0.2
  },
  {
    name: 'Very Creative',
    description: 'Maximum creativity and variability (stories, brainstorming)',
    temperature: 1.0,
    topP: 1.0,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5
  }
];

// Available LLM models
const models: LLMModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'ChatGPT 4.5',
    provider: 'openai',
    description: 'Most capable GPT-4 model for complex tasks',
    maxTokens: 128000,
    defaultTokens: 4096,
    defaultTemperature: 0.7,
    capabilities: ['text', 'code', 'reasoning'],
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'OpenAI o3-mini',
    provider: 'openai',
    description: 'Fast and efficient model for general purpose tasks',
    maxTokens: 16000,
    defaultTokens: 2048,
    defaultTemperature: 0.7,
    capabilities: ['text', 'code'],
  },
  {
    id: 'amazon-nova-pro',
    name: 'Amazon Nova Pro',
    provider: 'amazon',
    description: 'Amazon\'s most powerful model with enhanced reasoning',
    maxTokens: 64000,
    defaultTokens: 4096,
    defaultTemperature: 0.7,
    capabilities: ['text', 'code', 'reasoning', 'images'],
  },
  {
    id: 'amazon-nova-canvas',
    name: 'Amazon Nova Canvas',
    provider: 'amazon',
    description: 'Amazon\'s multimodal model specialized for creative tasks',
    maxTokens: 128000,
    defaultTokens: 4096,
    defaultTemperature: 0.8,
    capabilities: ['text', 'code', 'reasoning', 'images', 'creative'],
  },
  {
    id: 'amazon-nova-lite',
    name: 'Amazon Nova Lite',
    provider: 'amazon',
    description: 'Amazon\'s general purpose model with strong reasoning',
    maxTokens: 32000,
    defaultTokens: 2048,
    defaultTemperature: 0.7,
    capabilities: ['text', 'code', 'reasoning'],
  },
  {
    id: 'amazon-nova-micro',
    name: 'Amazon Nova Micro',
    provider: 'amazon',
    description: 'Fast and efficient model for simpler tasks',
    maxTokens: 16000,
    defaultTokens: 1024,
    defaultTemperature: 0.7,
    capabilities: ['text', 'code'],
  },
];

// Initial state
const initialState: ChatStateData = {
  chats: [],
  currentChatId: null,
  models,
  selectedModelId: 'amazon-nova-pro',
  maxTokens: 4096,
  temperature: 0.7,
  topP: 0.95,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  isLoading: false,
  error: null,
};

// Force state reset on load by using a different storage key
export const useStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Chat actions
      createChat: () => {
        const { selectedModelId } = get();
        const newChat: Chat = {
          id: uuidv4(),
          title: 'New Chat',
          messages: [],
          modelId: selectedModelId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }));

        return newChat.id;
      },

      deleteChat: (chatId: string) => {
        const { chats, currentChatId } = get();
        const newChats = chats.filter((chat) => chat.id !== chatId);
        
        // If we're deleting the current chat, select another one or null
        const newCurrentChatId = 
          currentChatId === chatId
            ? newChats.length > 0 
              ? newChats[0].id 
              : null
            : currentChatId;
            
        set({
          chats: newChats,
          currentChatId: newCurrentChatId,
        });
      },

      setCurrentChat: (chatId: string) => {
        set({ currentChatId: chatId });
      },

      updateChatTitle: (chatId: string, title: string) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, title, updatedAt: Date.now() }
              : chat
          ),
        }));
      },

      // Message actions
      addMessage: (chatId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const { selectedModelId } = get();
        const newMessage: ChatMessage = {
          ...message,
          id: uuidv4(),
          timestamp: Date.now(),
          // Add modelId to assistant messages
          ...(message.role === 'assistant' ? { modelId: selectedModelId } : {})
        };

        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  updatedAt: Date.now(),
                  // If this is the first message, update the title based on content
                  ...(chat.messages.length === 0 && message.role === 'user'
                    ? { title: message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '') }
                    : {}),
                }
              : chat
          ),
        }));

        return newMessage.id;
      },

      // Attachment actions
      addAttachment: (messageId: string, attachment: Omit<Attachment, 'id'>) => {
        const newAttachment: Attachment = {
          ...attachment,
          id: uuidv4(),
        };

        set((state) => ({
          chats: state.chats.map((chat) => ({
            ...chat,
            messages: chat.messages.map((message) =>
              message.id === messageId
                ? {
                    ...message,
                    attachments: [...(message.attachments || []), newAttachment],
                  }
                : message
            ),
            updatedAt: Date.now(),
          })),
        }));

        return newAttachment.id;
      },

      removeAttachment: (messageId: string, attachmentId: string) => {
        set((state) => ({
          chats: state.chats.map((chat) => ({
            ...chat,
            messages: chat.messages.map((message) =>
              message.id === messageId && message.attachments
                ? {
                    ...message,
                    attachments: message.attachments.filter(
                      (a) => a.id !== attachmentId
                    ),
                  }
                : message
            ),
            updatedAt: Date.now(),
          })),
        }));
      },

      // Model selection
      setSelectedModel: (modelId: string) => {
        const model = models.find(m => m.id === modelId);
        if (model) {
          set({ 
            selectedModelId: modelId,
            maxTokens: model.defaultTokens || 4096,
            temperature: model.defaultTemperature || 0.7
          });
        } else {
          set({ selectedModelId: modelId });
        }
      },
      
      // Model parameter settings
      setMaxTokens: (tokens: number) => {
        set({ maxTokens: tokens });
      },
      
      setTemperature: (temp: number) => {
        set({ temperature: temp });
      },
      
      setTopP: (value: number) => {
        set({ topP: value });
      },
      
      setFrequencyPenalty: (value: number) => {
        set({ frequencyPenalty: value });
      },
      
      setPresencePenalty: (value: number) => {
        set({ presencePenalty: value });
      },
      
      applyParameterPreset: (preset: ParameterPreset) => {
        set({ 
          temperature: preset.temperature,
          topP: preset.topP,
          frequencyPenalty: preset.frequencyPenalty,
          presencePenalty: preset.presencePenalty
        });
      },

      // Loading state
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // Error handling
      setError: (error: string | null) => {
        set({ error });
      },

      // Clear entire state
      clearState: () => {
        set(initialState);
      },
    }),
    {
      name: 'chat-playground-storage-v2', // Changed storage key to force reset
    }
  )
);