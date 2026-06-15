import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Use sharp from Next.js' own node_modules to avoid installing it as a dep
const sharpPath = path.resolve(root, "node_modules", "sharp");
const sharp = require(sharpPath);

const targets = [
  "public/images/folio.png",
  "public/images/macrotrackr.png",
  "public/images/floatvision-1.png",
];

for (const rel of targets) {
  const abs = path.resolve(root, rel);
  const before = fs.statSync(abs).size;
  const tmp = abs + ".tmp";

  await sharp(abs)
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
    .toFile(tmp);

  const after = fs.statSync(tmp).size;
  if (after < before) {
    fs.renameSync(tmp, abs);
    console.log(`${rel}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (-${Math.round((1 - after / before) * 100)}%)`);
  } else {
    fs.unlinkSync(tmp);
    console.log(`${rel}: already optimal (${(before / 1024).toFixed(0)} KB), skipped`);
  }
}
