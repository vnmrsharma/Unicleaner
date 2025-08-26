import React, { useState, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { Scissors, Loader2, Eye, EyeOff } from 'lucide-react';

const BackgroundRemover = ({ 
  originalFile, 
  onBackgroundRemoved, 
  disabled = false 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [error, setError] = useState(null);

  const handleRemoveBackground = useCallback(async () => {
    if (!originalFile || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Convert file to blob URL for processing
      const imageUrl = URL.createObjectURL(originalFile);
      
      // Remove background using @imgly/background-removal
      const blob = await removeBackground(imageUrl);
      
      // Convert blob to file
      const processedFile = new File([blob], `bg-removed-${originalFile.name}`, {
        type: 'image/png', // Background removal typically outputs PNG for transparency
        lastModified: Date.now(),
      });

      // Create preview URL
      const previewUrl = URL.createObjectURL(blob);
      setProcessedImage(previewUrl);
      
      // Notify parent component
      onBackgroundRemoved(processedFile, previewUrl);
      
      // Clean up the original URL
      URL.revokeObjectURL(imageUrl);
      
    } catch (err) {
      console.error('Background removal failed:', err);
      setError(err.message || 'Failed to remove background');
    } finally {
      setIsProcessing(false);
    }
  }, [originalFile, isProcessing, onBackgroundRemoved]);

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  if (!originalFile) return null;

  return (
    <div className="space-y-4">
      {/* Background Removal Controls */}
      <div className="card border-purple-200 bg-purple-50">
        <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
          <Scissors className="w-5 h-5 mr-2" />
          Background Removal
        </h3>
        
        <p className="text-purple-700 mb-4 text-sm">
          Remove the background from your image for a professional, clean look. 
          This process happens entirely in your browser for maximum privacy.
        </p>

        {!processedImage && !isProcessing && (
          <button
            onClick={handleRemoveBackground}
            disabled={disabled || isProcessing}
            className="btn-primary bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
          >
            <Scissors className="w-4 h-4 mr-2" />
            Remove Background
          </button>
        )}

        {isProcessing && (
          <div className="flex items-center space-x-3 text-purple-700">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Processing image... This may take a moment.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </div>

      {/* Preview and Comparison */}
      {processedImage && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Scissors className="w-4 h-4 mr-2 text-purple-600" />
              Background Removed Successfully
            </h4>
            <button
              onClick={toggleComparison}
              className="btn-secondary text-sm"
            >
              {showComparison ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Hide Comparison
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Show Comparison
                </>
              )}
            </button>
          </div>

          {showComparison ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Original</h5>
                <div className="bg-gray-100 rounded-lg p-4">
                  <img
                    src={URL.createObjectURL(originalFile)}
                    alt="Original"
                    className="max-w-full max-h-48 object-contain mx-auto rounded"
                  />
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Background Removed</h5>
                <div className="bg-gray-100 rounded-lg p-4 relative">
                  {/* Checkerboard pattern for transparency */}
                  <div 
                    className="absolute inset-4 rounded opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                                       linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                                       linear-gradient(45deg, transparent 75%, #ccc 75%), 
                                       linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                      backgroundSize: '12px 12px',
                      backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                    }}
                  />
                  <img
                    src={processedImage}
                    alt="Background Removed"
                    className="max-w-full max-h-48 object-contain mx-auto rounded relative z-10"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-4 relative">
              {/* Checkerboard pattern for transparency */}
              <div 
                className="absolute inset-4 rounded opacity-20"
                style={{
                  backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                                   linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                                   linear-gradient(45deg, transparent 75%, #ccc 75%), 
                                   linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                  backgroundSize: '12px 12px',
                  backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                }}
              />
              <img
                src={processedImage}
                alt="Background Removed"
                className="max-w-full max-h-64 object-contain mx-auto rounded relative z-10"
              />
            </div>
          )}

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              ✓ Background successfully removed! The processed image will be used for metadata cleaning.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
