import React, { useState, useEffect } from 'react';
import { GenerationSettings } from '../types';
import { ProductInfo } from './ProductInfo';
import { AutoSettings } from './AutoSettings';
import { StatusMessage } from './StatusMessage';
import { DebugInfo } from './DebugInfo';
import { useProductGenerator } from '../hooks/useProductGenerator';

interface Props {
  onProductGenerated: (message: string, productData: any, isLoading: boolean, loadingText: string) => void;
}

export const InputSection: React.FC<Props> = ({ onProductGenerated }) => {
  const [link, setLink] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    targetAudience: 'auto',
    ctaStyle: 'auto'
  });

  const {
    productData,
    generatedMessage,
    isLoading,
    loadingText,
    statusMessage,
    linkStatus,
    processProductLink
  } = useProductGenerator();

  useEffect(() => {
    onProductGenerated(generatedMessage, productData, isLoading, loadingText);
  }, [generatedMessage, productData, isLoading, loadingText, onProductGenerated]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (link.trim()) {
        processProductLink(link, settings);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [link, settings, processProductLink]);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLink(text);
    } catch (err) {
      console.log('Erro ao colar:', err);
      alert('Cole o link manualmente no campo acima');
    }
  };

  const getLinkInputStyles = () => {
    const baseStyles = "w-full p-5 border-3 rounded-xl text-base transition-all duration-300 pr-16 focus:outline-none focus:ring-4 focus:ring-indigo-200";
    
    switch (linkStatus) {
      case 'processing':
        return `${baseStyles} border-yellow-400 bg-yellow-50`;
      case 'success':
        return `${baseStyles} border-green-500 bg-green-50`;
      case 'error':
        return `${baseStyles} border-red-500 bg-red-50`;
      default:
        return `${baseStyles} border-gray-200 hover:border-indigo-300 focus:border-indigo-500 bg-white`;
    }
  };
  
  const getStatusIcon = () => {
    switch (linkStatus) {
      case 'processing':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '🔍';
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-ml">
      <h2 className="text-2xl font-bold text-ml-gray-dark mb-6 flex items-center gap-2">
        🔗 Link do Produto
      </h2>
      
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="productLink" className="text-sm font-medium text-gray-700">
            Link do produto do Mercado Livre
          </label>
          <span className="text-xs text-gray-500">
            {linkStatus === 'processing' ? 'Processando...' : 
             linkStatus === 'success' ? 'Link válido!' : 
             linkStatus === 'error' ? 'Link inválido' : ''}
          </span>
        </div>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {getStatusIcon()}
          </div>
          <input
            id="productLink"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={`${getLinkInputStyles()} pl-10`}
            placeholder="https://mercadolivre.com.br/produto-xyz/p/..."
            aria-label="Link do produto do Mercado Livre"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              onClick={handlePasteFromClipboard}
              className="bg-indigo-100 text-indigo-700 p-2 rounded-lg text-sm hover:bg-indigo-200 transition-colors"
              title="Colar da área de transferência"
              type="button"
            >
              📋
            </button>
            <button
              onClick={() => {
                // Testar com link direto do produto
                setLink('https://www.mercadolivre.com.br/smartphone-samsung-galaxy-a15-128gb-4gb-ram-tela-67-camera-50mp-azul/p/MLB4216225440');
              }}
              className="bg-green-100 text-green-700 p-2 rounded-lg text-sm hover:bg-green-200 transition-colors"
              title="Testar com link direto do produto"
              type="button"
            >
              🧪
            </button>
            {link && (
              <button
                onClick={() => {
                  setLink('');
                  window.location.reload();
                }}
                className="bg-red-100 text-red-700 p-2 rounded-lg text-sm hover:bg-red-200 transition-colors"
                title="Limpar tudo e recarregar"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <AutoSettings settings={settings} onChange={setSettings} />
      
      {/* Mensagem de ajuda */}
      {!productData && !isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 Como usar:</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Cole o link direto do produto (que contém <code className="bg-blue-100 px-1 rounded">/p/</code> ou <code className="bg-blue-100 px-1 rounded">MLB</code>)</li>
            <li>• Evite links encurtados (como <code className="bg-blue-100 px-1 rounded">/sec/</code> ou <code className="bg-blue-100 px-1 rounded">/s/</code>)</li>
            <li>• Clique em 🧪 para testar com um exemplo</li>
          </ul>
        </div>
      )}
      
      <ProductInfo productData={productData} isVisible={!!productData} />
      
      <DebugInfo productData={productData} isVisible={!!productData} />
      
      <StatusMessage status={statusMessage} />
    </div>
  );
};