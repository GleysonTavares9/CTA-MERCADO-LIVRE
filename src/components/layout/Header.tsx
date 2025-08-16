import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="text-center text-white mb-12 animate-fadeIn">
      <div className="relative">
        {/* Logo/Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm shadow-lg">
          <span className="text-4xl">🛒</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold mb-3 text-white drop-shadow-2xl tracking-tight">
          Gerador de CTA MercadoLivre
        </h1>
        
        <p className="text-base md:text-lg text-white/95 mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
          Transforme links do MercadoLivre em mensagens persuasivas com IA e gere conteúdo para redes sociais automaticamente!
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
          <div className="flex items-center gap-2 bg-white/95 text-gray-800 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg">
            <span className="font-medium">Dados reais</span>
          </div>
          <div className="flex items-center gap-2 bg-white/95 text-gray-800 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg">
            <span className="font-medium">IA integrada</span>
          </div>
          <div className="flex items-center gap-2 bg-white/95 text-gray-800 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg">
            <span className="font-medium">UTM tracking</span>
          </div>
          <div className="flex items-center gap-2 bg-white/95 text-gray-800 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg">
            <span className="font-medium">WhatsApp & Social</span>
          </div>
        </div>

        {/* CTA to AI settings */}
        <div className="mt-6">
          <a
            href="#ai-settings"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
          >
            ⚙️ Configurar IA
          </a>
        </div>
      </div>
    </div>
  );
};