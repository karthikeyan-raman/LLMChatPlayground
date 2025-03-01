import { FileType, Attachment } from '../types';

// Get file type from MIME type or file extension
export const getFileType = (file: File): FileType => {
  const mimeType = file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  if (mimeType === 'application/pdf' || extension === 'pdf') {
    return 'pdf';
  }

  if (mimeType === 'text/csv' || extension === 'csv') {
    return 'csv';
  }

  if (
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    extension === 'xls' ||
    extension === 'xlsx'
  ) {
    return 'excel';
  }

  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'image';
  }

  if (mimeType.startsWith('text/') || ['txt', 'md', 'json', 'js', 'ts', 'html', 'css'].includes(extension)) {
    return 'text';
  }

  return 'other';
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

// Create object URL for a file
export const createFilePreview = async (file: File): Promise<string> => {
  const fileType = getFileType(file);
  
  if (fileType === 'image') {
    return URL.createObjectURL(file);
  }
  
  // For text files, create a text preview
  if (fileType === 'text') {
    try {
      const text = await file.text();
      return text.slice(0, 200) + (text.length > 200 ? '...' : '');
    } catch (error) {
      console.error('Error reading text file:', error);
      return '';
    }
  }
  
  return '';
};

// Convert a File to an Attachment object
export const fileToAttachment = async (file: File): Promise<Omit<Attachment, 'id'>> => {
  const fileType = getFileType(file);
  const preview = await createFilePreview(file);
  
  let content: string | undefined;
  
  // For text files, store the content
  if (fileType === 'text') {
    try {
      content = await file.text();
    } catch (error) {
      console.error('Error reading text file:', error);
    }
  }
  
  return {
    name: file.name,
    type: fileType,
    size: file.size,
    url: URL.createObjectURL(file),
    preview,
    content,
  };
};

// Read a text file as a string
export const readTextFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Convert base64 to blob
export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
};