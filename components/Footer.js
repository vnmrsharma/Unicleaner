import React from 'react';
import { Shield, Lock, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-primary-400" />
              <h3 className="font-bold text-lg">UniCleaner</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Professional tool for removing metadata, backgrounds, and digital signatures from images. Developed by Unineed.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Privacy & Security
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Client-side background removal</li>
              <li>• All processing happens locally</li>
              <li>• No images stored on servers</li>
              <li>• Automatic file cleanup</li>
              <li>• End-to-end encryption</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Technical Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Canvas-based background removal</li>
              <li>• EXIF metadata removal</li>
              <li>• Color profile cleaning</li>
              <li>• Digital signature stripping</li>
              <li>• Enhanced 900x900 output with quality boost</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              About Unineed
            </h4>
            <p className="text-sm text-gray-400">
              UniCleaner is developed by Unineed, an Ecommerce company focused on creating powerful 
              tools for next wave of AI powered ecommerce.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 UniCleaner by Unineed. Built with modern web technologies for maximum privacy and security.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 