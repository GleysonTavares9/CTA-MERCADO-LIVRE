import { ProductData } from '../../types';
import { InputSection, OutputSection, WhatsAppPreview, ApiTester, AISetupNotification } from '../index';

// ==============================================
// 1. Tipos e Interfaces
// ==============================================

/**
 * Props para o componente GeneratorPage
 * 
 * @interface GeneratorPageProps
 * @property {string} generatedMessage - Mensagem gerada pelo sistema
 * @property {ProductData | null} productData - Dados do produto
 * @property {boolean} isLoading - Indica se está carregando
 * @property {string} loadingText - Texto exibido durante o carregamento
 * @property {(message: string, data: ProductData, loading: boolean, loadingMsg: string) => void} onProductGenerated - Callback chamado quando um produto é gerado
 */
interface GeneratorPageProps {
  generatedMessage: string;
  productData: ProductData | null;
  isLoading: boolean;
  loadingText: string;
  onProductGenerated: (message: string, data: ProductData, loading: boolean, loadingMsg: string) => void;
}

// ==============================================
// 2. Constantes
// ==============================================

// Configurações de animação para os componentes
const ANIMATION_DELAYS = {
  inputSection: '0s',
  outputSection: '0.1s',
  whatsappPreview: '0.2s',
  apiTester: '0.3s'
} as const;

// ==============================================
// 3. Componente Principal
// ==============================================

/**
 * Página principal do gerador de mensagens promocionais
 * 
 * @component
 * @example
 * ```tsx
 * <GeneratorPage 
 *   generatedMessage={generatedMessage}
 *   productData={productData}
 *   isLoading={isLoading}
 *   loadingText="Gerando mensagem..."
 *   onProductGenerated={handleProductGenerated}
 * />
 * ```
 */
export function GeneratorPage({
  generatedMessage,
  productData,
  isLoading,
  loadingText,
  onProductGenerated
}: GeneratorPageProps) {
  // Extrai a mensagem principal (remove URL se existir)
  const mainMessage = generatedMessage.split('\n\nhttps://')[0] || '';
  const hasContent = !!productData || isLoading;
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Página */}
        <header className="text-center mb-8">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl px-8 py-6 shadow-xl">
            <div className="text-5xl">🚀</div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Gerador de Mensagens
              </h1>
              <p className="mt-2 text-white/90 text-sm sm:text-base md:text-lg">
                Transforme links do Mercado Livre em mensagens incríveis em segundos
              </p>
            </div>
          </div>
        </header>

        {/* Notificação de Configuração da IA */}
        <div className="mb-8">
          <AISetupNotification />
        </div>

        {/* Grid principal com 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna da Esquerda */}
          <div className="space-y-8">
            {/* Bloco 1: Entrada de Dados */}
            <div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              style={{ animationDelay: ANIMATION_DELAYS.inputSection }}
            >
              <div className="p-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500"></div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">
                    1
                  </span>
                  <h2 className="text-2xl font-extrabold text-gray-800">
                    Dados do Produto
                  </h2>
                </div>
                <InputSection onProductGenerated={onProductGenerated} />
              </div>
            </div>

            {/* Bloco 3: Visualização do WhatsApp */}
            <div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              style={{ animationDelay: ANIMATION_DELAYS.whatsappPreview }}
            >
              <div className="p-1.5 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500"></div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">
                    3
                  </span>
                  <h2 className="text-2xl font-extrabold text-gray-800">
                    Visualização no WhatsApp
                  </h2>
                </div>
                {hasContent ? (
                  <WhatsAppPreview
                    productData={productData}
                    message={mainMessage}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Insira um link do produto para ver a prévia</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="space-y-8">
            {/* Bloco 2: Saída da Mensagem */}
            <div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              style={{ animationDelay: ANIMATION_DELAYS.outputSection }}
            >
              <div className="p-1.5 bg-gradient-to-r from-green-500 via-green-600 to-green-500"></div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">
                    2
                  </span>
                  <h2 className="text-2xl font-extrabold text-gray-800">
                    Mensagem Gerada
                  </h2>
                </div>
                <OutputSection
                  generatedMessage={generatedMessage}
                  isLoading={isLoading}
                  loadingText={loadingText}
                />
              </div>
            </div>

            {/* Bloco 4: Testador de API */}
            <div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              style={{ animationDelay: ANIMATION_DELAYS.apiTester }}
            >
              <div className="p-1.5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500"></div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <span className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">
                    4
                  </span>
                  <h2 className="text-2xl font-extrabold text-gray-800">
                    Testador de API
                  </h2>
                </div>
                <ApiTester />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}