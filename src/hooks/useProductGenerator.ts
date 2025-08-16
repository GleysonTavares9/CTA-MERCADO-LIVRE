import { useState, useCallback } from 'react';
import { ProductData, GenerationSettings, StatusMessage } from '../types';
import { MercadoLivreParser } from '../utils/mercadoLivreParser';
import { GeminiAI } from '../utils/geminiAI';

export const useProductGenerator = () => {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    type: 'info',
    message: '💡 Cole o link do produto e aguarde a mágica acontecer!'
  });
  const [linkStatus, setLinkStatus] = useState<'default' | 'processing' | 'success' | 'error'>('default');

  const resetState = useCallback(() => {
    setProductData(null);
    setGeneratedMessage('');
    setIsLoading(false);
    setLoadingText('');
    setLinkStatus('default');
    setStatusMessage({
      type: 'info',
      message: '💡 Cole o link do produto e aguarde a mágica acontecer!'
    });
  }, []);

  const addUTMParameters = useCallback((originalLink: string, productData: ProductData, audience: string, style: string): string => {
    try {
      const url = new URL(originalLink);
      
      // Parâmetros UTM para rastreamento
      const utmParams = {
        utm_source: 'whatsapp',
        utm_medium: 'cta_generator',
        utm_campaign: 'affiliate_cta',
        utm_content: `${audience}_${style}`,
        utm_term: productData.category,
        // Parâmetros personalizados
        cta_version: '2.0',
        generated_by: 'ai',
        product_category: productData.category,
        timestamp: Date.now().toString()
      };
      
      // Adicionar parâmetros UTM
      Object.entries(utmParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
      
      console.log('🔗 Link com UTM gerado:', url.toString());
      return url.toString();
      
    } catch (error) {
      console.error('❌ Erro ao adicionar UTM:', error);
      return originalLink; // Retorna link original se houver erro
    }
  }, []);

  const processProductLink = useCallback(async (link: string, settings: GenerationSettings) => {
    if (!link.trim()) {
      resetState();
      return;
    }

    if (!MercadoLivreParser.isValidMercadoLivreLink(link)) {
      setStatusMessage({
        type: 'error',
        message: '❌ Link inválido! Use links do MercadoLivre (diretos ou de afiliados)'
      });
      setLinkStatus('error');
      return;
    }

    try {
      // Sempre limpar dados anteriores primeiro
      console.log('🧹 Limpando dados anteriores...');
      setProductData(null);
      setGeneratedMessage('');
      
      setLinkStatus('processing');
      setIsLoading(true);
      setLoadingText('Analisando produto no Mercado Livre...');
      setStatusMessage({
        type: 'info',
        message: '🔍 Extraindo dados do produto...'
      });

      // Step 1: Extract product data
      console.log('🔍 Iniciando extração para novo link:', link);
      const extractedData = await MercadoLivreParser.extractProductData(link);
      const dataWithLink = { ...extractedData, affiliateLink: link };
      
      console.log('✅ Dados extraídos, atualizando estado:', dataWithLink.name);
      setProductData(dataWithLink);
      setLinkStatus('success');

      setLoadingText('Detectando melhor estratégia...');

      // Step 2: Detect optimal settings
      const detectedAudience = settings.targetAudience === 'auto' ? 
        MercadoLivreParser.detectAudience(extractedData) : settings.targetAudience;
      
      const detectedStyle = settings.ctaStyle === 'auto' ? 
        MercadoLivreParser.detectBestCTAStyle(extractedData) : settings.ctaStyle;

      setLoadingText('Gerando mensagem personalizada...');

      // Step 3: Generate CTA message (respect selected AI provider/model)
      const message = await GeminiAI.generateCTA(
        extractedData,
        detectedAudience,
        detectedStyle,
        settings.aiProvider || 'gemini',
        settings.aiModel
      );
      
      // Step 4: Add UTM parameters to the link
      const utmLink = addUTMParameters(link, extractedData, detectedAudience, detectedStyle);
      const finalMessage = message + '\n\n' + utmLink;
      setGeneratedMessage(finalMessage);

      setIsLoading(false);
      setStatusMessage({
        type: 'success',
        message: '✅ Mensagem gerada com sucesso!'
      });

    } catch (error) {
      console.error('Erro ao processar produto:', error);
      setLinkStatus('error');
      setIsLoading(false);
      setStatusMessage({
        type: 'error',
        message: '❌ Erro ao processar produto. Verifique o link e tente novamente.'
      });
    }
  }, [resetState, addUTMParameters]);

  return {
    productData,
    generatedMessage,
    isLoading,
    loadingText,
    statusMessage,
    linkStatus,
    processProductLink,
    resetState
  };
};