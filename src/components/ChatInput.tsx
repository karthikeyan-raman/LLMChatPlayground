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
  const textFieldRef = useRef<HTMLDivElement>(null);

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
            borderColor: 'divider',
            borderRadius: '16px',
            position: 'relative',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(79, 70, 229, 0.05)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <IconButton
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => setShowFileUploader(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          
          <Typography variant="subtitle2" gutterBottom>
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
          alignItems: 'flex-end',
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: '0 4px 20px rgba(79, 70, 229, 0.2)',
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
              fontSize: '1rem',
              padding: '10px 14px',
              borderRadius: '12px',
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
                opacity: 0.6,
                fontStyle: 'italic',
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
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                  borderRadius: '12px',
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
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
                  backgroundColor: 'rgba(79, 70, 229, 0.8)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '8px',
                  ml: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(79, 70, 229, 1)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    color: 'rgba(255, 255, 255, 0.3)',
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