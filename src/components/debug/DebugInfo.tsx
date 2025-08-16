import React, { useState } from 'react';
import { ProductData } from '../../types';

interface Props {
  productData: ProductData | null;
  isVisible: boolean;
}

export const DebugInfo: React.FC<Props> = ({ productData, isVisible }) => {
  const [showDebug, setShowDebug] = useState(false);

  if (!isVisible || !productData) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {showDebug ? 'Ocultar detalhes' : 'Ver detalhes técnicos'}
      </button>
      
      {showDebug && (
        <div className="mt-2 bg-gray-50/70 rounded-lg p-3 text-xs font-mono border border-gray-100">
          <h4 className="font-semibold text-gray-700 mb-2 text-[11px] uppercase tracking-wider">Dados Extraídos</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div className="truncate">
              <span className="text-gray-500">Nome:</span>
              <div className="font-medium text-gray-800 truncate" title={productData.name}>
                {productData.name}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Preço:</span>
              <div className="font-medium text-green-600">
                R$ {productData.originalPrice.toFixed(2)}
              </div>
            </div>
            {productData.discountPrice && (
              <div>
                <span className="text-gray-500">Desconto:</span>
                <div className="font-medium text-red-600">
                  R$ {productData.discountPrice.toFixed(2)}
                </div>
              </div>
            )}
            <div>
              <span className="text-gray-500">Categoria:</span>
              <div className="font-medium">{productData.category}</div>
            </div>
            <div>
              <span className="text-gray-500">Avaliação:</span>
              <div className="font-medium">{productData.rating}/5 ({productData.reviews} avaliações)</div>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Imagem:</span>
              <a 
                href={productData.image} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline text-xs block truncate"
                title={productData.image}
              >
                {productData.image?.substring(0, 50)}...
              </a>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Link Afiliado:</span>
              <a 
                href={productData.affiliateLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline text-xs block truncate"
                title={productData.affiliateLink}
              >
                {productData.affiliateLink?.substring(0, 50)}...
              </a>
            </div>
          </div>
          
          {productData.discountPrice && (
            <div className="mt-3 p-2 bg-green-50 rounded border border-green-100 text-xs">
              <div className="font-medium text-green-800 mb-1">Economia no produto:</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-1.5 rounded border">
                  <div className="text-gray-500">Valor economizado</div>
                  <div className="font-semibold text-green-600">
                    R$ {(productData.originalPrice - productData.discountPrice).toFixed(2)}
                  </div>
                </div>
                <div className="bg-white p-1.5 rounded border">
                  <div className="text-gray-500">Percentual</div>
                  <div className="font-semibold text-green-600">
                    {Math.round(((productData.originalPrice - productData.discountPrice) / productData.originalPrice) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};