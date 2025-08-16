import { useState } from 'react';
import { Header, TabNavigation, BackgroundDecorations, GeneratorPage, PosterPage } from './components';
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
    showDiscount: true,
    posterSize: 'instagram-story' as const
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
      <BackgroundDecorations />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <Header />

        {/* Navigation Tabs */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Content based on active tab */}
        {activeTab === 'generator' ? (
          <GeneratorPage
            generatedMessage={generatedMessage}
            productData={productData}
            isLoading={isLoading}
            loadingText={loadingText}
            onProductGenerated={handleProductGenerated}
          />
        ) : (
          <PosterPage
            productData={productData}
            posterConfig={posterConfig}
            setPosterConfig={setPosterConfig}
            onSwitchToGenerator={() => setActiveTab('generator')}
          />
        )}
      </div>
    </div>
  );
}

export default App;