import React, { useState } from 'react';
import Head from 'next/head';
import { Shield, Upload, Download, Info, CheckCircle, AlertTriangle, Scissors } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import MetadataDisplay from '../components/MetadataDisplay';
import ProcessingStatus from '../components/ProcessingStatus';
import BackgroundRemover from '../components/BackgroundRemover';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [originalMetadata, setOriginalMetadata] = useState(null);
  
  // Background removal states
  const [backgroundRemovedFile, setBackgroundRemovedFile] = useState(null);
  const [backgroundRemovalPreview, setBackgroundRemovalPreview] = useState(null);
  const [removeBackground, setRemoveBackground] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setOriginalMetadata(null);
    // Reset background removal states
    setBackgroundRemovedFile(null);
    setBackgroundRemovalPreview(null);
    setRemoveBackground(false);
  };

  const handleBackgroundRemoved = (processedFile, previewUrl) => {
    setBackgroundRemovedFile(processedFile);
    setBackgroundRemovalPreview(previewUrl);
    setRemoveBackground(true);
  };

  const handleProcessImage = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      // Use background-removed file if available, otherwise use original
      const imageToProcess = backgroundRemovedFile || file;
      formData.append('image', imageToProcess);

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      // Add background removal to removed items if it was applied
      if (backgroundRemovedFile) {
        data.removedItems = [...(data.removedItems || []), 'Background removed'];
      }

      setResult(data);
      setOriginalMetadata(data.originalMetadata);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.filename) return;

    try {
      const response = await fetch(`/api/download/${result.filename}`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // Use descriptive filename based on processing applied
      const baseFileName = file.name.split('.')[0];
      const suffix = backgroundRemovedFile ? 'bg-removed-cleaned' : 'cleaned';
      a.download = `${suffix}-${baseFileName}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setOriginalMetadata(null);
    // Reset background removal states
    setBackgroundRemovedFile(null);
    setBackgroundRemovalPreview(null);
    setRemoveBackground(false);
    // Clean up preview URLs
    if (backgroundRemovalPreview) {
      URL.revokeObjectURL(backgroundRemovalPreview);
    }
  };

  return (
    <>
      <Head>
        <title>UniCleaner - Professional Metadata Removal Tool</title>
        <meta name="description" content="Professional tool by Unineed to remove metadata, EXIF data, and digital signatures from images" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="w-16 h-16 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              UniCleaner
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tool to remove metadata, EXIF data, digital signatures, and backgrounds from your images
            </p>
            
            {/* Developer Credits */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>Developed by Unineed</strong> - Advanced metadata removal technology
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Upload Section */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Upload className="w-6 h-6 mr-2 text-primary-600" />
                Upload Image
              </h2>
              <ImageUploader 
                onFileSelect={handleFileSelect}
                selectedFile={file}
                disabled={processing}
              />
            </div>

            {/* Background Removal Section */}
            {file && !processing && !result && (
              <BackgroundRemover
                originalFile={file}
                onBackgroundRemoved={handleBackgroundRemoved}
                disabled={processing}
              />
            )}

            {/* Processing Status */}
            {processing && (
              <ProcessingStatus hasBackgroundRemoval={!!backgroundRemovedFile} />
            )}

            {/* Error Display */}
            {error && (
              <div className="card border-red-200 bg-red-50">
                <div className="flex items-center space-x-3 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Error: {error}</span>
                </div>
              </div>
            )}

            {/* Original Metadata */}
            {originalMetadata && !processing && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-primary-600" />
                  Original Image Metadata
                </h3>
                <MetadataDisplay metadata={originalMetadata} />
              </div>
            )}

            {/* Action Buttons */}
            {file && !processing && !result && (
              <div className="flex justify-center">
                <button 
                  onClick={handleProcessImage}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Clean Image
                </button>
              </div>
            )}

            {/* Results Section */}
            {result && (
              <div className="card border-green-200 bg-green-50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-green-900 flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Image Cleaned Successfully!
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Removed Items:</h4>
                    {result.removedItems.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {result.removedItems.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No metadata was found to remove.</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={handleDownload}
                      className="btn-primary px-6 py-3"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Cleaned Image
                    </button>
                    <button 
                      onClick={handleReset}
                      className="btn-secondary px-6 py-3"
                    >
                      Clean Another Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Features Section */}
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              <div className="text-center p-6">
                <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Metadata Removal</h3>
                <p className="text-gray-600">Removes EXIF data, color profiles, thumbnails, and all embedded metadata</p>
              </div>
              <div className="text-center p-6">
                <Scissors className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Background Removal</h3>
                <p className="text-gray-600">Client-side background removal for images with light/white backgrounds</p>
              </div>
              <div className="text-center p-6">
                <CheckCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Signature Cleaning</h3>
                <p className="text-gray-600">Eliminates digital watermarks and signature data from image files</p>
              </div>
              <div className="text-center p-6">
                <Download className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Output</h3>
                <p className="text-gray-600">900x900 pixels with enhanced contrast, saturation, and sharpening for optimal results</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
} 