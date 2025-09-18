#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(process.cwd(), 'assets', 'images');
const TARGET_QUALITY = 70;

async function ensureWebp(srcPath) {
  const ext = path.extname(srcPath).toLowerCase();
  const base = path.basename(srcPath, path.extname(srcPath));
  const dest = path.join(IMAGES_DIR, base + '.webp');
  if (fs.existsSync(dest)) {
    return { skipped: true, dest };
  }
  try {
    const buf = await sharp(srcPath)
      .rotate()
      .webp({ quality: TARGET_QUALITY })
      .toBuffer();
    fs.writeFileSync(dest, buf);
    return { skipped: false, dest, size: buf.length };
  } catch (e) {
    console.error('Failed converting', srcPath, e.message);
    return { error: true };
  }
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('Images dir not found:', IMAGES_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(IMAGES_DIR).filter(f => !f.endsWith('.webp'));
  let totalSaved = 0;
  for (const file of files) {
    const full = path.join(IMAGES_DIR, file);
    const stat = fs.statSync(full);
    if (!stat.isFile()) continue;
    const res = await ensureWebp(full);
    if (res.error) continue;
    if (!res.skipped && res.size) {
      totalSaved += Math.max(0, stat.size - res.size);
      console.log(`Converted: ${file} -> ${path.basename(res.dest)} (${(stat.size/1024).toFixed(1)}KB -> ${(res.size/1024).toFixed(1)}KB)`);
    } else if (res.skipped) {
      console.log('Skipped existing:', file);
    }
  }
  console.log('Approx total potential saved (original vs webp):', (totalSaved/1024).toFixed(1), 'KB');
}

main();
