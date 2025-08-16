import React, { useState } from 'react';
import { ProductData } from '../../types';

interface Props {
  productData: ProductData | null;
  message: string;
}

export const WhatsAppPreview: React.FC<Props> = ({ productData, message }) => {
  const [showLinkPreview, setShowLinkPreview] = useState(true);
  const defaultMessage = "Sua mensagem personalizada aparecerá aqui automaticamente após colar o link.";
  const defaultImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=280&h=200&fit=crop&crop=center";

  const generateWhatsAppLink = () => {
    if (!productData || !message) return '#';

    const fullMessage = `${message}\n\n${productData.affiliateLink || '#'}`;
    const encodedMessage = encodeURIComponent(fullMessage);
    return `https://wa.me/?text=${encodedMessage}`;
  };

  const copyToClipboard = async () => {
    if (!productData || !message) return;

    const fullMessage = `${message}\n\n${productData.affiliateLink || '#'}`;

    try {
      await navigator.clipboard.writeText(fullMessage);
      alert('Mensagem copiada para a área de transferência.');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar a mensagem.');
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-ml">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ml-gray-dark">
          Preview do WhatsApp
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLinkPreview(!showLinkPreview)}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            {showLinkPreview ? 'Com preview do link' : 'Somente texto'}
          </button>
        </div>
      </div>

      <div className="max-w-sm mx-auto bg-green-500 rounded-3xl p-5 relative shadow-lg">
        {/* WhatsApp header simulation */}
        <div className="bg-green-600 -mx-5 -mt-5 mb-4 rounded-t-3xl p-4 text-white text-center font-medium flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-green-600 text-[10px] font-semibold">WA</span>
          </div>
          <span>WhatsApp</span>
        </div>

        {/* Message bubble */}
        <div className="bg-white rounded-2xl p-4 shadow-lg relative animate-fadeIn">
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white transform rotate-45 shadow-sm"></div>

          {/* Link preview card (como aparece no WhatsApp) */}
          {showLinkPreview && productData && (
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-3 bg-white/70 backdrop-blur-sm shadow-sm">
              <img
                src={productData.image || defaultImage}
                alt={productData.name || "Preview do Produto"}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultImage;
                }}
              />
              <div className="p-3">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                  {productData.name || 'Produto do MercadoLivre'}
                </h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {productData.description || 'Confira este produto incrível no MercadoLivre!'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">mercadolivre.com.br</span>
                  {(productData.discountPrice || productData.originalPrice) && (
                    <span className="text-sm font-bold text-green-600">
                      R$ {productData.discountPrice || productData.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Message text */}
          <div className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
            {message || defaultMessage}
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-end mt-2 gap-1">
            <span className="text-xs text-gray-400">
              {new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <span className="text-blue-500 text-xs">✓✓</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {productData && message && (
        <div className="flex gap-3 mt-6">
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors text-center font-medium flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300"
          >
            Abrir no WhatsApp
          </a>
          <button
            onClick={copyToClipboard}
            className="bg-ml-blue text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
          >
            Copiar mensagem
          </button>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4 space-y-1">
        <p><strong>Preview:</strong> Mostra como a mensagem aparecerá no WhatsApp.</p>
        <p><strong>Link preview:</strong> O WhatsApp gera automaticamente o preview do link.</p>
        <p><strong>Dica:</strong> O preview costuma melhorar a taxa de cliques.</p>
      </div>
    </div>
  );
};