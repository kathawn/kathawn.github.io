/**
 * Mỗi section là một "bố cục" của cùng 24 thẻ (tile) — giống các bảng ERD /
 * thẻ yêu cầu. Cuộn trang = các thẻ tự sắp xếp lại từ hỗn loạn thành hệ thống.
 *
 *  0 hero       — hỗn loạn: ý tưởng, yêu cầu rời rạc
 *  1 highlights — 3 cột xếp chồng (biểu đồ cột trừu tượng)
 *  2 boardverse — sơ đồ ERD 13 thực thể
 *  3 cinema     — vòng 10 sơ đồ UML quanh tấm vé QR
 *  4 toolkit    — 3 swimlane kỹ năng
 *  5 contact    — một khối gọn gàng
 */
import { rig } from "./rig";

export const N = 24;

export type Pose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
  /** mức tô sáng header (0..1) */
  h: number;
};

export const makePose = (): Pose => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 0, h: 0 });

// PRNG cố định để bố cục hỗn loạn giống nhau mỗi lần tải
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const rand = lcg(146);
const CHAOS = Array.from({ length: N }, () => {
  const u = rand() * Math.PI * 2;
  const v = Math.acos(2 * rand() - 1);
  const r = 0.55 + Math.pow(rand(), 0.6) * 0.45;
  return {
    x: Math.cos(u) * Math.sin(v) * 2.7 * r,
    y: Math.cos(v) * 2.2 * r,
    z: Math.sin(u) * Math.sin(v) * 2.4 * r,
    rx: (rand() - 0.5) * 1.8,
    ry: (rand() - 0.5) * 1.8,
    rz: (rand() - 0.5) * 1.2,
    s: 0.78 + rand() * 0.3,
    ph: rand() * Math.PI * 2,
    hl: 0,
  };
});
[3, 11, 17].forEach((i) => (CHAOS[i].hl = 1));

const hidden = (o: Pose) => {
  o.x = 0;
  o.y = 0;
  o.z = -2;
  o.rx = 0;
  o.ry = 0;
  o.rz = 0;
  o.s = 0;
  o.h = 0;
};

// ---------------------------------------------------------------- 0 · hero
function chaos(k: number, t: number, o: Pose) {
  const c = CHAOS[k];
  const w = rig.reduced ? 0 : 1;
  o.x = c.x + Math.sin(t * 0.35 + c.ph) * 0.18 * w;
  o.y = c.y + Math.cos(t * 0.3 + c.ph) * 0.22 * w;
  o.z = c.z;
  o.rx = c.rx + Math.sin(t * 0.2 + c.ph) * 0.25 * w;
  o.ry = c.ry + t * 0.06 * w;
  o.rz = c.rz;
  o.s = c.s;
  o.h = c.hl;
}

// ---------------------------------------------------------- 1 · highlights
// 3 cột thẻ xếp chồng nằm ngang, đỉnh mỗi cột được tô sáng
const COLS = [10, 8, 6];
const colOf: { c: number; r: number }[] = [];
COLS.forEach((n, c) => {
  for (let r = 0; r < n; r++) colOf.push({ c, r });
});
function stacks(k: number, t: number, o: Pose) {
  const { c, r } = colOf[k];
  const n = COLS[c];
  o.x = (c - 1) * 1.55;
  o.y = -2.0 + r * 0.36;
  o.z = 0;
  o.rx = -Math.PI / 2 + 0.42;
  o.ry = 0;
  o.rz = rig.reduced ? 0 : Math.sin(t * 0.6 + r * 0.5 + c) * 0.03;
  o.s = 1;
  o.h = r === n - 1 ? 1 : 0;
}

// ---------------------------------------------------------- 2 · boardverse
// ERD 13 thực thể: hàng 3-4-3-3
const ERD: [number, number, number][] = [
  [-1.4, 2.1, 0.1], [0, 2.1, -0.2], [1.4, 2.1, 0.15],
  [-2.1, 0.7, -0.25], [-0.7, 0.7, 0.2], [0.7, 0.7, -0.1], [2.1, 0.7, 0.2],
  [-1.4, -0.7, 0.15], [0, -0.7, -0.15], [1.4, -0.7, 0.25],
  [-1.4, -2.1, -0.2], [0, -2.1, 0.1], [1.4, -2.1, -0.1],
];
// thực thể được tô sáng theo từng bước trong mục "How it was built"
const STEP_MASKS: number[][] = [
  [4, 5],
  [0, 1, 2, 3, 6],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [7, 8, 9],
  [10, 11, 12],
];
function stepWeight(k: number) {
  let h = 0;
  for (let s = 0; s < STEP_MASKS.length; s++) {
    const w = Math.max(0, 1 - Math.abs(rig.step - s));
    if (w > 0 && STEP_MASKS[s].includes(k)) h += w;
  }
  return Math.min(1, h);
}
function erd(k: number, t: number, o: Pose) {
  if (k >= ERD.length) return hidden(o);
  const [x, y, z] = ERD[k];
  const h = stepWeight(k);
  o.x = x;
  o.y = y + (rig.reduced ? 0 : Math.sin(t * 0.8 + k) * 0.03);
  o.z = z + h * 0.45;
  o.rx = 0;
  o.ry = 0;
  o.rz = 0;
  o.s = 0.82 + h * 0.06;
  o.h = h;
}

// ------------------------------------------------------------- 3 · cinema
const RING = 10;
function ring(k: number, t: number, o: Pose) {
  if (k >= RING) return hidden(o);
  const a = (k / RING) * Math.PI * 2 + (rig.reduced ? 0 : t * 0.12) + Math.PI / 2;
  o.x = Math.cos(a) * 2.25;
  o.y = Math.sin(a) * 2.15;
  o.z = Math.sin(a * 2) * 0.15;
  o.rx = 0;
  o.ry = 0;
  o.rz = 0;
  o.s = 0.6;
  o.h = k % 3 === 0 ? 1 : 0;
}

// ------------------------------------------------------------ 4 · toolkit
const LANES = [7, 3, 4];
export const LANE_X = [-1.65, 0, 1.65];
const laneOf: { l: number; r: number }[] = [];
LANES.forEach((n, l) => {
  for (let r = 0; r < n; r++) laneOf.push({ l, r });
});
function lanes(k: number, t: number, o: Pose) {
  if (k >= laneOf.length) return hidden(o);
  const { l, r } = laneOf[k];
  o.x = LANE_X[l];
  o.y = 2.05 - r * 0.68;
  o.z = 0;
  o.rx = 0;
  o.ry = 0;
  o.rz = 0;
  o.s = 0.56;
  o.h = r === 0 ? 1 : 0;
  if (!rig.reduced) o.x += Math.sin(t * 0.7 + k) * 0.02;
}

// ------------------------------------------------------------ 5 · contact
function block(k: number, t: number, o: Pose) {
  const c = k % 4;
  const r = Math.floor(k / 4) % 3;
  const l = Math.floor(k / 12);
  o.x = (c - 1.5) * 1.06;
  o.y = (r - 1) * 0.74;
  o.z = (l - 0.5) * 0.34;
  o.rx = 0;
  o.ry = 0;
  o.rz = 0;
  o.s = 0.86;
  o.h = k === 17 ? 1 : 0;
  void t;
}

export const LAYOUTS = [chaos, stacks, erd, ring, lanes, block];

/** Cạnh nối (connector) giữa các thẻ cho từng bố cục + độ đậm */
export const EDGES: { pairs: [number, number][]; alpha: number }[] = [
  {
    pairs: [
      [0, 5], [5, 9], [3, 11], [11, 17], [2, 14], [7, 20], [17, 22], [9, 13],
    ],
    alpha: 0.28,
  },
  { pairs: [], alpha: 0 },
  {
    pairs: [
      [0, 1], [1, 2], [0, 3], [0, 4], [1, 5], [2, 6], [3, 4], [4, 5], [5, 6],
      [4, 8], [5, 8], [7, 8], [8, 9], [3, 7], [7, 10], [8, 11], [9, 12], [6, 9],
    ],
    alpha: 0.75,
  },
  {
    pairs: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0],
    ],
    alpha: 0.6,
  },
  {
    pairs: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
      [7, 8], [8, 9],
      [10, 11], [11, 12], [12, 13],
      [1, 7], [9, 11],
    ],
    alpha: 0.7,
  },
  { pairs: [], alpha: 0 },
];

export const MAX_EDGES = Math.max(...EDGES.map((e) => e.pairs.length));

/**
 * Vị trí cụm 3D theo section: side +1 = bên phải chữ, -1 = bên trái, 0 = giữa.
 * rx/ry: góc nghiêng cả cụm; s: tỉ lệ.
 */
export const GROUP = [
  { side: 1, k: 0.31, y: 0, rx: 0.05, ry: -0.25, s: 0.9 },
  { side: 1, k: 0.25, y: -0.1, rx: 0.32, ry: -0.55, s: 1 },
  { side: 1, k: 0.25, y: 0, rx: 0.08, ry: -0.28, s: 0.84 },
  { side: -1, k: 0.25, y: 0, rx: 0.16, ry: 0.3, s: 0.86 },
  { side: 1, k: 0.25, y: 0, rx: 0.06, ry: -0.32, s: 1 },
  { side: 1, k: 0.25, y: 0.1, rx: 0.42, ry: -0.6, s: 1 },
];
