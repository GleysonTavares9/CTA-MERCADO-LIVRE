import React, { useState, useEffect } from 'react';
import { GenerationSettings } from '../../types';
import { ProductInfo } from '../preview/ProductInfo';
import { AutoSettings } from './AutoSettings';
import { StatusMessage } from '../ui/StatusMessage';
import { DebugInfo } from '../debug/DebugInfo';
import { useProductGenerator } from '../../hooks/useProductGenerator';

interface Props {
  onProductGenerated: (message: string, productData: any, isLoading: boolean, loadingText: string) => void;
}

export const InputSection: React.FC<Props> = ({ onProductGenerated }) => {
  const [link, setLink] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    targetAudience: 'auto',
    ctaStyle: 'auto',
    aiProvider: 'gemini',
    aiModel: 'gemini-1.5-flash-latest'
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
        return (
          <span
            className="loading-spinner w-4 h-4 inline-block align-middle"
            aria-label="Processando"
            role="status"
          />
        );
      case 'success':
        return (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 align-middle"
            aria-label="Válido"
          />
        );
      case 'error':
        return (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 align-middle"
            aria-label="Inválido"
          />
        );
      default:
        return (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300 align-middle"
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="productLink" className="block text-sm font-medium text-gray-700">
            Link do produto do Mercado Livre
          </label>
          <span className={`text-xs font-medium ${
            linkStatus === 'processing' ? 'text-yellow-600' : 
            linkStatus === 'success' ? 'text-green-600' : 
            linkStatus === 'error' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {linkStatus === 'processing' ? 'Processando...' : 
             linkStatus === 'success' ? '✓ Link válido' : 
             linkStatus === 'error' ? '✗ Link inválido' : ''}
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
            placeholder="Cole o link do produto ou de afiliado"
            aria-label="Link do produto do Mercado Livre"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <button
              onClick={handlePasteFromClipboard}
              className="bg-indigo-100 text-indigo-700 p-2 rounded-lg text-sm hover:bg-indigo-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              title="Colar da área de transferência"
              type="button"
            >
              Colar
            </button>
            <button
              onClick={() => {
                // Testar com link direto do produto
                setLink('https://www.mercadolivre.com.br/smartphone-samsung-galaxy-a15-128gb-4gb-ram-tela-67-camera-50mp-azul/p/MLB4216225440');
              }}
              className="bg-green-100 text-green-700 p-2 rounded-lg text-sm hover:bg-green-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
              title="Testar com link direto do produto"
              type="button"
            >
              Exemplo
            </button>
            {link && (
              <button
                onClick={() => {
                  setLink('');
                  window.location.reload();
                }}
                className="bg-red-100 text-red-700 p-2 rounded-lg text-sm hover:bg-red-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                title="Limpar tudo e recarregar"
                type="button"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      <AutoSettings settings={settings} onChange={setSettings} />
      
      {/* Mensagem de ajuda */}
      {!productData && !isLoading && (
        <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3 mb-4">
          <h3 className="text-xs font-medium text-blue-800 mb-1">Como usar</h3>
          <ul className="text-xs text-blue-700 space-y-0.5">
            <li>• <strong>Links diretos:</strong> <code className="bg-blue-100/80 px-1 rounded">/p/MLB123</code> ou <code className="bg-blue-100/80 px-1 rounded">MLB-123456789</code></li>
            <li>• <strong>Links de afiliados:</strong> <code className="bg-blue-100/80 px-1 rounded">/sec/</code>, <code className="bg-blue-100/80 px-1 rounded">/aff/</code>, <code className="bg-blue-100/80 px-1 rounded">?ref=</code></li>
            <li>• <strong>Links encurtados:</strong> <code className="bg-blue-100/80 px-1 rounded">/s/</code>, <code className="bg-blue-100/80 px-1 rounded">/share/</code> (resolução automática)</li>
          </ul>
        </div>
      )}
      
      <ProductInfo productData={productData} isVisible={!!productData} />
      
      {productData && (
        <div className="mt-4">
          <DebugInfo productData={productData} isVisible={!!productData} />
        </div>
      )}
      
      {statusMessage && (
        <div className="mt-4">
          <StatusMessage status={statusMessage} />
        </div>
      )}
    </div>
  );
};