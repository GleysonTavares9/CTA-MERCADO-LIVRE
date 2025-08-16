import { ProductData } from '../types';
import { API_CONFIG } from '../config/constants';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export class GeminiAI {
  private static async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 5, // Aumentado para 5 tentativas
    initialDelay = 10000 // Aumentado para 10 segundos para evitar limite de taxa
  ): Promise<Response> {
    let lastError: Error | undefined;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        // Sucesso ou erro do cliente que não deve ser repetido (exceto 429)
        if (response.ok || (response.status >= 400 && response.status !== 429 && response.status < 500)) {
          return response;
        }
        lastError = new Error(`Request failed with status ${response.status}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown fetch error');
      }

      if (i < retries - 1) {
        // Backoff exponencial com jitter
        const backoff = initialDelay * Math.pow(2, i);
        const jitter = backoff * 0.2 * Math.random(); // Adiciona até 20% de jitter
        const delay = backoff + jitter;
        console.log(`[fetchWithRetry] Attempt ${i + 1} failed. Retrying in ~${Math.round(delay / 1000)}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  private static async callGeminiAPI(prompt: string, model?: string): Promise<string> {
    console.log('🤖 Verificando configuração do Gemini...');
    console.log('🔑 API Key presente:', !!GEMINI_API_KEY);
    console.log('🔑 API Key (primeiros 10 chars):', GEMINI_API_KEY.substring(0, 10) + '...');

    if (!GEMINI_API_KEY) {
      console.warn('❌ Chave da API do Gemini não encontrada. Usando template local.');
      throw new Error('API key not configured');
    }

    try {
      console.log('📡 Fazendo requisição para o Gemini...');
      const selectedModel = model || API_CONFIG.gemini.defaultModel;
      const endpoint = `${API_CONFIG.gemini.baseUrl}/${selectedModel}:generateContent`;
      const response = await this.fetchWithRetry(`${endpoint}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      console.log('📊 Status da resposta Gemini:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erro na API do Gemini:', errorData);
        throw new Error(`Falha na API do Gemini: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 Resposta do Gemini recebida:', !!data.candidates);

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const generatedText = data.candidates[0].content.parts[0].text;
        console.log('✅ Texto gerado pela IA (primeiros 100 chars):', generatedText.substring(0, 100) + '...');
        return generatedText;
      } else {
        console.error('❌ Estrutura de resposta inesperada:', data);
        throw new Error('Resposta inválida do Gemini');
      }
    } catch (error) {
      console.error('❌ Erro ao chamar API do Gemini:', error);
      throw error;
    }
  }

  static async generateCTA(
    productData: ProductData,
    audience: string,
    style: string,
    aiProvider: 'gemini' | 'local' = 'gemini',
    aiModel?: string
  ): Promise<string> {
    const prompt = this.createPrompt(productData, audience, style);

    try {
      if (aiProvider === 'local') {
        // retorna imediatamente template local sem chamar API
        return this.generateLocalTemplate(productData, audience, style);
      }
      return await this.callGeminiAPI(prompt, aiModel);
    } catch (error) {
      console.warn('Usando template local devido ao erro na API:', error);
      return this.generateLocalTemplate(productData, audience, style);
    }
  }

  private static createPrompt(productData: ProductData, audience: string, style: string): string {
    const discount = productData.discountPrice ? productData.originalPrice - productData.discountPrice : 0;
    const discountPercent = productData.discountPrice
      ? Math.round((discount / productData.originalPrice) * 100)
      : 0;

    return `Você é um especialista em marketing digital e afiliados do MercadoLivre. Crie uma mensagem de CTA (Call to Action) IRRESISTÍVEL para WhatsApp que converta visitantes em compradores.

DADOS DO PRODUTO:
📦 Nome: ${productData.name}
💰 Preço Original: R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}
${productData.discountPrice ? `🔥 Preço Promocional: R$ ${productData.discountPrice.toFixed(2).replace('.', ',')}` : ''}
${discountPercent > 0 ? `💸 Desconto: ${discountPercent}% OFF (Economia de R$ ${discount.toFixed(2).replace('.', ',')})` : ''}
${productData.rating ? `⭐ Avaliação: ${productData.rating}/5 estrelas` : ''}
${productData.reviews ? `👥 Reviews: ${productData.reviews} avaliações` : ''}
${productData.description ? `📝 Descrição: ${productData.description}` : ''}
🎯 Categoria: ${productData.category}

CONFIGURAÇÕES:
👤 Público-alvo: ${this.translateAudience(audience)}
🎨 Estilo: ${this.translateStyle(style)}

INSTRUÇÕES OBRIGATÓRIAS:
1. ✅ Use formatação WhatsApp com *negrito* e ~riscado~
2. ✅ Crie um TÍTULO IMPACTANTE com emojis
3. ✅ Use URGÊNCIA e ESCASSEZ para criar desejo
4. ✅ Destaque PREÇOS com formatação especial
5. ✅ Liste 3-4 BENEFÍCIOS PRINCIPAIS
6. ✅ Inclua PROVA SOCIAL (avaliações, vendas)
7. ✅ Use GATILHOS MENTAIS (exclusividade, tempo limitado)
8. ✅ Termine com CTA FORTE e DIRETO
9. ✅ NÃO inclua o link na mensagem
10. ✅ Máximo 15 linhas

FORMATAÇÃO WHATSAPP:
- Use *texto* para negrito
- Use ~texto~ para riscado (preços antigos)
- Use quebras de linha para legibilidade
- Emojis estratégicos para destacar

ESTRUTURA OBRIGATÓRIA:
🔥 *TÍTULO IMPACTANTE COM URGÊNCIA*

📦 *Nome do Produto*

💰 ~DE R$ XX,XX~
🔥 *POR APENAS R$ XX,XX*
💸 *ECONOMIA DE R$ XX,XX!*

✅ Benefício 1
✅ Benefício 2
✅ Benefício 3

⭐ *Avaliação/Prova Social*
⏰ *URGÊNCIA/ESCASSEZ*
🚚 *FRETE/GARANTIA*

👆 *CTA FINAL IRRESISTÍVEL*

IMPORTANTE: Seja PERSUASIVO mas AUTÊNTICO. Use linguagem que converte!`;
  }

  private static translateAudience(audience: string): string {
    const translations: Record<string, string> = {
      'tecnologia': 'público interessado em tecnologia',
      'jovens': 'público jovem',
      'adultos': 'público adulto',
      'familia': 'famílias',
      'default': 'geral'
    };
    return translations[audience] || 'geral';
  }

  private static translateStyle(style: string): string {
    const translations: Record<string, string> = {
      'urgencia': 'criar urgência',
      'social': 'prova social',
      'beneficios': 'destaque de benefícios',
      'emocional': 'apelo emocional',
      'default': 'persuasivo'
    };
    return translations[style] || 'persuasivo';
  }

  private static generateLocalTemplate(productData: ProductData, audience: string, style: string): string {
    const discount = productData.discountPrice ? productData.originalPrice - productData.discountPrice : 0;
    const discountPercent = productData.discountPrice
      ? Math.round((discount / productData.originalPrice) * 100)
      : 0;

    console.log('💰 Debug template:', {
      originalPrice: productData.originalPrice,
      discountPrice: productData.discountPrice,
      discount: discount,
      discountPercent: discountPercent
    });

    const templates: Record<string, string> = {
      'casa_urgencia': `🚨 *OFERTA RELÂMPAGO!* ${discountPercent > 0 ? `*${discountPercent}% OFF*` : '*PREÇO ESPECIAL*'}

📦 *${productData.name}*

${discountPercent > 0 ? `💰 ~DE R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}~
🔥 *POR APENAS R$ ${productData.discountPrice!.toFixed(2).replace('.', ',')}*
💸 *VOCÊ ECONOMIZA R$ ${discount.toFixed(2).replace('.', ',')}!*` : `💰 *APENAS R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}*`}

✅ Motor potente e durável
✅ Fácil de usar e limpar  
✅ Garantia oficial do fabricante
${productData.rating ? `⭐ *${productData.rating.toFixed(1)}/5 estrelas* (${productData.reviews}+ avaliações)` : '⭐ Produto bem avaliado'}

⏰ *ÚLTIMAS UNIDADES DISPONÍVEIS!*
🚚 *FRETE GRÁTIS* para todo Brasil
🔒 Compra *100% SEGURA*

👆 *CLIQUE E GARANTA O SEU!*`,

      'tecnologia_urgencia': `🚨 *ALERTA DE OFERTA!* ${discountPercent > 0 ? `*${discountPercent}% OFF*` : '*PREÇO ESPECIAL*'}

📱 *${productData.name}*

${discountPercent > 0 ? `💰 ~DE R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}~
🔥 *POR R$ ${productData.discountPrice!.toFixed(2).replace('.', ',')}*
💸 *ECONOMIA DE R$ ${discount.toFixed(2).replace('.', ',')}!*` : `💰 *R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}*`}

✅ Produto original e lacrado
✅ Garantia oficial do fabricante
✅ Entrega rápida e segura
${productData.rating ? `⭐ *${productData.rating.toFixed(1)}/5 estrelas* (${productData.reviews}+ avaliações)` : '✅ Milhares de clientes satisfeitos'}

⏰ *ÚLTIMAS UNIDADES DISPONÍVEIS!*
🚚 *FRETE GRÁTIS* para todo Brasil

👆 *CLIQUE AGORA E GARANTA O SEU!*`,

      'jovens_social': `🏆 *MAIS VENDIDO!* ${discountPercent > 0 ? `🔥 *${discountPercent}% OFF*` : ''}

🛍️ *${productData.name}*

${productData.rating ? `⭐ *NOTA ${productData.rating.toFixed(1)}/5*` : '⭐ *SUPER BEM AVALIADO!*'}
${productData.reviews ? `💬 *${productData.reviews}+ pessoas já compraram!*` : '💬 *Milhares de vendas!*'}

${discountPercent > 0 ? `💰 ~De R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}~ por *R$ ${productData.discountPrice!.toFixed(2).replace('.', ',')}*
💸 *DESCONTO DE R$ ${discount.toFixed(2).replace('.', ',')}*` : `💰 *R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}*`}

✅ Entrega super rápida
✅ Produto 100% original  
✅ Troca grátis em 30 dias
✅ Pagamento seguro

🔥 *Todo mundo tá comprando!*

👇 *CLICA AÍ E GARANTA O SEU!*`,

      'familia_beneficios': `👨‍👩‍👧‍👦 *PERFEITO PARA SUA FAMÍLIA!* ${discountPercent > 0 ? `🎁 *${discountPercent}% OFF*` : ''}

🏠 *${productData.name}*

💡 *Por que milhares de famílias escolheram:*
✅ Qualidade premium comprovada
✅ ${productData.reviews ? `*${productData.reviews}+ famílias aprovaram*` : '*Aprovado por milhares de famílias*'}
✅ ${productData.rating ? `*${productData.rating.toFixed(1)} estrelas* de avaliação` : '*Excelente avaliação*'}
✅ Garantia oficial + Suporte

${discountPercent > 0 ? `💰 ~De R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}~ por *R$ ${productData.discountPrice!.toFixed(2).replace('.', ',')}*
🎁 *Economia de R$ ${discount.toFixed(2).replace('.', ',')} para sua família!*` : `💰 *Investimento: R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}*`}

🚚 *FRETE GRÁTIS* + Entrega rápida
🔒 Compra *100% PROTEGIDA*

👆 *GARANTA JÁ O SEU!*`,

      'default': `🎯 *OPORTUNIDADE IMPERDÍVEL!* ${discountPercent > 0 ? `🔥 *${discountPercent}% OFF*` : ''}

📦 *${productData.name}*

${productData.rating ? `⭐ *${productData.rating.toFixed(1)}/5 estrelas*` : '⭐ *Excelente avaliação*'}
${productData.reviews ? `📊 *${productData.reviews}+ clientes satisfeitos*` : '📊 *Milhares de vendas*'}

${discountPercent > 0 ? `💰 ~De R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}~ por *R$ ${productData.discountPrice!.toFixed(2).replace('.', ',')}*
💸 *Desconto de R$ ${discount.toFixed(2).replace('.', ',')}!*` : `💰 *R$ ${productData.originalPrice.toFixed(2).replace('.', ',')}*`}

✅ Produto original e garantido
✅ Frete grátis para todo Brasil  
✅ Compra 100% segura
✅ Entrega rápida

👆 *CLIQUE E APROVEITE AGORA!*`
    };

    const categoryKey = `${productData.category}_${style}`;
    const audienceKey = `${audience}_${style}`;

    const selectedTemplate = templates[categoryKey] || templates[audienceKey] || templates.default;

    console.log('📝 Template selecionado:', categoryKey, '||', audienceKey, '|| default');

    return selectedTemplate;
  }
}