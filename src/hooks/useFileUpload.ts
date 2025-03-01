import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { fileToAttachment, getFileType } from '../utils/fileHelpers';
import { Attachment, FileType } from '../types';

interface UseFileUploadOptions {
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  onUploadComplete?: (attachments: Omit<Attachment, 'id'>[]) => void;
}

interface UseFileUploadResult {
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  isLoading: boolean;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  attachments: Omit<Attachment, 'id'>[];
  setAttachments: React.Dispatch<React.SetStateAction<Omit<Attachment, 'id'>[]>>;
  error: string | null;
  clearFiles: () => void;
  onDrop: (acceptedFiles: File[], rejectedFiles: any[]) => Promise<void>;
}

export const useFileUpload = (options: UseFileUploadOptions = {}): UseFileUploadResult => {
  const {
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024, // 10MB default
    accept = {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'text/plain': ['.txt', '.md'],
    },
    onUploadComplete,
  } = options;

  const [files, setFiles] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<Omit<Attachment, 'id'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (!acceptedFiles || acceptedFiles.length === 0) {
        // No files were accepted
        console.log('No files were accepted in the drop');
        
        // Handle rejected files if any
        if (rejectedFiles.length > 0) {
          const errorMessages = rejectedFiles.map((file) => {
            const errors = file.errors.map((e: any) => e.message).join(', ');
            return `${file.file.name}: ${errors}`;
          });
          setError(errorMessages.join('; '));
        }
        return;
      }

      // Check file limit
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files`);
        return;
      }

      setIsLoading(true);

      try {
        // Create dummy attachments for demo purposes
        // In a real app, you would process the files properly
        const newAttachments = acceptedFiles.map(file => ({
          name: file.name,
          type: getFileType(file),
          size: file.size,
          url: URL.createObjectURL(file),
          preview: file.name,
          content: file.name,
        }));

        console.log('Created attachments:', newAttachments);

        setFiles((prev) => [...prev, ...acceptedFiles]);
        setAttachments((prev) => [...prev, ...newAttachments]);

        // Call onUploadComplete if provided
        if (onUploadComplete) {
          onUploadComplete(newAttachments);
        }
      } catch (error) {
        console.error('Error processing files:', error);
        setError('Error processing files. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [files, maxFiles, onUploadComplete]
  );

  const clearFiles = useCallback(() => {
    setFiles([]);
    setAttachments([]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple: true,
  });

  return {
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
    onDrop,
  };
};