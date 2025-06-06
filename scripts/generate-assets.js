const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Generate icon (1024x1024)
sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  }
})
.png()
.toFile(path.join(assetsDir, 'icon.png'))
.then(() => console.log('Generated icon.png'))
.catch(err => console.error('Error generating icon:', err));

// Generate adaptive icon (1024x1024)
sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  }
})
.png()
.toFile(path.join(assetsDir, 'adaptive-icon.png'))
.then(() => console.log('Generated adaptive-icon.png'))
.catch(err => console.error('Error generating adaptive-icon:', err));

// Generate splash (2048x2048)
sharp({
  create: {
    width: 2048,
    height: 2048,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  }
})
.png()
.toFile(path.join(assetsDir, 'splash.png'))
.then(() => console.log('Generated splash.png'))
.catch(err => console.error('Error generating splash:', err)); 