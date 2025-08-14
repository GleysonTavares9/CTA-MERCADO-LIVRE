import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface Props {
  generatedMessage: string;
  isLoading: boolean;
  loadingText: string;
}

export const OutputSection: React.FC<Props> = ({ 
  generatedMessage, 
  isLoading, 
  loadingText 
}) => {
  const [copyButtonText, setCopyButtonText] = useState('📋 Copiar Mensagem');

  const defaultMessage = `Cole um link do Mercado Livre para gerar automaticamente:

📱 Extração de dados do produto
🖼️ Captura da melhor imagem
🤖 Geração inteligente de CTA
📝 Mensagem otimizada para conversão

Tudo em segundos, de forma totalmente automática!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopyButtonText('✅ Copiado!');
      setTimeout(() => {
        setCopyButtonText('📋 Copiar Mensagem');
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleOpenWhatsApp = () => {
    try {
      // Extrair a mensagem principal e o link
      const messageParts = generatedMessage.split('\n\nhttps://');
      let mainMessage = messageParts[0];
      const productLink = messageParts[1] ? `https://${messageParts[1].split('\n')[0]}` : '';
      
      // Limpar a mensagem principal e remover emojis duplicados
      mainMessage = mainMessage
        .replace(/\n{3,}/g, '\n\n') // Múltiplas quebras de linha para apenas duas
        .replace(/^\s*\n/gm, '') // Linhas em branco no início
        .replace(/[✅🔗💰⭐🔥🛡️]\s*/g, '') // Remove todos os emojis existentes
        .replace(/\s*�\s*/g, '') // Remove caracteres inválidos
        .trim();
      
      // Criar mensagem formatada para WhatsApp
      let whatsappMessage = '';
      
      // Adicionar título e descrição formatados
      const messageLines = mainMessage.split('\n').filter(line => line.trim());
      if (messageLines.length > 0) {
        // Título em negrito e em caixa alta
        whatsappMessage += `*${messageLines[0].toUpperCase()}*\n\n`;
        
        // Processar as linhas restantes
        for (let i = 1; i < messageLines.length; i++) {
          const line = messageLines[i].trim();
          if (!line) continue;
          
          // Formatar título do produto
          if (i === 1) {
            whatsappMessage += `🔥 ${line}\n`;
          }
          // Formatar avaliações e classificação
          else if (line.includes('/5 estrelas') || line.includes('clientes')) {
            whatsappMessage += `⭐ ${line}\n`;
          } 
          // Formatar preço
          else if (line.includes('R$')) {
            whatsappMessage += `💰 *${line}*\n`;
          }
          // Formatar benefícios com destaque
          else if (line.match(/[0-9]+%/) || line.includes('OFF') || line.toLowerCase().includes('desconto')) {
            whatsappMessage += `🔥 ${line}\n`;
          }
          // Formatar garantias
          else if (line.toLowerCase().includes('frete') || 
                  line.toLowerCase().includes('entrega') || 
                  line.toLowerCase().includes('segur') ||
                  line.toLowerCase().includes('garant')) {
            whatsappMessage += `🛡️ ${line}\n`;
          }
          // Formatar CTA e benefícios gerais
          else if (line.match(/clique|aproveite|compre|agora|já|não perca/i)) {
            whatsappMessage += `🚀 ${line.toUpperCase()}\n`;
          }
          // Formatar benefícios gerais
          else {
            whatsappMessage += `✅ ${line}\n`;
          }
        }
        
        // Adicionar CTA final
        whatsappMessage += '\n⏰ *APROVEITE AGORA MESMO!*\n';
      }
      
      // Adicionar link do produto (importante vir antes para o WhatsApp buscar a imagem)
      if (productLink) {
        whatsappMessage += `\n🔗 *Compre agora:* ${productLink}`;
      }
      
      // Codificar a mensagem para URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      // Criar URL do WhatsApp com a mensagem formatada
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
      
      // Abrir o WhatsApp Web em uma nova aba
      const newWindow = window.open(whatsappUrl, '_blank');
      
      // Se a janela não abrir (pode ser bloqueada por popup), tentar redirecionar
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error('Erro ao abrir o WhatsApp:', error);
      // Fallback: abrir apenas com a mensagem original
      const encodedMessage = encodeURIComponent(generatedMessage);
      window.open(`https://api.whatsapp.com/send?text=${encodedMessage}`, '_blank');
    }
  };

  const hasValidMessage = generatedMessage && generatedMessage !== defaultMessage;

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-ml">
      <h2 className="text-2xl font-bold text-ml-gray-dark mb-6 flex items-center gap-2">
        💬 Mensagem Gerada
      </h2>

      <LoadingSpinner isVisible={isLoading} text={loadingText} />

      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 mb-4 min-h-[300px] whitespace-pre-wrap font-sans leading-relaxed">
        {generatedMessage || defaultMessage}
      </div>

      {hasValidMessage && !isLoading && (
        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full bg-ml-blue text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-600 transition-all duration-200 transform hover:-translate-y-0.5 shadow-ml hover:shadow-ml-hover"
          >
            {copyButtonText}
          </button>
          
          <button
            onClick={handleOpenWhatsApp}
            className="w-full bg-ml-yellow text-gray-800 font-semibold py-4 px-6 rounded-xl hover:bg-yellow-500 transition-all duration-200 transform hover:-translate-y-0.5 shadow-ml hover:shadow-ml-hover"
          >
            📱 Enviar para WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};