# 🤖 Como Configurar a API do Google Gemini

Para que o aplicativo funcione completamente, você precisa configurar a API do Google Gemini.

## 📋 Passo a Passo

### 1. Obter a Chave da API
1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em **"Create API Key"**
4. Copie a chave gerada (algo como: `AIzaSyC...`)

### 2. Configurar no Projeto
1. Abra o arquivo `.env` na raiz do projeto
2. Cole sua chave após o `=`:
```env
VITE_GEMINI_API_KEY=AIzaSyC_sua_chave_aqui
```

### 3. Reiniciar o Servidor
```bash
npm run dev
```

## ✅ Como Testar

1. Cole um link do MercadoLivre
2. Aguarde a extração dos dados
3. Verifique se a mensagem foi gerada pela IA (não pelo template local)

## 🆓 API Gratuita

A API do Gemini tem um plano gratuito generoso:
- 15 requisições por minuto
- 1 milhão de tokens por mês
- Perfeito para uso pessoal e testes

## ❌ Sem API Key

Se não configurar a API, o aplicativo ainda funciona:
- ✅ Extrai dados reais do MercadoLivre
- ✅ Mostra imagens e preços corretos
- ⚠️ Usa templates locais (menos personalizados)

## 🔧 Problemas Comuns

**Erro 403**: Verifique se a chave está correta
**Erro 429**: Muitas requisições, aguarde um minuto
**Chave inválida**: Gere uma nova chave no Google AI Studio