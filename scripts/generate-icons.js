import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sizes = [16, 32, 48, 128];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background - gradient blue
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(1, '#1e40af');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Spider web icon - white
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(1, size / 16);
  ctx.lineCap = 'round';
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  
  // Draw web lines
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius
    );
    ctx.stroke();
  }
  
  // Draw concentric circles
  [0.3, 0.6, 1].forEach(factor => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * factor, 0, Math.PI * 2);
    ctx.stroke();
  });
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), buffer);
  console.log(`Created icon${size}.png`);
});

console.log('All icons created!');
