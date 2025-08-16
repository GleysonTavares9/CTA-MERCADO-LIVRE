# 🚀 Gerador de CTA para MercadoLivre

Aplicativo que gera automaticamente mensagens de Call to Action (CTA) personalizadas para produtos do MercadoLivre, otimizadas para WhatsApp e integradas com IA.

## 🎯 O que faz?

✅ **Extrai dados reais** de qualquer link do MercadoLivre (incluindo links de afiliado)  
✅ **Gera CTAs personalizados** usando Inteligência Artificial (Google Gemini)  
✅ **Preview no WhatsApp** para ver como ficará a mensagem  
✅ **Copia com 1 clique** ou envia direto para o WhatsApp  

## 🚀 Como usar (Windows)

### 1️⃣ Primeira vez (Instalação)
```
🖱️ Clique duplo em: instalar.bat
```

### 2️⃣ Iniciar o aplicativo
```
🖱️ Clique duplo em: iniciar.bat
```

### 3️⃣ Usar o aplicativo
1. **Cole seu link de afiliado** do MercadoLivre
2. **Aguarde** a extração automática dos dados
3. **Copie** a mensagem gerada
4. **Cole no WhatsApp** e envie!

## 🔧 Configuração da IA (Opcional)

Para mensagens mais personalizadas:

1. Acesse: https://makersuite.google.com/app/apikey
2. Gere uma chave da API do Google Gemini (gratuita)
3. Abra o arquivo `.env`
4. Cole sua chave após o `=`

**Sem configurar:** Funciona com templates locais  
**Com configuração:** Mensagens únicas geradas por IA

## 📱 Exemplo de Uso

**Link de entrada:**
```
https://mercadolivre.com/sec/28TFwez
```

**Mensagem gerada:**
```
🔥 OFERTA IMPERDÍVEL! 25% OFF

Liquidificador Pratic Turbo III Mondial 550W

💰 DE R$ 199,90
⚡ POR APENAS R$ 149,90
💸 VOCÊ ECONOMIZA R$ 50,00!

✅ Motor potente 550W
✅ 3 velocidades + Pulsar
✅ Copo de vidro resistente
⭐ 4.5/5 estrelas (847+ avaliações)

⏰ ÚLTIMAS UNIDADES DISPONÍVEIS!
🚚 FRETE GRÁTIS para todo Brasil

👆 CLIQUE AGORA E GARANTE O SEU!
```

## 📂 Arquivos do Projeto

- `iniciar.bat` - Inicia o aplicativo (principal)
- `instalar.bat` - Instala dependências (primeira vez)
- `start.bat` - Início rápido (sem verificações)
- `.env` - Configuração da API do Gemini

## 🌐 Acesso

Após iniciar, acesse: **http://localhost:5173**

## ❓ Problemas Comuns

**"Node.js não encontrado"**
- Instale em: https://nodejs.org

**"Erro ao instalar dependências"**
- Execute `instalar.bat` como administrador
- Verifique sua conexão com a internet

**"API do Gemini não funciona"**
- Verifique se a chave está correta no arquivo `.env`
- O app funciona sem a API (com templates locais)

## 🆓 Totalmente Gratuito

- ✅ Aplicativo gratuito e open source
- ✅ API do MercadoLivre gratuita
- ✅ API do Gemini tem plano gratuito generoso
- ✅ Sem limites de uso local

---

**💡 Dica:** Deixe o `iniciar.bat` na área de trabalho para acesso rápido!