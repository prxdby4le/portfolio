// Copy dist/index.html to dist/404.html so GitHub Pages serves the SPA shell on 404s
// This is safe even if public/404.html exists; the built SPA should be the fallback.
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const fallbackPath = path.join(distDir, '404.html');

try {
  if (!fs.existsSync(indexPath)) {
    console.error('copy404: dist/index.html not found. Did the build run?');
    process.exit(1);
  }
  const html = fs.readFileSync(indexPath, 'utf8');
  fs.writeFileSync(fallbackPath, html, 'utf8');
  console.log('copy404: Wrote dist/404.html from dist/index.html');
} catch (err) {
  console.error('copy404 error:', err);
  process.exit(1);
}
