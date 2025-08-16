# 🚀 Guia de Deploy

## 📋 Pré-requisitos

1. **Node.js 18+** instalado
2. **Chave da API Google Gemini** configurada
3. **Conta** em uma plataforma de deploy

## 🌐 Opções de Deploy

### 1. 🟦 Netlify (Recomendado)

#### Deploy Manual
1. Execute: `npm run build`
2. Acesse [Netlify](https://netlify.com)
3. Arraste a pasta `dist` para o deploy
4. Configure as variáveis de ambiente

#### Deploy Automático
1. Conecte seu repositório GitHub
2. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`
3. Adicione variável de ambiente:
   - `VITE_GEMINI_API_KEY`: sua_chave_aqui

### 2. ▲ Vercel

#### Deploy Automático
1. Conecte seu repositório GitHub no [Vercel](https://vercel.com)
2. Configure automaticamente (detecta Vite)
3. Adicione variável de ambiente:
   - `VITE_GEMINI_API_KEY`: sua_chave_aqui

#### Deploy Manual
```bash
npm install -g vercel
npm run build
vercel --prod
```

### 3. 🐙 GitHub Pages

#### Configuração
1. Vá em **Settings** > **Pages** do seu repositório
2. Selecione **GitHub Actions** como source
3. Adicione secret:
   - `VITE_GEMINI_API_KEY`: sua_chave_aqui
4. Push para branch `main` fará deploy automático

### 4. 🔥 Firebase Hosting

```bash
npm install -g firebase-tools
npm run build
firebase login
firebase init hosting
firebase deploy
```

### 5. 🌊 Surge.sh

```bash
npm install -g surge
npm run build
cd dist
surge
```

## ⚙️ Configuração de Variáveis

### Produção
Todas as plataformas precisam da variável:
```
VITE_GEMINI_API_KEY=sua_chave_da_api_aqui
```

### Desenvolvimento Local
Crie arquivo `.env`:
```env
VITE_GEMINI_API_KEY=sua_chave_da_api_aqui
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint do código
npm run lint
```

## 📊 Otimizações de Build

### Já Configuradas
- ✅ **Minificação** com Terser
- ✅ **Code splitting** automático
- ✅ **Tree shaking** para reduzir tamanho
- ✅ **Compressão** de assets
- ✅ **Cache** otimizado

### Tamanhos Esperados
- **CSS**: ~7KB (gzipped)
- **JS**: ~120KB (gzipped)
- **Total**: ~130KB (muito otimizado!)

## 🚨 Troubleshooting

### Build Falha
1. Verifique Node.js 18+
2. Limpe cache: `npm ci`
3. Verifique variáveis de ambiente

### Deploy Falha
1. Verifique configuração da plataforma
2. Confirme variáveis de ambiente
3. Teste build local primeiro

### Funcionalidades Não Funcionam
1. Verifique chave da API
2. Teste em HTTPS (não HTTP)
3. Verifique console do navegador

## 🎯 Recomendações

### Para Afiliados
- **Netlify**: Melhor para iniciantes
- **Vercel**: Melhor performance
- **GitHub Pages**: Gratuito e simples

### Para Empresas
- **Vercel Pro**: CDN global
- **Netlify Pro**: Funcionalidades avançadas
- **Firebase**: Integração Google

## 📱 Teste Pós-Deploy

1. ✅ **Extração** de produtos funciona
2. ✅ **Geração** de posters funciona
3. ✅ **Download** de imagens funciona
4. ✅ **Compartilhamento** WhatsApp funciona
5. ✅ **Links de afiliado** preservados
6. ✅ **Responsivo** em mobile

## 🔗 URLs de Exemplo

Após deploy, teste estas funcionalidades:
- `/` - Página principal
- Extração de produto do MercadoLivre
- Geração de poster personalizado
- Download de imagem
- Compartilhamento WhatsApp

---

**Deploy realizado com sucesso!** 🎉