import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Collapse,
  Typography,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { FileUploader } from './FileUploader';
import { v4 as uuidv4 } from 'uuid';

interface ChatInputProps {
  onSendMessage: (content: string, attachmentIds: string[]) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [attachmentIds, setAttachmentIds] = useState<string[]>([]);

  // Temporary message ID for file uploader
  const tempMessageId = useRef(uuidv4());

  // Reset temporary message ID when uploader is closed
  useEffect(() => {
    if (!showFileUploader) {
      tempMessageId.current = uuidv4();
    }
  }, [showFileUploader]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() || attachmentIds.length > 0) {
      onSendMessage(message.trim(), attachmentIds);
      setMessage('');
      setAttachmentIds([]);
      setShowFileUploader(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFilesUploaded = (fileIds: string[]) => {
    setAttachmentIds((prev) => [...prev, ...fileIds]);
    setShowFileUploader(false);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Collapse in={showFileUploader} timeout={300}>
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            p: 2,
            border: '1px solid',
            borderColor: 'rgba(145, 158, 171, 0.12)',
            borderRadius: '12px',
            position: 'relative',
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <IconButton
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => setShowFileUploader(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          
          <Typography 
            variant="subtitle2" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'rgba(59, 130, 246, 0.9)',
              fontSize: '0.9rem'
            }}
          >
            Upload Files
          </Typography>
          
          <FileUploader
            onFilesUploaded={handleFilesUploaded}
            messageId={tempMessageId.current}
          />
        </Paper>
      </Collapse>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          border: '1px solid',
          borderColor: 'rgba(145, 158, 171, 0.12)',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:focus-within': {
            borderColor: 'rgba(59, 130, 246, 0.5)',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
          }
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={8}
          placeholder={
            disabled
              ? 'Start a new chat to send messages'
              : 'Type your message here...'
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          variant="outlined"
          autoFocus
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'transparent',
              fontSize: '0.95rem',
              padding: '6px 10px',
              borderRadius: '8px',
              fontWeight: 400,
              lineHeight: 1.5
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiInputBase-input': {
              '&::placeholder': {
                opacity: 0.7,
                fontStyle: 'normal',
                fontWeight: 400
              }
            }
          }}
        />

        <Box sx={{ display: 'flex', ml: 1, alignItems: 'center' }}>
          <Tooltip title="Upload files">
            <span>
              <IconButton
                color="primary"
                disabled={disabled || isLoading}
                onClick={() => setShowFileUploader(!showFileUploader)}
                sx={{
                  backgroundColor: showFileUploader ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  borderRadius: '10px',
                  padding: '8px',
                  color: showFileUploader ? 'rgba(59, 130, 246, 0.9)' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  }
                }}
              >
                <AttachFileIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Send message">
            <span>
              <IconButton
                color="primary"
                type="submit"
                disabled={
                  disabled || isLoading || (!message.trim() && attachmentIds.length === 0)
                }
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.9)',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '8px',
                  ml: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(59, 130, 246, 0.25)'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(145, 158, 171, 0.2)',
                    color: 'rgba(145, 158, 171, 0.5)'
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Paper>

      {attachmentIds.length > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: 'block' }}
        >
          {attachmentIds.length} file(s) attached
        </Typography>
      )}
    </Box>
  );
};