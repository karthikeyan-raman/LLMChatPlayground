import React, { useRef, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { ChatMessageComponent } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Chat, ChatMessage } from '../types';

interface ChatAreaProps {
  chat: Chat | null;
  isLoading: boolean;
  onSendMessage: (chatId: string, content: string, attachmentIds: string[]) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ chat, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexGrow: 1,
        maxWidth: 'calc(100% - 280px)', // Account for sidebar width
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
                  <ChatMessageComponent key={message.id} message={message} />
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
  );
};