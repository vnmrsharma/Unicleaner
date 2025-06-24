import React from 'react';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">UniCleaner</h1>
              <p className="text-xs text-gray-500">by Unineed - Professional Metadata Removal</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 