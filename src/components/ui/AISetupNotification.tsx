import React, { useState } from 'react';
import { AlertCircle, ExternalLink, X } from 'lucide-react';

export const AISetupNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const hasApiKey = import.meta.env.VITE_GEMINI_API_KEY && 
                   import.meta.env.VITE_GEMINI_API_KEY !== 'sua_chave_aqui' &&
                   import.meta.env.VITE_GEMINI_API_KEY.length > 10;

  if (!isVisible || hasApiKey) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X size={16} />
      </button>
      
      <div className="flex items-start space-x-3">
        <AlertCircle className="text-blue-500 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">
            🤖 Ative a IA para CTAs Personalizadas
          </h3>
          <p className="text-blue-700 text-sm mb-3">
            Atualmente usando templates locais. Configure o Gemini AI para CTAs ainda mais persuasivas e personalizadas!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={14} className="mr-1" />
              Obter Chave API Gratuita
            </a>
            <button
              onClick={() => setIsVisible(false)}
              className="px-3 py-2 text-blue-600 text-sm border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
            >
              Continuar sem IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};