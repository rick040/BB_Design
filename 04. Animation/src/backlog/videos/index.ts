import type { Entry } from "./helpers";
import { P1 } from "./p1-herkenning";
import { P2 } from "./p2-zo-werkt-het";
import { P3 } from "./p3-privacy";
import { P4 } from "./p4-geld";
import { P5 } from "./p5-mythes";
import { P6 } from "./p6-humor";

export { PILLARS, type Entry, type PillarKey } from "./helpers";

/** The whole backlog, in topic order (1–34). */
export const VIDEOS: Entry[] = [...P1, ...P2, ...P3, ...P4, ...P5, ...P6];
