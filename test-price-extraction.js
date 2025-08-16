// Teste para verificar extração de preços
// Execute com: node test-price-extraction.js

const testUrl = 'https://mercadolivre.com/sec/28TFwez';

async function testPriceExtraction() {
    console.log('🧪 Testando extração de preços...');
    console.log('🔗 URL:', testUrl);

    try {
        // Simular o processo de resolução do link
        const CORS_PROXY = 'https://api.allorigins.win/get?url=';
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(testUrl)}`;

        console.log('📡 Fazendo requisição via proxy...');
        const response = await fetch(proxyUrl);

        if (response.ok) {
            const data = await response.json();
            const html = data.contents;

            console.log('✅ HTML obtido, tamanho:', html.length);

            // Procurar por links do MercadoLivre
            const linkMatches = html.match(/https?:\/\/[^"'\s]*mercado[^"'\s]*/gi);
            if (linkMatches) {
                console.log('🔗 Links encontrados:', linkMatches.slice(0, 3));

                const productLink = linkMatches.find(link =>
                    link.includes('/p/') || link.includes('MLB')
                );

                if (productLink) {
                    console.log('✅ Link do produto:', productLink);

                    // Extrair ID do produto
                    const idMatch = productLink.match(/MLB\d+/);
                    if (idMatch) {
                        console.log('🆔 ID do produto:', idMatch[0]);

                        // Testar API do MercadoLivre
                        const apiUrl = `https://api.mercadolibre.com/items/${idMatch[0]}`;
                        console.log('📡 Testando API:', apiUrl);

                        try {
                            const apiResponse = await fetch(apiUrl);
                            if (apiResponse.ok) {
                                const apiData = await apiResponse.json();
                                console.log('✅ Dados da API:');
                                console.log('   Nome:', apiData.title);
                                console.log('   Preço:', apiData.price);
                                console.log('   Preço Original:', apiData.original_price);
                                console.log('   Moeda:', apiData.currency_id);
                                console.log('   Status:', apiData.status);
                            } else {
                                console.log('❌ API retornou:', apiResponse.status);
                            }
                        } catch (apiError) {
                            console.log('❌ Erro na API:', apiError.message);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

// Executar apenas se chamado diretamente
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    testPriceExtraction();
} else {
    // Browser environment
    window.testPriceExtraction = testPriceExtraction;
    console.log('🧪 Função testPriceExtraction() disponível no console');
}