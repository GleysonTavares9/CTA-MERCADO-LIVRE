import React from 'react';
import { GenerationSettings } from '../../types';

interface Props {
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
}

export const AutoSettings: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Configurações de Geração
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Provedor</label>
            <select
              value={settings.aiProvider || 'gemini'}
              onChange={(e) => onChange({ ...settings, aiProvider: e.target.value as any })}
              className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="gemini">Gemini</option>
              <option value="local">Template</option>
            </select>
          </div>

          {(!settings.aiProvider || settings.aiProvider === 'gemini') && (
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Modelo</label>
              <select
                value={settings.aiModel || 'gemini-1.5-flash-latest'}
                onChange={(e) => onChange({ ...settings, aiModel: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="gemini-1.5-flash-latest">1.5 Flash</option>
                <option value="gemini-1.5-pro-latest">1.5 Pro</option>
                <option value="gemini-1.0-pro">1.0 Pro</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Público-Alvo</label>
          <select 
            value={settings.targetAudience}
            onChange={(e) => onChange({ ...settings, targetAudience: e.target.value as any })}
            className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="auto">Detecção Automática</option>
            <option value="jovens">Jovens (18-30)</option>
            <option value="adultos">Adultos (30-50)</option>
            <option value="familia">Famílias</option>
            <option value="tecnologia">Tech Lovers</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Estilo da Mensagem</label>
          <select 
            value={settings.ctaStyle}
            onChange={(e) => onChange({ ...settings, ctaStyle: e.target.value as any })}
            className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="auto">Melhor para o Produto</option>
            <option value="urgencia">Urgência/Escassez</option>
            <option value="beneficios">Foco nos Benefícios</option>
            <option value="social">Prova Social</option>
            <option value="emocional">Apelo Emocional</option>
          </select>
        </div>
      </div>
    </div>
  );
};