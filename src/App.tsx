import React, { useState, useRef, useCallback } from 'react';
import { 
  Box, 
  CssBaseline, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Divider, 
  IconButton, 
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
  ListItemIcon,
  Badge,
  Collapse,
  Slider,
  Tooltip,
  Card,
  CardContent,
  Switch
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
// Chat-related icons
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonIcon from '@mui/icons-material/Person';
import SvgIcon from '@mui/material/SvgIcon';

// Custom logo for Chat Playground
const PlaygroundLogo = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 36 36">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="bubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Background circle with gradient */}
    <circle cx="18" cy="18" r="16" fill="url(#logoGradient)" />
    
    {/* Chat bubble shapes */}
    <path d="M10,11 L18,11 C19.1046,11 20,11.8954 20,13 L20,18 C20,19.1046 19.1046,20 18,20 L13,20 L10,23 L10,20 L9,20 C7.89543,20 7,19.1046 7,18 L7,13 C7,11.8954 7.89543,11 9,11 L10,11 Z" 
      fill="white" opacity="0.92" />
    
    <path d="M18,16 L26,16 C27.1046,16 28,16.8954 28,18 L28,23 C28,24.1046 27.1046,25 26,25 L21,25 L18,28 L18,25 L17,25 C15.8954,25 15,24.1046 15,23 L15,18 C15,16.8954 15.8954,16 17,16 L18,16 Z" 
      fill="url(#bubbleGradient)" opacity="0.9" filter="url(#glow)" />
    
    {/* Sparkle elements */}
    <circle cx="13" cy="15.5" r="1" fill="#FF9900" />
    <circle cx="23" cy="21" r="1" fill="#f472b6" />
    <circle cx="22" cy="19" r="0.6" fill="white" />
    
    {/* Speech lines */}
    <path d="M11,15 L15,15" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11,17 L16,17" stroke="#8b5cf6" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M20,19 L24,19" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M20,21 L25,21" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
  </SvgIcon>
);

// Custom SVG icons for AI providers
const AnthropicIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <defs>
      <linearGradient id="anthropicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z" fill="currentColor" />
    <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7z M15,13H9v-2h6V13z" fill="white" opacity="0.85" />
  </SvgIcon>
);

const OpenAIIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5093-2.6067-1.4997z" fill="currentColor" />
  </SvgIcon>
);

// Amazon icon
const AmazonIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M15.39 14.56C14.71 14.1 14.53 13.77 14.53 13.4C14.53 13.01 14.97 12.56 15.67 12.56C16.11 12.56 16.58 12.71 16.94 13.09L17.25 12.53C16.82 12.12 16.19 11.89 15.59 11.89C14.5 11.89 13.76 12.61 13.76 13.47C13.76 14.16 14.1 14.67 14.95 15.26C15.67 15.76 15.79 16.1 15.79 16.47C15.79 16.94 15.35 17.31 14.71 17.31C14.06 17.31 13.5 16.97 13.13 16.5L12.76 17.03C13.27 17.65 14.04 17.96 14.74 17.96C15.95 17.96 16.58 17.21 16.58 16.36C16.58 15.59 16.17 15.13 15.39 14.56M18.38 14.77C18.38 15.81 18.77 16.76 19.51 17.23C20.12 17.62 20.93 17.68 21.6 17.46C21.8 17.4 22.01 17.28 22.12 17.25L21.89 16.62L21.71 16.67C21.57 16.72 21.44 16.77 21.29 16.81C20.84 16.93 20.39 16.94 19.93 16.71C19.38 16.43 19.05 15.63 19.05 14.77C19.05 13.91 19.38 13.07 19.95 12.79C20.41 12.57 20.84 12.58 21.29 12.69C21.5 12.74 21.71 12.82 21.89 12.87L22.12 12.27C21.88 12.17 21.67 12.08 21.38 12.02C20.11 11.77 19.1 12.25 18.68 13.16C18.5 13.54 18.38 14.16 18.38 14.77M12.4 11.96L11.05 17.88H11.77L13.13 11.96C13.13 11.96 12.4 11.96 12.4 11.96M3.38 12.31C3.38 12.94 2.85 12.94 2.58 12.94H1.8V11.66H2.58C2.85 11.66 3.38 11.66 3.38 12.31M4.68 17.9H5.4V15.01H6.27C6.61 15.01 6.94 15.11 7.16 15.31C7.5 15.61 7.5 16.09 7.5 16.33C7.5 16.56 7.5 17.05 7.16 17.34C6.94 17.55 6.62 17.65 6.27 17.65H4.68C4.68 17.9 4.68 17.9 4.68 17.9M6.16 14.35H5.4V13H6.16C6.94 13 6.94 13.62 6.94 13.67C6.94 13.72 6.94 14.35 6.16 14.35M3.38 17.9H4.12V15.07H3.38V17.9ZM4.12 14.42V13H3.38V14.42H4.12ZM1.09 17.9H1.8V15.07H2.58C2.84 15.07 3.38 15.07 3.38 15.75C3.38 16.5 2.74 16.5 2.58 16.5H1.8V17.9C1.8 17.9 1.09 17.9 1.09 17.9M8.4 17.9H9.12V13H8.4V17.9ZM10.45 17.9H11.17V13H10.45V17.9ZM22.56 13H21.84V17.9H22.56V13ZM8.77 12.34C8.77 12.12 8.59 11.96 8.37 11.96C8.14 11.96 7.96 12.12 7.96 12.34C7.96 12.57 8.14 12.74 8.37 12.74C8.59 12.74 8.77 12.57 8.77 12.34M10.82 12.34C10.82 12.12 10.64 11.96 10.42 11.96C10.2 11.96 10.02 12.12 10.02 12.34C10.02 12.57 10.2 12.74 10.42 12.74C10.64 12.74 10.82 12.57 10.82 12.34" fill="currentColor" />
  </SvgIcon>
);

// Simple dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#ff6688', // Anthropic color
    },
    success: {
      main: '#10b981', // OpenAI color
    },
    background: {
      default: '#1e293b',
      paper: '#0f172a',
    },
  },
});

interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'csv' | 'excel' | 'text' | 'other';
  size: number;
  url: string;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  attachments?: Attachment[];
}

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  defaultTokens: number;
  defaultTemperature: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  modelId: string;
}

const App: React.FC = () => {
  // Available models
  const models: Model[] = [
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'anthropic',
      description: 'Balanced performance and speed',
      maxTokens: 180000,
      defaultTokens: 4096,
      defaultTemperature: 0.7
    },
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'anthropic',
      description: 'Fast and efficient Claude model',
      maxTokens: 150000,
      defaultTokens: 4096,
      defaultTemperature: 0.7
    },
    {
      id: 'amazon-nova-pro',
      name: 'Amazon Nova Pro',
      provider: 'amazon',
      description: 'Amazon\'s most powerful model with reasoning',
      maxTokens: 64000,
      defaultTokens: 4096,
      defaultTemperature: 0.7
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      description: 'Most capable OpenAI model',
      maxTokens: 128000,
      defaultTokens: 4096,
      defaultTemperature: 0.7
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'openai',
      description: 'OpenAI\'s optimized GPT-4 model',
      maxTokens: 128000,
      defaultTokens: 4096,
      defaultTemperature: 0.7
    },
    {
      id: 'o1-mini',
      name: 'o1-mini',
      provider: 'openai',
      description: 'Fast and efficient OpenAI model',
      maxTokens: 32000,
      defaultTokens: 2048,
      defaultTemperature: 0.7
    }
  ];
  
  // Chat data
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Welcome Chat',
      messages: [
        {
          id: '1',
          content: 'Welcome to Chat Playground! Type a message to start.',
          isUser: false
        }
      ],
      createdAt: Date.now(),
      modelId: 'amazon-nova-pro'
    }
  ]);
  
  const [currentChatId, setCurrentChatId] = useState<string>('1');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('amazon-nova-pro');
  const [showAttach, setShowAttach] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [streamResponse, setStreamResponse] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Get current chat
  const currentChat = chats.find(chat => chat.id === currentChatId) || chats[0];

  // Get current model
  const getCurrentModel = () => {
    return models.find(model => model.id === selectedModel) || models[0];
  };

  // Handle model change
  const handleModelChange = (event: SelectChangeEvent) => {
    const modelId = event.target.value;
    setSelectedModel(modelId);
    
    // Update settings based on selected model
    const model = models.find(m => m.id === modelId);
    if (model) {
      setTemperature(model.defaultTemperature);
      setMaxTokens(model.defaultTokens);
      
      // Update current chat's model ID
      if (currentChatId) {
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === currentChatId 
              ? { ...chat, modelId: modelId } 
              : chat
          )
        );
      }
    }
  };
  
  // Handle temperature change
  const handleTemperatureChange = (_event: Event, newValue: number | number[]) => {
    setTemperature(newValue as number);
  };
  
  // Handle max tokens change
  const handleMaxTokensChange = (_event: Event, newValue: number | number[]) => {
    setMaxTokens(newValue as number);
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    const model = getCurrentModel();
    setTemperature(model.defaultTemperature);
    setMaxTokens(model.defaultTokens);
  };

  // Create a new chat
  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [
        {
          id: Date.now().toString(),
          content: 'Start a new conversation here!',
          isUser: false
        }
      ],
      createdAt: Date.now(),
      modelId: selectedModel,
    };
    
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
  };

  // Delete a chat
  const handleDeleteChat = (chatId: string) => {
    const newChats = chats.filter(chat => chat.id !== chatId);
    setChats(newChats);
    
    // If we deleted the current chat, select another one
    if (currentChatId === chatId && newChats.length > 0) {
      setCurrentChatId(newChats[0].id);
    }
  };

  // Get icon for file type
  const getFileIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'pdf':
        return <PictureAsPdfIcon />;
      case 'image':
        return <ImageIcon />;
      case 'csv':
      case 'excel':
        return <TableChartIcon />;
      case 'text':
        return <DescriptionIcon />;
      default:
        return <AttachFileIcon />;
    }
  };

  // Process files (common function for both drop and select)
  const processFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;
    
    // Process each file
    const newAttachments: Attachment[] = Array.from(files).map(file => {
      // Determine file type
      let fileType: Attachment['type'] = 'other';
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      if (file.type.includes('pdf') || extension === 'pdf') {
        fileType = 'pdf';
      } else if (file.type.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        fileType = 'image';
      } else if (file.type.includes('csv') || extension === 'csv') {
        fileType = 'csv';
      } else if (['xls', 'xlsx', 'sheet'].some(ext => file.type.includes(ext) || extension === ext)) {
        fileType = 'excel';
      } else if (file.type.includes('text') || ['txt', 'md', 'js', 'ts', 'html', 'css'].includes(extension)) {
        fileType = 'text';
      }
      
      return {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: fileType,
        size: file.size,
        url: URL.createObjectURL(file)
      };
    });
    
    setAttachments(prev => [...prev, ...newAttachments]);
    setShowAttach(true);
  }, []);
  
  // Handle file upload via file input
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    processFiles(Array.from(files));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);
  
  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, [processFiles]);
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  // Remove an attachment
  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  // Send a message in the current chat
  const handleSendMessage = () => {
    if (!inputMessage.trim() && attachments.length === 0) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    
    const updatedChats = chats.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, userMessage],
          // Update title for new chats based on first message
          title: chat.messages.length <= 1 ? 
            (inputMessage.trim() ? inputMessage.slice(0, 20) + '...' : `Chat with ${attachments.length} file(s)`) 
            : chat.title
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setInputMessage('');
    setAttachments([]);
    setShowAttach(false);
    setIsLoading(true);
    
    // Simulate response after delay
    setTimeout(() => {
      // Create a different response based on whether there are attachments
      let responseContent = '';
      
      if (attachments.length > 0) {
        const fileTypes = attachments.map(a => a.type).join(', ');
        responseContent = `I've received your message with ${attachments.length} attachment(s) (${fileTypes}). `;
        responseContent += inputMessage.trim() ? `About your message: "${inputMessage}"` : 'Let me know if you need help with these files.';
      } else {
        // No longer include model settings directly in the response
        responseContent = `This is a ${getCurrentModel().name} response to: "${inputMessage}"`;
      }
      
      // If streaming is enabled, simulate it by sending response in chunks
      if (streamResponse) {
        const words = responseContent.split(' ');
        let currentContent = '';
        let msgId = Date.now().toString();
        
        // Add initial empty message
        setChats(prevChats => 
          prevChats.map(chat => {
            if (chat.id === currentChatId) {
              return {
                ...chat,
                messages: [
                  ...chat.messages, 
                  { id: msgId, content: currentContent, isUser: false }
                ]
              };
            }
            return chat;
          })
        );
        
        // Simulate streaming by updating the message with more content
        const wordInterval = setInterval(() => {
          if (words.length > 0) {
            const nextWord = words.shift() || '';
            currentContent += (currentContent ? ' ' : '') + nextWord;
            
            setChats(prevChats => 
              prevChats.map(chat => {
                if (chat.id === currentChatId) {
                  return {
                    ...chat,
                    messages: chat.messages.map(msg => 
                      msg.id === msgId ? { ...msg, content: currentContent } : msg
                    )
                  };
                }
                return chat;
              })
            );
          } else {
            clearInterval(wordInterval);
            setIsLoading(false);
          }
        }, 100); // Add a word every 100ms
        
        return; // Exit early for streaming mode
      }
      
      // For non-streaming mode, add the full response at once
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false
      };
      
      setChats(prevChats => 
        prevChats.map(chat => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, botMessage]
            };
          }
          return chat;
        })
      );
      
      setIsLoading(false);
    }, 1000);
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ display: 'flex', height: '100vh' }}
        onDragEnter={handleDragEnter}
      >
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                p: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <PlaygroundLogo 
                sx={{ 
                  fontSize: 42,
                  mr: 1.5
                }}
              />
              <Box>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ 
                    color: 'white',
                    lineHeight: 1.1,
                    letterSpacing: '0.5px'
                  }}
                >
                  Chat
                </Typography>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ 
                    color: 'white',
                    lineHeight: 1.1,
                    letterSpacing: '0.5px',
                    opacity: 0.9
                  }}
                >
                  Playground
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleNewChat}
              sx={{ mb: 2 }}
            >
              New Chat
            </Button>
          </Box>
          
          <Divider />
          
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {chats.map((chat) => (
              <ListItem 
                key={chat.id}
                disablePadding
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    size="small"
                    onClick={() => handleDeleteChat(chat.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={chat.id === currentChatId}
                  onClick={() => setCurrentChatId(chat.id)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemText 
                    primary={chat.title}
                    secondary={formatDate(chat.createdAt)}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontWeight: chat.id === currentChatId ? 'medium' : 'normal',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              &copy; {new Date().getFullYear()} Chat Playground
            </Typography>
          </Box>
        </Drawer>
        
        {/* Main content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {/* Model selector and settings */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  labelId="model-select-label"
                  id="model-select"
                  value={selectedModel}
                  label="Model"
                  onChange={handleModelChange}
                  sx={{ 
                    bgcolor: 'background.paper',
                    '& .MuiSelect-select': { 
                      display: 'flex', 
                      alignItems: 'center' 
                    }
                  }}
                >
                  {models.map((model) => (
                    <MenuItem key={model.id} value={model.id} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          mr: 1.5,
                          bgcolor: 'transparent',
                          border: '1px solid',
                          borderColor: model.provider === 'anthropic' 
                            ? 'secondary.main' 
                            : model.provider === 'amazon' 
                              ? '#FF9900'
                              : 'success.main',
                          color: model.provider === 'anthropic' 
                            ? 'secondary.main' 
                            : model.provider === 'amazon' 
                              ? '#FF9900'
                              : 'success.main'
                        }}
                      >
                        {model.provider === 'anthropic' 
                          ? <AnthropicIcon sx={{ fontSize: 18 }} /> 
                          : model.provider === 'amazon'
                            ? <AmazonIcon sx={{ fontSize: 18 }} />
                            : <OpenAIIcon sx={{ fontSize: 18 }} />
                        }
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{model.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{model.description}</Typography>
                      </Box>
                      {model.id === currentChat.modelId && (
                        <Chip 
                          label="Current" 
                          size="small" 
                          color={model.provider === 'anthropic' 
                            ? 'secondary' 
                            : model.provider === 'amazon' 
                              ? 'warning'
                              : 'success'}
                          variant="outlined"
                          sx={{ ml: 1, fontSize: '0.65rem' }}
                        />
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <IconButton 
                onClick={() => setShowSettings(!showSettings)} 
                sx={{ ml: 1 }}
                color={showSettings ? "primary" : "default"}
              >
                <TuneIcon />
              </IconButton>
            </Box>
            
            {/* Compact model settings chip display */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              <Tooltip title="Temperature controls randomness (0 = deterministic, 1 = creative)">
                <Chip
                  size="small"
                  label={`Temp: ${temperature.toFixed(1)}`}
                  color={temperature > 0.7 ? "secondary" : "primary"}
                  variant="outlined"
                  onClick={() => setShowSettings(true)}
                />
              </Tooltip>
              
              <Tooltip title="Maximum length of the response">
                <Chip
                  size="small"
                  label={`Max: ${(maxTokens >= 1000) ? `${(maxTokens/1000).toFixed(1)}K` : maxTokens}`}
                  color="primary"
                  variant="outlined"
                  onClick={() => setShowSettings(true)}
                />
              </Tooltip>
              
              <Tooltip title={streamResponse ? "Streaming enabled" : "Streaming disabled"}>
                <Chip
                  size="small"
                  icon={streamResponse ? <TuneIcon fontSize="small" /> : undefined}
                  label="Stream"
                  color={streamResponse ? "success" : "default"}
                  variant="outlined"
                  onClick={() => setStreamResponse(!streamResponse)}
                />
              </Tooltip>
            </Box>
            
            {/* Settings dialog/popup - appears when settings icon is clicked */}
            {showSettings && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '80px',
                  right: '20px',
                  zIndex: 1000,
                  width: 360,
                  maxWidth: '90vw',
                  transform: 'translateX(0)',
                  animation: 'fadeIn 0.2s ease-out',
                  '@keyframes fadeIn': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(-10px)'
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                <Card
                  elevation={6}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'rgba(30, 41, 59, 0.98)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2, 
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Model Settings
                    </Typography>
                    <IconButton size="small" onClick={() => setShowSettings(false)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <CardContent sx={{ p: 2, pt: 3 }}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Temperature: {temperature.toFixed(1)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {temperature === 0 ? 'Deterministic' : temperature < 0.4 ? 'Precise' : temperature < 0.7 ? 'Balanced' : 'Creative'}
                          </Typography>
                        </Box>
                        <Tooltip title="Controls randomness: 0 = deterministic, 1 = creative">
                          <HelpOutlineIcon fontSize="small" sx={{ opacity: 0.7 }} />
                        </Tooltip>
                      </Box>
                      <Slider
                        value={temperature}
                        onChange={handleTemperatureChange}
                        min={0}
                        max={1}
                        step={0.1}
                        marks={[
                          { value: 0, label: '0' },
                          { value: 0.5, label: '0.5' },
                          { value: 1, label: '1' }
                        ]}
                        sx={{
                          color: temperature > 0.7 ? '#9c27b0' : 'primary.main',
                          '& .MuiSlider-thumb': {
                            transition: 'all 0.2s ease',
                            boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.1)',
                          },
                          '& .MuiSlider-thumb:hover': {
                            boxShadow: '0 0 0 10px rgba(99, 102, 241, 0.2)',
                          }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Max Tokens: {maxTokens.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round((maxTokens / getCurrentModel().maxTokens) * 100)}% of {getCurrentModel().name} limit
                          </Typography>
                        </Box>
                        <Tooltip title="Maximum length of the response">
                          <HelpOutlineIcon fontSize="small" sx={{ opacity: 0.7 }} />
                        </Tooltip>
                      </Box>
                      <Slider
                        value={maxTokens}
                        onChange={handleMaxTokensChange}
                        min={256}
                        max={getCurrentModel().maxTokens}
                        step={256}
                        sx={{
                          '& .MuiSlider-thumb': {
                            transition: 'all 0.2s ease',
                          }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 1,
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      border: '1px solid',
                      borderColor: streamResponse ? 'rgba(99, 102, 241, 0.2)' : 'divider',
                    }}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">Stream Response</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Show response as it's being generated
                        </Typography>
                      </Box>
                      <Switch 
                        checked={streamResponse}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStreamResponse(e.target.checked)}
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    p: 2, 
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'rgba(0,0,0,0.1)'
                  }}>
                    <Button 
                      size="small" 
                      startIcon={<SettingsIcon />}
                      onClick={handleResetSettings}
                    >
                      Reset to Defaults
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => setShowSettings(false)}
                    >
                      Done
                    </Button>
                  </Box>
                </Card>
              </Box>
            )}
          </Box>
          
          <Paper
            sx={{
              p: 2,
              flexGrow: 1,
              mb: 2,
              overflow: 'auto',
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: 'background.paper',
            }}
          >
            {currentChat.messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                  backgroundColor: message.isUser ? 'primary.dark' : 'background.default',
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                  maxWidth: '70%',
                  boxShadow: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {message.isUser ? (
                    <Avatar 
                      sx={{ 
                        width: 28, 
                        height: 28, 
                        mr: 1,
                        bgcolor: 'primary.main',
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  ) : (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        mr: 1,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                          opacity: 0.7,
                        }}
                      />
                      <SmartToyIcon
                        sx={{
                          width: 18,
                          height: 18,
                          zIndex: 1,
                          color: 'white',
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))',
                        }}
                      />
                    </Box>
                  )}
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={message.isUser ? {} : {
                      background: 'linear-gradient(to right, #8b5cf6, #d946ef)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'medium',
                    }}
                  >
                    {message.isUser ? 'You' : 'Assistant'}
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ mb: message.attachments?.length ? 2 : 0 }}>
                  {message.content}
                </Typography>
                
                {message.attachments && message.attachments.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      size="small" 
                      label={`${message.attachments.length} attachment(s)`} 
                      sx={{ mb: 1 }} 
                    />
                    <Paper
                      variant="outlined"
                      sx={{
                        overflow: 'hidden',
                        borderRadius: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <List dense disablePadding>
                        {message.attachments.map((attachment) => (
                          <ListItem 
                            key={attachment.id}
                            divider
                            dense
                            secondaryAction={
                              message.isUser && (
                                <IconButton 
                                  edge="end" 
                                  size="small" 
                                  aria-label="view"
                                  component="a"
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <AttachFileIcon fontSize="small" />
                                </IconButton>
                              )
                            }
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {getFileIcon(attachment.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={attachment.name}
                              secondary={formatFileSize(attachment.size)}
                              primaryTypographyProps={{ variant: 'body2' }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
          
          {/* File attachment panel */}
          <Collapse in={showAttach} timeout={300}>
            <Paper
              ref={dropAreaRef}
              sx={{
                p: 2,
                mb: 2,
                bgcolor: 'background.default',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                border: '1px solid',
                borderColor: isDragging ? 'primary.main' : 'divider',
                boxShadow: isDragging ? '0 0 15px rgba(99, 102, 241, 0.3)' : 'none',
                position: 'relative',
                overflow: 'visible',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDragging && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'primary.main',
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.main',
                      mb: 2
                    }}
                  >
                    <AttachFileIcon sx={{ fontSize: 30, color: 'white' }} />
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight="medium"
                    color="primary"
                  >
                    Release to Upload
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Your files will be automatically attached
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">
                  Attachments ({attachments.length})
                </Typography>
                <IconButton size="small" onClick={() => setShowAttach(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              
              {attachments.length > 0 ? (
                <List dense disablePadding>
                  {attachments.map((attachment) => (
                    <ListItem 
                      key={attachment.id}
                      sx={{ 
                        bgcolor: 'rgba(15, 23, 42, 0.4)', 
                        borderRadius: 2,
                        mb: 1,
                        transition: 'all 0.2s ease',
                        border: '1px solid',
                        borderColor: 'rgba(255,255,255,0.05)',
                        overflow: 'hidden',
                        backdropFilter: 'blur(8px)',
                        position: 'relative',
                        '&:hover': {
                          bgcolor: 'rgba(15, 23, 42, 0.7)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          '&::before': {
                            opacity: 0.8
                          }
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '3px',
                          height: '100%',
                          bgcolor: 'primary.main',
                          opacity: 0
                        }
                      }}
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          size="small" 
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          sx={{
                            color: 'error.light',
                            opacity: 0.7,
                            '&:hover': {
                              opacity: 1,
                              color: 'error.main',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: attachment.type === 'pdf' ? '#f44336' : 
                               attachment.type === 'image' ? '#2196f3' : 
                               attachment.type === 'csv' || attachment.type === 'excel' ? '#4caf50' : 
                               '#ff9800',
                          mr: 1.5,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        {getFileIcon(attachment.type)}
                      </Box>
                      <ListItemText
                        primary={attachment.name}
                        secondary={formatFileSize(attachment.size)}
                        primaryTypographyProps={{ 
                          variant: 'body2', 
                          fontWeight: 'medium',
                          sx: { 
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box'
                          }
                        }}
                        secondaryTypographyProps={{ 
                          variant: 'caption',
                          sx: { opacity: 0.7 }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box 
                  sx={{ 
                    py: 3, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                      mb: 2,
                      border: '1px solid',
                      borderColor: 'rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    <AttachFileIcon sx={{ color: 'primary.main', fontSize: 26 }} />
                  </Box>
                  
                  <Typography variant="subtitle2" align="center" sx={{ mb: 0.5 }}>
                    Drag & drop files here
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    or
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    component="label"
                    sx={{ 
                      mt: 2,
                      borderRadius: '20px',
                      px: 3,
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      }
                    }}
                  >
                    Browse Files
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                    />
                  </Button>
                  
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    align="center"
                    sx={{ mt: 2, opacity: 0.7 }}
                  >
                    Supports all file types
                  </Typography>
                </Box>
              )}
              
              {attachments.length > 0 && (
                <Box 
                  sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    borderTop: '1px solid',
                    borderColor: 'rgba(255,255,255,0.1)',
                    pt: 2
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    component="label"
                    startIcon={<AttachFileIcon />}
                    sx={{ 
                      borderRadius: '20px',
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      }
                    }}
                  >
                    Add More
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                    />
                  </Button>
                  
                  <Button
                    variant="text"
                    size="small"
                    color="error"
                    onClick={() => setAttachments([])}
                    sx={{ 
                      borderRadius: '20px',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.05)',
                      }
                    }}
                  >
                    Remove All
                  </Button>
                </Box>
              )}
            </Paper>
          </Collapse>

          {/* Message input */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ position: 'relative', display: 'flex', flexGrow: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
                multiline
                maxRows={3}
              />
              <IconButton 
                sx={{ position: 'absolute', right: 45, bottom: 8 }}
                onClick={() => setShowAttach(!showAttach)}
                color={attachments.length > 0 ? "primary" : "default"}
              >
                <Badge badgeContent={attachments.length} color="primary">
                  <AttachFileIcon />
                </Badge>
              </IconButton>
            </Box>
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={isLoading || (!inputMessage.trim() && attachments.length === 0)}
            >
              Send
            </Button>
          </Box>
          
          {/* Hidden file input */}
          <input
            type="file"
            multiple
            hidden
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;