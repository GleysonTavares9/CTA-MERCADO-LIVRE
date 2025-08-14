import React, { useState } from 'react';
import { ProductData } from '../types';

interface Props {
  productData: ProductData | null;
  isVisible: boolean;
}

export const DebugInfo: React.FC<Props> = ({ productData, isVisible }) => {
  const [showDebug, setShowDebug] = useState(false);

  if (!isVisible || !productData) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        🔧 {showDebug ? 'Ocultar' : 'Mostrar'} Debug
      </button>
      
      {showDebug && (
        <div className="mt-3 bg-gray-50 rounded-lg p-4 text-xs font-mono">
          <h4 className="font-bold text-gray-800 mb-2">Dados Extraídos:</h4>
          <div className="space-y-1">
            <div><strong>Nome:</strong> {productData.name}</div>
            <div><strong>Preço Original:</strong> R$ {productData.originalPrice.toFixed(2)}</div>
            <div><strong>Preço com Desconto:</strong> {productData.discountPrice ? `R$ ${productData.discountPrice.toFixed(2)}` : 'Não há'}</div>
            <div><strong>Categoria:</strong> {productData.category}</div>
            <div><strong>Rating:</strong> {productData.rating}/5</div>
            <div><strong>Reviews:</strong> {productData.reviews}</div>
            <div><strong>Imagem:</strong> <a href={productData.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver imagem</a></div>
            <div><strong>Link Afiliado:</strong> <a href={productData.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver produto</a></div>
          </div>
          
          {productData.discountPrice && (
            <div className="mt-3 p-2 bg-green-100 rounded">
              <strong>Desconto Calculado:</strong>
              <div>Economia: R$ {(productData.originalPrice - productData.discountPrice).toFixed(2)}</div>
              <div>Percentual: {Math.round(((productData.originalPrice - productData.discountPrice) / productData.originalPrice) * 100)}%</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};