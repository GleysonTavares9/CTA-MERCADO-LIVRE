import React, { useState } from 'react';
import { ProductData } from '../../types';

interface Props {
  productData: ProductData | null;
  isVisible: boolean;
}

export const ProductInfo: React.FC<Props> = ({ productData, isVisible }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!isVisible || !productData) return null;

  const handleImageError = () => {
    setImageError(true);
  };

  // URL da imagem ou fallback
  const imageUrl = imageError || !productData.image 
    ? 'https://http2.mlstatic.com/static/org-img/errors/404-mla.png'
    : productData.image;

  // Formatar preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-5 animate-fadeIn">
      <div className="flex gap-4 items-start">
        <div className="relative w-20 h-20 flex-shrink-0">
          <img 
            src={imageUrl}
            alt={productData.name}
            onError={handleImageError}
            className={`w-full h-full object-cover rounded-lg border-2 ${
              imageError ? 'border-gray-300' : 'border-blue-300'
            }`}
            loading="lazy"
          />
          {!imageError && (
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all rounded-lg" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
            {productData.name}
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white rounded-lg p-2 border border-blue-200">
              <div className="text-gray-500 mb-1">Preço</div>
              <div className="font-bold text-green-600">
                {productData.discountPrice 
                  ? formatPrice(productData.discountPrice)
                  : formatPrice(productData.originalPrice)
                }
              </div>
              {productData.discountPrice && (
                <div className="text-gray-400 line-through text-xs">
                  {formatPrice(productData.originalPrice)}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg p-2 border border-blue-200">
              <div className="text-gray-500 mb-1">Avaliação</div>
              <div className="font-bold text-yellow-600">
                ⭐ {productData.rating.toFixed(1)}
              </div>
              <div className="text-gray-400 text-xs">
                {productData.reviews} avaliações
              </div>
            </div>
          </div>
          
          <div className="mt-3 bg-white rounded-lg p-2 border border-blue-200">
            <div className="text-gray-500 text-xs mb-1">Categoria</div>
            <div className="font-medium text-blue-600 text-xs">
              {productData.category}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};