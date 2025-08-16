import React, { useState, useRef, useEffect } from 'react';
import { ProductData } from '../../types';
import { ProductPosterWithSave } from '../index';

// ==============================================
// 1. Tipos e Interfaces
// ==============================================

/**
 * Tipos de tamanhos de poster disponíveis
 */
type PosterSizeType = 
  | 'instagram-story' 
  | 'instagram-post' 
  | 'facebook-post' 
  | 'twitter-post' 
  | 'promotional-poster';

/**
 * Dimensões de um tamanho de poster
 */
interface PosterSize {
  width: number;
  height: number;
  name: string;
}

/**
 * Configuração do poster
 */
interface PosterConfig {
  // Cores e tema
  backgroundColor: string;
  accentColor: string;
  
  // Informações da marca
  brandName: string;
  slogan: string;
  contactPhone: string;
  
  // Opções de exibição
  showDiscount: boolean;
  posterSize: PosterSizeType;
}

/**
 * Props do componente principal
 */
interface PosterPageProps {
  // Dados do produto
  productData: ProductData | null;
  
  // Configuração e estado
  posterConfig: PosterConfig;
  setPosterConfig: (config: PosterConfig) => void;
  
  // Navegação
  onSwitchToGenerator: () => void;
}

// ==============================================
// 2. Constantes e Configurações
// ==============================================

/**
 * Dimensões padrão para cada tipo de poster
 * Mantido como Record para garantir type safety
 */
const POSTER_SIZES: Record<PosterSizeType, PosterSize> = {
  // Redes Sociais
  'instagram-story': { 
    width: 1080, 
    height: 1920, 
    name: 'Instagram Story' 
  },
  'instagram-post': { 
    width: 1080, 
    height: 1080, 
    name: 'Instagram Post' 
  },
  'facebook-post': { 
    width: 1200, 
    height: 630, 
    name: 'Facebook Post' 
  },
  'twitter-post': { 
    width: 1200, 
    height: 675, 
    name: 'Twitter Post' 
  },
  // Tamanho personalizado
  'promotional-poster': { 
    width: 1200, 
    height: 800, 
    name: 'Poster Promocional' 
  }
} as const;

/**
 * Configuração padrão para um novo poster
 */
export const DEFAULT_POSTER_CONFIG: PosterConfig = {
  // Cores padrão baseadas no tema do Mercado Livre
  backgroundColor: 'from-blue-600 via-blue-500 to-yellow-400',
  accentColor: 'yellow-300',
  
  // Dados da marca
  brandName: 'Sua Loja',
  slogan: 'As melhores ofertas você encontra aqui!',
  contactPhone: '(11) 99999-9999',
  
  // Configurações de exibição
  showDiscount: true,
  posterSize: 'promotional-poster'
};

// ==============================================
// 3. Componente Principal
// ==============================================

/**
 * Página principal para criação e visualização de posters promocionais
 * 
 * @component
 * @example
 * ```tsx
 * <PosterPage 
 *   productData={productData}
 *   posterConfig={posterConfig}
 *   setPosterConfig={setPosterConfig}
 *   onSwitchToGenerator={handleSwitchToGenerator}
 * />
 * ```
 */
export function PosterPage({
  productData,
  posterConfig,
  setPosterConfig,
  onSwitchToGenerator
}: PosterPageProps) {
  // Renderiza o estado vazio se não houver dados do produto
  if (!productData) {
    return <EmptyPosterState onSwitchToGenerator={onSwitchToGenerator} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Cabeçalho da página */}
      <PageHeader 
        title="Poster Promocional"
        description="Crie posters profissionais para seus produtos"
        icon="🎨"
      />

      {/* Card com informações do produto */}
      <ProductInfo productData={productData} />

      {/* Layout principal com controles e visualização */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de controles (1/3 da largura em telas grandes) */}
        <div className="lg:col-span-1">
          <PosterControls 
            posterConfig={posterConfig} 
            setPosterConfig={setPosterConfig} 
          />
        </div>

        {/* Visualização do poster (2/3 da largura em telas grandes) */}
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <PosterPreview 
              productData={productData} 
              posterConfig={posterConfig} 
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// 4. Subcomponentes
// ==============================================

/**
 * Props para o componente PageHeader
 */
interface PageHeaderProps {
  /** Título principal */
  title: string;
  
  /** Descrição ou subtítulo */
  description: string;
  
  /** Ícone ou emoji representativo */
  icon: string;
}

/**
 * Cabeçalho de página estilizado
 * 
 * @component
 * @example
 * ```tsx
 * <PageHeader 
 *   title="Título da Página"
 *   description="Descrição detalhada"
 *   icon="🎯"
 * />
 * ```
 */
function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 mb-6">
        <div className="text-3xl">{icon}</div>
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-white/70 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Props para o componente EmptyPosterState
 */
interface EmptyPosterStateProps {
  /** Função para voltar ao gerador de mensagens */
  onSwitchToGenerator: () => void;
}

/**
 * Estado vazio exibido quando não há dados de produto
 * 
 * @component
 * @example
 * ```tsx
 * <EmptyPosterState 
 *   onSwitchToGenerator={handleSwitchToGenerator} 
 * />
 * ```
 */
function EmptyPosterState({ onSwitchToGenerator }: EmptyPosterStateProps) {
  return (
    <div className="glass-effect rounded-2xl p-8 lg:p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-8xl mb-6">📦</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Nenhum produto carregado
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Para criar um poster promocional, primeiro você precisa extrair os dados de um produto do MercadoLivre
        </p>
        <button
          onClick={onSwitchToGenerator}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto"
        >
          <span>🚀</span>
          Ir para Gerador de Mensagens
        </button>
      </div>
    </div>
  );
}


/**
 * Props para o componente ProductInfo
 */
interface ProductInfoProps {
  /** Dados do produto */
  productData: ProductData;
}

/**
 * Exibe informações do produto
 * 
 * @component
 * @example
 * ```tsx
 * <ProductInfo 
 *   productData={productData}
 * />
 * ```
 */
/**
 * Props para o componente InfoCard
 */
interface InfoCardProps {
  /** Valor principal a ser exibido */
  value: string | number;
  
  /** Rótulo descritivo */
  label: string;
  
  /** Cor de destaque do card */
  color: 'blue' | 'yellow' | 'green' | 'purple';
}

/**
 * Componente de card de informação estilizado
 * 
 * @component
 * @example
 * ```tsx
 * <InfoCard 
 *   value="R$ 199,90"
 *   label="Preço"
 *   color="blue"
 * />
 * ```
 */
function InfoCard({ value, label, color }: InfoCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className={`rounded-lg p-3 text-center ${colorClasses[color]}`}>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
}

/**
 * Componente que exibe as informações do produto em um card estilizado
 * 
 * @component
 * @example
 * ```tsx
 * <ProductInfo productData={productData} />
 * ```
 */
function ProductInfo({ productData }: ProductInfoProps) {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <img 
          src={productData.image} 
          alt={productData.name}
          className="w-24 h-24 object-cover rounded-xl shadow-lg mx-auto sm:mx-0"
        />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-gray-800 mb-3">{productData.name}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard 
              value={`R$ ${productData.discountPrice || productData.originalPrice}`}
              label="Preço"
              color="blue"
            />
            <InfoCard 
              value={productData.rating}
              label="⭐ Avaliação"
              color="yellow"
            />
            <InfoCard 
              value={productData.reviews}
              label="Avaliações"
              color="green"
            />
            <InfoCard 
              value={productData.category}
              label="Categoria"
              color="purple"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PosterConfig {
  backgroundColor: string;
  accentColor: string;
  brandName: string;
  slogan: string;
  contactPhone: string;
  showDiscount: boolean;
  posterSize: PosterSizeType;
}

function PosterControls({ 
  posterConfig, 
  setPosterConfig 
}: { 
  posterConfig: PosterConfig;
  setPosterConfig: (config: PosterConfig) => void; 
}) {
  const [activeTab, setActiveTab] = useState<'brand' | 'appearance' | 'sizes'>('brand');
  return (
    <div className="h-full">
      <div className="glass-effect rounded-2xl p-4 lg:p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <span className="text-xl">⚙️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Personalizar</h3>
            <p className="text-gray-600 text-sm">Ajuste as configurações</p>
          </div>
        </div>
        
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-2">
            <button
              onClick={() => setActiveTab('brand')}
              className={`${activeTab === 'brand' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-2 px-2 border-b-2 font-medium text-xs sm:text-sm`}
            >
              🏷️ Info
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`${activeTab === 'appearance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-2 px-2 border-b-2 font-medium text-xs sm:text-sm`}
            >
              🎨 Aparência
            </button>
            <button
              onClick={() => setActiveTab('sizes')}
              className={`${activeTab === 'sizes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-2 px-2 border-b-2 font-medium text-xs sm:text-sm`}
            >
              📏 Tamanhos
            </button>
          </nav>
        </div>

        {activeTab === 'brand' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              🏷️ Informações da Marca
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Nome da Marca
                </label>
                <input
                  type="text"
                  value={posterConfig.brandName}
                  onChange={(e) => setPosterConfig({...posterConfig, brandName: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  placeholder="Ex: Minha Loja Digital"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Telefone de Contato
                </label>
                <input
                  type="text"
                  value={posterConfig.contactPhone}
                  onChange={(e) => setPosterConfig({...posterConfig, contactPhone: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  value={posterConfig.slogan}
                  onChange={(e) => setPosterConfig({...posterConfig, slogan: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  placeholder="Ex: Ofertas Imperdíveis Todos os Dias"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              🎨 Aparência Visual
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Tema de Cores
                </label>
                <select 
                  value={posterConfig.backgroundColor}
                  onChange={(e) => {
                    const bg = e.target.value;
                    const accent = bg.includes('blue') ? 'yellow-300' : 
                                 bg.includes('red') ? 'yellow-400' :
                                 bg.includes('purple') ? 'pink-300' :
                                 bg.includes('green') ? 'lime-300' : 'yellow-300';
                    setPosterConfig({...posterConfig, backgroundColor: bg, accentColor: accent});
                  }}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  <option value="from-blue-600 via-blue-500 to-yellow-400">🔵 MercadoLivre (Azul/Amarelo)</option>
                  <option value="from-red-900 to-red-700">🔴 Clássico Vermelho</option>
                  <option value="from-purple-900 to-purple-700">🟣 Roxo Elegante</option>
                  <option value="from-green-900 to-green-700">🟢 Verde Natureza</option>
                  <option value="from-orange-900 to-orange-700">🟠 Laranja Vibrante</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Cor de Destaque
                </label>
                <select 
                  value={posterConfig.accentColor}
                  onChange={(e) => setPosterConfig({...posterConfig, accentColor: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  <option value="yellow-300">🟡 Amarelo</option>
                  <option value="white">⚪ Branco</option>
                  <option value="pink-300">🩷 Rosa</option>
                  <option value="lime-300">🟢 Verde Limão</option>
                  <option value="cyan-300">🔵 Ciano</option>
                </select>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div>
                  <label className="text-gray-700 font-medium">Mostrar Badge de Desconto</label>
                  <p className="text-sm text-gray-500">Exibe o percentual de economia</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={posterConfig.showDiscount}
                    onChange={(e) => setPosterConfig({...posterConfig, showDiscount: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sizes' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              📏 Tamanhos
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Selecione o tamanho do poster
                </label>
                <select 
                  value={posterConfig.posterSize}
                  onChange={(e) => setPosterConfig({...posterConfig, posterSize: e.target.value as PosterSizeType})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  {(Object.keys(POSTER_SIZES) as PosterSizeType[]).map((size) => (
                    <option key={size} value={size}>
                      {POSTER_SIZES[size].name} ({POSTER_SIZES[size].width}×{POSTER_SIZES[size].height}px)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error('Error in PosterPreview:', error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <h3 className="font-bold">Erro ao renderizar o preview</h3>
          <p>Por favor, tente novamente ou mude o tamanho do poster.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

interface PosterPreviewProps {
  productData: ProductData;
  posterConfig: PosterConfig;
}

function PosterPreview({ 
  productData, 
  posterConfig 
}: PosterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  // Log any potential errors
  useEffect(() => {
    if (!productData) {
      console.error('No product data available');
      return;
    }

    const currentSize = posterConfig?.posterSize;
    if (!currentSize || !POSTER_SIZES[currentSize]) {
      console.error('Invalid poster size:', currentSize);
      return;
    }

    console.log('PosterPreview mounted with config:', {
      posterSize: currentSize,
      sizes: POSTER_SIZES[currentSize],
      productData: true
    });
  }, [posterConfig?.posterSize, productData]);

  // Ajustar escala para caber no container
  useEffect(() => {
    const updateScale = (): void => {
      if (!containerRef.current || !posterConfig?.posterSize) return;
      
      const currentSize = POSTER_SIZES[posterConfig.posterSize];
      if (!currentSize) return;
      
      const containerWidth = containerRef.current.offsetWidth - 64; // 64px de padding
      const targetWidth = currentSize.width;
      const containerHeight = window.innerHeight * 0.7; // 70% da altura da janela
      const targetHeight = currentSize.height;
      
      // Calcular escala baseada na largura e altura
      const widthScale = (containerWidth - 32) / targetWidth; // 32px de margem
      const heightScale = (containerHeight - 32) / targetHeight;
      
      // Usar a menor escala para garantir que o poster caiba na tela
      const newScale = Math.min(1, widthScale, heightScale);
      
      setScale(Math.max(0.3, newScale)); // Limite mínimo de escala
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [posterConfig.posterSize]);
  return (
    <div className="glass-effect rounded-2xl p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-3 rounded-full">
          <span className="text-2xl">👁️</span>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800">Preview do Poster</h3>
          <p className="text-sm md:text-base text-gray-600">Visualize como ficará seu poster promocional</p>
        </div>
      </div>
      
      <ErrorBoundary>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Tamanho: {POSTER_SIZES[posterConfig.posterSize].name} ({POSTER_SIZES[posterConfig.posterSize].width} × {POSTER_SIZES[posterConfig.posterSize].height}px)
          </div>
          <div className="text-sm text-gray-500">
            Zoom: {Math.round(scale * 100)}%
          </div>
        </div>
        
        <div 
          ref={containerRef}
          className="w-full flex justify-center items-center overflow-auto py-4"
          style={{
            minHeight: '400px',
            maxHeight: '70vh',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          <div 
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center',
              width: POSTER_SIZES[posterConfig.posterSize].width,
              height: POSTER_SIZES[posterConfig.posterSize].height,
              minWidth: POSTER_SIZES[posterConfig.posterSize].width,
              minHeight: POSTER_SIZES[posterConfig.posterSize].height,
              transition: 'transform 0.2s ease-in-out',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <ProductPosterWithSave 
              product={productData}
              backgroundColor={posterConfig.backgroundColor}
              accentColor={posterConfig.accentColor}
              brandName={posterConfig.brandName}
              slogan={posterConfig.slogan}
              contactPhone={posterConfig.contactPhone}
              showDiscount={posterConfig.showDiscount}
              width={POSTER_SIZES[posterConfig.posterSize].width}
              height={POSTER_SIZES[posterConfig.posterSize].height}
            />
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Visualização ajustada em {Math.round(scale * 100)}% do tamanho real
        </div>
      </div>
      </ErrorBoundary>
    </div>
  );
}