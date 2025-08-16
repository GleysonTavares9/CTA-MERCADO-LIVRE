import React, { useRef, useState } from 'react';
import { ProductData } from '../../types';
import { ProductPoster } from './ProductPoster';
import html2canvas from 'html2canvas';

interface ProductPosterWithSaveProps {
  product: ProductData;
  backgroundColor?: string;
  accentColor?: string;
  showDiscount?: boolean;
  brandName?: string;
  slogan?: string;
  contactPhone?: string;
  width?: number;
  height?: number;
}

export const ProductPosterWithSave: React.FC<ProductPosterWithSaveProps> = (props) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadImage = async () => {
    if (!posterRef.current) {
      console.error('posterRef is not attached to any element');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Starting image generation with props:', {
        width: props.width,
        height: props.height,
        productName: props.product?.name
      });
      const posterElement = posterRef.current.querySelector('.poster-container');
      if (!posterElement) {
        console.error('Could not find .poster-container element');
        return;
      }

      const canvas = await html2canvas(posterElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: props.width,
        height: props.height,
        windowWidth: props.width,
        windowHeight: props.height,
        logging: false,
        onclone: (clonedDoc, element) => {
          // Garantir que as fontes sejam carregadas no clone
          const clonedElement = element.querySelector('.poster-container');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.fontFamily = 'Arial, sans-serif';
          }
        }
      });

      const link = document.createElement('a');
      link.download = `${props.product.name.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_poster.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('✅ Imagem baixada com sucesso!');
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Ocorreu um erro ao gerar a imagem. Por favor, verifique o console para mais detalhes e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareToWhatsApp = () => {
    // Criar mensagem do WhatsApp com link de afiliado
    const discountText = props.product.discountPrice 
      ? `💰 *De R$ ${props.product.originalPrice} por R$ ${props.product.discountPrice}*\n🔥 *Economia de R$ ${props.product.originalPrice - props.product.discountPrice}!*\n`
      : `💰 *R$ ${props.product.originalPrice}*\n`;
    
    const message = encodeURIComponent(
      `🛒 *OFERTA ESPECIAL MERCADOLIVRE* 🛒\n\n` +
      `📦 *${props.product.name}*\n\n` +
      discountText +
      `⭐ ${props.product.rating} estrelas (${props.product.reviews} avaliações)\n\n` +
      `🎯 *Categoria:* ${props.product.category}\n\n` +
      `🔗 *COMPRE AGORA:*\n${props.product.affiliateLink || 'Link não disponível'}\n\n` +
      `⚡ *Aproveite antes que acabe!*`
    );
    
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const copyLink = () => {
    if (props.product.affiliateLink) {
      navigator.clipboard.writeText(props.product.affiliateLink).then(() => {
        alert('Link de afiliado copiado para a área de transferência!');
      }).catch(() => {
        alert('Erro ao copiar link. Tente novamente.');
      });
    } else {
      alert('Link de afiliado não disponível.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Poster */}
      <div ref={posterRef} className="flex justify-center w-full">
        <div 
          className="poster-container"
          style={{
            width: props.width ? `${props.width}px` : '100%',
            height: props.height ? `${props.height}px` : 'auto',
            maxWidth: '100%',
            overflow: 'hidden',
            position: 'relative',
            aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : 'auto',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ProductPoster 
            product={props.product}
            backgroundColor={props.backgroundColor || "from-blue-600 via-blue-500 to-yellow-400"}
            accentColor={props.accentColor || "yellow-300"}
            showDiscount={props.showDiscount !== false}
            brandName={props.brandName || "MercadoLivre"}
            slogan={props.slogan || "Oferta Exclusiva & Imperdível"}
            contactPhone={props.contactPhone || "(11) 99999-9999"}
          />
        </div>
      </div>

      {/* Controles de ação */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={downloadImage}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Gerando...
            </>
          ) : (
            <>
              💾 Baixar Imagem
            </>
          )}
        </button>

        <button
          onClick={shareToWhatsApp}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          📱 Compartilhar WhatsApp
        </button>

        <button
          onClick={copyLink}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          📋 Copiar Link
        </button>

        {props.product.affiliateLink && (
          <button
            onClick={() => window.open(props.product.affiliateLink, '_blank')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            🛒 Comprar Agora
          </button>
        )}
      </div>

      {/* Informações para afiliados */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">💼 Ferramentas para Afiliados</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>📱 <strong>WhatsApp:</strong> Compartilhe com mensagem otimizada e seu link de afiliado</p>
          <p>💾 <strong>Download:</strong> Salve a imagem para usar em suas redes sociais</p>
          <p>🔗 <strong>Link Direto:</strong> Copie seu link de afiliado para usar onde quiser</p>
          <p>🛒 <strong>Comprar:</strong> Teste o link e veja a página do produto</p>
        </div>
      </div>

      {/* Estatísticas do produto */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Informações do Produto</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">R$ {props.product.discountPrice || props.product.originalPrice}</div>
            <div className="text-gray-600">Preço Final</div>
          </div>
          {props.product.discountPrice && (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(((props.product.originalPrice - props.product.discountPrice) / props.product.originalPrice) * 100)}%
              </div>
              <div className="text-gray-600">Desconto</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{props.product.rating}</div>
            <div className="text-gray-600">⭐ Avaliação</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{props.product.reviews}</div>
            <div className="text-gray-600">Avaliações</div>
          </div>
        </div>
      </div>
    </div>
  );
};