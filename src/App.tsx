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
  Stack,
  Collapse,
  Slider,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Grid
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
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
    </defs>
    <path d="M18,2 C26.8366,2 34,9.16344 34,18 C34,26.8366 26.8366,34 18,34 C9.16344,34 2,26.8366 2,18 C2,9.16344 9.16344,2 18,2 Z" fill="url(#logoGradient)" />
    <path d="M12,12 L24,12 C25.1046,12 26,12.8954 26,14 L26,22 C26,23.1046 25.1046,24 24,24 L12,24 C10.8954,24 10,23.1046 10,22 L10,14 C10,12.8954 10.8954,12 12,12 Z" fill="white" opacity="0.9" />
    <circle cx="14" cy="16" r="1.5" fill="#6366f1" />
    <circle cx="18" cy="16" r="1.5" fill="#8b5cf6" />
    <circle cx="22" cy="16" r="1.5" fill="#6366f1" />
    <path d="M12,19 L24,19 L24,20 L12,20 L12,19 Z" fill="#6366f1" />
  </SvgIcon>
);

// Custom SVG icons for AI providers
const AnthropicIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M12,7 C9.23858,7 7,9.23858 7,12 C7,14.7614 9.23858,17 12,17 C13.1259,17 14.1647,16.6295 15,16 L15,14.5 C14.3764,15.4409 13.2615,16 12,16 C9.79086,16 8,14.2091 8,12 C8,9.79086 9.79086,8 12,8 C13.2615,8 14.3764,8.55914 15,9.5 L15,8 C14.1647,7.37046 13.1259,7 12,7 Z" fill="currentColor" />
  </SvgIcon>
);

const OpenAIIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5093-2.6067-1.4997z" fill="currentColor" />
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
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'anthropic',
      description: 'Most powerful Claude model',
      maxTokens: 200000,
      defaultTokens: 4096,
      defaultTemperature: 0.7
    },
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
      modelId: 'claude-3-opus'
    }
  ]);
  
  const [currentChatId, setCurrentChatId] = useState<string>('1');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-3-opus');
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
        // Include model settings in the response
        responseContent = `[Temperature: ${temperature.toFixed(1)}, Max Tokens: ${maxTokens}] `;
        responseContent += `This is a ${getCurrentModel().name} response to: "${inputMessage}"`;
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
                          borderColor: model.provider === 'anthropic' ? 'secondary.main' : 'success.main',
                          color: model.provider === 'anthropic' ? 'secondary.main' : 'success.main'
                        }}
                      >
                        {model.provider === 'anthropic' 
                          ? <AnthropicIcon sx={{ fontSize: 18 }} /> 
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
                          color={model.provider === 'anthropic' ? 'secondary' : 'success'}
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
                        onChange={(e) => setStreamResponse(e.target.checked)}
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