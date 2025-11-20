# QR Scan Pro - PWA Android

## Estrutura de Diretórios
O projeto deve ser organizado da seguinte forma:
- /index.html
- /manifest.json
- /service-worker.js
- /src/
  - index.tsx
  - App.tsx
  - types.ts
  - constants.ts
  - components/
    - Scanner.tsx

## Passos para Empacotamento (APK)

1. **Deploy HTTPS**: 
   - Suba estes arquivos para um servidor compatível com HTTPS (Vercel, Netlify ou GitHub Pages). PWAs exigem HTTPS para acesso à câmera e Service Workers.

2. **Validação PWA**:
   - Acesse [PWABuilder.com](https://www.pwabuilder.com).
   - Insira a URL do seu deploy.
   - Verifique se o `manifest.json` e o `service-worker.js` foram detectados corretamente e se a pontuação está alta.

3. **Geração do APK**:
   - No PWABuilder, clique em "Package for Stores".
   - Selecione "Android".
   - Baixe o arquivo `.apk` ou o bundle assinado.

## Testes Locais (Android)

1. Conecte seu celular Android via USB com Depuração USB ativada.
2. Use o Chrome DevTools no desktop: `chrome://inspect/#devices`.
3. Configure o Port Forwarding (ex: localhost:3000) se estiver rodando localmente.
4. Abra o Chrome no celular e acesse o localhost.
5. Clique em "Adicionar à tela inicial" para testar a experiência Fullscreen.

## Notas Técnicas
- **Scanner**: Utiliza `BarcodeDetector` API, nativa no Chrome para Android (versões modernas). É a solução mais leve e rápida.
- **Offline**: O Service Worker usa estratégia Cache First/Stale-while-revalidate para garantir funcionamento sem internet após o primeiro acesso.
- **Visual**: Tailwind CSS configurado para Dark Mode automático e responsividade móvel.
