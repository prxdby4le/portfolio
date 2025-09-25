# Fruitygear Studio - Portfolio de Beats & Visualizers

Um portfolio moderno com estética "fruitygear aero" (glassmorphism + neon suave) para apresentação de beats e visualizers.

## 🎨 Design System

- **Estética Fruitygear Aero**: Inspirado em FL Studio e Windows Aero
- **Glassmorphism**: Superfícies translúcidas com blur
- **Neon Suave**: Cores vibrantes (lima, laranja, roxo) com glow
- **Animações Suaves**: Transições spring e microinterações

## 🎵 Funcionalidades

### Aba Beats
- 11 categorias de gêneros musicais
- Player de áudio persistente
- Carrosséis interativos por gênero
- Filtros por tags e busca
- Compartilhamento de faixas

### Aba Visualizers  
- Grid responsivo de vídeos
- Modal fullscreen com navegação
- Suporte para Cloudflare Stream/R2

## 🚀 Como Configurar

### 1. Configurar URLs do Cloudflare

Edite os arquivos de dados para adicionar suas URLs do Cloudflare:

**`src/data/playlists.json`**:
```json
{
  "Boombap": {
    "tracks": [
      {
        "src": "https://SEU-CLOUDFLARE-R2-URL/audio.mp3",
        "cover": "https://SEU-CLOUDFLARE-R2-URL/cover.jpg"
      }
    ]
  }
}
```

**`src/data/visualizers.json`**:
```json
{
  "videos": [
    {
      "src": "https://SEU-CLOUDFLARE-STREAM-URL/video.mp4",
      "thumbnail": "https://SEU-CLOUDFLARE-R2-URL/thumb.jpg"
    }
  ]
}
```

### 2. Desenvolvimento Local

```bash
npm install
npm run dev
```

### 3. Build para Produção

```bash
npm run build
```

## 📁 Estrutura de Dados

### Tracks (Beats)
- `id`: Identificador único
- `title`: Título da faixa  
- `src`: URL do áudio (Cloudflare)
- `cover`: URL da capa (Cloudflare)
- `bpm`: Batidas por minuto
- `key`: Tom musical (opcional)
- `duration`: Duração
- `tags`: Array de tags
- `downloadable`: Boolean para download

### Visualizers
- `id`: Identificador único
- `title`: Título do vídeo
- `src`: URL do vídeo (Cloudflare)
- `thumbnail`: URL da thumbnail
- `duration`: Duração
- `category`: Categoria do visualizer

## 🎹 Categorias de Beats

1. **Boombap** - Beats clássicos com grooves orgânicos
2. **dnb** - Drum and Bass com energia alta
3. **ambient** - Texturas etéreas e atmosferas
4. **drumless** - Faixas sem bateria
5. **hoodtrap** - Trap com vibração de rua
6. **hyper** - Hiperativo e brilhante
7. **other** - Experimentos fora da caixa
8. **pluggnb** - Vibes melódicas
9. **synthwave** - Retro-futurista 80s
10. **trap under** - Trap underground
11. **voltmix** - Misturas eletrizantes

## 🛠 Tecnologias

- React + TypeScript
- Tailwind CSS (Design System customizado)
- Framer Motion (Animações)
- Lucide React (Ícones)
- shadcn/ui (Componentes base)

## 📱 Responsividade

- Mobile-first design
- Carrosséis com swipe/touch
- Player adaptativo
- Grid responsivo para visualizers

## ♿ Acessibilidade

- Navegação completa por teclado
- Foco visível em todos elementos
- Respeito a `prefers-reduced-motion`
- Contraste AA/AAA

## 🔗 Deploy

Pronto para deploy estático em:
- Cloudflare Pages
- Vercel  
- Netlify
- GitHub Pages

## 📄 Licença

MIT