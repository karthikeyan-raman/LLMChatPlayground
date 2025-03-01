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
  Badge
} from '@mui/material';
import { ChatMessageComponent } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Chat, ChatMessage } from '../types';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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

export const ChatArea: React.FC<ChatAreaProps> = ({ chat, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  
  // Generate simulated logs for demo purposes
  const [logs, setLogs] = useState<MessageLogItem[]>([]);
  
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
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      maxWidth: 500,
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '24px',
                      textAlign: 'center',
                      border: '1px dashed rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Start a new conversation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Send a message to start chatting with the AI assistant.
                    </Typography>
                  </Paper>
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