# Portfolio + React (Vite)

Este projeto originalmente era HTML/CSS/JS puro. Agora suporta React usando Vite sem quebrar o código legado.

## Estrutura adicionada
- `package.json` com React 18 e Vite
- `src/App.jsx` componente raiz de exemplo
- `src/main.jsx` monta `<App />` em `#react-root`
- Div `#react-root` adicionada ao final de `index.html`
- `.gitignore` para `node_modules` e `dist`

## Scripts
```
npm run dev      # inicia Vite em modo desenvolvimento (porta padrão 5173)
npm run build    # build de produção em dist/
npm run preview  # serve o build para teste
```

## Instalando dependências
Se PowerShell bloquear (ExecutionPolicy), execute como Administrador:
```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Depois:
```
npm install
npm run dev
```
Abra http://localhost:5173/

## Integrando gradualmente
Você pode migrar seções do site para React aos poucos:
1. Criar componentes em `src/components/`.
2. Manipular apenas o DOM dentro da árvore React; manter código legacy funcionando.
3. Para compartilhar dados entre legacy e React, use eventos customizados (`window.dispatchEvent(new CustomEvent('nome', {detail: ...}))`).

## Deploy (GitHub Pages / Static)
Execute `npm run build`. Os arquivos estáticos ficam em `dist/`. Publique o conteúdo de `dist` no branch ou serviço de hospedagem.

## Próximos Passos Sugeridos
- Converter player de áudio para componente React.
- Adicionar TypeScript (`npm i -D typescript @types/react @types/react-dom`).
- Configurar ESLint/Prettier.

Boa migração! ✨
