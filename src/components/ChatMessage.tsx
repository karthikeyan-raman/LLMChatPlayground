import React from 'react';
import { Box, Paper, Typography, Avatar, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { ChatMessage as ChatMessageType, FileType } from '../types';
import { formatFileSize } from '../utils/fileHelpers';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface ChatMessageProps {
  message: ChatMessageType;
}

const getIconForFileType = (type: FileType) => {
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

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const hasAttachments = message.attachments && message.attachments.length > 0;
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        mb: 3, 
        alignItems: 'flex-start',
      }}
    >
      <Avatar 
        sx={{ 
          mr: 2,
          bgcolor: isUser ? 'rgba(79, 70, 229, 0.9)' : 'rgba(147, 51, 234, 0.9)',
          boxShadow: isUser 
            ? '0 0 10px rgba(79, 70, 229, 0.5)' 
            : '0 0 10px rgba(147, 51, 234, 0.5)',
          p: 0.75,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: isUser 
              ? '0 0 15px rgba(79, 70, 229, 0.7)' 
              : '0 0 15px rgba(147, 51, 234, 0.7)',
          }
        }}
      >
        {isUser ? <PersonIcon /> : <SmartToyIcon />}
      </Avatar>
      
      <Box sx={{ maxWidth: 'calc(100% - 56px)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '12px',
              px: 1,
              py: 0.25,
              backgroundColor: isUser 
                ? 'rgba(79, 70, 229, 0.1)' 
                : 'rgba(147, 51, 234, 0.1)',
              mr: 1,
              border: '1px solid',
              borderColor: isUser 
                ? 'rgba(79, 70, 229, 0.3)' 
                : 'rgba(147, 51, 234, 0.3)',
            }}
          >
            <Typography 
              variant="body2" 
              fontWeight={600} 
              sx={{ 
                color: isUser ? '#4f46e5' : '#9333ea',
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
              }}
            >
              {isUser ? 'YOU' : 'ASSISTANT'}
            </Typography>
          </Box>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{
              fontSize: '0.7rem',
              opacity: 0.7,
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
        
        <Paper
          sx={{
            p: 2,
            borderRadius: '16px',
            bgcolor: isUser ? 'primary.dark' : 'rgba(255, 255, 255, 0.05)',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            maxWidth: '100%',
            overflowX: 'auto',
            boxShadow: isUser ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: isUser ? '0 6px 16px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.15)'
            }
          }}
          elevation={0}
        >
          <ReactMarkdown 
            rehypePlugins={[rehypeHighlight]}
            components={{
              p: ({ node, ...props }) => <Typography variant="body1" gutterBottom {...props} />,
              li: ({ node, ...props }) => <Typography component="li" variant="body1" {...props} />,
              a: ({ node, ...props }) => (
                <Typography 
                  component="a" 
                  variant="body1" 
                  sx={{ color: 'primary.light', textDecoration: 'underline' }} 
                  {...props} 
                />
              ),
              code: ({ node, inline, ...props }) => 
                inline ? (
                  <Typography 
                    component="code" 
                    variant="body2" 
                    sx={{ 
                      backgroundColor: isUser ? 'rgba(0, 0, 0, 0.2)' : 'rgba(79, 70, 229, 0.1)', 
                      px: 1,
                      py: 0.5,
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      border: '1px solid',
                      borderColor: isUser ? 'rgba(255, 255, 255, 0.1)' : 'rgba(79, 70, 229, 0.2)',
                    }} 
                    {...props} 
                  />
                ) : (
                  <Box component="pre" sx={{ 
                    maxWidth: '100%',
                    overflow: 'auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    p: 2,
                    my: 2,
                    position: 'relative',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: 'linear-gradient(90deg, #4f46e5, #9333ea)',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                    }
                  }}>
                    <Typography component="code" variant="body2" fontFamily="monospace" {...props} />
                  </Box>
                ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </Paper>
        
        {hasAttachments && (
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={`${message.attachments!.length} attachment${message.attachments!.length > 1 ? 's' : ''}`} 
              size="small" 
              sx={{ 
                mb: 1,
                borderRadius: '8px',
                fontWeight: 500,
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                border: '1px solid rgba(79, 70, 229, 0.2)',
                color: 'primary.main',
                px: 0.5,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
              icon={<AttachFileIcon style={{ fontSize: '0.9rem' }} />}
            />
            <List dense sx={{ 
              bgcolor: 'rgba(0, 0, 0, 0.1)', 
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'rgba(79, 70, 229, 0.2)',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              {message.attachments!.map((attachment) => (
                <ListItem 
                  key={attachment.id} 
                  disablePadding 
                  sx={{ 
                    px: 2,
                    py: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(79, 70, 229, 0.1)',
                    },
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    '&:last-child': {
                      borderBottom: 'none',
                    }
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 36,
                      color: 'rgba(79, 70, 229, 0.9)',
                    }}
                  >
                    {getIconForFileType(attachment.type as FileType)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={attachment.name}
                    secondary={formatFileSize(attachment.size)}
                    primaryTypographyProps={{ 
                      variant: 'body2', 
                      noWrap: true,
                      fontWeight: 500,
                    }}
                    secondaryTypographyProps={{ 
                      variant: 'caption',
                      sx: { opacity: 0.7 }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};