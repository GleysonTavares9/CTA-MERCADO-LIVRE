import React from 'react';
import { GenerationSettings } from '../types';

interface Props {
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
}

export const AutoSettings: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 mb-5">
      <div className="flex items-center gap-2 font-semibold text-gray-700 mb-4">
        ⚙️ Configurações Automáticas
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-600">Público-Alvo:</label>
          <select 
            value={settings.targetAudience}
            onChange={(e) => onChange({ ...settings, targetAudience: e.target.value as any })}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="auto">🤖 Detectar Automaticamente</option>
            <option value="jovens">👥 Jovens (18-30 anos)</option>
            <option value="adultos">👨‍💼 Adultos (30-50 anos)</option>
            <option value="familia">👨‍👩‍👧‍👦 Famílias</option>
            <option value="tecnologia">💻 Tech Lovers</option>
          </select>
        </div>
        
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-600">Estilo de Mensagem:</label>
          <select 
            value={settings.ctaStyle}
            onChange={(e) => onChange({ ...settings, ctaStyle: e.target.value as any })}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="auto">🎯 Melhor para o Produto</option>
            <option value="urgencia">⏰ Urgência/Escassez</option>
            <option value="beneficios">✨ Foco nos Benefícios</option>
            <option value="social">⭐ Prova Social</option>
            <option value="emocional">❤️ Apelo Emocional</option>
          </select>
        </div>
      </div>
    </div>
  );
};