import React, { useState } from 'react';

export const ColorPalette: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const colors = [
    { name: 'Amarelo Principal', value: '#FFF159', class: 'bg-ml-yellow' },
    { name: 'Amarelo Brilhante', value: '#FFEB3B', class: 'bg-ml-yellow-bright' },
    { name: 'Amarelo Escuro', value: '#F9C74F', class: 'bg-ml-yellow-dark' },
    { name: 'Azul Principal', value: '#3483FA', class: 'bg-ml-blue' },
    { name: 'Azul Escuro', value: '#2968C8', class: 'bg-ml-blue-dark' },
    { name: 'Azul Claro', value: '#E3F2FD', class: 'bg-ml-blue-light' },
  ];

  const gradients = [
    { name: 'Gradiente Principal', class: 'bg-ml-gradient' },
    { name: 'Gradiente Amarelo', class: 'bg-ml-gradient-yellow' },
    { name: 'Gradiente Azul', class: 'bg-ml-gradient-blue' },
  ];

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-ml">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-ml-blue flex items-center gap-2">
          🎨 Paleta de Cores Oficial
        </h2>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-gray-500 hover:text-gray-700 text-sm bg-white px-3 py-1 rounded-full shadow-sm"
        >
          {isVisible ? '▼ Ocultar' : '▶ Mostrar'}
        </button>
      </div>

      {isVisible && (
        <div className="space-y-6">
          {/* Cores principais */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Cores Principais</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colors.map((color, index) => (
                <div key={index} className="text-center">
                  <div 
                    className={`${color.class} w-full h-16 rounded-lg shadow-sm border border-gray-200 mb-2`}
                  ></div>
                  <p className="text-xs font-medium text-gray-700">{color.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{color.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gradientes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Gradientes</h3>
            <div className="space-y-3">
              {gradients.map((gradient, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className={`${gradient.class} w-24 h-12 rounded-lg shadow-sm border border-gray-200`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{gradient.name}</p>
                    <p className="text-xs text-gray-500">Baseado no site oficial</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exemplo de uso */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Exemplo de Aplicação</h3>
            <div className="bg-ml-gradient rounded-lg p-4 text-white text-center">
              <h4 className="text-lg font-bold mb-2">🛒 MercadoLivre</h4>
              <p className="text-sm opacity-90">Tema oficial aplicado na aplicação</p>
            </div>
          </div>

          {/* Informações */}
          <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
            <p>🎯 <strong>Baseado em:</strong> Site oficial do MercadoLivre (mercadolivre.com.br)</p>
            <p>🎨 <strong>Cores extraídas:</strong> Diretamente da interface oficial</p>
            <p>✨ <strong>Aplicação:</strong> Gradientes, botões, componentes e canvas</p>
            <p>📱 <strong>Responsivo:</strong> Otimizado para todos os dispositivos</p>
          </div>
        </div>
      )}
    </div>
  );
};