import React, { useState, useCallback, useEffect } from 'react';
import { Scissors, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

const BackgroundRemover = ({ 
  originalFile, 
  onBackgroundRemoved, 
  disabled = false 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [processingReady, setProcessingReady] = useState(false);

  // Ensure this only runs on the client side
  useEffect(() => {
    setIsClient(true);
    setProcessingReady(true);
  }, []);

  // Simple canvas-based background removal (alpha channel manipulation)
  const processImageBackground = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple background removal: make predominantly white/light areas transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate brightness
          const brightness = (r + g + b) / 3;
          
          // If pixel is predominantly light (white/light gray background), make it transparent
          if (brightness > 200 && Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          } else if (brightness > 180) {
            // Partially transparent for near-white areas
            data[i + 3] = Math.max(0, 255 - (brightness - 180) * 3);
          }
        }

        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to process image'));
          }
        }, 'image/png');
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleRemoveBackground = useCallback(async () => {
    if (!originalFile || isProcessing || !processingReady) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Process the image using canvas-based background removal
      const blob = await processImageBackground(originalFile);
      
      // Convert blob to file
      const processedFile = new File([blob], `bg-removed-${originalFile.name}`, {
        type: 'image/png', // Background removal outputs PNG for transparency
        lastModified: Date.now(),
      });

      // Create preview URL
      const previewUrl = URL.createObjectURL(blob);
      setProcessedImage(previewUrl);
      
      // Notify parent component
      onBackgroundRemoved(processedFile, previewUrl);
      
    } catch (err) {
      console.error('Background removal failed:', err);
      setError(err.message || 'Failed to remove background');
    } finally {
      setIsProcessing(false);
    }
  }, [originalFile, isProcessing, onBackgroundRemoved, processingReady]);

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  // Don't render on server side to avoid hydration issues
  if (!isClient || !originalFile) return null;

  return (
    <div className="space-y-4">
      {/* Background Removal Controls */}
      <div className="card border-purple-200 bg-purple-50">
        <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
          <Scissors className="w-5 h-5 mr-2" />
          Background Removal
        </h3>
        
        <p className="text-purple-700 mb-4 text-sm">
          Remove light/white backgrounds from your image for a professional look. 
          This process happens entirely in your browser for maximum privacy.
        </p>

        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p><strong>Best Results:</strong> This feature works best with images that have solid white or light-colored backgrounds. For complex backgrounds, consider using dedicated AI tools.</p>
            </div>
          </div>
        </div>

        {!processedImage && !isProcessing && (
          <button
            onClick={handleRemoveBackground}
            disabled={disabled || isProcessing || !processingReady}
            className="btn-primary bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 disabled:opacity-50"
          >
            <Scissors className="w-4 h-4 mr-2" />
            {processingReady ? 'Remove Light Background' : 'Preparing...'}
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
