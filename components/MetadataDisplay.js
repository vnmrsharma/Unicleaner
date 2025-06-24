import React from 'react';
import { Info, Camera } from 'lucide-react';

const MetadataDisplay = ({ metadata }) => {
  const renderBasicInfo = () => (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        <Info className="w-4 h-4 mr-2" />
        Basic Information
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm font-medium text-gray-600">Format</span>
          <p className="text-sm text-gray-900">{metadata.format || 'Unknown'}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Dimensions</span>
          <p className="text-sm text-gray-900">
            {metadata.width} × {metadata.height}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">File Size</span>
          <p className="text-sm text-gray-900">
            {metadata.size ? `${(metadata.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Color Profile</span>
          <p className="text-sm text-gray-900">
            {metadata.hasProfile ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPrivacyConcerns = () => {
    const concerns = [];
    
    if (metadata.exif) {
      const exifKeys = Object.keys(metadata.exif);
      if (exifKeys.some(key => key.toLowerCase().includes('gps'))) {
        concerns.push('GPS Location Data');
      }
      if (exifKeys.some(key => ['Make', 'Model', 'Software'].includes(key))) {
        concerns.push('Device Information');
      }
      if (exifKeys.some(key => key.toLowerCase().includes('date'))) {
        concerns.push('Timestamp Information');
      }
      if (exifKeys.some(key => ['Artist', 'Copyright', 'Author'].includes(key))) {
        concerns.push('Copyright/Author Data');
      }
    }

    if (concerns.length === 0) {
      return (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">Privacy Status</h4>
          <p className="text-sm text-green-700">No obvious privacy concerns detected in metadata.</p>
        </div>
      );
    }

    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h4 className="font-medium text-red-900 mb-2">Privacy Concerns Detected</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
          {concerns.map((concern, index) => (
            <li key={index}>{concern}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderBasicInfo()}
      {renderPrivacyConcerns()}
    </div>
  );
};

export default MetadataDisplay; 