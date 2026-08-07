import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = path.resolve('Assets', 'Optimized-150');
const outBase = path.resolve('public', 'assets', 'webp');

const desktopDir = path.join(outBase, 'desktop');
const tabletDir = path.join(outBase, 'tablet');
const mobileDir = path.join(outBase, 'mobile');

[outBase, desktopDir, tabletDir, mobileDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function convertAll() {
  console.log('Starting conversion of 150 frames to WebP multi-resolution tiers...');
  
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.png')).sort();
  let totalOrigBytes = 0;
  let totalWebpDesktopBytes = 0;
  let totalWebpTabletBytes = 0;
  let totalWebpMobileBytes = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcPath = path.join(srcDir, file);
    const origStat = fs.statSync(srcPath);
    totalOrigBytes += origStat.size;

    const baseName = file.replace('.png', '.webp');
    const outDesktop = path.join(desktopDir, baseName);
    const outTablet = path.join(tabletDir, baseName);
    const outMobile = path.join(mobileDir, baseName);

    // Desktop: 1920px max width, WebP Q85
    await sharp(srcPath)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toFile(outDesktop);
    totalWebpDesktopBytes += fs.statSync(outDesktop).size;

    // Tablet: 1280px max width, WebP Q80
    await sharp(srcPath)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toFile(outTablet);
    totalWebpTabletBytes += fs.statSync(outTablet).size;

    // Mobile: 768px max width, WebP Q75
    await sharp(srcPath)
      .resize({ width: 768, withoutEnlargement: true })
      .webp({ quality: 75, effort: 4 })
      .toFile(outMobile);
    totalWebpMobileBytes += fs.statSync(outMobile).size;

    // First frame preview thumbnail (< 20 KB)
    if (i === 0) {
      const previewPath = path.join(outBase, 'frame-001-preview.webp');
      await sharp(srcPath)
        .resize({ width: 480, withoutEnlargement: true })
        .webp({ quality: 55, effort: 4 })
        .toFile(previewPath);
      console.log(`Generated ultra-fast preview poster: ${previewPath} (${(fs.statSync(previewPath).size / 1024).toFixed(1)} KB)`);
    }

    if ((i + 1) % 25 === 0 || i === files.length - 1) {
      console.log(`Processed ${i + 1}/${files.length} frames...`);
    }
  }

  const report = {
    totalOriginalPngMB: (totalOrigBytes / (1024 * 1024)).toFixed(2) + ' MB',
    totalWebpDesktopMB: (totalWebpDesktopBytes / (1024 * 1024)).toFixed(2) + ' MB',
    totalWebpTabletMB: (totalWebpTabletBytes / (1024 * 1024)).toFixed(2) + ' MB',
    totalWebpMobileMB: (totalWebpMobileBytes / (1024 * 1024)).toFixed(2) + ' MB',
    desktopReductionPercent: ((1 - totalWebpDesktopBytes / totalOrigBytes) * 100).toFixed(1) + '%',
    mobileReductionPercent: ((1 - totalWebpMobileBytes / totalOrigBytes) * 100).toFixed(1) + '%',
    avgFrameDesktopKB: (totalWebpDesktopBytes / (files.length * 1024)).toFixed(1) + ' KB',
    avgFrameMobileKB: (totalWebpMobileBytes / (files.length * 1024)).toFixed(1) + ' KB',
  };

  console.log('\n=== COMPRESSION PERFORMANCE REPORT ===');
  console.log(JSON.stringify(report, null, 2));

  fs.writeFileSync('webp-compression-report.json', JSON.stringify(report, null, 2));
}

convertAll().catch(console.error);
