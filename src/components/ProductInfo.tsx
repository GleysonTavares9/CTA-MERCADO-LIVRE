import React, { useState } from 'react';
import { ProductData } from '../types';

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
          <h3 className="font-semibold text-blue-900 mb-2 text-sm line-clamp-2" title={productData.name}>
            {productData.name}
          </h3>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(productData.discountPrice || productData.originalPrice)}
            </span>
            
            {productData.discountPrice && productData.discountPrice < productData.originalPrice && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(productData.originalPrice)}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  {Math.round((1 - productData.discountPrice / productData.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          
          {productData.rating > 0 && (
            <div className="mt-1 flex items-center">
              <span className="text-yellow-500 mr-1">
                {'★'.repeat(Math.round(productData.rating))}
                {'☆'.repeat(5 - Math.round(productData.rating))}
              </span>
              <span className="text-xs text-gray-600">
                ({productData.reviews} {productData.reviews === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};