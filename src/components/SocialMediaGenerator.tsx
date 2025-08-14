import React, { useState, useRef } from 'react';
import { ProductData } from '../types';
import '../utils/canvasPolyfill';

interface SocialMediaGeneratorProps {
    productData: ProductData | null;
    message: string;
}

export const SocialMediaGenerator: React.FC<SocialMediaGeneratorProps> = ({
    productData,
    message
}) => {
    const [selectedFormat, setSelectedFormat] = useState<'instagram-story' | 'instagram-post' | 'facebook-post' | 'twitter-post' | 'promotional-poster'>('instagram-story');
    const [isGenerating, setIsGenerating] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const formats = {
        'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
        'instagram-post': { width: 1080, height: 1080, name: 'Instagram Post' },
        'facebook-post': { width: 1200, height: 630, name: 'Facebook Post' },
        'twitter-post': { width: 1200, height: 675, name: 'Twitter Post' },
        'promotional-poster': { width: 1200, height: 800, name: 'Poster Promocional' }
    };

    const generateImage = async () => {
        if (!productData || !canvasRef.current) return;

        setIsGenerating(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const format = formats[selectedFormat];
        canvas.width = format.width;
        canvas.height = format.height;

        try {
            // Verificar se é poster promocional
            if (selectedFormat === 'promotional-poster') {
                await generatePromotionalPoster(ctx, canvas, productData);
                return;
            }

            // Background branco como no WhatsApp
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Margem e dimensões do card de preview
            const margin = 60;
            const cardWidth = canvas.width - (margin * 2);
            let currentY = margin;

            // 1. CARD DE PREVIEW DO PRODUTO (igual ao WhatsApp)
            const previewCardHeight = 400;
            const previewCardRadius = 12;

            // Sombra do card
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.roundRect(margin + 2, currentY + 2, cardWidth, previewCardHeight, previewCardRadius);
            ctx.fill();

            // Card branco
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#E5E5E5';
            ctx.lineWidth = 1;
            ctx.roundRect(margin, currentY, cardWidth, previewCardHeight, previewCardRadius);
            ctx.fill();
            ctx.stroke();

            // Imagem do produto (parte superior do card)
            const imageHeight = 200;
            if (productData.image) {
                try {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';

                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = productData.image;
                    });

                    // Clip para bordas arredondadas apenas no topo
                    ctx.save();
                    ctx.roundRect(margin, currentY, cardWidth, imageHeight, previewCardRadius);
                    ctx.clip();

                    // Desenhar imagem mantendo proporção
                    const imgAspect = img.width / img.height;
                    const cardAspect = cardWidth / imageHeight;

                    let drawWidth, drawHeight, drawX, drawY;

                    if (imgAspect > cardAspect) {
                        drawHeight = imageHeight;
                        drawWidth = drawHeight * imgAspect;
                        drawX = margin - (drawWidth - cardWidth) / 2;
                        drawY = currentY;
                    } else {
                        drawWidth = cardWidth;
                        drawHeight = drawWidth / imgAspect;
                        drawX = margin;
                        drawY = currentY - (drawHeight - imageHeight) / 2;
                    }

                    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                    ctx.restore();
                } catch (error) {
                    // Placeholder para imagem
                    ctx.fillStyle = '#F0F0F0';
                    ctx.roundRect(margin, currentY, cardWidth, imageHeight, previewCardRadius);
                    ctx.fill();

                    ctx.fillStyle = '#999999';
                    ctx.font = '32px Arial, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('📷', margin + cardWidth / 2, currentY + imageHeight / 2 + 10);
                }
            }

            // Área de texto do card
            const textStartY = currentY + imageHeight + 20;
            const textPadding = 20;

            // Título do produto (igual ao WhatsApp)
            ctx.fillStyle = '#1A1A1A';
            ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
            ctx.textAlign = 'left';

            const title = productData.name.length > 50
                ? productData.name.substring(0, 50) + '...'
                : productData.name;

            wrapText(ctx, title, margin + textPadding, textStartY, cardWidth - (textPadding * 2), 38, 2);

            // Descrição (igual ao WhatsApp)
            ctx.fillStyle = '#65676B';
            ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
            const description = productData.description.length > 80
                ? productData.description.substring(0, 80) + '...'
                : productData.description;

            wrapText(ctx, description, margin + textPadding, textStartY + 80, cardWidth - (textPadding * 2), 28, 2);

            // Linha inferior: domínio e preço
            const bottomY = currentY + previewCardHeight - 30;

            // Domínio (esquerda)
            ctx.fillStyle = '#65676B';
            ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('mercadolivre.com.br', margin + textPadding, bottomY);

            // Preço (direita)
            const price = productData.discountPrice || productData.originalPrice;
            if (price) {
                ctx.fillStyle = '#00A650';
                ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(`R$ ${price}`, margin + cardWidth - textPadding, bottomY);
            }

            currentY += previewCardHeight + 40;

            // 2. MENSAGEM PERSONALIZADA (como no WhatsApp)
            if (message && message.trim()) {
                // Processar mensagem linha por linha
                const messageLines = message.split('\n').filter(line => line.trim());

                ctx.fillStyle = '#1A1A1A';
                ctx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
                ctx.textAlign = 'left';

                messageLines.forEach((line) => {
                    if (line.trim()) {
                        // Detectar diferentes tipos de linha e aplicar formatação
                        let lineColor = '#1A1A1A';
                        let lineFont = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

                        // Linhas com emojis de destaque
                        if (line.includes('🔥') || line.includes('⚡') || line.includes('💰')) {
                            lineColor = '#FF6B35';
                            lineFont = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
                        }
                        // Linhas com check marks
                        else if (line.includes('✅') || line.includes('☑️')) {
                            lineColor = '#00A650';
                            lineFont = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
                        }
                        // Linhas com estrelas (avaliações)
                        else if (line.includes('⭐') || line.includes('estrelas')) {
                            lineColor = '#1877F2';
                            lineFont = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
                        }
                        // Linhas com ofertas/tempo limitado
                        else if (line.includes('🎯') || line.includes('⏰') || line.includes('limitado')) {
                            lineColor = '#E74C3C';
                            lineFont = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
                        }

                        ctx.fillStyle = lineColor;
                        ctx.font = lineFont;

                        // Quebrar linha se for muito longa
                        wrapText(ctx, line, margin + 20, currentY, cardWidth - 40, 35, 1);
                        currentY += 40;
                    }
                });
            }

            // 3. TIMESTAMP E STATUS (como no WhatsApp)
            const timestampY = canvas.height - 60;
            ctx.fillStyle = '#65676B';
            ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
            ctx.textAlign = 'right';

            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            ctx.fillText(`${timeString} ✓✓`, canvas.width - margin, timestampY);

        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const generatePromotionalPoster = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, productData: ProductData) => {
        // Criar gradiente de fundo - Cores do MercadoLivre
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#3483FA'); // Azul MercadoLivre
        gradient.addColorStop(0.5, '#2968C8'); // Azul mais escuro
        gradient.addColorStop(1, '#FFE600'); // Amarelo MercadoLivre
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Elementos decorativos de fundo - Tema MercadoLivre
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.font = 'bold 100px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🛒', 120, 140);
        ctx.fillText('💳', canvas.width - 120, 180);
        ctx.fillStyle = 'rgba(255, 230, 0, 0.3)';
        ctx.fillText('⭐', canvas.width - 180, canvas.height - 80);
        ctx.fillText('🔥', 100, canvas.height - 120);

        // Header MercadoLivre
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(0, 0, canvas.width, 80);
        
        // Logo MercadoLivre (texto)
        ctx.fillStyle = '#3483FA';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('MercadoLivre', 30, 50);
        
        // Ícone de carrinho
        ctx.fillStyle = '#FFE600';
        ctx.font = '28px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('🛒', canvas.width - 30, 50);

        // Layout principal
        const leftWidth = canvas.width * 0.6;
        const rightWidth = canvas.width * 0.4;
        const contentY = 140;

        // Lado esquerdo - Texto em português
        ctx.fillStyle = 'white';
        ctx.font = 'italic 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Oferta Exclusiva & Imperdível', 60, contentY);

        // Título principal
        ctx.fillStyle = '#FFE600'; // Amarelo MercadoLivre
        ctx.font = 'bold 64px Arial';
        const categoryText = productData.category.length > 15 
            ? productData.category.substring(0, 15) + '...' 
            : productData.category;
        ctx.fillText(categoryText.toUpperCase(), 60, contentY + 70);

        // Descrição
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '24px Arial';
        const description = productData.description.length > 60
            ? productData.description.substring(0, 60) + '...'
            : productData.description;
        wrapText(ctx, description, 60, contentY + 140, leftWidth - 120, 30, 3);

        // Preço
        const finalPrice = productData.discountPrice || productData.originalPrice;
        const discountPercentage = productData.discountPrice
            ? Math.round(((productData.originalPrice - productData.discountPrice) / productData.originalPrice) * 100)
            : 0;

        ctx.fillStyle = 'white';
        ctx.font = 'bold 64px Arial';
        ctx.fillText(`R$ ${finalPrice}`, 60, contentY + 280);

        if (productData.discountPrice) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '32px Arial';
            ctx.fillText(`R$ ${productData.originalPrice}`, 60 + ctx.measureText(`R$ ${finalPrice}`).width + 20, contentY + 280);

            // Linha sobre o preço original
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            const strikeY = contentY + 260;
            ctx.moveTo(60 + ctx.measureText(`R$ ${finalPrice}`).width + 20, strikeY);
            ctx.lineTo(60 + ctx.measureText(`R$ ${finalPrice}`).width + 20 + ctx.measureText(`R$ ${productData.originalPrice}`).width, strikeY);
            ctx.stroke();
        }

        ctx.fillStyle = 'white';
        ctx.font = '28px Arial';
        ctx.fillText('ONLY', 60, contentY + 320);

        // Botão CTA
        const buttonWidth = 200;
        const buttonHeight = 60;
        const buttonX = 60;
        const ctaButtonY = contentY + 360;

        ctx.fillStyle = '#7C2D12';
        ctx.fillRect(buttonX, ctaButtonY, buttonWidth, buttonHeight);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SHOP NOW', buttonX + buttonWidth / 2, ctaButtonY + buttonHeight / 2 + 8);

        // Informações de contato
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(60, contentY + 450, 300, 80);

        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('📞 Call for Order', 80, contentY + 480);
        ctx.font = 'bold 20px Arial';
        ctx.fillText('000 123 456 789', 80, contentY + 510);

        // Lado direito - Imagem do produto
        if (productData.image) {
            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';

                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = productData.image;
                });

                // Fundo branco em nuvem
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.ellipse(leftWidth + rightWidth / 2, contentY + 200, rightWidth / 2 - 40, 80, 0, 0, 2 * Math.PI);
                ctx.fill();

                // Imagem do produto
                const imgSize = Math.min(rightWidth - 80, 300);
                const imgX = leftWidth + (rightWidth - imgSize) / 2;
                const imgY = contentY + 50;

                ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

                // Badge de desconto
                if (discountPercentage > 0) {
                    const badgeX = imgX + imgSize - 60;
                    const badgeY = imgY - 20;

                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.arc(badgeX, badgeY, 50, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.strokeStyle = '#EAB308';
                    ctx.lineWidth = 4;
                    ctx.stroke();

                    ctx.fillStyle = '#7C2D12';
                    ctx.font = 'bold 24px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${discountPercentage}%`, badgeX, badgeY - 5);
                    ctx.fillStyle = '#EAB308';
                    ctx.font = 'bold 16px Arial';
                    ctx.fillText('SAVE', badgeX, badgeY + 15);
                }

            } catch (error) {
                // Placeholder para imagem
                ctx.fillStyle = '#F3F4F6';
                ctx.fillRect(leftWidth + 40, contentY + 50, rightWidth - 80, 300);

                ctx.fillStyle = '#9CA3AF';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('📷', leftWidth + rightWidth / 2, contentY + 220);
            }
        }

        // Seta apontando para o preço
        ctx.fillStyle = '#EAB308';
        ctx.font = '48px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('←', 20, contentY + 280);
    };

    const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number = 2) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        let lineCount = 0;

        for (let n = 0; n < words.length && lineCount < maxLines; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                // Se é a última linha permitida e ainda há palavras, adicionar "..."
                if (lineCount === maxLines - 1 && n < words.length - 1) {
                    line = line.trim() + '...';
                }
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
                lineCount++;
            } else {
                line = testLine;
            }
        }

        // Desenhar a última linha se ainda não excedeu o limite
        if (lineCount < maxLines && line.trim()) {
            ctx.fillText(line, x, currentY);
        }
    };

    const downloadImage = () => {
        if (!canvasRef.current) return;

        const link = document.createElement('a');
        link.download = `${productData?.name.substring(0, 30) || 'produto'}-${selectedFormat}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    const shareToWhatsApp = () => {
        if (!canvasRef.current || !productData) return;

        canvasRef.current.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'produto.png', { type: 'image/png' });

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    navigator.share({
                        files: [file],
                        title: productData.name,
                        text: message
                    });
                } else {
                    // Fallback: download image
                    downloadImage();
                }
            }
        });
    };

    return (
        <div className="glass-effect rounded-2xl p-6 shadow-ml">
            <h2 className="text-2xl font-bold text-ml-gray-dark flex items-center gap-2 mb-4">
                📱 Gerador de Posts (Estilo WhatsApp)
            </h2>

            {!productData ? (
                <div className="text-center py-8 text-gray-500">
                    <p>🔍 Primeiro, extraia os dados de um produto do MercadoLivre</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Format selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Formato da imagem:
                        </label>
                        <select
                            value={selectedFormat}
                            onChange={(e) => setSelectedFormat(e.target.value as any)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-ml-blue"
                        >
                            {Object.entries(formats).map(([key, format]) => (
                                <option key={key} value={key}>
                                    {format.name} ({format.width}x{format.height})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={generateImage}
                            disabled={isGenerating}
                            className="flex-1 bg-ml-blue text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Gerando...
                                </>
                            ) : (
                                <>
                                    🎨 Gerar Imagem
                                </>
                            )}
                        </button>

                        <button
                            onClick={downloadImage}
                            className="bg-ml-yellow text-gray-800 px-4 py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
                        >
                            💾 Download
                        </button>

                        <button
                            onClick={shareToWhatsApp}
                            className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                            📱 Compartilhar
                        </button>
                    </div>

                    {/* Canvas for image generation */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                        <canvas
                            ref={canvasRef}
                            className="max-w-full h-auto border rounded-lg shadow-sm bg-white"
                            style={{ maxHeight: '400px' }}
                        />
                        {!canvasRef.current?.width && (
                            <div className="text-center py-8 text-gray-500">
                                <p>👆 Clique em "Gerar Imagem" para criar o post</p>
                            </div>
                        )}
                    </div>

                    {/* Preview info */}
                    <div className="text-xs text-gray-500 space-y-1">
                        <p><strong>🎯 Layout:</strong> Idêntico ao preview do WhatsApp</p>
                        <p><strong>📱 Inclui:</strong> Card de produto + mensagem + timestamp</p>
                        <p><strong>🎨 Cores:</strong> Formatação automática por tipo de linha</p>
                        <p><strong>📐 Dimensões:</strong> {formats[selectedFormat].width}x{formats[selectedFormat].height}px</p>
                    </div>
                </div>
            )}
        </div>
    );
};