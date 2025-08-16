import React, { useState } from 'react';
import { ProductPoster } from './ProductPoster';
import { ProductData } from '../types';

// Dados de exemplo - você pode substituir pelos seus produtos reais
const sampleProducts: ProductData[] = [
  {
    name: "Smart Watch Pro",
    originalPrice: 60,
    discountPrice: 30,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "COLLECTION",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    rating: 4.5,
    reviews: 128,
    affiliateLink: "#"
  },
  {
    name: "Wireless Headphones",
    originalPrice: 80,
    discountPrice: 45,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "AUDIO",
    description: "Premium sound quality with noise cancellation technology.",
    rating: 4.8,
    reviews: 256,
    affiliateLink: "#"
  },
  {
    name: "Gaming Mouse",
    originalPrice: 40,
    discountPrice: 25,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    category: "GAMING",
    description: "High precision gaming mouse with RGB lighting.",
    rating: 4.6,
    reviews: 89,
    affiliateLink: "#"
  }
];

const colorThemes = [
  { name: 'Red Classic', bg: 'from-red-900 to-red-700', accent: 'yellow-400' },
  { name: 'Blue Ocean', bg: 'from-blue-900 to-blue-700', accent: 'cyan-400' },
  { name: 'Purple Night', bg: 'from-purple-900 to-purple-700', accent: 'pink-400' },
  { name: 'Green Forest', bg: 'from-green-900 to-green-700', accent: 'lime-400' },
  { name: 'Orange Sunset', bg: 'from-orange-900 to-orange-700', accent: 'yellow-300' }
];

export const PosterPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductData>(sampleProducts[0]);
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);
  const [showDiscount, setShowDiscount] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Product Poster Generator
        </h1>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Produto
              </label>
              <select 
                value={sampleProducts.indexOf(selectedProduct)}
                onChange={(e) => setSelectedProduct(sampleProducts[parseInt(e.target.value)])}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sampleProducts.map((product, index) => (
                  <option key={index} value={index}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema de Cores
              </label>
              <select 
                value={colorThemes.indexOf(selectedTheme)}
                onChange={(e) => setSelectedTheme(colorThemes[parseInt(e.target.value)])}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {colorThemes.map((theme, index) => (
                  <option key={index} value={index}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opções
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showDiscount"
                  checked={showDiscount}
                  onChange={(e) => setShowDiscount(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showDiscount" className="text-sm text-gray-700">
                  Mostrar desconto
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Poster Preview */}
        <div className="flex justify-center">
          <ProductPoster 
            product={selectedProduct}
            backgroundColor={selectedTheme.bg}
            accentColor={selectedTheme.accent}
            showDiscount={showDiscount}
          />
        </div>

        {/* Download/Export Options */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Exportar Poster</h3>
            <div className="flex justify-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                Download PNG
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                Copiar HTML
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};