import { ProductData } from '../types';

export class MercadoLivreParser {
  private static readonly CORS_PROXIES = [
    'https://api.allorigins.win/get?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://corsproxy.io/?'
  ];
  private static readonly ML_API_BASE = 'https://api.mercadolibre.com';

  static async extractProductData(url: string): Promise<ProductData> {
    const timestamp = Date.now();
    console.log(`🔍 [${timestamp}] Iniciando extração de dados para:`, url);

    try {
      if (!this.isValidMercadoLivreLink(url)) {
        throw new Error('URL do MercadoLivre inválida');
      }

      // 1. Primeiro, tentar resolver o link de afiliado
      console.log(`📍 [${timestamp}] Resolvendo link de afiliado...`);
      const resolvedUrl = await this.resolveAffiliateLink(url);
      console.log(`✅ [${timestamp}] URL resolvida:`, resolvedUrl);

      // 2. Extrair ID do produto
      const productId = this.extractProductId(resolvedUrl);
      console.log(`🆔 [${timestamp}] ID do produto extraído:`, productId);

      if (!productId) {
        // Como último recurso, tentar buscar por termo baseado no código do link
        if (url.includes('/sec/') || url.includes('/s/') || url.includes('/share/')) {
          const shortCode = url.split('/').pop();
          if (shortCode && shortCode.length > 3) {
            console.log('🔄 Tentando busca por termo como último recurso...');
            const searchResult = await this.searchProductByTerm(shortCode);
            if (searchResult) {
              console.log('✅ Produto encontrado via busca por termo!');
              searchResult.affiliateLink = url; // Manter o link original
              return searchResult;
            }
          }
          
          throw new Error(`❌ Link encurtado não pôde ser resolvido automaticamente.\n\n💡 Soluções:\n1. Tente usar um link direto do produto (que contém "/p/" ou "MLB")\n2. Verifique se o link está correto\n3. Tente novamente em alguns segundos\n\n🔗 Link fornecido: ${url}`);
        } else {
          throw new Error(`❌ Não foi possível extrair o ID do produto.\n\n💡 Verifique se é um link válido de produto do MercadoLivre.\n\n🔗 Link fornecido: ${url}\n\n✅ Exemplos de links válidos:\n- https://produto.mercadolivre.com.br/MLB-123456789-produto\n- https://www.mercadolivre.com.br/p/MLB123456789`);
        }
      }

      // 3. Usar API oficial do MercadoLivre
      console.log(`🌐 [${timestamp}] Buscando dados na API do MercadoLivre...`);
      const productData = await this.fetchFromMercadoLivreAPI(productId);

      // Manter o link original de afiliado
      productData.affiliateLink = url;

      console.log(`✅ [${timestamp}] Dados extraídos com sucesso:`, productData.name);
      return productData;

    } catch (error) {
      console.error(`❌ [${timestamp}] Erro ao extrair dados:`, error);
      throw error;
    }
  }

  private static async resolveAffiliateLink(url: string): Promise<string> {
    // Se não é link de afiliado, retorna o próprio URL
    if (!url.includes('/sec/') && !url.includes('/share/') && !url.includes('/s/')) {
      console.log('📍 Não é link de afiliado, usando URL direta');
      return url;
    }

    console.log('🔗 Resolvendo link de afiliado...');

    // Tentar múltiplas estratégias para resolver o link
    const strategies = [
      // Estratégia 1: Tentar buscar produto por código usando API do MercadoLivre
      async () => {
        const shortCode = url.split('/').pop();
        if (shortCode && shortCode.length > 3) {
          console.log('🔍 Tentando buscar por código:', shortCode);
          
          // Tentar diferentes formatos de busca
          const searchQueries = [
            shortCode,
            shortCode.toUpperCase(),
            `MLB${shortCode}`,
            shortCode.replace(/[^a-zA-Z0-9]/g, '')
          ];

          for (const query of searchQueries) {
            try {
              const searchUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${query}&limit=5`;
              const response = await fetch(searchUrl);
              
              if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                  // Pegar o primeiro resultado que tenha um permalink válido
                  for (const result of data.results) {
                    if (result.permalink && this.isValidMercadoLivreLink(result.permalink)) {
                      console.log('✅ Produto encontrado via busca:', result.permalink);
                      return result.permalink;
                    }
                  }
                }
              }
            } catch (e) {
              console.log(`⚠️ Erro na busca com query "${query}":`, e);
            }
          }
        }
        throw new Error('Busca por código falhou');
      },

      // Estratégia 2: Usar proxy CORS
      async () => {
        const proxyUrl = `${this.CORS_PROXIES[0]}${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (response.ok) {
          const data = await response.json();
          return data.contents;
        }
        throw new Error('Proxy CORS falhou');
      },

      // Estratégia 3: Tentar fetch direto (pode funcionar em alguns casos)
      async () => {
        const response = await fetch(url, {
          method: 'HEAD',
          redirect: 'follow'
        });
        
        if (response.url && response.url !== url) {
          console.log('✅ Redirecionamento detectado:', response.url);
          return response.url;
        }
        throw new Error('Fetch direto não retornou redirecionamento');
      },

      // Estratégia 4: Tentar construir URLs baseadas em padrões conhecidos
      async () => {
        const shortCode = url.split('/').pop();
        if (shortCode && shortCode.length > 3) {
          console.log('🔧 Tentando construir URLs com código:', shortCode);
          
          // Tentar diferentes formatos de URL do MercadoLivre
          const possibleUrls = [
            `https://produto.mercadolivre.com.br/MLB-${shortCode}`,
            `https://www.mercadolivre.com.br/p/MLB${shortCode}`,
            `https://lista.mercadolivre.com.br/MLB-${shortCode}`,
            `https://produto.mercadolivre.com.br/${shortCode}`,
            `https://www.mercadolivre.com.br/p/${shortCode}`
          ];

          for (const testUrl of possibleUrls) {
            try {
              console.log('🔍 Testando URL:', testUrl);
              const response = await fetch(testUrl, { 
                method: 'HEAD',
                redirect: 'follow'
              });
              
              if (response.ok && response.url && this.isValidMercadoLivreLink(response.url)) {
                console.log('✅ URL construída com sucesso:', response.url);
                return response.url;
              }
            } catch (e) {
              // Continuar tentando
            }
          }
        }
        throw new Error('Construção de URL falhou');
      }
    ];

    for (let i = 0; i < strategies.length; i++) {
      try {
        console.log(`🔄 Tentativa ${i + 1} de resolução...`);
        const result = await strategies[i]();
        
        if (typeof result === 'string') {
          if (result.startsWith('http') && result.includes('mercado')) {
            // Se é uma URL direta, retorna
            console.log('✅ URL resolvida diretamente:', result);
            return result;
          } else {
            // Se é HTML, processa
            const html = result;

            // Primeiro, tentar encontrar o link do produto no JSON-LD
            const jsonLdMatch = html.match(/<script type="application\/ld\+json">\s*({[\s\S]*?})\s*<\/script>/i);
            if (jsonLdMatch) {
              try {
                const jsonLd = JSON.parse(jsonLdMatch[1]);
                if (jsonLd.url && this.isValidMercadoLivreLink(jsonLd.url)) {
                  console.log('✅ URL do produto encontrada no JSON-LD:', jsonLd.url);
                  return jsonLd.url;
                }
              } catch (e) {
                console.log('⚠️ Erro ao analisar JSON-LD:', e);
              }
            }

            // Procurar por redirecionamentos no HTML
            const patterns = [
              /window\.location\.href\s*=\s*["']([^"']+)["']/i,
              /location\.href\s*=\s*["']([^"']+)["']/i,
              /url=([^"'>\s&]+)/i,
              /href=["']([^"']*mercado[^"']*)["']/i,
              /"url":\s*"([^"]*mercado[^"]*)"/i,
              /<a[^>]*href=["']([^"']*\/p\/[^"']*)["'][^>]*>/i,
              /<a[^>]*href=["']([^"']*MLB-?\d+[^"']*)["'][^>]*>/i
            ];

            // Coleção de URLs encontradas para evitar duplicatas
            const foundUrls = new Set<string>();

            for (const pattern of patterns) {
              const matches = html.match(new RegExp(pattern, 'gi')) || [];
              for (const match of matches) {
                const urlMatch = match.match(/(https?:\/\/[^"'\s]+)/i);
                if (urlMatch && urlMatch[1]) {
                  let redirectUrl = urlMatch[1];

                  // Decodificar URL se necessário
                  try {
                    redirectUrl = decodeURIComponent(redirectUrl);
                  } catch (e) {
                    // Ignorar erro de decodificação
                  }

                  // Verificar se é um link de produto válido e não é um perfil
                  if (this.isValidMercadoLivreLink(redirectUrl) &&
                    (redirectUrl.includes('/p/') || /MLB-?\d+/i.test(redirectUrl)) &&
                    !redirectUrl.includes('/perfil/') &&
                    !redirectUrl.includes('/user/') &&
                    !foundUrls.has(redirectUrl)) {

                    console.log('✅ URL de produto encontrada:', redirectUrl);
                    foundUrls.add(redirectUrl);

                    // Se encontrar um link direto de produto, retorna imediatamente
                    if (redirectUrl.includes('/p/') || redirectUrl.includes('MLB-')) {
                      return redirectUrl;
                    }
                  }
                }
              }
            }

            // Se encontrou URLs mas nenhum link direto de produto, retorna o primeiro link válido
            if (foundUrls.size > 0) {
              const firstUrl = Array.from(foundUrls)[0];
              console.log('⚠️ Usando primeiro link válido encontrado:', firstUrl);
              return firstUrl;
            }
          }
        }
      } catch (error) {
        console.log(`⚠️ Estratégia ${i + 1} falhou:`, error);
        continue;
      }
    }

    console.log('⚠️ Não foi possível resolver, usando URL original');
    return url;
  }

  // Função auxiliar para tentar buscar produto por termo quando o ID não pode ser extraído
  private static async searchProductByTerm(searchTerm: string): Promise<ProductData | null> {
    try {
      console.log('🔍 Tentando buscar produto por termo:', searchTerm);
      
      const searchUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(searchTerm)}&limit=1`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        console.log('✅ Produto encontrado via busca:', result.title);
        
        return {
          name: result.title || 'Produto não identificado',
          originalPrice: result.original_price || result.price || 0,
          discountPrice: result.price !== result.original_price ? result.price : undefined,
          image: result.thumbnail || result.secure_thumbnail || '',
          category: result.category_id || 'Categoria não identificada',
          description: result.title || 'Descrição não disponível',
          rating: 4.0, // Valor padrão
          reviews: 100, // Valor padrão
          affiliateLink: result.permalink || ''
        };
      }
      
      return null;
    } catch (error) {
      console.log('⚠️ Erro na busca por termo:', error);
      return null;
    }
  }

  private static async fetchFromMercadoLivreAPI(productId: string): Promise<ProductData> {
    const timestamp = Date.now();
    console.log(`🌐 [${timestamp}] Tentando múltiplas estratégias para obter dados...`);

    // Estratégia 1: Tentar API direta primeiro (pode funcionar em alguns casos)
    try {
      console.log(`📡 [${timestamp}] Tentativa 1.0: API direta...`);
      const itemUrl = `${this.ML_API_BASE}/items/${productId}`;

      const response = await fetch(itemUrl, {
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const itemData = await response.json();
        if (itemData && itemData.title) {
          console.log(`✅ [${timestamp}] Dados obtidos via API direta:`, itemData.title);
          return this.parseApiResponse(itemData, '', 0, 0);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.log(`⚠️ [${timestamp}] API direta falhou (esperado):`, errorMessage);
    }

    // Estratégia 2: API com múltiplos proxies CORS
    for (let i = 0; i < this.CORS_PROXIES.length; i++) {
      try {
        console.log(`📡 [${timestamp}] Tentativa 2.${i + 1}: API via proxy CORS...`);
        const itemUrl = `${this.ML_API_BASE}/items/${productId}?_=${timestamp}`;

        let proxyUrl: string;
        if (this.CORS_PROXIES[i].includes('allorigins')) {
          proxyUrl = `${this.CORS_PROXIES[i]}${encodeURIComponent(itemUrl)}`;
        } else {
          proxyUrl = `${this.CORS_PROXIES[i]}${itemUrl}`;
        }

        const response = await fetch(proxyUrl, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (response.ok) {
          let itemData: any;

          if (this.CORS_PROXIES[i].includes('allorigins')) {
            const data = await response.json();
            if (data.contents && data.contents.trim()) {
              itemData = JSON.parse(data.contents);
            }
          } else {
            itemData = await response.json();
          }

          if (itemData && itemData.title) {
            console.log(`✅ [${timestamp}] Dados obtidos via proxy ${i + 1}:`, itemData.title);
            return this.parseApiResponse(itemData, '', 0, 0);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`⚠️ [${timestamp}] Proxy ${i + 1} falhou:`, errorMessage);
        continue;
      }
    }

    // Estratégia 3: Scraping da página do produto
    for (let i = 0; i < this.CORS_PROXIES.length; i++) {
      try {
        console.log(`📡 [${timestamp}] Tentativa 3.${i + 1}: Scraping da página...`);
        const productUrl = `https://www.mercadolivre.com.br/p/${productId}?_=${timestamp}`;

        let proxyUrl: string;
        if (this.CORS_PROXIES[i].includes('allorigins')) {
          proxyUrl = `${this.CORS_PROXIES[i]}${encodeURIComponent(productUrl)}`;
        } else {
          proxyUrl = `${this.CORS_PROXIES[i]}${productUrl}`;
        }

        const response = await fetch(proxyUrl, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (response.ok) {
          let html: string;

          if (this.CORS_PROXIES[i].includes('allorigins')) {
            const data = await response.json();
            html = data.contents;
          } else {
            html = await response.text();
          }

          const productData = this.parseHTMLData(html, productId);
          if (productData.name !== 'Produto não encontrado') {
            console.log(`✅ [${timestamp}] Dados extraídos via scraping ${i + 1}:`, productData.name);
            return productData;
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`⚠️ [${timestamp}] Scraping ${i + 1} falhou:`, errorMessage);
        continue;
      }
    }

    // Estratégia 4: Tentar URL alternativa do produto
    try {
      console.log(`📡 [${timestamp}] Tentativa 4: URL alternativa...`);
      const alternativeUrl = `https://produto.mercadolivre.com.br/${productId}`;
      const proxyUrl = `${this.CORS_PROXIES[0]}${encodeURIComponent(alternativeUrl)}`;

      const response = await fetch(proxyUrl);
      if (response.ok) {
        const data = await response.json();
        const html = data.contents;

        const productData = this.parseHTMLData(html, productId);
        if (productData.name !== 'Produto não encontrado') {
          console.log(`✅ [${timestamp}] Dados extraídos via URL alternativa:`, productData.name);
          return productData;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.log(`⚠️ [${timestamp}] URL alternativa falhou:`, errorMessage);
    }

    // Estratégia 5: Usar dados básicos do ID (último recurso)
    console.log(`📡 [${timestamp}] Tentativa 5: Dados básicos do ID...`);
    return this.createBasicProductData(productId);
  }

  private static parseHTMLData(html: string, productId: string): ProductData {
    try {
      console.log('🔍 Fazendo parse do HTML da página...');

      // Nome do produto - múltiplas estratégias
      let name = 'Produto não encontrado';

      const titlePatterns = [
        /<title[^>]*>([^<]+?)\s*(?:-\s*Mercado\s*Livre)?<\/title>/i,
        /"title":\s*"([^"]+)"/i,
        /class="[^"]*ui-pdp-title[^"]*"[^>]*>([^<]+)</i,
        /data-testid="product-title"[^>]*>([^<]+)</i,
        /<h1[^>]*>([^<]+)</i
      ];

      for (const pattern of titlePatterns) {
        const match = html.match(pattern);
        if (match && match[1] && match[1].trim()) {
          name = match[1].replace(/\s*-\s*Mercado\s*Livre.*$/i, '').trim();
          if (name.length > 5) break; // Nome válido encontrado
        }
      }

      console.log('📝 Nome extraído:', name);

      // Preços - estratégia mais precisa para MercadoLivre
      let originalPrice = 0;
      let discountPrice: number | undefined;

      console.log('💰 Buscando preços no HTML...');

      // Debug: mostrar parte do HTML relacionada a preços
      const priceSection = html.match(/.{0,200}price.{0,200}/gi);
      if (priceSection) {
        console.log('🔍 Seções com "price" encontradas:', priceSection.slice(0, 3));
      }

      // Estratégia 1: Buscar no JSON estruturado da página
      const jsonPricePatterns = [
        /"price":\s*(\d+(?:\.\d+)?)/i,
        /"original_price":\s*(\d+(?:\.\d+)?)/i,
        /"base_price":\s*(\d+(?:\.\d+)?)/i
      ];

      const jsonPrices: { current?: number; original?: number } = {};

      for (const pattern of jsonPricePatterns) {
        const matches = html.match(new RegExp(pattern.source, 'gi'));
        if (matches) {
          for (const match of matches) {
            const priceMatch = match.match(/(\d+(?:\.\d+)?)/);
            if (priceMatch) {
              const price = parseFloat(priceMatch[1]);
              if (price > 1 && price < 1000000) {
                if (match.includes('original_price')) {
                  jsonPrices.original = Math.max(jsonPrices.original || 0, price);
                } else {
                  jsonPrices.current = Math.max(jsonPrices.current || 0, price);
                }
              }
            }
          }
        }
      }

      // Estratégia 2: Buscar preços em elementos HTML específicos do ML
      const htmlPricePatterns = [
        /class="[^"]*andes-money-amount__fraction[^"]*"[^>]*>(\d+)/gi,
        /class="[^"]*price-tag-fraction[^"]*"[^>]*>(\d+)/gi,
        /class="[^"]*ui-pdp-price__fraction[^"]*"[^>]*>(\d+)/gi,
        /<span[^>]*class="[^"]*price[^"]*"[^>]*>.*?R\$\s*(\d+(?:[.,]\d+)?)/gi
      ];

      const htmlPrices: number[] = [];

      for (const pattern of htmlPricePatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          const priceStr = match[1].replace(/[.,]/g, '');
          const price = parseFloat(priceStr);
          if (price > 1 && price < 1000000) {
            htmlPrices.push(price);
          }
        }
      }

      // Estratégia 3: Buscar padrões de preço em reais
      const realPatterns = [
        /R\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/gi,
        /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*reais?/gi
      ];

      const realPrices: number[] = [];

      for (const pattern of realPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          let priceStr = match[1];
          // Converter formato brasileiro (1.234,56) para formato decimal (1234.56)
          if (priceStr.includes(',') && priceStr.includes('.')) {
            priceStr = priceStr.replace(/\./g, '').replace(',', '.');
          } else if (priceStr.includes(',')) {
            priceStr = priceStr.replace(',', '.');
          }

          const price = parseFloat(priceStr);
          if (price > 1 && price < 1000000) {
            realPrices.push(price);
          }
        }
      }

      // Combinar todos os preços encontrados
      const allFoundPrices = [
        ...(jsonPrices.current ? [jsonPrices.current] : []),
        ...(jsonPrices.original ? [jsonPrices.original] : []),
        ...htmlPrices,
        ...realPrices
      ];

      // Remover duplicatas e filtrar preços válidos
      const uniquePrices = Array.from(new Set(allFoundPrices));
      const validPrices = uniquePrices
        .filter(price => price > 10 && price < 100000) // Filtro mais restritivo
        .sort((a, b) => b - a);

      console.log('💰 Preços encontrados:', validPrices);

      if (validPrices.length > 0) {
        // Se temos preços do JSON, usar eles primeiro
        if (jsonPrices.original && jsonPrices.current) {
          originalPrice = jsonPrices.original;
          discountPrice = jsonPrices.current < jsonPrices.original ? jsonPrices.current : undefined;
        } else if (validPrices.length >= 2) {
          // Se temos múltiplos preços, assumir que o maior é original
          originalPrice = validPrices[0];
          discountPrice = validPrices[1];
        } else {
          // Apenas um preço encontrado
          originalPrice = validPrices[0];
        }
      } else {
        // Fallback: tentar extrair pelo menos um preço
        const fallbackMatch = html.match(/(\d{2,6})/g);
        if (fallbackMatch) {
          const numbers = fallbackMatch
            .map(n => parseInt(n))
            .filter(n => n > 50 && n < 50000)
            .sort((a, b) => b - a);

          if (numbers.length > 0) {
            originalPrice = numbers[0];
          }
        }
      }

      console.log('💰 Preços finais:', { originalPrice, discountPrice });

      // Imagem - buscar a melhor qualidade disponível
      let image = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop';

      console.log('🖼️ Buscando imagens no HTML...');

      console.log('🔍 Iniciando busca por imagens no HTML...');

      // Estratégia 1: Extrair do JSON-LD (estrutura mais confiável)
      const jsonLdPattern = /<script type="application\/ld\+json">(\{.*?\})<\/script>/gi;
      const jsonLdMatch = html.match(jsonLdPattern);

      const foundImages: Set<string> = new Set();

      if (jsonLdMatch) {
        try {
          console.log('🔍 Encontrado JSON-LD, extraindo imagens...');
          const jsonLd = JSON.parse(jsonLdMatch[1]);

          // Extrair imagens do JSON-LD (formato schema.org/Product)
          const extractImages = (obj: any) => {
            if (!obj) return;

            if (Array.isArray(obj)) {
              obj.forEach(extractImages);
            } else if (typeof obj === 'object') {
              // Verificar se é um objeto de imagem
              if (obj['@type'] === 'ImageObject' && obj.contentUrl) {
                const imgUrl = obj.contentUrl.replace(/\\/g, '');
                if (imgUrl.match(/\.(jpg|jpeg|png|webp)(?:\?.*)?$/i)) {
                  foundImages.add(imgUrl);
                }
              }

              // Verificar propriedades que podem conter imagens
              ['image', 'thumbnail', 'thumbnailUrl', 'url', 'contentUrl'].forEach(prop => {
                if (obj[prop]) {
                  if (Array.isArray(obj[prop])) {
                    obj[prop].forEach((url: string) => {
                      if (typeof url === 'string' && url.match(/\.(jpg|jpeg|png|webp)(?:\?.*)?$/i)) {
                        foundImages.add(url);
                      }
                    });
                  } else if (typeof obj[prop] === 'string' && obj[prop].match(/\.(jpg|jpeg|png|webp)(?:\?.*)?$/i)) {
                    foundImages.add(obj[prop]);
                  }
                }
              });

              // Verificar objetos aninhados
              Object.values(obj).forEach(extractImages);
            }
          };

          extractImages(jsonLd);
          console.log(`✅ ${foundImages.size} imagens encontradas no JSON-LD`);
        } catch (e) {
          console.log('⚠️ Erro ao processar JSON-LD:', e);
        }
      }

      // Estratégia 2: Buscar imagens em elementos de galeria (carrossel)
      const galleryPattern = /"pictures":\s*(\[.*?\])/gi;
      const galleryMatch = html.match(galleryPattern);

      if (galleryMatch) {
        try {
          console.log('🔍 Encontrada galeria de imagens, extraindo...');
          const gallery = JSON.parse(galleryMatch[1]);

          if (Array.isArray(gallery)) {
            gallery.forEach((item: any) => {
              if (item.url) {
                const imgUrl = item.url.replace(/\\/g, '');
                if (imgUrl.match(/\.(jpg|jpeg|png|webp)(?:\?.*)?$/i)) {
                  foundImages.add(imgUrl);
                }
              }
            });
            console.log(`✅ ${gallery.length} imagens adicionadas da galeria`);
          }
        } catch (e) {
          console.log('⚠️ Erro ao processar galeria de imagens:', e);
        }
      }

      // Estratégia 3: Buscar imagens em atributos de dados
      const dataImagePatterns = [
        /data-(?:src|image|zoom)="([^"]*?\.(?:jpg|jpeg|png|webp)[^"]*?)"/gi,
        /data:image\/[^;]+;base64,[a-zA-Z0-9+/=]+/gi,
        /"secure_url":\s*"([^"]*?\.(?:jpg|jpeg|png|webp)[^"]*?)"/gi,
        /"url":\s*"([^"]*?\.(?:jpg|jpeg|png|webp)[^"]*?)"/gi
      ];

      dataImagePatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          let imgUrl = match[1] || match[0];
          // Remover caracteres de escape e normalizar URL
          imgUrl = imgUrl.replace(/\\/g, '').replace(/^"|"$/g, '');

          // Verificar se é uma URL de imagem válida
          if (imgUrl.match(/^https?:\/\//) && imgUrl.match(/\.(jpg|jpeg|png|webp)(?:\?.*)?$/i)) {
            foundImages.add(imgUrl);
          }
        }
      });

      // Estratégia 4: Buscar em elementos HTML
      const htmlImagePatterns = [
        /<img[^>]+(?:src|data-src|data-srcset)="([^"]*?\.(?:jpg|jpeg|png|webp)[^"]*?)"[^>]*>/gi,
        /<source[^>]+(?:srcset|src)="([^"]*?\.(?:jpg|jpeg|png|webp)[^"]*?)"[^>]*>/gi,
        /<div[^>]+(?:data-src|data-image)="([^"]*?\.(?:jpg|jpeg|png|webp)[^"]*?)"[^>]*>/gi
      ];

      htmlImagePatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          const imgUrl = match[1].replace(/\\/g, '');
          if (imgUrl.match(/^https?:\/\//)) {
            foundImages.add(imgUrl);
          }
        }
      });

      console.log(`📊 Total de imagens encontradas: ${foundImages.size}`);

      // Converter Set para array para facilitar a manipulação
      const imageArray = Array.from(foundImages);
      console.log(`🖼️ ${imageArray.length} imagens únicas encontradas`);

      if (imageArray.length > 0) {
        // Ordenar imagens por qualidade (maior resolução primeiro)
        const sortedImages = imageArray.sort((a, b) => {
          // Priorizar imagens de alta qualidade
          const aQuality = a.includes('-O.') || a.includes('_O.') || a.includes('original') ? 1 : 0;
          const bQuality = b.includes('-O.') || b.includes('_O.') || b.includes('original') ? 1 : 0;

          // Se uma é de alta qualidade e a outra não, priorizar a de alta qualidade
          if (aQuality !== bQuality) return bQuality - aQuality;

          // Se ambas são da mesma qualidade, priorizar a maior resolução
          const aRes = a.match(/(\d+)x(\d+)/);
          const bRes = b.match(/(\d+)x(\d+)/);

          if (aRes && bRes) {
            const aPixels = parseInt(aRes[1]) * parseInt(aRes[2]);
            const bPixels = parseInt(bRes[1]) * parseInt(bRes[2]);
            return bPixels - aPixels;
          }

          return 0;
        });

        // Selecionar a melhor imagem
        image = sortedImages[0];

        // Otimizar URL da imagem se necessário
        if (image) {
          // Se for uma imagem de baixa resolução, tentar obter a versão de alta resolução
          if (image.includes('-I.')) {
            image = image.replace('-I.', '-O.');
          } else if (image.includes('_I.')) {
            image = image.replace('_I.', '_O.');
          } else if (image.includes('s-l64')) {
            // Se for uma imagem pequena do Mercado Livre, tentar obter uma maior
            image = image.replace('s-l64', 's-l2000');
          } else if (image.includes('s-') && !image.includes('s-l2000')) {
            // Tentar obter a maior resolução disponível
            image = image.replace(/s-\d+/, 's-2000');
          }

          console.log('🖼️ Melhor imagem selecionada:', image.substring(0, 100) + '...');
        } else {
          console.log('⚠️ Nenhuma imagem válida encontrada, usando placeholder');
          image = 'https://http2.mlstatic.com/static/org-img/errors/404-mla.png';
        }
      }

      console.log('🖼️ Imagem final:', image.substring(0, 80) + '...');

      // Categoria
      const category = this.detectCategoryFromName(name);

      // Reviews e rating
      let rating = 4.0;
      let reviews = 100;

      const ratingMatch = html.match(/"rating_average":\s*(\d+(?:\.\d+)?)/i) ||
        html.match(/(\d+(?:\.\d+)?)\s*estrelas?/i);
      if (ratingMatch) {
        rating = parseFloat(ratingMatch[1]);
      }

      const reviewsMatch = html.match(/"reviews_total":\s*(\d+)/i) ||
        html.match(/(\d+)\s*(?:avalia|opini|review)/i);
      if (reviewsMatch) {
        reviews = parseInt(reviewsMatch[1]);
      }

      console.log('⭐ Avaliações extraídas:', { rating, reviews });

      const productData = {
        name,
        originalPrice: originalPrice || 99.99,
        discountPrice: discountPrice && discountPrice < originalPrice ? discountPrice : undefined,
        image,
        category,
        description: `${name} - Produto disponível no MercadoLivre com entrega rápida e segura.`,
        rating,
        reviews,
        affiliateLink: ''
      };

      console.log('✅ Produto extraído via HTML:', productData.name);
      return productData;

    } catch (error) {
      console.log('⚠️ Erro ao fazer parse do HTML:', error);
      return this.createBasicProductData(productId);
    }
  }

  private static detectCategoryFromName(name: string): string {
    const nameLower = name.toLowerCase();

    const categories = {
      'tecnologia': ['smartphone', 'celular', 'tablet', 'notebook', 'computador', 'tv', 'smart', 'android', 'ios', 'samsung', 'apple', 'xiaomi', 'iphone'],
      'casa': ['liquidificador', 'geladeira', 'fogão', 'micro-ondas', 'air fryer', 'panela', 'cozinha', 'casa', 'lar', 'móvel', 'decoração'],
      'esportes': ['tênis', 'sapato', 'esporte', 'corrida', 'academia', 'fitness', 'nike', 'adidas', 'puma'],
      'beleza': ['perfume', 'maquiagem', 'cabelo', 'pele', 'beleza', 'cosmético', 'shampoo'],
      'roupas': ['roupa', 'camisa', 'calça', 'vestido', 'blusa', 'shorts', 'jeans']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => nameLower.includes(keyword))) {
        return category;
      }
    }

    return 'geral';
  }

  private static createBasicProductData(productId: string): ProductData {
    console.log('⚠️ Usando dados básicos para:', productId);

    // Tentar inferir categoria pelo ID (alguns padrões conhecidos)
    let category = 'geral';
    let name = `Produto ${productId}`;
    let image = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop';

    // Alguns padrões conhecidos de categorias por faixa de ID
    const idNumber = parseInt(productId.replace('MLB', ''));
    if (idNumber > 3000000000) {
      category = 'casa';
      name = 'Produto para Casa e Cozinha';
      image = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop';
    } else if (idNumber > 2000000000) {
      category = 'tecnologia';
      name = 'Produto de Tecnologia';
      image = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop';
    } else if (idNumber > 1000000000) {
      category = 'roupas';
      name = 'Produto de Moda e Vestuário';
      image = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop';
    }

    return {
      name,
      originalPrice: 99.99,
      image,
      category,
      description: `${name} disponível no MercadoLivre com entrega rápida e segura.`,
      rating: 4.2,
      reviews: 150,
      affiliateLink: ''
    };
  }



  private static extractProductId(url: string): string | null {
    console.log('🔍 Extraindo ID da URL:', url);

    // Padrões de URL do MercadoLivre (ordem de prioridade)
    const patterns = [
      // Padrões com /p/ (mais comuns)
      /\/p\/(MLB\d{8,})/i,                    // /p/MLB123456789 (mais comum)
      /\/p\/MLB-([A-Z0-9]+)/i,                 // /p/MLB-1234567890
      /\/p\/[^/]+\/([A-Z]{2,4}\d{8,})/i,     // /p/nome-do-produto/MLB123456789

      // Padrões com MLB-
      /MLB-(\d{8,})[^\d]/i,                  // MLB-1234567890-produto
      /MLB-(\d{8,})/i,                       // MLB-1234567890

      // Padrões com /MLB
      /\/(MLB\d{8,})/i,                      // /MLB123456789
      /([A-Z]{2,4}\d{8,})/i,                 // MLB123456789 (qualquer lugar na URL)

      // Padrões com /item/
      /\/item\/([A-Z]{2,4}\d{8,})/i,        // /item/MLB123456789

      // Padrões com -MLB-
      /-([A-Z]{2,4}\d{8,})-/i,               // produto-MLB1234567890-
      /-([A-Z]{2,4}\d{8,})/i,                // produto-MLB1234567890

      // Parâmetros de URL
      /[?&]id=([A-Z]{2,4}\d{8,})/i,         // ?id=MLB123456789
      /[?&]wid=([A-Z]{2,4}\d{8,})/i,        // &wid=MLB123456789
      /[?&]product_id=([A-Z]{2,4}\d{8,})/i, // &product_id=MLB123456789
      /[?&]item_id=([A-Z]{2,4}\d{8,})/i     // &item_id=MLB123456789
    ];

    // Tenta extrair usando os padrões
    for (const pattern of patterns) {
      try {
        const match = url.match(pattern);
        if (match && match[1]) {
          let productId = match[1].toUpperCase();

          // Se for apenas números, adicionar prefixo MLB
          if (/^\d{8,}$/.test(productId)) {
            productId = 'MLB' + productId;
          }

          // Padronizar o formato (remover hífens e outros caracteres)
          productId = productId.replace(/[^A-Z0-9]/g, '');

          // Validar formato final (MLB seguido de 10 ou mais dígitos)
          if (/^[A-Z]{2,4}\d{8,}$/.test(productId)) {
            console.log(`✅ ID extraído (${pattern.source}):`, productId);
            return productId;
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`⚠️ Erro ao processar padrão ${pattern}:`, errorMessage);
      }
    }

    // Tentar extrair de parâmetros da URL como último recurso
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);

      // Verificar todos os parâmetros por valores que pareçam IDs
      params.forEach((value) => {
        if (value && value.match(/^[A-Z]{2,4}\d{8,}$/i)) {
          const productId = value.toUpperCase();
          console.log('✅ ID extraído dos parâmetros:', productId);
          return productId;
        }
      });

      // Verificar o próprio pathname para IDs
      const pathSegments = urlObj.pathname.split('/');
      for (const segment of pathSegments) {
        if (segment.match(/^[A-Z]{2,4}\d{8,}$/i)) {
          console.log('✅ ID extraído do caminho:', segment.toUpperCase());
          return segment.toUpperCase();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.log('⚠️ Erro ao processar URL:', errorMessage);
    }

    // Como último recurso, tentar usar o código do link encurtado
    if (url.includes('/sec/') || url.includes('/share/') || url.includes('/s/')) {
      const shortCode = url.split('/').pop();
      if (shortCode && shortCode.length >= 6) {
        console.log('🔧 Tentando usar código encurtado como ID:', shortCode);
        // Tentar construir um ID baseado no código
        const possibleId = 'MLB' + shortCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (possibleId.length >= 10) {
          console.log('✅ ID construído a partir do código:', possibleId);
          return possibleId;
        }
      }
    }

    console.log('❌ Nenhum ID válido encontrado na URL:', url);
    return null;
  }

  private static parseApiResponse(data: any, description: string, rating: number, reviews: number): ProductData {
    console.log('📊 Processando dados da API...');
    console.log('📊 Dados brutos da API:', {
      title: data.title,
      price: data.price,
      original_price: data.original_price,
      currency_id: data.currency_id
    });

    // Determinar preços com mais precisão
    let currentPrice = 0;
    let originalPrice = 0;
    let discountPrice: number | undefined;

    // Extrair preço atual
    if (data.price && typeof data.price === 'number') {
      currentPrice = data.price;
    }

    // Extrair preço original (se houver desconto)
    if (data.original_price && typeof data.original_price === 'number') {
      originalPrice = data.original_price;
      // Se há preço original diferente do atual, há desconto
      if (originalPrice > currentPrice) {
        discountPrice = currentPrice;
      } else {
        originalPrice = currentPrice;
      }
    } else {
      originalPrice = currentPrice;
    }

    // Validar preços
    if (originalPrice <= 0) {
      originalPrice = 99.99; // Fallback
    }

    console.log('💰 Preços processados da API:', {
      original: originalPrice,
      current: currentPrice,
      discount: discountPrice,
      hasDiscount: !!discountPrice
    });

    // Obter melhor imagem
    const image = this.getBestImage(data.pictures || []) ||
      data.thumbnail ||
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop';

    // Mapear categoria
    const category = this.mapCategory(data.category_id);

    // Limpar descrição
    const cleanDesc = this.cleanDescription(description || data.subtitle || data.title || '');

    const productData: ProductData = {
      name: data.title || 'Produto do MercadoLivre',
      originalPrice: originalPrice,
      discountPrice: discountPrice,
      image: image,
      category: category,
      description: cleanDesc,
      rating: rating > 0 ? rating : (data.health ? data.health * 5 : 4.0),
      reviews: reviews > 0 ? reviews : (data.sold_quantity || 0),
      affiliateLink: '' // Será definido depois
    };

    console.log('✅ Produto processado da API:', {
      name: productData.name,
      originalPrice: productData.originalPrice,
      discountPrice: productData.discountPrice,
      category: productData.category,
      rating: productData.rating,
      reviews: productData.reviews
    });

    return productData;
  }

  private static getBestImage(pictures: any[]): string {
    const defaultImage = 'https://http2.mlstatic.com/static/org-img/errors/404-mla.png';

    if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
      console.log('🖼️ Nenhuma imagem disponível na API');
      return defaultImage;
    }

    console.log(`🖼️ Processando ${pictures.length} imagens da API...`);

    try {
      // Mapear e classificar as imagens por qualidade
      const processedPictures = pictures
        .map(picture => {
          try {
            // Extrair URL da imagem, priorizando secure_url
            let url = (picture.secure_url || picture.url || '').trim();
            if (!url) return null;

            // Garantir HTTPS
            url = url.replace(/^http:/, 'https:');

            // Extrair metadados de tamanho/resolução
            const size = (picture.size || '').toUpperCase();
            const dimensions = this.extractImageDimensions(picture);
            const pixelCount = dimensions.width * dimensions.height;

            // Verificar se é uma imagem em alta resolução
            const isHighQuality = url.includes('-O.') ||
              url.includes('_O.') ||
              url.includes('original') ||
              pixelCount > 1000000; // > 1MP

            return {
              url,
              size,
              width: dimensions.width,
              height: dimensions.height,
              pixelCount,
              isHighQuality,
              source: 'api',
              raw: picture
            };
          } catch (error) {
            console.warn('⚠️ Erro ao processar imagem:', error);
            return null;
          }
        })
        .filter((img): img is NonNullable<typeof img> => {
          // Filtrar URLs inválidas
          return Boolean(img && img.url && img.url.startsWith('http'));
        })
        .sort((a, b) => {
          // Ordenar por:
          // 1. Qualidade (alta prioridade para imagens de alta qualidade)
          if (a.isHighQuality !== b.isHighQuality) {
            return a.isHighQuality ? -1 : 1;
          }

          // 2. Resolução (mais pixels primeiro)
          if (a.pixelCount !== b.pixelCount) {
            return b.pixelCount - a.pixelCount;
          }

          // 3. Tamanho nominal (XL > L > M > S)
          const sizeOrder: Record<string, number> = {
            'XL': 4, 'X-LARGE': 4, 'LARGE': 3, 'L': 3,
            'MEDIUM': 2, 'M': 2, 'SMALL': 1, 'S': 1, '': 0
          };

          return (sizeOrder[b.size] || 0) - (sizeOrder[a.size] || 0);
        });

      console.log(`✅ ${processedPictures.length} imagens processadas`);

      // Selecionar a melhor imagem
      if (processedPictures.length > 0) {
        const bestImage = processedPictures[0];
        console.log(`🖼️ Melhor imagem selecionada: ${bestImage.width}x${bestImage.height} (${bestImage.size})`);

        // Otimizar URL da imagem selecionada
        const optimizedUrl = this.optimizeImageUrl(bestImage.url);
        if (optimizedUrl) {
          console.log('🔧 URL otimizada com sucesso');
          return optimizedUrl;
        }

        console.log('ℹ️ Usando URL original (não foi possível otimizar)');
        return bestImage.url;
      }

      console.log('⚠️ Nenhuma imagem válida encontrada após processamento');
      return defaultImage;

    } catch (error) {
      console.error('❌ Erro crítico ao processar imagens:', error);
      return defaultImage;
    }
  }

  // Método auxiliar para extrair dimensões da imagem
  private static extractImageDimensions(picture: any): { width: number; height: number } {
    // Tenta extrair das propriedades diretas
    if (picture.width && picture.height) {
      return {
        width: parseInt(picture.width, 10) || 0,
        height: parseInt(picture.height, 10) || 0
      };
    }

    // Tenta extrair da URL (ex: .../image.jpg_100x100.jpg)
    const sizeMatch = (picture.secure_url || picture.url || '').match(/_?(\d+)x(\d+)\.(jpg|jpeg|png|webp)$/i);
    if (sizeMatch) {
      return {
        width: parseInt(sizeMatch[1], 10) || 0,
        height: parseInt(sizeMatch[2], 10) || 0
      };
    }

    // Tenta extrair de variações de resolução (s-500, s-1000, etc)
    const resMatch = (picture.secure_url || picture.url || '').match(/s-(\d+)(?:-|$)/i);
    if (resMatch) {
      const size = parseInt(resMatch[1], 10) || 0;
      return { width: size, height: size };
    }

    // Retorna valores padrão se não conseguir extrair
    return { width: 0, height: 0 };
  }

  private static optimizeImageUrl(url: string): string | null {
    if (!url) return null;

    try {
      // Padrões comuns de URLs do Mercado Livre
      const patterns = [
        // Padrão: ...-V-f.jpg -> muda para -O.jpg (original)
        {
          regex: /(\/[^/]+\-[^/]+\.jpg)$/i,
          replace: (_match: string) => _match.replace(/-[A-Za-z0-9]+\.jpg$/, '-O.jpg')
        },
        // Padrão: .../v1/.../s-... -> remove o /s-... para pegar a imagem original
        {
          regex: /(\/v1\/[^/]+\/)[^/]+(\/[^/]+\.jpg)$/i,
          replace: (_match: string, p1: string, p2: string) => `${p1}o${p2}`
        },
        // Padrão: .../s-...-f.jpg -> muda para -O.jpg
        {
          regex: /(\/[^/]+\-)[^/]+(\-[^/]+\.jpg)$/i,
          replace: (_match: string, p1: string) => `${p1}O.jpg`
        }
      ];

      // Tentar cada padrão
      for (const { regex, replace } of patterns) {
        if (regex.test(url)) {
          const optimizedUrl = url.replace(regex, replace);
          if (optimizedUrl !== url) {
            console.log('🖼️ Otimizando URL:', { original: url, otimizada: optimizedUrl });
            return optimizedUrl;
          }
        }
      }

      return null;

    } catch (error) {
      console.warn('⚠️ Erro ao otimizar URL da imagem:', error);
      return null;
    }
  }

  private static mapCategory(categoryId: string): string {
    const categoryMap: Record<string, string> = {
      'MLA1051': 'tecnologia', // Celulares
      'MLA1648': 'tecnologia', // Computação
      'MLA1144': 'tecnologia', // Consoles
      'MLA1039': 'casa', // Casa
      'MLA1071': 'casa', // Casa e Jardim
      'MLA1276': 'esportes', // Esportes
      'MLA1430': 'roupas', // Roupas
      'MLA1246': 'beleza', // Beleza
      'MLA1182': 'casa' // Eletrodomésticos
    };

    return categoryMap[categoryId] || 'geral';
  }

  private static cleanDescription(description: string): string {
    if (!description) return 'Produto disponível no MercadoLivre';

    const cleaned = description
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return cleaned.length > 200 ? cleaned.substring(0, 200) + '...' : cleaned;
  }





  static detectAudience(productData: ProductData): string {
    const categoryMap: Record<string, string> = {
      'tecnologia': 'tecnologia',
      'informatica': 'tecnologia',
      'esportes': 'jovens',
      'casa': 'familia',
      'beleza': 'adultos'
    };

    return categoryMap[productData.category] || 'adultos';
  }

  static isValidMercadoLivreLink(url: string): boolean {
    if (!url) return false;

    console.log('🔍 Validando URL:', url);

    try {
      const urlObj = new URL(url);
      const validDomains = [
        'mercadolivre.com.br',
        'mercadolivre.com',
        'mercadolibre.com.ar',
        'mercadolibre.com.mx',
        'mercadolibre.com.co',
        'mercadolibre.cl',
        'mercadolibre.com.pe',
        'mercadolibre.com.uy',
        'mercadolibre.com.ve',
        'mercadolibre.com.ec',
        'mercadolibre.com.bo',
        'mercadolibre.com.py',
        'mercadolibre.com.cr',
        'mercadolibre.com.pa',
        'mercadolibre.com.ni',
        'mercadolibre.com.sv',
        'mercadolibre.com.gt',
        'mercadolibre.com.hn',
        'mercadolibre.com.do',
        'mercadolibre.com.pt',
        'mercadolivre.pt'
      ];

      const isValidDomain = validDomains.some(domain =>
        urlObj.hostname.endsWith(domain) ||
        urlObj.hostname.endsWith(`.${domain}`)
      );

      console.log('🌐 Domínio válido?', isValidDomain);

      if (!isValidDomain) return false;

      // Verificar se é um perfil (não queremos esses links)
      const isProfileLink = /\/(perfil|user)\/[^/]+/i.test(url);
      if (isProfileLink) {
        console.log('⚠️ Link de perfil detectado, ignorando');
        return false;
      }

      // Verificar se o caminho contém /p/ ou um ID de produto (MLB seguido de números)
      const hasProductPath =
        /\/p\//i.test(url) || // /p/xxxx
        /MLB-?\d+/i.test(url) || // MLB-1234567890 ou MLB1234567890
        /\/[A-Z]{2,4}\d{8,}/i.test(url) || // MLB1234567890
        /\/produto\//i.test(url) || // /produto/...
        /\/sec\//i.test(url) || // Links de afiliado
        /\/share\//i.test(url) || // Links compartilhados
        /\/s\//i.test(url); // Links encurtados

      console.log('🔗 Possui caminho de produto?', hasProductPath);

      // Para links encurtados (/sec/, /s/), sempre aceitar pois podem ser válidos
      const isShortLink = /\/(sec|s|share)\//i.test(url);
      if (isShortLink) {
        console.log('🔗 Link encurtado detectado, será resolvido posteriormente');
        return true;
      }

      // Se não tem caminho de produto e não é link encurtado, não é válido
      if (!hasProductPath) return false;

      console.log('✅ URL válida');
      return true;

    } catch (error) {
      console.error('❌ Erro ao validar URL:', error);
      return false;
    }
  }

  static detectBestCTAStyle(productData: ProductData): string {
    // Calcular desconto percentual se houver preço original e de desconto
    const hasDiscount = productData.originalPrice > 0 &&
      productData.discountPrice !== undefined &&
      productData.discountPrice > 0 &&
      productData.discountPrice < productData.originalPrice;
    let discountPercent = 0;

    if (hasDiscount && productData.discountPrice !== undefined) {
      // O TypeScript agora sabe que discountPrice está definido aqui
      const discountPrice = productData.discountPrice;
      discountPercent = ((productData.originalPrice - discountPrice) / productData.originalPrice) * 100;
      console.log(`💰 Desconto de ${discountPercent.toFixed(0)}% detectado`);
    }

    // Verificar se tem classificação alta
    const hasHighRating = productData.rating >= 4.5;
    const hasManyReviews = productData.reviews > 50;

    // 1. Se tiver um desconto significativo (>20%), usar estilo de urgência
    if (hasDiscount && discountPercent > 20) {
      console.log('🎯 Usando estilo de CTA: Urgência (desconto alto)');
      return 'urgencia';
    }

    // 2. Se tiver classificação alta e muitas avaliações, usar prova social
    if (hasHighRating && hasManyReviews) {
      console.log('🏆 Usando estilo de CTA: Prova Social (avaliações altas)');
      return 'social';
    }

    // 3. Se for da categoria tecnologia, destacar benefícios
    const techCategories = ['tecnologia', 'informatica', 'eletronicos', 'celulares'];
    if (techCategories.includes(productData.category.toLowerCase())) {
      console.log('💻 Usando estilo de CTA: Benefícios (categoria de tecnologia)');
      return 'beneficios';
    }

    // 4. Se for para família ou casa, apelar para o emocional
    const familyCategories = ['casa', 'casa-e-cozinha', 'moveis', 'eletrodomesticos', 'bebes'];
    if (familyCategories.includes(productData.category.toLowerCase())) {
      console.log('🏠 Usando estilo de CTA: Emocional (produtos para casa/família)');
      return 'emocional';
    }

    // 5. Se for moda ou beleza, usar prova social
    const fashionCategories = ['moda', 'beleza', 'perfumaria', 'maquiagem'];
    if (fashionCategories.includes(productData.category.toLowerCase())) {
      console.log('👗 Usando estilo de CTA: Prova Social (moda/beleza)');
      return 'social';
    }

    // 6. Se tiver desconto, mesmo que pequeno, usar urgência
    if (hasDiscount) {
      console.log('⏰ Usando estilo de CTA: Urgência (desconto disponível)');
      return 'urgencia';
    }

    // 7. Estilo padrão: benefícios
    console.log('✨ Usando estilo de CTA: Benefícios (padrão)');
    return 'beneficios';
  }
}