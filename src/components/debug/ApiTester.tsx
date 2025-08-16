import React, { useState } from 'react';

interface ApiConfig {
  geminiKey: string;
  temperature: number;
  maxTokens: number;
  model: string;
}

export const ApiTester: React.FC = () => {
  const [config, setConfig] = useState<ApiConfig>({
    geminiKey: '',
    temperature: 0.7,
    maxTokens: 1000,
    model: 'gemini-1.5-flash-latest'
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('Responda apenas "API funcionando!" se você conseguir me ouvir.');

  const models = [
    { value: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Rápido)' },
    { value: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Avançado)' },
    { value: 'gemini-pro', name: 'Gemini Pro (Clássico)' }
  ];

  const testGeminiAPI = async () => {
    if (!config.geminiKey.trim()) {
      setTestResult('❌ Por favor, insira uma chave da API');
      return;
    }

    setIsLoading(true);
    setTestResult('🧪 Testando API do Gemini...');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: customPrompt
            }]
          }],
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const generatedText = data.candidates[0].content.parts[0].text;
          setTestResult(`✅ API funcionando!\n\nResposta: ${generatedText}\n\n📊 Tokens usados: ~${generatedText.length / 4}`);
          
          // Salvar configurações no localStorage
          saveConfig();
        } else {
          setTestResult('❌ Resposta inválida da API');
        }
      } else {
        const errorData = await response.json();
        setTestResult(`❌ Erro ${response.status}: ${errorData.error?.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      setTestResult(`❌ Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = () => {
    localStorage.setItem('gemini_api_config', JSON.stringify(config));
    localStorage.setItem('gemini_custom_prompt', customPrompt);
  };

  const loadConfig = () => {
    const savedConfig = localStorage.getItem('gemini_api_config');
    const savedPrompt = localStorage.getItem('gemini_custom_prompt');
    
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    if (savedPrompt) {
      setCustomPrompt(savedPrompt);
    }
  };

  const resetConfig = () => {
    setConfig({
      geminiKey: '',
      temperature: 0.7,
      maxTokens: 1000,
      model: 'gemini-1.5-flash-latest'
    });
    setCustomPrompt('Responda apenas "API funcionando!" se você conseguir me ouvir.');
    localStorage.removeItem('gemini_api_config');
    localStorage.removeItem('gemini_custom_prompt');
    setTestResult('');
  };

  const exportConfig = () => {
    const configData = {
      config: { ...config, geminiKey: '***HIDDEN***' },
      customPrompt,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gemini-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    loadConfig();
  }, []);

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-ml">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-ml-gray-dark flex items-center gap-2">
          🤖 Configuração & Teste da API
        </h2>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-gray-500 hover:text-gray-700 text-sm bg-white px-3 py-1 rounded-full shadow-sm"
        >
          {isVisible ? '▼ Ocultar' : '▶ Configurar'}
        </button>
      </div>

      {isVisible && (
        <div className="space-y-4">
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔑 Chave da API do Google Gemini:
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={config.geminiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, geminiKey: e.target.value }))}
                placeholder="AIzaSy..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-ml-blue"
              />
              <button
                onClick={testGeminiAPI}
                disabled={isLoading}
                className="bg-ml-blue text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '⏳' : '🧪 Testar'}
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🧠 Modelo:
            </label>
            <select
              value={config.model}
              onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-ml-blue"
            >
              {models.map(model => (
                <option key={model.value} value={model.value}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌡️ Temperatura: {config.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">
                Criatividade: {config.temperature < 0.3 ? 'Baixa' : config.temperature < 0.7 ? 'Média' : 'Alta'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Max Tokens:
              </label>
              <input
                type="number"
                min="50"
                max="8000"
                value={config.maxTokens}
                onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-ml-blue"
              />
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💬 Prompt de Teste Personalizado:
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-ml-blue"
              placeholder="Digite seu prompt de teste aqui..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={saveConfig}
              className="bg-ml-yellow text-gray-800 px-3 py-2 rounded-lg hover:bg-yellow-500 transition-colors text-sm"
            >
              💾 Salvar Config
            </button>
            <button
              onClick={exportConfig}
              className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              📤 Exportar
            </button>
            <button
              onClick={resetConfig}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              🔄 Reset
            </button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`p-4 rounded-lg text-sm whitespace-pre-wrap ${
              testResult.startsWith('✅') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : testResult.startsWith('🧪')
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {testResult}
            </div>
          )}

          {/* Help Info */}
          <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
            <p>💡 <strong>Como obter:</strong> <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-ml-blue hover:underline">Google AI Studio</a></p>
            <p>🔒 <strong>Segurança:</strong> Configurações salvas apenas no seu navegador</p>
            <p>🆓 <strong>Limites gratuitos:</strong> 15 req/min, 1M tokens/mês</p>
            <p>⚡ <strong>Dica:</strong> Use Flash para velocidade, Pro para qualidade</p>
          </div>
        </div>
      )}
    </div>
  );
};