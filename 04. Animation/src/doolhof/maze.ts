// Deterministic maze + the wandering walk of the "you" dot (concept 126).
export const COLS = 8;
export const ROWS = 6;
export const CELL = 105;

type Cell = { c: number; r: number };
export type Maze = {
  /** east[r][c]: wall on the right of cell (c,r); south[r][c]: wall below it. */
  east: boolean[][];
  south: boolean[][];
  /** Cells visited by an exhaustive depth-first search from the entrance, backtracking included. */
  walk: Cell[];
  /** Indices in walk where the dot reaches a dead end. */
  deadEnds: number[];
};

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const cache = new Map<number, Maze>();

export const buildMaze = (seed: number): Maze => {
  const hit = cache.get(seed);
  if (hit) return hit;
  const rand = rng(seed);
  const east = Array.from({ length: ROWS }, () => Array(COLS).fill(true));
  const south = Array.from({ length: ROWS }, () => Array(COLS).fill(true));
  const seen = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const shuffle = <T,>(a: T[]) => {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  // Recursive backtracker.
  const stack: Cell[] = [{ c: 0, r: 0 }];
  seen[0][0] = true;
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const next = shuffle(DIRS)
      .map(([dc, dr]) => ({ c: cur.c + dc, r: cur.r + dr }))
      .filter((n) => n.c >= 0 && n.r >= 0 && n.c < COLS && n.r < ROWS && !seen[n.r][n.c]);
    if (!next.length) {
      stack.pop();
      continue;
    }
    const n = next[0];
    if (n.c > cur.c) east[cur.r][cur.c] = false;
    if (n.c < cur.c) east[n.r][n.c] = false;
    if (n.r > cur.r) south[cur.r][cur.c] = false;
    if (n.r < cur.r) south[n.r][n.c] = false;
    seen[n.r][n.c] = true;
    stack.push(n);
  }
  const open = (a: Cell, b: Cell) => {
    if (b.c === a.c + 1) return !east[a.r][a.c];
    if (b.c === a.c - 1) return !east[b.r][b.c];
    if (b.r === a.r + 1) return !south[a.r][a.c];
    if (b.r === a.r - 1) return !south[b.r][b.c];
    return false;
  };
  // Wandering search for the exit, recording every step (also going back).
  const walk: Cell[] = [];
  const deadEnds: number[] = [];
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  // No goal: the dot explores the whole maze and never finds the way out.
  const goal = { c: -1, r: -1 };
  const dfs = (cur: Cell): boolean => {
    visited[cur.r][cur.c] = true;
    walk.push(cur);
    if (cur.c === goal.c && cur.r === goal.r) return true;
    const ns = shuffle(DIRS)
      .map(([dc, dr]) => ({ c: cur.c + dc, r: cur.r + dr }))
      .filter((n) => n.c >= 0 && n.r >= 0 && n.c < COLS && n.r < ROWS && !visited[n.r][n.c] && open(cur, n));
    if (!ns.length) deadEnds.push(walk.length - 1);
    for (const n of ns) {
      if (visited[n.r][n.c]) continue;
      if (dfs(n)) return true;
      walk.push(cur);
    }
    return false;
  };
  dfs({ c: 0, r: 0 });
  const m = { east, south, walk, deadEnds };
  cache.set(seed, m);
  return m;
};

export const cellCenter = (c: Cell) => ({ x: c.c * CELL + CELL / 2, y: c.r * CELL + CELL / 2 });
