// Teste da API do Gemini
// Execute no console do browser: testGemini()

async function testGemini() {
  console.log('🤖 Testando API do Gemini...');
  
  const GEMINI_API_KEY = 'AIzaSyAeLqHqMwAg4-bim8rmSKQDOXeDha1lyRg';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  if (!GEMINI_API_KEY) {
    console.error('❌ Chave da API não encontrada');
    return;
  }
  
  console.log('🔑 Chave da API:', GEMINI_API_KEY.substring(0, 10) + '...');
  
  const testPrompt = `Crie uma mensagem de CTA para WhatsApp para o produto:
  
Nome: Liquidificador Mondial 550W
Preço: R$ 149,90
Categoria: Casa

Seja criativo e persuasivo em no máximo 5 linhas.`;

  try {
    console.log('📡 Fazendo requisição para o Gemini...');
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: testPrompt
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

    console.log('📊 Status da resposta:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro na API:', errorData);
      return;
    }

    const data = await response.json();
    console.log('📋 Resposta completa:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('✅ Texto gerado pela IA:');
      console.log('---');
      console.log(generatedText);
      console.log('---');
      return generatedText;
    } else {
      console.error('❌ Estrutura de resposta inesperada:', data);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

// Disponibilizar no console
if (typeof window !== 'undefined') {
  window.testGemini = testGemini;
  console.log('🧪 Função testGemini() disponível no console');
}