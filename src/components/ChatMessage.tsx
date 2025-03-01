import React, { useState } from 'react';
import { Box, Paper, Typography, Avatar, Snackbar } from '@mui/material';
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
        mb: 3.5, // Increased bottom margin for better spacing
        alignItems: 'flex-start',
        gap: 1.5,
      }}
    >
      <Avatar 
        sx={{ 
          width: 40, // Slightly larger avatar
          height: 40,
          bgcolor: isUser ? 'rgba(59, 130, 246, 0.9)' : 'rgba(147, 51, 234, 0.9)',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.12)', // Enhanced shadow
          fontSize: '0.9rem',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          }
        }}
      >
        {isUser ? <FaceRetouchingNaturalIcon fontSize="small" /> : <AutoFixHighIcon fontSize="small" />}
      </Avatar>
      
      <Box sx={{ 
        maxWidth: '75%', // Slightly wider for better readability
        position: 'relative',
      }}>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{
            position: 'absolute',
            top: -18,
            [isUser ? 'right' : 'left']: 0,
            fontSize: '0.75rem', // Slightly larger
            fontWeight: 600, // Bolder for better visibility
            letterSpacing: '0.3px',
          }}
        >
          <Box component="span" sx={{ 
            color: isUser ? 'rgba(59, 130, 246, 0.9)' : 'rgba(147, 51, 234, 0.9)',
          }}>
            {isUser ? 'You' : 'Assistant'}
          </Box> 
          {!isUser && message.modelId && ` (${message.modelId.split('-')[0]})`} 
          • {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Typography>
        
        <Paper
          sx={{
            py: 1.8, // More vertical padding
            px: 2.5, // More horizontal padding
            borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
            bgcolor: isUser ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.04)', // Slightly more contrast
            borderLeft: isUser ? 'none' : '3px solid rgba(147, 51, 234, 0.6)', // More vivid border
            borderRight: isUser ? '3px solid rgba(59, 130, 246, 0.6)' : 'none', // More vivid border
            color: 'text.primary',
            maxWidth: '100%',
            overflowX: 'auto',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)', // Enhanced shadow
            backdropFilter: 'blur(8px)',
          }}
          elevation={0}
        >
          <ReactMarkdown 
            rehypePlugins={[rehypeHighlight]}
            className="markdown-body"
          >
            {message.content}
          </ReactMarkdown>
          
          {/* Copy button below content */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              mt: 1.5,
              borderTop: '1px solid',
              borderColor: isUser ? 'rgba(59, 130, 246, 0.2)' : 'rgba(147, 51, 234, 0.2)',
              pt: 1,
            }}
          >
            <Box
              onClick={handleCopyContent}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: '14px',
                py: 0.5,
                px: 1,
                fontSize: '0.75rem',
                color: isUser ? 'rgba(59, 130, 246, 0.9)' : 'rgba(147, 51, 234, 0.9)',
                bgcolor: isUser ? 'rgba(59, 130, 246, 0.05)' : 'rgba(147, 51, 234, 0.05)',
                border: '1px solid',
                borderColor: isUser ? 'rgba(59, 130, 246, 0.2)' : 'rgba(147, 51, 234, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isUser ? 'rgba(59, 130, 246, 0.1)' : 'rgba(147, 51, 234, 0.1)',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              <ContentCopyIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
              <Typography variant="caption" fontWeight={500}>Copy text</Typography>
            </Box>
          </Box>
          
          <Snackbar
            open={copySuccess}
            message="Message copied to clipboard!"
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={1500}
            sx={{
              '& .MuiSnackbarContent-root': {
                bgcolor: isUser ? 'rgba(59, 130, 246, 0.9)' : 'rgba(147, 51, 234, 0.9)',
                minWidth: 'auto',
                borderRadius: '20px',
                fontWeight: 500,
                px: 2,
                py: 0.75,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }
            }}
          />
        </Paper>
        
        {hasAttachments && (
          <Box sx={{ 
            mt: 1.5,
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            borderRadius: 2,
            p: 1.5,
            border: '1px dashed rgba(145, 158, 171, 0.2)',
          }}>
            <Typography variant="caption" sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              mb: 1,
              color: isUser ? 'rgba(59, 130, 246, 0.9)' : 'rgba(147, 51, 234, 0.9)',
            }}>
              <AttachFileIcon sx={{ fontSize: 16, mr: 0.5 }} />
              {message.attachments!.length} attachment{message.attachments!.length > 1 ? 's' : ''}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1
            }}>
              {message.attachments!.map((attachment) => (
                <Paper
                  key={attachment.id}
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(145, 158, 171, 0.12)',
                    width: 'calc(50% - 4px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <Box sx={{ 
                    mr: 1, 
                    color: isUser ? 'rgba(59, 130, 246, 0.9)' : 'rgba(147, 51, 234, 0.9)',
                  }}>
                    {getIconForFileType(attachment.type as FileType)}
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {attachment.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
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