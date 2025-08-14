import { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { WhatsAppPreview } from './components/WhatsAppPreview';
import { ApiTester } from './components/ApiTester';
import { SocialMediaGenerator } from './components/SocialMediaGenerator';
import { ProductPosterWithSave } from './components/ProductPosterWithSave';
import { ProductData } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'poster'>('generator');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  
  // Estados para personalização do poster
  const [posterConfig, setPosterConfig] = useState({
    backgroundColor: 'from-blue-600 via-blue-500 to-yellow-400',
    accentColor: 'yellow-300',
    brandName: 'MercadoLivre',
    slogan: 'Oferta Exclusiva & Imperdível',
    contactPhone: '(11) 99999-9999',
    showDiscount: true
  });

  const handleProductGenerated = (message: string, data: ProductData, loading: boolean, loadingMsg: string) => {
    setGeneratedMessage(message);
    setProductData(data);
    setIsLoading(loading);
    setLoadingText(loadingMsg);
  };

  return (
    <div className="min-h-screen bg-ml-gradient relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <Header />

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex space-x-1">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${activeTab === 'generator'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/10'
                }`}
            >
              Gerador de Mensagens
            </button>
            <button
              onClick={() => setActiveTab('poster')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${activeTab === 'poster'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/10'
                }`}
            >
              Poster de Produtos
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'generator' ? (
          <>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="animate-slideUp">
                <InputSection onProductGenerated={handleProductGenerated} />
              </div>
              <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <OutputSection
                  generatedMessage={generatedMessage}
                  isLoading={isLoading}
                  loadingText={loadingText}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <WhatsAppPreview
                  productData={productData}
                  message={generatedMessage.split('\n\nhttps://')[0] || ''}
                />
              </div>
              <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <SocialMediaGenerator
                  productData={productData}
                  message={generatedMessage.split('\n\nhttps://')[0] || ''}
                />
              </div>
            </div>

            <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <ApiTester />
            </div>
          </>
        ) : (
          <div className="animate-slideUp">
            <div className="max-w-6xl mx-auto">
              <div className="glass-effect rounded-2xl p-8 shadow-ml mb-8">
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                  🎨 Poster Promocional de Produtos
                </h2>
                
                {!productData ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-white/80 text-lg mb-4">
                      Nenhum produto carregado ainda
                    </p>
                    <p className="text-white/60 mb-6">
                      Vá para "Gerador de Mensagens" e extraia um produto do MercadoLivre primeiro
                    </p>
                    <button
                      onClick={() => setActiveTab('generator')}
                      className="bg-ml-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Ir para Gerador
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Controles do poster */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Personalizar Poster</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Nome da Marca
                          </label>
                          <input
                            type="text"
                            value={posterConfig.brandName}
                            onChange={(e) => setPosterConfig({...posterConfig, brandName: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-ml-blue"
                            placeholder="Ex: Minha Loja"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Telefone de Contato
                          </label>
                          <input
                            type="text"
                            value={posterConfig.contactPhone}
                            onChange={(e) => setPosterConfig({...posterConfig, contactPhone: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-ml-blue"
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Slogan
                        </label>
                        <input
                          type="text"
                          value={posterConfig.slogan}
                          onChange={(e) => setPosterConfig({...posterConfig, slogan: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-ml-blue"
                          placeholder="Ex: Ofertas Imperdíveis Todos os Dias"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-ml-blue bg-white"
                          >
                            <option value="from-blue-600 via-blue-500 to-yellow-400">MercadoLivre (Azul/Amarelo)</option>
                            <option value="from-red-900 to-red-700">Clássico Vermelho</option>
                            <option value="from-purple-900 to-purple-700">Roxo Elegante</option>
                            <option value="from-green-900 to-green-700">Verde Natureza</option>
                            <option value="from-orange-900 to-orange-700">Laranja Vibrante</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Cor de Destaque
                          </label>
                          <select 
                            value={posterConfig.accentColor}
                            onChange={(e) => setPosterConfig({...posterConfig, accentColor: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-ml-blue bg-white"
                          >
                            <option value="yellow-300">Amarelo</option>
                            <option value="white">Branco</option>
                            <option value="pink-300">Rosa</option>
                            <option value="lime-300">Verde Limão</option>
                            <option value="cyan-300">Ciano</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center text-white/80">
                            <input 
                              type="checkbox" 
                              checked={posterConfig.showDiscount}
                              onChange={(e) => setPosterConfig({...posterConfig, showDiscount: e.target.checked})}
                              className="mr-2" 
                            />
                            Mostrar desconto
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Poster preview */}
                    <div className="flex justify-center">
                      <ProductPosterWithSave 
                        product={productData}
                        backgroundColor={posterConfig.backgroundColor}
                        accentColor={posterConfig.accentColor}
                        brandName={posterConfig.brandName}
                        slogan={posterConfig.slogan}
                        contactPhone={posterConfig.contactPhone}
                        showDiscount={posterConfig.showDiscount}
                      />
                    </div>



                    {/* Informações do produto */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Produto Atual</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <img 
                            src={productData.image} 
                            alt={productData.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <div className="text-white/80 space-y-2">
                          <h4 className="text-lg font-semibold text-white">{productData.name}</h4>
                          <p><strong>Categoria:</strong> {productData.category}</p>
                          <p><strong>Preço Original:</strong> R$ {productData.originalPrice}</p>
                          {productData.discountPrice && (
                            <p><strong>Preço com Desconto:</strong> R$ {productData.discountPrice}</p>
                          )}
                          <p><strong>Avaliação:</strong> {productData.rating} ⭐ ({productData.reviews} avaliações)</p>
                          <p className="text-sm">{productData.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;