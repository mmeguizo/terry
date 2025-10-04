const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Map domains to their SITE_SLUG values
const SITE_CONFIG = {
  'studio.raceready.com.au': 'studio',
  'raceready.com.au': 'raceready',
  'motorrace.com.au': 'mra',
  'supertt.com.au': 'supertt',
  'clubmanchampionship.com.au': 'clubman',
  'mx5cup.com.au': 'mx5cup',
  'extremett.com.au': 'extremett',
  'raceofficial.com.au': 'raceofficial',
  'sydney300.com.au': 'sydney300',
  'wakefield300.com.au': 'wakefield300',
  'classicsportscars.com.au': 'classicsportscars',
  'amrc.com.au': 'amrc',
  'aprabathurstchallenge.com': 'aprabathurst',
  'iprabathurstchallenge.com': 'iprabathurst',
  'tc2.au': 'tc2',
  'mx5nationals.com.au': 'mx5nationals',
  'raceevents.com.au': 'raceevents',
  'rallysprint.com.au': 'rallysprint'
};

const ROOT_DIR = __dirname;
const APPS_LINUX_DIR = path.join(ROOT_DIR, 'apps-linux');

// Files and directories to copy to each site
const COPY_ITEMS = [
  'src',
  'public',
  'package.json',
  'package-lock.json',
  'next.config.mjs',
  'jsconfig.json',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'middleware.js',
  'middleware.ts',
  '.gitignore'
];

function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(item => {
      copyRecursive(path.join(src, item), path.join(dest, item));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function deploySite(domain, siteSlug) {
  const targetDir = path.join(APPS_LINUX_DIR, domain);

  console.log(`\n📦 Deploying ${domain} (slug: ${siteSlug})...`);

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`  ✓ Created directory: ${targetDir}`);
  }

  // Copy each item
  COPY_ITEMS.forEach(item => {
    const srcPath = path.join(ROOT_DIR, item);
    const destPath = path.join(targetDir, item);

    if (!fs.existsSync(srcPath)) {
      console.log(`  ⚠ Skipping ${item} (not found)`);
      return;
    }

    try {
      // Remove existing if it exists
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
      }

      // Copy
      copyRecursive(srcPath, destPath);
      console.log(`  ✓ Copied ${item}`);
    } catch (error) {
      console.error(`  ✗ Error copying ${item}:`, error.message);
    }
  });

  // Create/update .env file
  const envContent = `STRAPI_URL=https://studio.raceready.com.au
STRAPI_API_TOKEN=c51e98c82d85938543ccb1e4341b9d5904e46a8bfb216825a1fc0741d390fe5af455a9ee145481e1805eaf8562a82d9032964fd71123aef90cf8dc4f96f77e3eb893897cbbae4bdcfea60a39164c47e50456343e868f64ce3c53ed25afde387b9c9a70b723a30b561b52833954d6c6f6bc46c7eceaa0837b1dc2410f33a78257
SITE_SLUG=${siteSlug}
`;

  fs.writeFileSync(path.join(targetDir, '.env'), envContent);
  console.log(`  ✓ Created .env with SITE_SLUG=${siteSlug}`);

  console.log(`  ✅ ${domain} deployment complete!`);
}

// Main execution
console.log('🚀 Starting deployment to apps-linux directories...\n');
console.log(`Found ${Object.keys(SITE_CONFIG).length} sites to deploy`);

Object.entries(SITE_CONFIG).forEach(([domain, siteSlug]) => {
  try {
    deploySite(domain, siteSlug);
  } catch (error) {
    console.error(`❌ Failed to deploy ${domain}:`, error.message);
  }
});

console.log('\n✨ Deployment complete!');
console.log('\nNext steps:');
console.log('1. Upload apps-linux folder to your EC2 /apps directory');
console.log('2. Run: cd /apps/scripts && ./manage.sh start all');
console.log('3. Verify: ./manage.sh verify all');
