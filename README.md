# 🚀 Gerador de CTA para MercadoLivre

Aplicativo que integra com o Google Gemini para gerar automaticamente CTAs (Call to Action) personalizados para produtos do MercadoLivre, otimizados para WhatsApp.

## ✨ Funcionalidades

- **Extração Automática**: Cole qualquer link do MercadoLivre e extraia dados do produto automaticamente
- **IA Integrada**: Usa Google Gemini para gerar mensagens persuasivas e personalizadas
- **Preview WhatsApp**: Visualize como ficará a mensagem no WhatsApp antes de enviar
- **Múltiplas Estratégias**: Detecta automaticamente o melhor público-alvo e estilo de CTA
- **Cópia Rápida**: Copie a mensagem com um clique ou envie diretamente para o WhatsApp

## 🛠️ Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar API do Gemini
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Clique em "Create API Key"
3. Copie a chave gerada
4. Crie um arquivo `.env` na raiz do projeto:
```env
VITE_GEMINI_API_KEY=sua_chave_api_aqui
```

### 3. Executar o Projeto
```bash
npm run dev
```

## 📱 Como Usar

1. **Cole o Link**: Insira qualquer URL de produto do MercadoLivre
2. **Aguarde a Extração**: O sistema extrai automaticamente:
   - Nome do produto
   - Preços (original e com desconto)
   - Imagem principal
   - Avaliações e reviews
   - Categoria do produto

3. **Geração Automática**: A IA gera uma mensagem personalizada baseada em:
   - Público-alvo detectado
   - Estilo de CTA mais eficaz
   - Dados específicos do produto

4. **Preview e Envio**: Visualize no formato WhatsApp e envie com um clique

## 🎯 Tipos de CTA Suportados

- **Urgência**: Para produtos com grandes descontos
- **Prova Social**: Para produtos bem avaliados
- **Benefícios**: Para produtos tecnológicos
- **Emocional**: Para outros tipos de produtos

## 🌍 Países Suportados

O aplicativo funciona com links do MercadoLivre de todos os países:
- 🇧🇷 Brasil (.com.br)
- 🇦🇷 Argentina (.com.ar)
- 🇲🇽 México (.com.mx)
- 🇨🇴 Colômbia (.com.co)
- 🇨🇱 Chile (.cl)
- 🇵🇪 Peru (.com.pe)
- E outros países da América Latina

## 🔧 Tecnologias Utilizadas

- **React 18** + **TypeScript**
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Google Gemini AI** para geração de conteúdo
- **API do MercadoLivre** para extração de dados
- **CORS Proxies** para contornar limitações de CORS

## 📝 Estrutura do Projeto

```
src/
├── components/          # Componentes React
├── hooks/              # Hooks personalizados
├── types/              # Definições TypeScript
├── utils/              # Utilitários e parsers
│   ├── geminiAI.ts     # Integração com Gemini
│   └── mercadoLivreParser.ts  # Parser do MercadoLivre
└── App.tsx             # Componente principal
```

## 🚀 Deploy

Para fazer deploy do projeto:

```bash
npm run build
npm run preview
```

Os arquivos de build estarão na pasta `dist/`.

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.