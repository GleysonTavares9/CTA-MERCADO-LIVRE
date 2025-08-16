import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface Props {
  generatedMessage: string;
  isLoading: boolean;
  loadingText: string;
  className?: string;
}

export const OutputSection: React.FC<Props> = ({ 
  generatedMessage, 
  isLoading, 
  loadingText,
  className = ''
}) => {
  const [copyButtonText, setCopyButtonText] = useState('Copiar Mensagem');
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const defaultMessage = [
    '📱 Cole um link do Mercado Livre para começar',
    '✨ Geração automática de mensagens',
    '⚡ Rápido e fácil de usar',
    '🚀 Aumente suas vendas com CTAs eficazes',
    '💡 Dica: Use o botão "Usar Exemplo" para testar'
  ].join('\n');

  // Reset placeholder visibility when message changes
  useEffect(() => {
    if (generatedMessage && generatedMessage !== defaultMessage) {
      setShowPlaceholder(false);
    } else if (!generatedMessage) {
      setShowPlaceholder(true);
    }
  }, [generatedMessage, defaultMessage]);

  const handleCopy = async () => {
    if (!generatedMessage) return;
    
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopyButtonText('Copiado!');
      setTimeout(() => {
        setCopyButtonText('Copiar Mensagem');
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      setCopyButtonText('Erro ao copiar');
      setTimeout(() => {
        setCopyButtonText('Copiar Mensagem');
      }, 2000);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!generatedMessage) return;
    
    try {
      // Extrair a mensagem principal e o link
      const messageParts = generatedMessage.split('\n\nhttps://');
      let mainMessage = messageParts[0];
      const productLink = messageParts[1] ? `https://${messageParts[1].split('\n')[0]}` : '';
      
      // Limpar e formatar a mensagem para o WhatsApp
      mainMessage = mainMessage
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^\s*\n/gm, '')
        .replace(/[✅🔗💰⭐🔥🛡️]\s*/g, '')
        .replace(/\s*\s*/g, '')
        .trim();
      
      // Formatar a mensagem
      let whatsappMessage = '';
      const messageLines = mainMessage.split('\n').filter(line => line.trim());
      
      if (messageLines.length > 0) {
        // Título
        whatsappMessage += `*${messageLines[0].toUpperCase()}*\n\n`;
        
        // Conteúdo formatado
        for (let i = 1; i < messageLines.length; i++) {
          const line = messageLines[i].trim();
          if (!line) continue;
          
          if (i === 1) whatsappMessage += `🔥 ${line}\n`;
          else if (line.includes('/5 estrelas') || line.includes('clientes')) whatsappMessage += `⭐ ${line}\n`;
          else if (line.includes('R$')) whatsappMessage += `💰 *${line}*\n`;
          else if (line.match(/[0-9]+%/) || line.includes('OFF') || line.toLowerCase().includes('desconto')) whatsappMessage += `🔥 ${line}\n`;
          else if (line.toLowerCase().match(/frete|entrega|segur|garant/i)) whatsappMessage += `🛡️ ${line}\n`;
          else if (line.match(/clique|aproveite|compre|agora|já|não perca/i)) whatsappMessage += `🚀 ${line.toUpperCase()}\n`;
          else whatsappMessage += `✅ ${line}\n`;
        }
        
        // CTA final
        whatsappMessage += '\n⏰ *APROVEITE AGORA MESMO!*\n';
      }
      
      // Adicionar link do produto
      if (productLink) {
        whatsappMessage += `\n🔗 *Compre agora:* ${productLink}`;
      }
      
      // Abrir WhatsApp
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
      
      const newWindow = window.open(whatsappUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error('Erro ao abrir o WhatsApp:', error);
      const encodedMessage = encodeURIComponent(generatedMessage);
      window.open(`https://api.whatsapp.com/send?text=${encodedMessage}`, '_blank');
    }
  };

  const hasValidMessage = generatedMessage && generatedMessage !== defaultMessage;

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Mensagem Gerada
        </h3>
        {hasValidMessage && !isLoading && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              title="Copiar mensagem"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copyButtonText}
            </button>
          </div>
        )}
      </div>

      <div className={`relative min-h-[200px] rounded-lg border border-gray-100 bg-white p-4 overflow-auto transition-all duration-200 ${isLoading ? 'opacity-50' : ''}`}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <LoadingSpinner isVisible={true} text={loadingText} />
          </div>
        ) : null}
        
        <div className={`whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 ${showPlaceholder ? 'text-gray-400' : ''}`}>
          {generatedMessage || defaultMessage}
        </div>
      </div>

      {hasValidMessage && !isLoading && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleOpenWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm font-medium py-2 px-4 rounded-lg border border-green-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.963-.94 1.16-.174.199-.347.223-.644.075-.297-.15-1.264-.465-2.04-1.485-.713-.912-.994-1.987-1.105-2.32-.113-.334.008-.514.087-.653.087-.133.197-.35.296-.523.1-.172.13-.296.198-.494.068-.2.03-.371-.016-.52-.046-.15-.446-1.075-.612-1.473-.16-.388-.324-.336-.446-.34-.114-.004-.248-.006-.38-.006a.73.73 0 00-.52.248c-.182.186-.7.68-.7 1.655 0 .975 1.007 1.92 1.058 2.012.05.093.08 1.11 2.47 3.461 1.84 1.83 3.7 2.4 4.4 2.66.7.26 1.13.2 1.49.12.38-.08 1.64-.67 1.86-1.31.23-.64.23-1.19.16-1.3-.07-.11-.24-.17-.54-.28m-5.92 4.87h-.01z" />
              <path d="M18.26 5.09a7.98 7.98 0 00-11.3-.6l-.26.21-1.06-.5a1 1 0 00-1.1.2l-.99.97a1 1 0 00-.22 1.08l.4 1.23a7.99 7.99 0 00.6 8.9 8.5 8.5 0 005 2.56l1.18.1a1 1 0 00.99-.84l.3-1.6a1 1 0 01.46-.61l1.3-.78c.11-.07.23-.1.35-.1.21-.01.43.05.62.17l1.01.67a1 1 0 001.09.04l1.21-.81a1 1 0 01.94-.14l2.78 1.1a1 1 0 001.37-1.1l-.6-2.8a1 1 0 01.28-.88l.9-.9a1 1 0 00.2-1.18l-1.1-2.1a1 1 0 00-.72-.54l-2.8-.7a.99.99 0 01-.7-.52l-1.25-2.5a1 1 0 00-.9-.57z" />
            </svg>
            Enviar para WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};