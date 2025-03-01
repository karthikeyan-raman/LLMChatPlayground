import React from 'react';
import { Box, Typography, CircularProgress, List, ListItem, ListItemText, ListItemIcon, Button, Chip } from '@mui/material';
import { useFileUpload } from '../hooks/useFileUpload';
import { formatFileSize } from '../utils/fileHelpers';
import { FileType } from '../types';

// Icons
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

interface FileUploaderProps {
  onFilesUploaded: (fileIds: string[]) => void;
  messageId: string;
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

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesUploaded, messageId }) => {
  // Use the custom hook with destructuring to get all values and methods
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isLoading,
    files,
    setFiles,
    attachments,
    setAttachments,
    error,
    clearFiles,
  } = useFileUpload({
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleSubmit = () => {
    try {
      // In a real implementation, this would upload files to a server
      // For demo purposes, we'll just pass the attachments to the parent component
      const fileIds = attachments.map((_, index) => `${messageId}-${index}`);
      
      // Pass the file IDs to the parent component
      onFilesUploaded(fileIds);
      
      // Clear the files from the uploader
      clearFiles();
    } catch (error) {
      console.error('Error handling file upload:', error);
      // In a real app, we would show an error message to the user
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.500',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
          transition: 'all 0.2s',
          mb: 2,
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
            borderColor: 'primary.light',
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" component="div" gutterBottom>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to select files
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          For this demo: Try any file type
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          size="small"
          sx={{ mt: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            // Create multiple dummy files for demonstration
            const files = [
              new File(["dummy content"], "document.pdf", { type: "application/pdf" }),
              new File(["dummy image content"], "image.jpg", { type: "image/jpeg" }),
              new File(["dummy data"], "data.csv", { type: "text/csv" })
            ];
            
            // Log to console for debugging
            // Add the files to our file list
            setFiles(files);
            
            // Create attachments manually
            const dummyAttachments = files.map(file => ({
              name: file.name,
              type: file.type.includes('pdf') ? 'pdf' : 
                    file.type.includes('image') ? 'image' : 
                    file.type.includes('csv') ? 'csv' : 'text',
              size: file.size,
              url: '#demo-url',
              preview: `Preview of ${file.name}`,
              content: `Content of ${file.name}`
            }));
            
            setAttachments(dummyAttachments);
          }}
        >
          Add Demo Files
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {isLoading && (
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="body2">Processing files...</Typography>
        </Box>
      )}

      {files.length > 0 && (
        <>
          <List dense sx={{ mt: 2 }}>
            {files.map((file, index) => (
              <ListItem
                key={`${file.name}-${index}`}
                secondaryAction={
                  <Chip 
                    size="small" 
                    label={formatFileSize(file.size)}
                    variant="outlined" 
                  />
                }
              >
                <ListItemIcon>
                  {getIconForFileType(attachments[index].type as FileType)}
                </ListItemIcon>
                <ListItemText 
                  primary={file.name} 
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
            ))}
          </List>

          <Box display="flex" justifyContent="flex-end" gap={1} sx={{ mt: 2 }}>
            <Button 
              size="small" 
              startIcon={<DeleteIcon />} 
              onClick={clearFiles}
              color="inherit"
            >
              Clear
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              size="medium" 
              onClick={handleSubmit}
              disableElevation
              fullWidth
            >
              Add Files to Message
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};