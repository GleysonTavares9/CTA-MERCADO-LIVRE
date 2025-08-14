// Teste de extração real de dados
// Execute no console: testRealExtraction()

async function testRealExtraction() {
  console.log('🧪 Testando extração real de dados...');
  
  // Teste com ID conhecido
  const testProductId = 'MLB24171270'; // Carrinho Milano II
  console.log('🆔 Testando com ID:', testProductId);
  
  try {
    // Testar API direta
    console.log('📡 Testando API direta...');
    const apiUrl = `https://api.mercadolibre.com/items/${testProductId}`;
    
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API direta funcionou!');
        console.log('Nome:', data.title);
        console.log('Preço:', data.price);
        console.log('Imagens:', data.pictures?.length || 0);
        return data;
      } else {
        console.log('❌ API direta falhou:', response.status);
      }
    } catch (error) {
      console.log('❌ API direta erro:', error.message);
    }
    
    // Testar via proxy
    console.log('📡 Testando via proxy...');
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
    
    const proxyResponse = await fetch(proxyUrl);
    if (proxyResponse.ok) {
      const proxyData = await proxyResponse.json();
      if (proxyData.contents) {
        const data = JSON.parse(proxyData.contents);
        console.log('✅ API via proxy funcionou!');
        console.log('Nome:', data.title);
        console.log('Preço:', data.price);
        console.log('Preço Original:', data.original_price);
        console.log('Status:', data.status);
        console.log('Imagens:', data.pictures?.length || 0);
        
        if (data.pictures && data.pictures.length > 0) {
          console.log('Primeira imagem:', data.pictures[0].secure_url);
        }
        
        return data;
      }
    }
    
    console.log('❌ Todas as tentativas falharam');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Teste de resolução de link de afiliado
async function testAffiliateResolution() {
  console.log('🔗 Testando resolução de link de afiliado...');
  
  const affiliateLink = 'https://mercadolivre.com/sec/28TFwez';
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(affiliateLink)}`;
  
  try {
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const data = await response.json();
      const html = data.contents;
      
      console.log('✅ HTML obtido, tamanho:', html.length);
      
      // Procurar links do produto
      const patterns = [
        /https:\/\/[^"'\s]*mercadolivre\.com\.br[^"'\s]*\/p\/([A-Z0-9]+)/gi,
        /https:\/\/[^"'\s]*mercadolivre\.com\.br[^"'\s]*([A-Z]{3}\d{8,})/gi,
        /\/p\/([A-Z]{3}\d{8,})/gi
      ];
      
      for (const pattern of patterns) {
        const matches = [...html.matchAll(pattern)];
        if (matches.length > 0) {
          console.log(`✅ Encontrados ${matches.length} matches para padrão:`, pattern.source);
          matches.slice(0, 3).forEach((match, i) => {
            console.log(`  ${i + 1}. ${match[0]} -> ID: ${match[1]}`);
          });
        }
      }
      
      // Procurar por qualquer MLB
      const mlbMatches = html.match(/MLB\d{8,}/gi);
      if (mlbMatches) {
        const uniqueIds = [...new Set(mlbMatches)];
        console.log('🆔 IDs MLB encontrados:', uniqueIds.slice(0, 5));
      }
      
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Disponibilizar no console
if (typeof window !== 'undefined') {
  window.testRealExtraction = testRealExtraction;
  window.testAffiliateResolution = testAffiliateResolution;
  console.log('🧪 Funções disponíveis:');
  console.log('- testRealExtraction()');
  console.log('- testAffiliateResolution()');
}