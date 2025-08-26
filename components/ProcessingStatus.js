import React from 'react';
import { Loader2, Shield, Zap, CheckCircle, Scissors } from 'lucide-react';

const ProcessingStatus = ({ hasBackgroundRemoval = false }) => {
  const baseSteps = [
    { icon: <Loader2 className="w-5 h-5" />, text: "Analyzing image metadata..." },
    { icon: <Shield className="w-5 h-5" />, text: "Removing EXIF data..." },
    { icon: <Zap className="w-5 h-5" />, text: "Cleaning digital signatures..." },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Optimizing image quality..." }
  ];

  const backgroundRemovalStep = { 
    icon: <Scissors className="w-5 h-5" />, 
    text: "Processing background-removed image..." 
  };

  const steps = hasBackgroundRemoval 
    ? [backgroundRemovalStep, ...baseSteps]
    : baseSteps;

  return (
    <div className="card border-blue-200 bg-blue-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-blue-900 mb-2">
          Processing Your Image
        </h3>
        <p className="text-blue-700 mb-6">
          Please wait while we clean your image...
        </p>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-center justify-center space-x-3 text-blue-700"
            >
              <div className="animate-pulse">
                {step.icon}
              </div>
              <span className="text-sm">{step.text}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus; 