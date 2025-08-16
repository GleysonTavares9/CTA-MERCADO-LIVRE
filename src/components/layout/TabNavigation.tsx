interface TabNavigationProps {
  activeTab: 'generator' | 'poster';
  onTabChange: (tab: 'generator' | 'poster') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex justify-center mb-8">
      <div
        className="bg-white/10 backdrop-blur-sm rounded-xl p-1 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 w-full max-w-md sm:max-w-lg"
        role="tablist"
        aria-label="Navegação de páginas"
      >
        <button
          onClick={() => onTabChange('generator')}
          role="tab"
          aria-selected={activeTab === 'generator'}
          className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 ${
            activeTab === 'generator'
              ? 'bg-white text-blue-700 shadow-lg transform scale-105'
              : 'text-white/95 hover:bg-white/10 hover:scale-102'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            📱 <span>Gerador de Mensagens</span>
          </span>
        </button>
        <button
          onClick={() => onTabChange('poster')}
          role="tab"
          aria-selected={activeTab === 'poster'}
          className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 ${
            activeTab === 'poster'
              ? 'bg-white text-blue-700 shadow-lg transform scale-105'
              : 'text-white/95 hover:bg-white/10 hover:scale-102'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            🎨 <span>Poster de Produtos</span>
          </span>
        </button>
      </div>
    </div>
  );
}