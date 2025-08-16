export interface ProductData {
  name: string;
  originalPrice: number;
  discountPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  affiliateLink?: string;
}

export interface GenerationSettings {
  targetAudience: 'auto' | 'jovens' | 'adultos' | 'familia' | 'tecnologia';
  ctaStyle: 'auto' | 'urgencia' | 'beneficios' | 'social' | 'emocional';
  aiProvider?: 'gemini' | 'local';
  aiModel?: string; // e.g., 'gemini-1.5-flash-latest'
}

export type StatusType = 'info' | 'success' | 'error';

export interface StatusMessage {
  type: StatusType;
  message: string;
}