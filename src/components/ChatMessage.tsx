import React, { useState } from 'react';
import { Box, Paper, Typography, Avatar, Snackbar, Tooltip } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { ChatMessage as ChatMessageType, FileType } from '../types';
import { formatFileSize } from '../utils/fileHelpers';

// Icons
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural'; // Renaissance-style human face
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'; // Magic wand for assistant
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
  const [copySuccess, setCopySuccess] = useState(false);
  
  const handleCopyContent = () => {
    navigator.clipboard.writeText(message.content)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy message: ', err);
      });
  };
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: isUser ? 'row-reverse' : 'row',
        mb: 4, // Increased spacing between messages
        alignItems: 'flex-start',
        gap: 2, // Increased gap between avatar and content
        position: 'relative',
      }}
    >
      {/* Message timestamp floating above message */}
      <Typography 
        variant="caption" 
        sx={{
          position: 'absolute',
          top: -16,
          [isUser ? 'right' : 'left']: 52, // Align with message bubble not avatar
          fontSize: '0.7rem',
          color: 'text.secondary',
          opacity: 0.7,
        }}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </Typography>
      
      <Tooltip title={isUser ? "You" : `AI Assistant${message.modelId ? ` (${message.modelId})` : ''}`}>
        <Avatar 
          sx={{ 
            width: 44, // Larger avatar for better visibility
            height: 44,
            bgcolor: isUser 
              ? 'primary.main' // Use theme colors for consistency
              : 'secondary.main',
            boxShadow: '0 3px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '1rem',
            transition: 'all 0.2s ease-in-out',
            border: '2px solid',
            borderColor: isUser 
              ? 'primary.dark' 
              : 'secondary.dark',
            '&:hover': {
              transform: 'scale(1.08)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          {isUser ? <FaceRetouchingNaturalIcon /> : <AutoFixHighIcon />}
        </Avatar>
      </Tooltip>
      
      <Box sx={{ 
        maxWidth: '80%', // Wider for better readability on large screens
        width: '100%', // Take full width up to maxWidth
        position: 'relative',
      }}>
        {/* Sender identifier with prominent styling */}
        <Typography 
          variant="subtitle2" 
          sx={{
            mb: 0.75,
            fontWeight: 700, // Bolder for better visibility
            letterSpacing: '0.3px',
            color: isUser ? 'primary.main' : 'secondary.main',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}
        >
          {isUser ? 'You' : 'Assistant'}
          {!isUser && message.modelId && (
            <Box component="span" sx={{ 
              color: 'text.secondary',
              ml: 1,
              fontSize: '0.75rem',
              fontWeight: 400,
              textTransform: 'none',
            }}>
              using {message.modelId.split('-')[0]}
            </Box>
          )}
        </Typography>
        
        <Paper
          sx={{
            py: 2, // More vertical padding
            px: 2.5, // More horizontal padding
            borderRadius: isUser ? '16px 2px 16px 16px' : '2px 16px 16px 16px',
            bgcolor: isUser 
              ? 'rgba(25, 118, 210, 0.08)' // More distinct user bubble (primary color)
              : 'rgba(156, 39, 176, 0.06)', // More distinct assistant bubble (secondary color)
            boxShadow: isUser
              ? '0 3px 10px rgba(25, 118, 210, 0.1), 0 1px 2px rgba(25, 118, 210, 0.08)' 
              : '0 3px 10px rgba(156, 39, 176, 0.1), 0 1px 2px rgba(156, 39, 176, 0.08)',
            border: '1px solid',
            borderColor: isUser 
              ? 'rgba(25, 118, 210, 0.2)' 
              : 'rgba(156, 39, 176, 0.2)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              [isUser ? 'right' : 'left']: 0,
              height: '100%',
              width: '4px',
              bgcolor: isUser ? 'primary.main' : 'secondary.main',
              borderRadius: isUser ? '0 2px 0 0' : '2px 0 0 0',
              opacity: 0.7,
            },
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: isUser
                ? '0 5px 15px rgba(25, 118, 210, 0.15)' 
                : '0 5px 15px rgba(156, 39, 176, 0.15)',
            }
          }}
          elevation={0}
        >
          <ReactMarkdown 
            rehypePlugins={[rehypeHighlight]}
            className="markdown-body"
            components={{
              // Enhance code blocks with better styling
              code({ node, inline, className, children, ...props }) {
                return inline ? (
                  <code
                    className={className}
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.06)',
                      padding: '0.2em 0.4em',
                      borderRadius: '3px',
                      fontSize: '0.9em',
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: '6px',
                      padding: '0.5em',
                      overflowX: 'auto',
                      border: '1px solid rgba(145, 158, 171, 0.2)',
                    }}
                  >
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </Box>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
          
          {/* Copy button below content */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              mt: 2,
              borderTop: '1px solid',
              borderColor: isUser ? 'rgba(25, 118, 210, 0.15)' : 'rgba(156, 39, 176, 0.15)',
              pt: 1.5,
            }}
          >
            <Box
              onClick={handleCopyContent}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: '20px',
                py: 0.5,
                px: 1.5,
                fontSize: '0.75rem',
                color: isUser ? 'primary.main' : 'secondary.main',
                bgcolor: isUser ? 'rgba(25, 118, 210, 0.08)' : 'rgba(156, 39, 176, 0.08)',
                border: '1px solid',
                borderColor: isUser ? 'rgba(25, 118, 210, 0.2)' : 'rgba(156, 39, 176, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isUser ? 'rgba(25, 118, 210, 0.15)' : 'rgba(156, 39, 176, 0.15)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <ContentCopyIcon sx={{ fontSize: '0.875rem', mr: 0.7 }} />
              <Typography variant="caption" fontWeight={600}>Copy text</Typography>
            </Box>
          </Box>
          
          <Snackbar
            open={copySuccess}
            message="Message copied to clipboard!"
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={2000}
            sx={{
              '& .MuiSnackbarContent-root': {
                bgcolor: isUser ? 'primary.main' : 'secondary.main',
                minWidth: 'auto',
                borderRadius: '20px',
                fontWeight: 600,
                px: 2,
                py: 0.75,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }
            }}
          />
        </Paper>
        
        {/* Attachment section with improved styling */}
        {hasAttachments && (
          <Box sx={{ 
            mt: 2,
            backgroundColor: isUser ? 'rgba(25, 118, 210, 0.04)' : 'rgba(156, 39, 176, 0.04)',
            borderRadius: 2,
            p: 2,
            border: '1px solid',
            borderColor: isUser ? 'rgba(25, 118, 210, 0.15)' : 'rgba(156, 39, 176, 0.15)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}>
            <Typography variant="subtitle2" sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              mb: 1.5,
              color: isUser ? 'primary.main' : 'secondary.main',
            }}>
              <AttachFileIcon sx={{ fontSize: 16, mr: 0.8 }} />
              {message.attachments!.length} attachment{message.attachments!.length > 1 ? 's' : ''}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1.5
            }}>
              {message.attachments!.map((attachment) => (
                <Paper
                  key={attachment.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isUser ? 'rgba(25, 118, 210, 0.08)' : 'rgba(156, 39, 176, 0.08)',
                    border: '1px solid',
                    borderColor: isUser ? 'rgba(25, 118, 210, 0.2)' : 'rgba(156, 39, 176, 0.2)',
                    width: 'calc(50% - 12px)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: isUser ? 'rgba(25, 118, 210, 0.12)' : 'rgba(156, 39, 176, 0.12)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  <Box sx={{ 
                    mr: 1.5, 
                    color: isUser ? 'primary.main' : 'secondary.main',
                    bgcolor: isUser ? 'rgba(25, 118, 210, 0.12)' : 'rgba(156, 39, 176, 0.12)',
                    p: 1,
                    borderRadius: '50%',
                  }}>
                    {getIconForFileType(attachment.type as FileType)}
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {attachment.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {formatFileSize(attachment.size)}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};