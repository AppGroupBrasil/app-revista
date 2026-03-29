import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// --- OG Image 1200x630 PNG ---
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0F1B2D"/>
      <stop offset="100%" style="stop-color:#1E3A5F"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#D4AF37"/>
      <stop offset="100%" style="stop-color:#F0D060"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="580" width="1200" height="50" fill="url(#accent)" opacity="0.15"/>
  <rect x="80" y="160" width="80" height="80" rx="16" fill="url(#accent)"/>
  <text x="120" y="215" font-family="Arial,sans-serif" font-size="40" font-weight="bold" fill="#0F1B2D" text-anchor="middle">AR</text>
  <text x="190" y="210" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="white">APP REVISTA</text>
  <line x1="80" y1="260" x2="600" y2="260" stroke="#D4AF37" stroke-width="2" opacity="0.4"/>
  <text x="80" y="310" font-family="Arial,sans-serif" font-size="32" fill="#D4AF37">Revista Digital do Condomínio</text>
  <text x="80" y="370" font-family="Arial,sans-serif" font-size="22" fill="#8899AA">Comunicação moderna para condomínios.</text>
  <text x="80" y="405" font-family="Arial,sans-serif" font-size="22" fill="#8899AA">Informativos, chamados, classificados e muito mais.</text>
  <rect x="80" y="460" width="260" height="50" rx="25" fill="url(#accent)"/>
  <text x="210" y="492" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="#0F1B2D" text-anchor="middle">Começar Agora</text>
  <text x="80" y="600" font-family="Arial,sans-serif" font-size="16" fill="#556677">apprevista.com.br</text>
</svg>`;

// --- Favicon 32x32 ---
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E3A5F"/>
      <stop offset="100%" style="stop-color:#D4AF37"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="6" fill="url(#bg2)"/>
  <text x="16" y="22" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">AR</text>
</svg>`;

// --- Icon 192x192 ---
const icon192Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E3A5F"/>
      <stop offset="100%" style="stop-color:#D4AF37"/>
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="38" fill="url(#bg3)"/>
  <text x="96" y="120" font-family="Arial,sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">AR</text>
</svg>`;

// --- Icon 512x512 ---
const icon512Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E3A5F"/>
      <stop offset="100%" style="stop-color:#D4AF37"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bg4)"/>
  <text x="256" y="316" font-family="Arial,sans-serif" font-size="210" font-weight="bold" fill="white" text-anchor="middle">AR</text>
</svg>`;

async function generate() {
  // OG image PNG
  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(join(publicDir, 'og-image.png'));
  console.log('✓ og-image.png (1200x630)');

  // Favicon ICO (use 32x32 PNG, rename to .ico - browsers accept PNG inside .ico)
  const faviconPng = await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toBuffer();
  // Generate proper favicon.png and also a 16x16 version
  await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile(join(publicDir, 'favicon.png'));
  console.log('✓ favicon.png (32x32)');

  // Icon 192 PNG
  if (!existsSync(join(publicDir, 'icons'))) mkdirSync(join(publicDir, 'icons'), { recursive: true });
  await sharp(Buffer.from(icon192Svg)).resize(192, 192).png().toFile(join(publicDir, 'icons', 'icon-192.png'));
  console.log('✓ icons/icon-192.png');

  // Icon 512 PNG
  await sharp(Buffer.from(icon512Svg)).resize(512, 512).png().toFile(join(publicDir, 'icons', 'icon-512.png'));
  console.log('✓ icons/icon-512.png');

  // Apple touch icon 180x180
  await sharp(Buffer.from(icon192Svg)).resize(180, 180).png().toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png (180x180)');

  console.log('\nAll images generated!');
}

generate().catch(console.error);
