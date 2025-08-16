import React from 'react';
import { ProductData } from '../../types';

interface ProductPosterProps {
    product: ProductData;
    backgroundColor?: string;
    accentColor?: string;
    showDiscount?: boolean;
    brandName?: string;
    slogan?: string;
    contactPhone?: string;
    width?: number | string;
    height?: number | string;
}

export const ProductPoster: React.FC<ProductPosterProps> = ({
    product,
    backgroundColor = 'from-blue-600 via-blue-500 to-yellow-400',
    accentColor = 'yellow-300',
    showDiscount = true,
    brandName = 'MercadoLivre',
    slogan = 'Oferta Exclusiva & Imperdível',
    contactPhone = '(11) 99999-9999',
    width = '100%',
    height = 'auto'
}) => {
    const discountPercentage = product.discountPrice
        ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
        : 0;

    const finalPrice = product.discountPrice || product.originalPrice;

    // Calculate aspect ratio if both width and height are numbers
    const aspectRatio = typeof width === 'number' && typeof height === 'number' 
        ? width / height 
        : undefined;

    return (
        <div 
            className={`relative mx-auto bg-gradient-to-br ${backgroundColor} rounded-3xl overflow-hidden shadow-2xl`}
            style={{
                width: width,
                height: height,
                maxWidth: '100%',
                aspectRatio: aspectRatio,
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            }}
        >
            {/* Background decorative elements - MercadoLivre theme */}
            <div className="absolute top-6 left-6 text-white/15 text-6xl font-bold transform -rotate-12">🛒</div>
            <div className="absolute top-12 right-12 text-white/15 text-5xl font-bold transform rotate-12">💳</div>
            <div className="absolute bottom-12 right-16 text-yellow-300/40 text-4xl transform rotate-12">⭐</div>
            <div className="absolute bottom-20 left-8 text-white/20 text-3xl">🔥</div>

            {/* Header personalizado */}
            <div className="flex items-center justify-between p-4 bg-white/95">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl font-black text-blue-600">{brandName}</span>
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">{brandName.substring(0, 2).toUpperCase()}</span>
                    </div>
                </div>
                <div className="text-yellow-500 text-2xl">🛒</div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between flex-1">
                {/* Left side - Text content */}
                <div className="flex-1 text-white mb-8 lg:mb-0 lg:pr-12">
                    <div className="mb-6">
                        <p className="text-xl font-light italic mb-3 tracking-wide">{slogan}</p>
                        <h1 className={`text-5xl lg:text-7xl font-black text-${accentColor} mb-6 leading-none drop-shadow-lg`}>
                            {product.category.toUpperCase()}
                        </h1>
                        <p className="text-white/90 text-base max-w-lg leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Price section */}
                    <div className="mb-8">
                        <div className="flex items-baseline space-x-4 mb-3">
                            <span className="text-5xl font-black text-white drop-shadow-md">
                                R$ {finalPrice}
                            </span>
                            {product.discountPrice && (
                                <span className="text-2xl text-white/50 line-through">
                                    R$ {product.originalPrice}
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-light tracking-wider">APENAS</p>
                    </div>

                    {/* CTA Button - apenas visual, sem ação direta */}
                    <div className="bg-yellow-400 text-blue-900 font-black py-4 px-12 rounded-xl mb-8 text-lg tracking-wide shadow-2xl text-center">
                        COMPRAR AGORA
                    </div>

                    {/* Contact info */}
                    <div className="flex items-center space-x-3 text-base bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white/90 font-medium">Ligue e Peça</p>
                            <p className="font-black text-lg tracking-wide">{contactPhone}</p>
                        </div>
                    </div>
                </div>

                {/* Right side - Product image */}
                <div className="flex-1 relative max-w-lg">
                    <div className="relative">
                        {/* Discount badge */}
                        {showDiscount && discountPercentage > 0 && (
                            <div className="absolute -top-6 -right-6 z-20 animate-pulse">
                                <div className="bg-white rounded-full p-6 shadow-2xl transform rotate-12 border-4 border-yellow-400">
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-blue-600">{discountPercentage}%</p>
                                        <p className="text-base font-bold text-yellow-500">OFF</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Product image */}
                        <div className="relative z-10">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full max-w-md mx-auto drop-shadow-2xl transform hover:scale-110 transition-all duration-500 hover:rotate-3"
                            />

                            {/* Enhanced white cloud background */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-40 bg-white rounded-full opacity-90 blur-2xl -z-10"></div>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-20 bg-white rounded-full opacity-60 blur-xl -z-10"></div>
                        </div>
                    </div>

                    {/* Enhanced decorative brush strokes - MercadoLivre colors */}
                    <div className="absolute bottom-0 right-0 w-40 h-20 bg-gradient-to-r from-transparent to-blue-600/40 transform rotate-12 rounded-full blur-sm"></div>
                    <div className="absolute bottom-6 right-12 w-32 h-12 bg-gradient-to-r from-transparent to-yellow-400/30 transform -rotate-12 rounded-full blur-sm"></div>
                    <div className="absolute bottom-12 right-4 w-24 h-8 bg-gradient-to-r from-transparent to-blue-500/20 transform rotate-45 rounded-full blur-sm"></div>
                </div>
            </div>

            {/* Enhanced arrow pointing to price */}
            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 animate-bounce">
                <svg className={`w-20 h-12 text-${accentColor} drop-shadow-lg`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 12l-4-4v3H2v2h8v3l4-4z" />
                </svg>
            </div>

            {/* Additional floating elements */}
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>

            {/* Branding personalizado */}
            <div className="absolute bottom-4 right-4 text-white/60 text-xs font-medium">
                {brandName.toLowerCase().replace(/\s+/g, '')}.com.br
            </div>
        </div>
    );
};