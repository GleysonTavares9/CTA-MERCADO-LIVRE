// Debug da extração de dados
// Execute no console do browser: debugExtraction()

async function debugExtraction() {
    console.log('🔍 Testando extração de dados...');

    const testUrl = 'https://mercadolivre.com/sec/28TFwez';
    console.log('🔗 URL de teste:', testUrl);

    try {
        // Simular resolução de link de afiliado
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
                console.log('🔗 Links encontrados:', linkMatches.slice(0, 5));

                const productLink = linkMatches.find(link =>
                    link.includes('/p/') || link.includes('MLB')
                );

                if (productLink) {
                    console.log('✅ Link do produto:', productLink);

                    // Extrair ID do produto
                    const patterns = [
                        /\/p\/(MLB\d{8,})/i,
                        /MLB-(\d{8,})-[^-]+-_JM/i,
                        /\/(MLB\d{8,})/i,
                    ];

                    let productId = null;
                    for (const pattern of patterns) {
                        const match = productLink.match(pattern);
                        if (match && match[1]) {
                            productId = match[1];
                            if (productId.startsWith('MLB-')) {
                                productId = productId.replace('MLB-', 'MLB');
                            }
                            break;
                        }
                    }

                    if (productId) {
                        console.log('🆔 ID do produto extraído:', productId);

                        // Testar API do MercadoLivre
                        const apiUrl = `https://api.mercadolibre.com/items/${productId}`;
                        console.log('📡 Testando API:', apiUrl);

                        try {
                            const apiResponse = await fetch(apiUrl);
                            if (apiResponse.ok) {
                                const apiData = await apiResponse.json();
                                console.log('✅ Dados da API:');
                                console.log('   Nome:', apiData.title);
                                console.log('   Preço:', apiData.price);
                                console.log('   Preço Original:', apiData.original_price);
                                console.log('   Status:', apiData.status);
                                console.log('   Imagens:', apiData.pictures?.length || 0);
                            } else {
                                console.log('❌ API retornou:', apiResponse.status);

                                // Tentar via proxy
                                const proxyApiUrl = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
                                const proxyApiResponse = await fetch(proxyApiUrl);

                                if (proxyApiResponse.ok) {
                                    const proxyData = await proxyApiResponse.json();
                                    const apiData = JSON.parse(proxyData.contents);
                                    console.log('✅ Dados da API via proxy:');
                                    console.log('   Nome:', apiData.title);
                                    console.log('   Preço:', apiData.price);
                                    console.log('   Preço Original:', apiData.original_price);
                                }
                            }
                        } catch (apiError) {
                            console.log('❌ Erro na API:', apiError.message);
                        }
                    } else {
                        console.log('❌ Não foi possível extrair ID do produto');
                    }
                } else {
                    console.log('❌ Nenhum link de produto encontrado');
                }
            } else {
                console.log('❌ Nenhum link do MercadoLivre encontrado');
            }
        } else {
            console.log('❌ Erro na requisição:', response.status);
        }
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

// Disponibilizar no console
if (typeof window !== 'undefined') {
    window.debugExtraction = debugExtraction;
    console.log('🧪 Função debugExtraction() disponível no console');
}