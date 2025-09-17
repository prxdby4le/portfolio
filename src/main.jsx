import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Garante que não quebre caso o elemento ainda não exista
function mount() {
  const container = document.getElementById('react-root');
  if (!container) return;
  const root = createRoot(container);
  root.render(<App />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
