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
    <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 mb-4 mt-4 animate-fadeIn shadow-sm">
      <h3 className="text-sm font-medium text-blue-800 mb-3">Informações do Produto</h3>
      <div className="flex gap-3">
        <div className="relative w-16 h-16 flex-shrink-0">
          <img 
            src={imageUrl}
            alt={productData.name}
            onError={handleImageError}
            className={`w-full h-full object-cover rounded-md border ${
              imageError ? 'border-gray-200' : 'border-blue-200'
            }`}
            loading="lazy"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
            {productData.name}
          </h4>
          
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-green-600 text-sm">
              {productData.discountPrice 
                ? formatPrice(productData.discountPrice)
                : formatPrice(productData.originalPrice)
              }
            </span>
            {productData.discountPrice && (
              <span className="text-gray-400 line-through text-xs">
                {formatPrice(productData.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center text-xs text-gray-500">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="font-medium text-gray-700 mr-1">{productData.rating.toFixed(1)}</span>
            <span className="text-gray-400">({productData.reviews})</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-blue-600">{productData.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};