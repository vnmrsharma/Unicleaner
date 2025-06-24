import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, FileImage } from 'lucide-react';

const ImageUploader = ({ onFileSelect, selectedFile, disabled }) => {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileSelect(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.webp', '.bmp']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled
  });

  const removeFile = () => {
    onFileSelect(null);
    setPreview(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <Upload className={`w-12 h-12 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
              </p>
              <p className="text-gray-500 mt-1">
                or click to select a file
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Supports: JPEG, PNG, TIFF, WebP, BMP (max 50MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <FileImage className="w-8 h-8 text-primary-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>
              {!disabled && (
                <button
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Preview
              </h4>
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-64 object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Upload Another Button */}
          {!disabled && (
            <div className="flex justify-center">
              <div
                {...getRootProps()}
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <input {...getInputProps()} />
                <Upload className="w-4 h-4 mr-2" />
                Upload Different Image
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 