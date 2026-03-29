import https from 'https';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imgDir = join(__dirname, '..', 'public', 'images', 'demo');

if (!existsSync(imgDir)) mkdirSync(imgDir, { recursive: true });

const images = [
  { name: 'obras-1.jpg', url: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&h=400&fit=crop' },
  { name: 'obras-2.jpg', url: 'https://images.unsplash.com/photo-1564429238904-bf58fbd7b28f?w=600&h=400&fit=crop' },
  { name: 'predio.jpg', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop' },
  { name: 'eventos.jpg', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop' },
  { name: 'sustentabilidade.jpg', url: 'https://images.unsplash.com/photo-1518173946687-a243b0be2f3e?w=600&h=400&fit=crop' },
  { name: 'academia-1.jpg', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop' },
  { name: 'academia-2.jpg', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=400&fit=crop' },
  { name: 'escritorio.jpg', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop' },
  { name: 'semana.jpg', url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop' },
  { name: 'sindico.jpg', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop' },
  { name: 'benfeitoria-1.jpg', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop' },
  { name: 'benfeitoria-2.jpg', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop' },
  { name: 'hall-antes.jpg', url: 'https://images.unsplash.com/photo-1562259920-0c0d0bb3f4e1?w=400' },
  { name: 'hall-depois.jpg', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
  { name: 'reparo.jpg', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400' },
  { name: 'jardim.jpg', url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
  { name: 'piscina.jpg', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400' },
  { name: 'playground.jpg', url: 'https://images.unsplash.com/photo-1564429238961-bf8efe201079?w=400' },
];

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    const request = (targetUrl) => {
      https.get(targetUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(res.headers.location);
          return;
        }
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          writeFileSync(filePath, Buffer.concat(chunks));
          resolve();
        });
        res.on('error', reject);
      }).on('error', reject);
    };
    request(url);
  });
}

async function main() {
  for (const img of images) {
    const dest = join(imgDir, img.name);
    if (existsSync(dest)) {
      console.log(`⏭ ${img.name} (já existe)`);
      continue;
    }
    try {
      await download(img.url, dest);
      console.log(`✓ ${img.name}`);
    } catch (e) {
      console.error(`✗ ${img.name}: ${e.message}`);
    }
  }
  console.log('\nDone!');
}

main();
