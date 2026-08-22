# Como colocar este PWA no ar — passo a passo

Este pacote já é um app funcional (menu + assistente com chat e voz).
Falta só: (1) publicar num endereço web grátis e (2) ligar o backend de IA.

## Passo 1 — Publicar de graça (5 minutos)
Escolha uma dessas opções gratuitas (todas aceitam esses arquivos exatamente como estão):

- **Netlify** (mais simples): crie conta grátis em netlify.com → arraste a pasta
  inteira "pwa-saude" na área de deploy → pronto, já gera um link público.
- **Vercel**: mesma lógica, vercel.com → import → arrastar pasta.
- **GitHub Pages**: suba os arquivos num repositório GitHub grátis → ative Pages
  nas configurações do repositório.

Qualquer uma dessas te dá um link tipo `https://seu-app.netlify.app`.

## Passo 2 — Testar a instalação no celular
1. Abra o link publicado no navegador do celular (Chrome no Android, Safari no iPhone).
2. Android: vai aparecer um aviso "Adicionar à tela inicial" (ou use o menu ⋮).
3. iPhone: toque em Compartilhar → "Adicionar à Tela de Início".
4. Um ícone do app aparece na tela, abrindo em tela cheia, sem barra de navegador.

## Passo 3 — Ligar o backend de verdade
Agora o chat responde com uma mensagem simulada (protótipo). Para funcionar de verdade:
1. Monte o fluxo no n8n (como já conversamos): recebe a mensagem → chama a IA
   com o prompt que já montamos → consulta Google Sheets (agenda/plantão) → responde.
2. Copie a URL do webhook do n8n.
3. Abra o arquivo `app.js` e troque a linha:
   ```
   const API_URL = "https://SEU-N8N-AQUI.exemplo.com/webhook/assistente-saude";
   ```
   pela URL real.
4. Descomente o bloco `fetch(API_URL...)` dentro da função `sendMessage` e
   apague o bloco de "Resposta simulada".

## Passo 4 — Depois, empacotar para as lojas (opcional)
Quando quiser publicar na Play Store/App Store:
- **Android**: use o **Bubblewrap** (ferramenta gratuita do Google) apontando
  para o link publicado — gera o pacote pronto pra Play Store.
- **iOS**: use o **PWABuilder** (pwabuilder.com, gratuito) — ele orienta o
  empacotamento pra App Store (lembrando da taxa anual de US$99 da Apple).

## O que já vem pronto neste pacote
- Menu com os 8 serviços que definimos (consulta, exame, transporte,
  endereços, plantão, ouvidoria, protocolo, avaliação).
- Botão de emergência que liga direto pro 192.
- Assistente flutuante com chat por texto E por voz (usando reconhecimento
  de voz nativo do navegador, gratuito).
- Camada de detecção de emergência no texto, antes de qualquer resposta da IA.
- Ícones e manifesto já configurados para instalação como app.
- Aviso de LGPD visível na tela inicial e no assistente.

## Página de tabelas de teste

A cópia de teste inclui a página `/todas-as-opcoes/`, que carrega seis tabelas a partir de `dados/tabelas.json`. Os dados foram estruturados a partir dos PDFs enviados e são destinados somente à validação da interface. A página tem seletor de tabela, pesquisa textual e tabela responsiva.

Esta cópia não usa Google Sheets, não usa `GOOGLE_SHEET_ID` e não altera a Function `assistant` da V1. Para a publicação de teste, mantenha os PDFs originais fora do pacote público e publique somente o JSON necessário à página.

## O que falta você decidir/fazer
- Cores e nome definitivos (troque em `style.css` e `manifest.json` se quiser
  outra identidade visual).
- Ligar o backend real (n8n + IA + Google Sheets) — passo 3 acima.
- Definir quem atualiza a escala de plantão todo dia (combinado antes).
