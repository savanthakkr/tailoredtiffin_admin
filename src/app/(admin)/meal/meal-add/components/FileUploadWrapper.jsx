'use client';

import { createContext, useContext, useState } from 'react';
import DropzoneFormInput from '@/components/form/DropzoneFormInput';
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';

// Create Image Context
const ImageContext = createContext();

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within ImageContextProvider');
  }
  return context;
};

export const ImageContextProvider = ({ children }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // For now, store the file objects
      // In a real scenario, you would upload to server here
      setUploadedImages(files);
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ImageContext.Provider value={{ uploadedImages, uploading, handleFileUpload, setUploadedImages }}>
      {children}
    </ImageContext.Provider>
  );
};

const FileUploadWrapper = () => {
  const { handleFileUpload } = useImageContext();

  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle as="h4">Add Thumbnail Photo</CardTitle>
      </CardHeader>
      <CardBody>
        <DropzoneFormInput
          className="py-5"
          iconProps={{
            icon: 'bx:cloud-upload',
            height: 48,
            width: 48,
            className: 'mb-4 text-primary'
          }}
          text="Drop your images here, or click to browse"
          helpText={<span className="text-muted fs-13">(1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed )</span>}
          showPreview
          onFileUpload={handleFileUpload}
        />
      </CardBody>
    </Card>
  );
};

export default FileUploadWrapper;
