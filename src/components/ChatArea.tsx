import React, { useRef, useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Drawer, 
  IconButton, 
  Collapse, 
  Divider,
  Tooltip,
  Badge,
  Grid,
  Chip,
  Button
} from '@mui/material';
import { ChatMessageComponent } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Chat, ChatMessage } from '../types';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CodeIcon from '@mui/icons-material/Code';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SchoolIcon from '@mui/icons-material/School';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TranslateIcon from '@mui/icons-material/Translate';
import ChatIcon from '@mui/icons-material/Chat';

interface ChatAreaProps {
  chat: Chat | null;
  isLoading: boolean;
  onSendMessage: (chatId: string, content: string, attachmentIds: string[]) => void;
}

interface MessageLogItem {
  type: 'info' | 'error' | 'request' | 'response';
  timestamp: number;
  content: string;
  metadata?: Record<string, any>;
}

// Define starter templates with corresponding icons
interface StarterTemplate {
  icon: React.ReactNode;
  title: string;
  prompt: string;
  category: 'creative' | 'analytical' | 'utility' | 'learning';
  color: string;
}

const starterTemplates: StarterTemplate[] = [
  {
    icon: <CodeIcon />,
    title: 'Write Code',
    prompt: 'Write a JavaScript function that sorts an array of objects by a specific property.',
    category: 'utility',
    color: '#10b981'
  },
  {
    icon: <SummarizeIcon />,
    title: 'Summarize Text',
    prompt: 'Summarize the following text in 3-5 bullet points: [paste your text here]',
    category: 'analytical',
    color: '#3b82f6'
  },
  {
    icon: <LightbulbIcon />,
    title: 'Brainstorm Ideas',
    prompt: 'Brainstorm 10 creative ideas for a mobile app that helps people reduce their carbon footprint.',
    category: 'creative',
    color: '#f59e0b'
  },
  {
    icon: <PsychologyIcon />,
    title: 'Solve a Problem',
    prompt: 'I need help solving this problem: [describe your problem]. What are some potential solutions?',
    category: 'analytical',
    color: '#8b5cf6'
  },
  {
    icon: <SchoolIcon />,
    title: 'Explain a Concept',
    prompt: 'Explain quantum computing in simple terms, as if you were teaching a 12-year-old.',
    category: 'learning',
    color: '#ec4899'
  },
  {
    icon: <FormatListBulletedIcon />,
    title: 'Create a List',
    prompt: 'Create a detailed checklist for planning an international trip.',
    category: 'utility',
    color: '#14b8a6'
  },
  {
    icon: <TranslateIcon />,
    title: 'Translate Text',
    prompt: 'Translate the following English text to Spanish: [your text here]',
    category: 'utility',
    color: '#6366f1'
  },
  {
    icon: <ChatIcon />,
    title: 'Roleplay Expert',
    prompt: 'I want you to act as a historian specializing in ancient Rome. Tell me about daily life in Rome around 100 CE.',
    category: 'learning',
    color: '#0ea5e9'
  }
];

export const ChatArea: React.FC<ChatAreaProps> = ({ chat, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'creative' | 'analytical' | 'utility' | 'learning'>('all');
  
  // Generate simulated logs for demo purposes
  const [logs, setLogs] = useState<MessageLogItem[]>([]);
  
  // Filter templates based on selected category
  const filteredTemplates = selectedCategory === 'all' 
    ? starterTemplates 
    : starterTemplates.filter(template => template.category === selectedCategory);
  
  // Add a log when a message is sent or received
  useEffect(() => {
    if (!chat?.messages || chat.messages.length === 0) return;
    
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (lastMessage && !logs.some(log => log.timestamp === lastMessage.timestamp)) {
      // Add request log for user messages
      if (lastMessage.role === 'user') {
        const newLog: MessageLogItem = {
          type: 'request',
          timestamp: lastMessage.timestamp,
          content: `Request to ${chat.modelId}`,
          metadata: {
            message: lastMessage.content,
            model: chat.modelId,
            temperature: 0.7,
            maxTokens: 4096,
            user_id: 'user-123',
            conversation_id: chat.id,
            has_attachments: !!lastMessage.attachments?.length
          }
        };
        setLogs(prev => [...prev, newLog]);
      } 
      
      // Add response log for assistant messages
      if (lastMessage.role === 'assistant') {
        const newLog: MessageLogItem = {
          type: 'response',
          timestamp: lastMessage.timestamp,
          content: `Response from ${chat.modelId}`,
          metadata: {
            message_length: lastMessage.content.length,
            model: chat.modelId,
            latency: Math.round(Math.random() * 2000 + 500) + 'ms',
            tokens_used: Math.round(lastMessage.content.length / 4),
            finish_reason: 'completed',
            conversation_id: chat.id
          }
        };
        setLogs(prev => [...prev, newLog]);
      }
    }
  }, [chat?.messages, logs]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  // Handler for sending a message
  const handleSendMessage = (content: string, attachmentIds: string[]) => {
    if (chat) {
      onSendMessage(chat.id, content, attachmentIds);
    }
  };
  
  // Toggle expansion of a specific log item
  const toggleLogExpansion = (timestamp: number) => {
    setExpandedLogs(prev => ({
      ...prev,
      [timestamp]: !prev[timestamp]
    }));
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexGrow: 1,
        position: 'relative',
        maxWidth: 'calc(100% - 280px)', // Account for sidebar width
      }}
    >
      {/* Debug Panel Toggle Button */}
      {chat && chat.messages.length > 0 && (
        <Tooltip title="Toggle Debug Panel">
          <IconButton
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 20,
              zIndex: 1200,
              backgroundColor: (theme) => 
                showDebugPanel ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.4)',
              color: 'white',
              width: 48,
              height: 48,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: (theme) => 
                  showDebugPanel ? theme.palette.primary.dark : 'rgba(0, 0, 0, 0.6)',
                transform: 'translateY(-3px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            <Badge 
              badgeContent={logs.length} 
              color="error"
              sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  minWidth: '20px',
                  height: '20px',
                  padding: '0 6px',
                }
              }}
            >
              <BugReportIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      )}

      {/* Debug Panel Drawer */}
      <Drawer
        anchor="right"
        open={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            width: 420,
            borderLeft: '1px solid',
            borderColor: 'divider',
            boxShadow: '-5px 0 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(15, 23, 42, 0.97)',
            backdropFilter: 'blur(10px)',
            height: '100%',
            top: 0,
            zIndex: 1100,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
            <BugReportIcon sx={{ mr: 1, color: 'primary.main' }} /> 
            Debug Console ({logs.length})
          </Typography>
          <IconButton onClick={() => setShowDebugPanel(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <Box 
          sx={{ 
            overflow: 'auto', 
            height: 'calc(100% - 60px)',
            px: 2, 
            py: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          {logs.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant="body2">No logs available</Typography>
            </Box>
          ) : (
            logs.map((log) => (
              <Paper
                key={log.timestamp}
                sx={{
                  p: 1.5,
                  mb: 1.5,
                  backgroundColor: 
                    log.type === 'error' ? 'rgba(239, 68, 68, 0.1)' :
                    log.type === 'request' ? 'rgba(25, 118, 210, 0.1)' :
                    log.type === 'response' ? 'rgba(147, 51, 234, 0.1)' :
                    'rgba(255, 255, 255, 0.05)',
                  borderLeft: '4px solid',
                  borderColor: 
                    log.type === 'error' ? 'error.main' :
                    log.type === 'request' ? 'primary.main' :
                    log.type === 'response' ? 'secondary.main' :
                    'info.main',
                  borderRadius: '4px',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, alignItems: 'center' }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 700,
                      color: 
                        log.type === 'error' ? 'error.main' :
                        log.type === 'request' ? 'primary.main' :
                        log.type === 'response' ? 'secondary.main' :
                        'info.main',
                    }}
                  >
                    {log.type.toUpperCase()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                      {formatTimestamp(log.timestamp)}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => toggleLogExpansion(log.timestamp)}
                      sx={{ padding: 0.5 }}
                    >
                      {expandedLogs[log.timestamp] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2">{log.content}</Typography>
                
                {log.metadata && (
                  <Collapse in={expandedLogs[log.timestamp] || false}>
                    <Box 
                      sx={{ 
                        mt: 1.5, 
                        p: 1.5, 
                        backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        overflowX: 'auto',
                      }}
                    >
                      <pre style={{ margin: 0 }}>
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </Box>
                  </Collapse>
                )}
              </Paper>
            ))
          )}
        </Box>
      </Drawer>

      {/* Main Chat Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: showDebugPanel ? 'calc(100% - 420px)' : '100%', // Adjust width based on debug panel visibility
          transition: 'width 0.3s ease',
        }}
      >
        {chat ? (
          <>
            <Box
              sx={{
                flexGrow: 1,
                p: 3,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {chat.messages.length === 0 ? (
                <Box
                  data-testid="chat-empty-state"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 3,
                    height: '100%',
                  }}
                >
                  <Box sx={{ maxWidth: 900, width: '100%' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '24px',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)',
                        mb: 4,
                        border: '1px solid',
                        borderColor: 'rgba(79, 70, 229, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(79, 70, 229, 0.15) 0%, rgba(0, 0, 0, 0) 70%), radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
                          zIndex: -1,
                        }
                      }}
                    >
                      <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 800,
                          background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 2,
                        }}
                      >
                        Welcome to Chat Playground
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3, maxWidth: 700, mx: 'auto' }}>
                        This AI assistant can help you with a wide range of tasks, from writing and coding to brainstorming and problem-solving.
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                        Try one of these conversation starters or send your own message:
                      </Typography>
                      
                      {/* Category filters */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 1 }}>
                        {(['all', 'creative', 'analytical', 'utility', 'learning'] as const).map((category) => (
                          <Chip 
                            key={category}
                            label={category.charAt(0).toUpperCase() + category.slice(1)}
                            variant="outlined"
                            onClick={() => setSelectedCategory(category)}
                            sx={{ 
                              borderRadius: '16px',
                              px: 1,
                              backgroundColor: category === selectedCategory ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                              borderColor: category === selectedCategory ? 'rgba(79, 70, 229, 0.3)' : 'divider',
                              color: category === selectedCategory ? 'primary.main' : 'text.secondary',
                              fontWeight: category === selectedCategory ? 600 : 400,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(79, 70, 229, 0.05)',
                                borderColor: 'rgba(79, 70, 229, 0.2)',
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                    
                    {/* Starter templates grid */}
                    <Grid container spacing={2}>
                      {filteredTemplates.map((template, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper
                            elevation={0}
                            onClick={() => {
                              if (chat) {
                                handleSendMessage(template.prompt, []);
                              }
                            }}
                            sx={{
                              p: 2,
                              borderRadius: '16px',
                              backgroundColor: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                              position: 'relative',
                              overflow: 'hidden',
                              '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderColor: 'rgba(255, 255, 255, 0.15)',
                              },
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '4px',
                                background: template.color,
                                opacity: 0.8,
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                              <Box 
                                sx={{ 
                                  width: 36, 
                                  height: 36,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  backgroundColor: template.color,
                                  opacity: 0.8,
                                  mr: 1.5,
                                }}
                              >
                                {template.icon}
                              </Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {template.title}
                              </Typography>
                            </Box>
                            
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                flexGrow: 1
                              }}
                            >
                              {template.prompt}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Chip 
                                label={template.category}
                                size="small"
                                sx={{ 
                                  fontSize: '0.7rem', 
                                  height: 20,
                                  borderRadius: '10px',
                                  backgroundColor: `${template.color}20`,
                                  color: template.color,
                                  fontWeight: 500
                                }}
                              />
                              <Typography 
                                variant="caption" 
                                color="primary.main"
                                sx={{ fontWeight: 600 }}
                              >
                                Try it →
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              ) : (
                <>
                  {chat.messages.map((message: ChatMessage) => (
                    <ChatMessageComponent 
                      key={message.id} 
                      message={message} 
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </Box>

            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 5,
                maxWidth: 600,
                backgroundColor: 'rgba(79, 70, 229, 0.05)',
                borderRadius: '30px',
                textAlign: 'center',
                border: '1px solid rgba(79, 70, 229, 0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '5px',
                  background: 'linear-gradient(90deg, #4f46e5, #9333ea, #4f46e5)',
                  backgroundSize: '200% auto',
                  animation: 'gradient 3s linear infinite',
                },
                '@keyframes gradient': {
                  '0%': {
                    backgroundPosition: '0% center',
                  },
                  '100%': {
                    backgroundPosition: '200% center',
                  },
                },
              }}
            >
              <Typography variant="h5" gutterBottom>
                Welcome to Chat Playground
              </Typography>
              <Typography variant="body1" paragraph>
                Experiment with different LLM models and upload files to enhance your conversations.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a chat from the sidebar or start a new one to begin.
              </Typography>
            </Paper>

            <ChatInput
              onSendMessage={() => {}}
              isLoading={isLoading}
              disabled={true}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};