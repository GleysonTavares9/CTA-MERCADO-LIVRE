import { GeminiAI } from './geminiAI';
import { ProductData } from '../types';

// Dados de exemplo para teste
const testProductData: ProductData = {
  name: 'Smartphone XYZ - 128GB, Tela 6.5", Câmera Tripla 48MP',
  originalPrice: 1999.90,
  discountPrice: 1499.90,
  rating: 4.7,
  reviews: 1245,
  description: 'Smartphone com processador rápido, tela AMOLED de 6.5 polegadas, câmera tripla de 48MP + 8MP + 5MP, bateria de 5000mAh e carregamento rápido de 33W.',
  category: 'Celulares e Smartphones',
  image: 'https://http2.mlstatic.com/D_NQ_NP_123456-MLB12345678901_052021-O.jpg',
  affiliateLink: 'https://mercadolivre.com.br/produto/1234567890/'
};

// Função para testar a integração com a API do Gemini
async function testGeminiIntegration() {
  console.log('🚀 Iniciando teste de integração com Gemini AI...');
  
  try {
    console.log('📝 Gerando mensagem CTA de teste...');
    
    // Testar com um único público e estilo para simplificar
    const audience = 'jovens';
    const style = 'urgencia';
    
    console.log(`🔍 Testando combinação: Público=${audience}, Estilo=${style}`);
    
    const message = await GeminiAI.generateCTA(testProductData, audience, style);
    
    console.log('✅ Mensagem gerada com sucesso!');
    console.log('📝 Mensagem completa:');
    console.log(message);
    
    console.log('✅ Teste concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o teste de integração:');
    console.error(error);
  }
}

// Executar o teste diretamente
testGeminiIntegration();
