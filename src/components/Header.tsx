import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="text-center text-white mb-12 animate-fadeIn">
      <div className="relative">
        {/* Logo/Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
          <span className="text-4xl">🛒</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-2xl">
          Gerador de CTA MercadoLivre
        </h1>
        
        <p className="text-lg md:text-xl text-white mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
          Transforme links do MercadoLivre em mensagens persuasivas com IA e gere conteúdo para redes sociais automaticamente!
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-white bg-opacity-95 text-gray-800 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg">
            <span className="text-green-600">✅</span>
            <span className="font-medium">Dados Reais</span>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-95 text-gray-800 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg">
            <span className="text-blue-600">🤖</span>
            <span className="font-medium">IA Integrada</span>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-95 text-gray-800 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg">
            <span className="text-yellow-600">📊</span>
            <span className="font-medium">UTM Tracking</span>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-95 text-gray-800 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg">
            <span className="text-green-600">📱</span>
            <span className="font-medium">WhatsApp & Social</span>
          </div>
        </div>
      </div>
    </div>
  );
};