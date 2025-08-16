// Application Constants
export const APP_CONFIG = {
  name: 'MercadoLivre Poster Generator',
  version: '1.0.0',
  description: 'Gerador profissional de posters promocionais para produtos do MercadoLivre',
  author: 'Kiro AI Assistant',
  repository: 'https://github.com/user/mercadolivre-poster-generator'
};

export const API_CONFIG = {
  gemini: {
    // Base de modelos; o endpoint completo será `${baseUrl}/{model}:generateContent`
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    defaultModel: 'gemini-1.5-flash-latest',
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || ''
  },
  mercadoLivre: {
    baseUrl: 'https://api.mercadolibre.com',
    corsProxies: [
      'https://api.allorigins.win/get?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://corsproxy.io/?'
    ]
  }
};

export const POSTER_FORMATS = {
  'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
  'instagram-post': { width: 1080, height: 1080, name: 'Instagram Post' },
  'facebook-post': { width: 1200, height: 630, name: 'Facebook Post' },
  'twitter-post': { width: 1200, height: 675, name: 'Twitter Post' },
  'promotional-poster': { width: 1200, height: 800, name: 'Poster Promocional' }
} as const;

export const THEME_COLORS = {
  mercadoLivre: 'from-blue-600 via-blue-500 to-yellow-400',
  red: 'from-red-900 to-red-700',
  purple: 'from-purple-900 to-purple-700',
  green: 'from-green-900 to-green-700',
  orange: 'from-orange-900 to-orange-700'
} as const;