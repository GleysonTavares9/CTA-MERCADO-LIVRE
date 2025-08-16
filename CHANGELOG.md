# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2024-12-19

### ✨ Adicionado
- **Suporte Completo a Links de Afiliados**: Aceita todos os tipos de links do MercadoLivre
  - Links diretos (`/p/MLB123`, `MLB-123456789`)
  - Links de afiliados (`/sec/`, `/aff/`, `/ref/`, `/track/`)
  - Links encurtados (`/s/`, `/share/`, `/go/`)
  - Parâmetros UTM (`?utm_source=`, `?utm_campaign=`)
  - Parâmetros de afiliados (`?ref=`, `?aff=`, `?affiliate=`)
- **Resolução Automática de Links**: Links problemáticos são resolvidos automaticamente
- **Preservação de Links Originais**: Links de afiliados são mantidos intactos
- **Interface Mobile-First**: Totalmente responsiva para qualquer celular
- **Validação Inteligente**: Rejeita perfis e aceita apenas produtos válidos

### 🔄 Alterado
- **Validação de URLs**: Expandida para aceitar 15+ tipos de links de afiliados
- **Mensagens de Ajuda**: Atualizadas com exemplos de links de afiliados
- **Interface Responsiva**: Otimizada para telas pequenas (320px+)
- **Navegação Mobile**: Tabs verticais em dispositivos móveis
- **Formulários**: Inputs maiores e mais fáceis de usar no mobile

### 🛠️ Técnico
- **Parser Aprimorado**: Múltiplas estratégias de resolução de links
- **Breakpoints Responsivos**: sm (640px), md (768px), lg (1024px)
- **Grid System**: Layout flexível com CSS Grid e Flexbox
- **Performance Mobile**: Componentes otimizados para touch

## [1.0.0] - 2024-12-19

### ✨ Adicionado
- **Gerador de Mensagens com IA**: Integração com Google Gemini para geração automática de mensagens promocionais
- **Gerador de Posters**: Criação de posters profissionais para produtos do MercadoLivre
- **Gerador de Posts para Redes Sociais**: Posts otimizados para Instagram, Facebook, Twitter
- **Preview WhatsApp**: Visualização em tempo real no estilo WhatsApp
- **Múltiplos Formatos**: Instagram Story, Post, Facebook, Twitter, Poster Promocional
- **Extração Automática**: Dados do produto extraídos automaticamente do MercadoLivre
- **Interface Responsiva**: Otimizada para desktop, tablet e mobile
- **Compartilhamento Direto**: Integração com WhatsApp para compartilhamento
- **Download de Imagens**: Export em alta qualidade (PNG)

### 🛠️ Técnico
- **React 18 + TypeScript**: Base sólida e tipada
- **Tailwind CSS**: Estilização moderna e responsiva  
- **Vite**: Build tool rápido e otimizado
- **html2canvas**: Geração de imagens de alta qualidade
- **Arquitetura Modular**: Componentes organizados por categoria
- **Custom Hooks**: Lógica reutilizável e testável
- **Error Handling**: Tratamento robusto de erros
- **CORS Handling**: Múltiplas estratégias para contornar CORS

### 🎨 Design
- **Visual MercadoLivre**: Cores e branding oficial
- **Animações Suaves**: Transições e micro-interações
- **Glass Morphism**: Efeitos modernos de vidro
- **Mobile First**: Design otimizado para mobile
- **Acessibilidade**: Componentes acessíveis por padrão

### 🚀 Performance
- **Code Splitting**: Carregamento otimizado
- **Lazy Loading**: Componentes sob demanda
- **Bundle Optimization**: Build otimizado para produção
- **Image Optimization**: Geração eficiente de imagens

### 📱 Compatibilidade
- **Navegadores Modernos**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos Móveis**: iOS Safari, Chrome Mobile, Samsung Internet
- **Tablets**: iPad, Android tablets
- **Desktop**: Windows, macOS, Linux

### 🔧 Configuração
- **Variáveis de Ambiente**: Configuração via .env
- **Deploy Automático**: GitHub Actions para CI/CD
- **Múltiplas Plataformas**: Netlify, Vercel, GitHub Pages
- **Documentação Completa**: README, ARCHITECTURE, DEPLOY

### 🔒 Segurança
- **API Key Protection**: Chaves protegidas via variáveis de ambiente
- **Input Validation**: Validação rigorosa de URLs
- **XSS Prevention**: Sanitização de dados de entrada
- **HTTPS Only**: Comunicação segura com APIs

### 📊 Monitoramento
- **Console Logs**: Logs estruturados para debug
- **Error Tracking**: Captura e tratamento de erros
- **Performance Metrics**: Métricas de performance
- **User Feedback**: Sistema de feedback integrado

## [Próximas Versões]

### 🔮 Planejado para v1.1.0
- [ ] **Temas Personalizados**: Mais opções de cores e layouts
- [ ] **Batch Processing**: Processamento de múltiplos produtos
- [ ] **Templates Salvos**: Salvar e reutilizar templates
- [ ] **Analytics**: Métricas de uso e conversão
- [ ] **API Pública**: API para integração com outras ferramentas

### 🔮 Planejado para v1.2.0
- [ ] **Editor Visual**: Editor drag-and-drop para posters
- [ ] **Mais Formatos**: LinkedIn, Pinterest, TikTok
- [ ] **Integração Direta**: Publicação direta nas redes sociais
- [ ] **Colaboração**: Compartilhamento de templates entre usuários
- [ ] **White Label**: Versão personalizável para agências

---

## 📋 Tipos de Mudanças
- **✨ Adicionado** para novas funcionalidades
- **🔄 Alterado** para mudanças em funcionalidades existentes  
- **❌ Removido** para funcionalidades removidas
- **🐛 Corrigido** para correções de bugs
- **🔒 Segurança** para vulnerabilidades corrigidas
- **🛠️ Técnico** para mudanças técnicas internas