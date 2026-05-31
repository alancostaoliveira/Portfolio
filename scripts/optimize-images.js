const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..', 'assets', 'images');

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {}
}

async function processFile(filePath, outDir) {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath, ext);
  const outFile = path.join(outDir, base + '.webp');

  try {
    const input = await fs.readFile(filePath);
    await sharp(input).webp({ quality: 80 }).toFile(outFile);
    console.log('Created', outFile);
  } catch (err) {
    console.error('Failed', filePath, err.message);
  }
}

async function walk(dir, cb) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, cb);
    else await cb(full);
  }
}

async function main() {
  const outRoot = path.join(root, 'optimized');
  await ensureDir(outRoot);

  // Projects: resize to 1200px width
  const projectsDir = path.join(root, 'projects');
  const projectsOut = path.join(outRoot, 'projects');
  await ensureDir(projectsOut);
  try {
    await walk(projectsDir, async (file) => {
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.svg'].includes(ext)) return;
      const base = path.basename(file, ext);
      const outFile = path.join(projectsOut, base + '.webp');
      try {
        await sharp(file)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outFile);
        console.log('Project optimized:', outFile);
      } catch (err) {
        console.error('Skip', file, err.message);
      }
    });
  } catch (e) {}

  // Technologies and others: convert to webp (no large resize)
  await walk(root, async (file) => {
    if (file.includes(path.join('assets', 'images', 'optimized'))) return;
    const rel = path.relative(root, file);
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.svg'].includes(ext)) return;

    // Avatar
    if (rel.includes('avatar') || rel.includes('avatar.jpg')) {
      const outDir = path.join(outRoot, path.dirname(rel));
      await ensureDir(outDir);
      const outFile = path.join(outDir, path.basename(file, ext) + '.webp');
      try {
        await sharp(file)
          .resize({ width: 400, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(outFile);
        console.log('Avatar optimized:', outFile);
      } catch (err) {
        console.error('Skip avatar', file, err.message);
      }
      return;
    }

    // Technology logos and others
    if (rel.includes('technologies')) {
      const outDir = path.join(outRoot, 'technologies');
      await ensureDir(outDir);
      const outFile = path.join(outDir, path.basename(file, ext) + '.webp');
      try {
        await sharp(file)
          .resize({ width: 256, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outFile);
        console.log('Tech optimized:', outFile);
      } catch (err) {
        console.error('Skip tech', file, err.message);
      }
      return;
    }
  });

  console.log('\nOptimization complete. Files are in assets/images/optimized');
}

main().catch((err) => console.error(err));
