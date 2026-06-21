const sharp = require('sharp');
const path = require('path');

async function generate() {
  const logoDark = path.join(__dirname, 'public/assets/Logo Dark.svg');
  const logoWhite = path.join(__dirname, 'public/assets/Logo White.svg');

  // favicon-16x16
  await sharp(logoDark)
    .resize(16, 16)
    .toFile(path.join(__dirname, 'public/favicon-16x16.png'));

  // favicon-32x32
  await sharp(logoDark)
    .resize(32, 32)
    .toFile(path.join(__dirname, 'public/favicon-32x32.png'));

  // apple-touch-icon (180x180) - white logo on dark green background #052107
  await sharp(logoWhite)
    .resize(120, 120, { fit: 'contain', background: { r: 5, g: 33, b: 7, alpha: 0 } })
    .extend({
      top: 30, bottom: 30, left: 30, right: 30,
      background: { r: 5, g: 33, b: 7, alpha: 1 }
    })
    .flatten({ background: { r: 5, g: 33, b: 7 } })
    .toFile(path.join(__dirname, 'public/apple-touch-icon.png'));
    
  console.log('Icons generated successfully.');
}

generate().catch(console.error);
