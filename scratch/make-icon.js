const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIcon() {
  const logoPath = path.join(__dirname, '../public/assets/Logo White.svg');
  const outPath = path.join(__dirname, '../public/apple-touch-icon.png');
  
  const logoSvg = fs.readFileSync(logoPath);
  
  // Resize logo to fit inside the 180x180 box with some padding (e.g. 120x120)
  const resizedLogo = await sharp(logoSvg)
    .resize(110, 110, { fit: 'contain', background: {r:0,g:0,b:0,alpha:0} })
    .toBuffer();
  
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: '#052107' // Dark green background
    }
  })
  .composite([
    { input: resizedLogo, gravity: 'center' }
  ])
  .toFile(outPath);
  
  console.log("Apple Touch Icon successfully created at " + outPath);
}

createIcon().catch(console.error);
