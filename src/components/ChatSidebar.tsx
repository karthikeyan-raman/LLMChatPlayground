import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  alpha,
} from '@mui/material';
import { Chat } from '../types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
}) => {

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRight: '1px solid',
        borderColor: 'divider',
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.85),
        backdropFilter: 'blur(10px)',
        width: 280,
        position: 'relative',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(180deg, rgba(79, 70, 229, 0.15) 0%, rgba(0, 0, 0, 0) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }
      }}
    >
      <Box sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          justifyContent: 'center',
          position: 'relative',
        }}>
          <Box
            sx={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, rgba(125, 58, 237, 0) 70%)',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              filter: 'blur(15px)',
              zIndex: -1,
            }}
          />
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(to right, #4f46e5, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.5rem',
              textShadow: '0 2px 10px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                display: 'inline-flex',
                mr: 1.5,
                p: 0.8,
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4), 0 0 0 2px rgba(79, 70, 229, 0.2)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4), 0 0 0 2px rgba(79, 70, 229, 0.2)' },
                  '50%': { boxShadow: '0 8px 16px rgba(79, 70, 229, 0.5), 0 0 0 3px rgba(79, 70, 229, 0.3)' },
                  '100%': { boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4), 0 0 0 2px rgba(79, 70, 229, 0.2)' }
                }
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 3.5H7C4.79086 3.5 3 5.29086 3 7.5V16.5C3 18.7091 4.79086 20.5 7 20.5H17C19.2091 20.5 21 18.7091 21 16.5V7.5C21 5.29086 19.2091 3.5 17 3.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 8.5H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12.5H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 16.5H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
            Chat Playground
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon sx={{ fontSize: '1.4rem' }} />}
          onClick={onNewChat}
          sx={{ 
            mb: 2.5,
            borderRadius: '16px',
            py: 1.8, // Taller button for better visibility
            fontSize: '1.05rem', // Larger font
            fontWeight: 800, // Extra bold for emphasis
            textTransform: 'none',
            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.35), 0 0 0 1px rgba(79, 70, 229, 0.2)',
            background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            letterSpacing: '0.6px', // Better letter spacing
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.8s ease',
            },
            '&:hover': {
              background: 'linear-gradient(45deg, #4338ca, #6d28d9)',
              boxShadow: '0 12px 24px rgba(79, 70, 229, 0.5), 0 0 0 2px rgba(79, 70, 229, 0.3)',
              transform: 'translateY(-4px)',
              '&::before': {
                transform: 'translateX(100%)',
              }
            },
            '&:active': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(79, 70, 229, 0.3)',
            }
          }}
        >
          New Chat
        </Button>

      </Box>
      
      <Divider sx={{ 
        height: '2px',
        background: 'linear-gradient(to right, rgba(79, 70, 229, 0.2), rgba(147, 51, 234, 0.2))',
        border: 'none',
        my: 0.75,
      }} />
      
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            background: (theme) => `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main || '#9c27b0', 0.8)})`,
            px: 1.5,
            py: 0.5,
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'white',
              fontWeight: 'medium',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              letterSpacing: '0.5px'
            }}
          >
            Chat History
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {chats.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', mt: 2 }}>
            <Box
              sx={{
                mx: 'auto',
                mb: 2,
                width: 60,
                height: 60,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                backdropFilter: 'blur(8px)',
                border: '1px dashed',
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
              }}
            >
              <AddIcon sx={{ fontSize: 28, color: 'primary.main', opacity: 0.6 }} />
            </Box>
            <Typography variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 'medium',
                opacity: 0.8,
                lineHeight: 1.5,
              }}
            >
              No chats yet. Start a new conversation!
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {chats.map((chat) => (
              <ListItem
                key={chat.id}
                disablePadding
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 12,
                      zIndex: 2,
                      width: 28,
                      height: 28,
                      opacity: 0.7,
                      color: 'error.main',
                      backgroundColor: (theme) => alpha(theme.palette.error.light, 0.1),
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: (theme) => alpha(theme.palette.error.light, 0.2),
                        opacity: 1,
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ pr: 6 }}
              >
                <ListItemButton
                  selected={chat.id === currentChatId}
                  onClick={() => onChatSelect(chat.id)}
                  sx={{
                    borderRadius: '16px',
                    margin: '0 8px 8px 8px',
                    paddingTop: 1.5,
                    paddingBottom: 1.5,
                    paddingLeft: 2,
                    paddingRight: 2,
                    minHeight: '70px',
                    alignItems: 'flex-start',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: '1px solid',
                    borderColor: 'divider',
                    backdropFilter: 'blur(8px)',
                    backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7),
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      opacity: 0,
                      backgroundColor: 'primary.main',
                      transition: 'opacity 0.3s ease',
                    },
                    '&.Mui-selected': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                      borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                      '&::before': {
                        opacity: 1,
                      }
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    },
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <ListItemText
                    primary={chat.title || 'New Chat'}
                    secondary={formatDate(chat.updatedAt)}
                    primaryTypographyProps={{ 
                      noWrap: false,
                      variant: 'body2',
                      fontWeight: chat.id === currentChatId ? 'bold' : 'medium', // Bolder for active item
                      sx: { 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4, // Slightly increased line height
                        // Gradient text color for active chat
                        color: chat.id === currentChatId 
                          ? 'transparent' 
                          : 'text.primary',
                        background: chat.id === currentChatId 
                          ? 'linear-gradient(90deg, #4f46e5, #8b5cf6)' 
                          : 'none',
                        backgroundClip: chat.id === currentChatId ? 'text' : 'none',
                        mb: 0.8, // More space
                        fontSize: '0.95rem', // Larger text
                        letterSpacing: '0.2px',
                      }
                    }}
                    secondaryTypographyProps={{ 
                      noWrap: true,
                      variant: 'caption',
                      component: 'div',
                      sx: {
                        display: 'inline-block',
                        background: (theme) => alpha(
                          theme.palette.primary.main, 
                          chat.id === currentChatId ? 0.2 : 0.1 // More contrast for active item
                        ),
                        borderRadius: '12px',
                        px: 1.2,
                        py: 0.3,
                        fontSize: '0.75rem', // Slightly larger date
                        fontWeight: chat.id === currentChatId ? 'medium' : 'regular',
                        boxShadow: chat.id === currentChatId ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                      }
                    }}
                    sx={{ my: 0.7 }} // More vertical space
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      
      <Box sx={{ p: 2, mb: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: '16px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              background: 'linear-gradient(to right, #4f46e5, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'medium',
              letterSpacing: '0.5px',
              mb: 0.5
            }}
          >
            Modern LLM Chat Playground
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ opacity: 0.7 }}>
            &copy; {new Date().getFullYear()}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};