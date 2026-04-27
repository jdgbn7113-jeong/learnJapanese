// house.png에서 흰색 배경을 투명으로 처리해 house-cutout.png로 저장
// - corner-flood-fill 대신 단순 threshold + alpha feather
import fs from 'node:fs';
import { PNG } from 'pngjs';

const SRC = 'C:/Users/USER/Desktop/React_Album/React_Album/React_Album/public/art/house.png';
const DST = 'C:/Users/USER/Desktop/React_Album/React_Album/React_Album/public/art/house-cutout.png';

const buf = fs.readFileSync(SRC);
const png = PNG.sync.read(buf);
const { width, height, data } = png; // RGBA

// 1) flood-fill from 4 corners — only "near-white" pixels reachable from corner are background
const visited = new Uint8Array(width * height);
const stack = [];
const seed = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  stack.push(y * width + x);
};
seed(0, 0); seed(width - 1, 0); seed(0, height - 1); seed(width - 1, height - 1);

const isNearWhite = (i) => {
  const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
  return r >= 235 && g >= 235 && b >= 235;
};

let count = 0;
while (stack.length) {
  const idx = stack.pop();
  if (visited[idx]) continue;
  if (!isNearWhite(idx)) continue;
  visited[idx] = 1;
  count++;
  const x = idx % width, y = (idx / width) | 0;
  if (x > 0) stack.push(idx - 1);
  if (x < width - 1) stack.push(idx + 1);
  if (y > 0) stack.push(idx - width);
  if (y < height - 1) stack.push(idx + width);
}
console.log(`flood-fill reached ${count} px`);

// 2) set those pixels to fully transparent
for (let i = 0; i < width * height; i++) {
  if (visited[i]) {
    data[i * 4 + 3] = 0;
  }
}

// 3) edge feather: pixels adjacent to transparent get alpha softened by white-strength
// (anti-alias the cut)
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = y * width + x;
    if (visited[idx]) continue;
    // check neighbours
    let touchTransparent = false;
    if (x > 0 && visited[idx - 1]) touchTransparent = true;
    else if (x < width - 1 && visited[idx + 1]) touchTransparent = true;
    else if (y > 0 && visited[idx - width]) touchTransparent = true;
    else if (y < height - 1 && visited[idx + width]) touchTransparent = true;
    if (!touchTransparent) continue;
    const r = data[idx * 4], g = data[idx * 4 + 1], b = data[idx * 4 + 2];
    const lightness = (r + g + b) / 3;
    if (lightness > 200) {
      // 200~255 매핑 → alpha 255~0
      const a = Math.max(0, Math.min(255, Math.round(255 - (lightness - 200) * (255 / 55))));
      data[idx * 4 + 3] = a;
    }
  }
}

const out = PNG.sync.write(png);
fs.writeFileSync(DST, out);
console.log('wrote', DST, '(', out.length, 'bytes )');
