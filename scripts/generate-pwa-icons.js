#!/usr/bin/env node

/**
 * PWA Icon Generator for RaceReady Multi-Tenant Platform
 * Generates all required PWA icons from a source image
 */

const fs = require('fs');
const path = require('path');

// Required icon sizes for PWA
const ICON_SIZES = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

// Shortcut icons
const SHORTCUT_ICONS = [
  { name: 'shortcut-events.png', size: 96 },
  { name: 'shortcut-news.png', size: 96 },
  { name: 'shortcut-info.png', size: 96 }
];

// Badge and action icons
const MISC_ICONS = [
  { name: 'badge-72x72.png', size: 72 },
  { name: 'action-view.png', size: 24 },
  { name: 'action-dismiss.png', size: 24 },
  { name: 'action-events.png', size: 24 }
];

function generateRacingIcon(size, type = 'main') {
  // Generate SVG for racing-themed icon
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="flag" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background circle -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#bg)" stroke="#ffffff" stroke-width="2"/>
      
      ${type === 'main' ? `
        <!-- Racing flag pattern -->
        <g transform="translate(${size * 0.2}, ${size * 0.3})">
          <!-- Flag pole -->
          <rect x="0" y="0" width="3" height="${size * 0.4}" fill="#ffffff"/>
          
          <!-- Checkered flag -->
          <g transform="translate(3, 0)">
            <rect x="0" y="0" width="${size * 0.3}" height="${size * 0.2}" fill="#ffffff"/>
            <rect x="0" y="0" width="${size * 0.15}" height="${size * 0.1}" fill="#000000"/>
            <rect x="${size * 0.15}" y="${size * 0.1}" width="${size * 0.15}" height="${size * 0.1}" fill="#000000"/>
            <rect x="0" y="${size * 0.1}" width="${size * 0.15}" height="${size * 0.1}" fill="#ffffff"/>
            <rect x="${size * 0.15}" y="0" width="${size * 0.15}" height="${size * 0.1}" fill="#ffffff"/>
          </g>
        </g>
        
        <!-- Racing text -->
        <text x="${size/2}" y="${size * 0.8}" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="${size * 0.08}" font-weight="bold">RACE</text>
      ` : type === 'events' ? `
        <!-- Calendar icon -->
        <rect x="${size * 0.25}" y="${size * 0.3}" width="${size * 0.5}" height="${size * 0.4}" fill="#ffffff" rx="4"/>
        <rect x="${size * 0.3}" y="${size * 0.35}" width="${size * 0.4}" height="${size * 0.05}" fill="#3b82f6"/>
        <circle cx="${size * 0.4}" cy="${size * 0.5}" r="${size * 0.03}" fill="#3b82f6"/>
        <circle cx="${size * 0.6}" cy="${size * 0.5}" r="${size * 0.03}" fill="#3b82f6"/>
        <circle cx="${size * 0.4}" cy="${size * 0.6}" r="${size * 0.03}" fill="#3b82f6"/>
      ` : type === 'news' ? `
        <!-- News icon -->
        <rect x="${size * 0.25}" y="${size * 0.3}" width="${size * 0.5}" height="${size * 0.4}" fill="#ffffff" rx="4"/>
        <rect x="${size * 0.3}" y="${size * 0.4}" width="${size * 0.4}" height="${size * 0.03}" fill="#3b82f6"/>
        <rect x="${size * 0.3}" y="${size * 0.5}" width="${size * 0.3}" height="${size * 0.03}" fill="#3b82f6"/>
        <rect x="${size * 0.3}" y="${size * 0.6}" width="${size * 0.35}" height="${size * 0.03}" fill="#3b82f6"/>
      ` : `
        <!-- Info icon -->
        <circle cx="${size/2}" cy="${size/2}" r="${size * 0.2}" fill="#ffffff"/>
        <text x="${size/2}" y="${size * 0.6}" text-anchor="middle" fill="#3b82f6" font-family="Arial, sans-serif" font-size="${size * 0.25}" font-weight="bold">i</text>
      `}
    </svg>
  `;
  
  return svg;
}

function createIconsDirectory() {
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
    console.log('📁 Created icons directory');
  }
  return iconsDir;
}

function generateIcons() {
  console.log('🏁 Generating PWA icons for RaceReady...');
  
  const iconsDir = createIconsDirectory();
  
  // Generate main app icons
  ICON_SIZES.forEach(({ size, name }) => {
    const svg = generateRacingIcon(size, 'main');
    const filePath = path.join(iconsDir, name);
    fs.writeFileSync(filePath, svg);
    console.log(`✅ Generated ${name} (${size}x${size})`);
  });
  
  // Generate shortcut icons
  SHORTCUT_ICONS.forEach(({ name, size }) => {
    const type = name.includes('events') ? 'events' : 
                 name.includes('news') ? 'news' : 'info';
    const svg = generateRacingIcon(size, type);
    const filePath = path.join(iconsDir, name);
    fs.writeFileSync(filePath, svg);
    console.log(`✅ Generated ${name} (${size}x${size})`);
  });
  
  // Generate misc icons
  MISC_ICONS.forEach(({ name, size }) => {
    const svg = generateRacingIcon(size, 'main');
    const filePath = path.join(iconsDir, name);
    fs.writeFileSync(filePath, svg);
    console.log(`✅ Generated ${name} (${size}x${size})`);
  });
  
  // Generate favicon.ico placeholder
  const faviconSvg = generateRacingIcon(32, 'main');
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.svg'), faviconSvg);
  console.log('✅ Generated favicon.svg');
  
  console.log('🏆 All PWA icons generated successfully!');
  console.log('📝 Note: These are SVG-based placeholders. For production, consider using high-quality PNG icons.');
}

// Run if called directly
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };



