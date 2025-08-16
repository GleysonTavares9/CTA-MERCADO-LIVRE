# 🏗️ Arquitetura do Projeto

## 📁 Estrutura de Pastas

```
src/
├── components/           # Componentes React organizados por categoria
│   ├── debug/           # Componentes de debug e teste
│   │   ├── ApiTester.tsx
│   │   ├── DebugInfo.tsx
│   │   └── index.ts
│   ├── forms/           # Componentes de formulário
│   │   ├── AutoSettings.tsx
│   │   ├── InputSection.tsx
│   │   └── index.ts
│   ├── generators/      # Componentes geradores de conteúdo
│   │   ├── ProductPoster.tsx
│   │   ├── ProductPosterWithSave.tsx
│   │   ├── SocialMediaGenerator.tsx
│   │   └── index.ts
│   ├── layout/          # Componentes de layout
│   │   ├── Header.tsx
│   │   └── index.ts
│   ├── preview/         # Componentes de preview
│   │   ├── OutputSection.tsx
│   │   ├── ProductInfo.tsx
│   │   ├── WhatsAppPreview.tsx
│   │   └── index.ts
│   ├── ui/              # Componentes de interface básicos
│   │   ├── ColorPalette.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── StatusMessage.tsx
│   │   └── index.ts
│   └── index.ts         # Exportações principais
├── config/              # Configurações da aplicação
│   ├── constants.ts     # Constantes globais
│   └── index.ts
├── hooks/               # Custom React Hooks
│   ├── useProductGenerator.ts
│   └── index.ts
├── styles/              # Estilos CSS organizados
│   └── components.css   # Estilos dos componentes
├── types/               # Definições de tipos TypeScript
│   └── index.ts
├── utils/               # Utilitários e helpers
│   ├── canvasPolyfill.ts
│   ├── geminiAI.ts
│   ├── mercadoLivreParser.ts
│   └── index.ts
├── App.tsx              # Componente principal
├── index.css            # Estilos globais
├── main.tsx             # Ponto de entrada
└── vite-env.d.ts        # Tipos do Vite
```

## 🧩 Componentes

### 📱 Layout
- **Header**: Cabeçalho da aplicação com branding

### 📝 Forms
- **InputSection**: Entrada de links do MercadoLivre
- **AutoSettings**: Configurações automáticas de geração

### 🎨 Generators
- **ProductPoster**: Gerador de poster promocional
- **ProductPosterWithSave**: Poster com funcionalidades de save
- **SocialMediaGenerator**: Gerador de posts para redes sociais

### 👁️ Preview
- **OutputSection**: Exibição da mensagem gerada
- **ProductInfo**: Informações do produto extraído
- **WhatsAppPreview**: Preview no estilo WhatsApp

### 🎯 UI
- **LoadingSpinner**: Indicador de carregamento
- **StatusMessage**: Mensagens de status
- **ColorPalette**: Paleta de cores

### 🔧 Debug
- **ApiTester**: Testador de APIs
- **DebugInfo**: Informações de debug

## 🔧 Utilitários

### 🤖 AI Integration
- **GeminiAI**: Integração com Google Gemini para geração de mensagens

### 🛒 MercadoLivre
- **MercadoLivreParser**: Parser para extrair dados de produtos

### 🎨 Canvas
- **canvasPolyfill**: Polyfill para funcionalidades de canvas

## 🎣 Hooks

### 📦 Product Generation
- **useProductGenerator**: Hook principal para geração de produtos

## ⚙️ Configuração

### 🔧 Constants
- Configurações da API
- Formatos de poster
- Cores do tema
- Configurações gerais

## 📱 Responsividade

O projeto utiliza Tailwind CSS com classes responsivas:
- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: Layout flexível com CSS Grid e Flexbox

## 🚀 Performance

### Otimizações Implementadas:
- **Code Splitting**: Componentes organizados em módulos
- **Lazy Loading**: Carregamento sob demanda
- **Memoization**: React.memo para componentes pesados
- **Bundle Optimization**: Vite para build otimizado

## 🔒 Segurança

### Medidas de Segurança:
- **CORS Handling**: Proxies para contornar CORS
- **API Key Protection**: Variáveis de ambiente
- **Input Validation**: Validação de URLs
- **XSS Prevention**: Sanitização de dados

## 📊 Monitoramento

### Debug e Logs:
- Console logs estruturados
- Componentes de debug
- Tratamento de erros
- Status messages

## 🎯 Padrões de Código

### Convenções:
- **TypeScript**: Tipagem forte
- **ESLint**: Linting automático
- **Prettier**: Formatação consistente
- **Conventional Commits**: Commits padronizados

## 🔄 Fluxo de Dados

```
User Input → InputSection → useProductGenerator → MercadoLivreParser → GeminiAI → OutputSection → Generators
```

1. **Input**: Usuário cola link do MercadoLivre
2. **Validation**: Validação do link
3. **Extraction**: Extração de dados do produto
4. **AI Generation**: Geração de mensagem com IA
5. **Output**: Exibição dos resultados
6. **Generation**: Criação de posters e posts