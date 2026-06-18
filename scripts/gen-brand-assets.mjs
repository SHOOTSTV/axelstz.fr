// One-off: rasterize the Apex (Concept 01) mark into the brand assets.
// favicon.ico + apple-icon.png from the rounded chip; avatar.png from the flat dark square.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const MARK = `
  <path fill="#ffffff" d="M50 14 L50 49 L31 85 L11 85 Z"/>
  <path fill="#3B82F6" d="M50 14 L50 49 L69 85 L89 85 Z"/>`;

const chip = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#0c0d0e"/>${MARK}
</svg>`;

const avatar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0c0d0e"/>${MARK}
</svg>`;

const png = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

// ICO container wrapping a single PNG entry (Vista+ PNG-in-ICO).
function ico(pngBuf, size) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0); // reserved
  head.writeUInt16LE(1, 2); // type: icon
  head.writeUInt16LE(1, 4); // count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size % 256, 0); // width (0 == 256)
  entry.writeUInt8(size % 256, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuf.length, 8); // size of png data
  entry.writeUInt32LE(22, 12); // offset
  return Buffer.concat([head, entry, pngBuf]);
}

const favPng = await png(chip, 64);
writeFileSync("app/favicon.ico", ico(favPng, 64));
writeFileSync("app/apple-icon.png", await png(chip, 180));
writeFileSync("public/images/avatar.png", await png(avatar, 512));

console.log("brand assets written: favicon.ico, apple-icon.png, avatar.png");
