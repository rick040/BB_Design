import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A generic, flat navigation map (no real map provider, no logos).
// Every scene uses the same street grid in a 960 × 700 coordinate space, so
// the route from scene 1 to 3 feels like one drive.
export const MAP_W = 960;
export const MAP_H = 700;

export type Pt = [number, number];

const ROAD_X = [300, 760];
const ROAD_Y = [110, 330, 560];
const EDGES_X = [0, ...ROAD_X, MAP_W];
const EDGES_Y = [0, ...ROAD_Y, MAP_H];

export const ROAD_W = 46;

// ---------- polyline helpers ----------
const segLen = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

export const polyLen = (pts: Pt[]) => {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += segLen(pts[i - 1], pts[i]);
  return l;
};

/** Point at distance `d` along the polyline (clamped). */
export const pointAtDist = (pts: Pt[], d: number): { x: number; y: number; angle: number } => {
  let rest = Math.max(0, d);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const l = segLen(a, b);
    if (rest <= l || i === pts.length - 1) {
      const t = l === 0 ? 0 : Math.min(1, rest / l);
      return {
        x: a[0] + (b[0] - a[0]) * t,
        y: a[1] + (b[1] - a[1]) * t,
        angle: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI,
      };
    }
    rest -= l;
  }
  const last = pts[pts.length - 1];
  return { x: last[0], y: last[1], angle: 0 };
};

/** Distance along the polyline to vertex `i`. */
export const distToVertex = (pts: Pt[], i: number) => polyLen(pts.slice(0, i + 1));

const pathD = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

// ---------- the map ----------
export type MapMode = "light" | "blue";

export const useMapColors = (mode: MapMode) => {
  const p = usePalette();
  return mode === "light"
    ? { base: "#e6ecf8", block: "#d6dff2", park: "#cdeff1", road: p.white, route: p.blue, label: p.ink }
    : { base: "#0a35e6", block: "#1d4cff", park: "#2a5cff", road: "#4673ff", route: p.white, label: p.white };
};

/** Map card: blocks + roads in SVG; `overlay` (SVG) and `children` (HTML) are drawn on top in map coordinates. */
export const MapCard: React.FC<{
  mode: MapMode;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ mode, overlay, children, style }) => {
  const c = useMapColors(mode);
  const blocks: React.ReactNode[] = [];
  for (let xi = 0; xi < EDGES_X.length - 1; xi++) {
    for (let yi = 0; yi < EDGES_Y.length - 1; yi++) {
      const x0 = EDGES_X[xi] + (xi === 0 ? 0 : ROAD_W / 2 + 14);
      const x1 = EDGES_X[xi + 1] - (xi === EDGES_X.length - 2 ? 0 : ROAD_W / 2 + 14);
      const y0 = EDGES_Y[yi] + (yi === 0 ? 0 : ROAD_W / 2 + 14);
      const y1 = EDGES_Y[yi + 1] - (yi === EDGES_Y.length - 2 ? 0 : ROAD_W / 2 + 14);
      const park = xi === 1 && yi === 2;
      blocks.push(
        <rect
          key={`${xi}-${yi}`}
          x={x0}
          y={y0}
          width={Math.max(0, x1 - x0)}
          height={Math.max(0, y1 - y0)}
          rx={18}
          fill={park ? c.park : c.block}
        />,
      );
    }
  }
  return (
    <div
      style={{
        position: "absolute",
        width: MAP_W,
        height: MAP_H,
        borderRadius: 48,
        overflow: "hidden",
        background: c.base,
        boxShadow: mode === "light" ? "0 24px 70px rgba(1, 30, 140, 0.16)" : "0 24px 70px rgba(0, 10, 80, 0.35)",
        ...style,
      }}
    >
      <svg width={MAP_W} height={MAP_H} style={{ position: "absolute", inset: 0 }}>
        {blocks}
        {ROAD_X.map((x) => (
          <line key={`x${x}`} x1={x} y1={-20} x2={x} y2={MAP_H + 20} stroke={c.road} strokeWidth={ROAD_W} />
        ))}
        {ROAD_Y.map((y) => (
          <line key={`y${y}`} x1={-20} y1={y} x2={MAP_W + 20} y2={y} stroke={c.road} strokeWidth={ROAD_W} />
        ))}
        {overlay}
      </svg>
      {children}
    </div>
  );
};

/** Route line that draws itself (progress 0..1). */
export const RouteLine: React.FC<{
  pts: Pt[];
  progress: number;
  color: string;
  width?: number;
  opacity?: number;
}> = ({ pts, progress, color, width = 24, opacity = 1 }) => {
  if (progress <= 0.005) return null;
  const len = polyLen(pts);
  const drawn = len * Math.min(1, progress);
  return (
    <path
      d={pathD(pts)}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      strokeDasharray={`${drawn} ${len + 10}`}
    />
  );
};

/** Dashed route (dots) that draws itself: uses a mask so the dots stay put. */
export const DottedRoute: React.FC<{
  pts: Pt[];
  progress: number;
  color: string;
  width?: number;
  id: string;
}> = ({ pts, progress, color, width = 22, id }) => {
  if (progress <= 0.005) return null;
  const len = polyLen(pts);
  return (
    <g>
      <mask id={id}>
        <path
          d={pathD(pts)}
          fill="none"
          stroke="#fff"
          strokeWidth={width + 8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${len * Math.min(1, progress)} ${len + 10}`}
        />
      </mask>
      <path
        d={pathD(pts)}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`0.1 ${width * 1.7}`}
        mask={`url(#${id})`}
      />
    </g>
  );
};

/** Map pin (teardrop) with an icon; anchored at its tip (x, y in map coords). */
export const Pin: React.FC<{
  x: number;
  y: number;
  color: string;
  icon: "flag" | "alert" | "check";
  iconColor?: string;
  scale?: number;
  size?: number;
}> = ({ x, y, color, icon, iconColor = "#fff", scale = 1, size = 76 }) => {
  const h = size * 1.3;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - h,
        width: size,
        height: h,
        transform: `scale(${scale})`,
        transformOrigin: "50% 100%",
        filter: "drop-shadow(0 8px 14px rgba(0, 20, 90, 0.28))",
      }}
    >
      <svg width={size} height={h} viewBox="0 0 40 52">
        <path d="M20 51C20 51 3 31 3 19.5A17 17 0 0 1 37 19.5C37 31 20 51 20 51Z" fill={color} />
        {icon === "flag" ? (
          <path d="M14 29V10M14 11h12l-3 4 3 4H14" fill="none" stroke={iconColor} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
        ) : icon === "alert" ? (
          <>
            <path d="M20 10v11" stroke={iconColor} strokeWidth={3.6} strokeLinecap="round" />
            <circle cx={20} cy={27.5} r={2.3} fill={iconColor} />
          </>
        ) : (
          <path d="M12 19.5l5.5 5.5L28.5 14" fill="none" stroke={iconColor} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
};

/** Small rounded label on the map. */
export const MapLabel: React.FC<{
  text: string;
  x: number;
  y: number;
  bg: string;
  color: string;
  anchor?: "center" | "left" | "right";
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, x, y, bg, color, anchor = "center", size = 30, style }) => {
  const tx = anchor === "center" ? "-50%" : anchor === "left" ? "0%" : "-100%";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${tx}, -50%)`,
        padding: `${size * 0.32}px ${size * 0.62}px`,
        borderRadius: 999,
        background: bg,
        color,
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
        boxShadow: "0 8px 22px rgba(0, 20, 90, 0.18)",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Generic navigation position marker (a chevron in a disc), heading in degrees (0 = right). */
export const NavArrow: React.FC<{ x: number; y: number; heading: number; color: string; size?: number }> = ({
  x,
  y,
  heading,
  color,
  size = 78,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: `0 0 0 ${size * 0.22}px ${color}33, 0 8px 18px rgba(0, 20, 90, 0.3)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 40 40" style={{ transform: `rotate(${heading + 90}deg)` }}>
      <path d="M20 4L33 35 20 27 7 35Z" fill={color} strokeLinejoin="round" />
    </svg>
  </div>
);

/** Turn-by-turn banner on top of the map. */
export const NavBanner: React.FC<{
  title: string;
  sub: string;
  bg: string;
  icon: "right" | "reroute" | "check";
  style?: React.CSSProperties;
}> = ({ title, sub, bg, icon, style }) => (
  <div
    style={{
      position: "absolute",
      display: "flex",
      alignItems: "center",
      gap: 28,
      padding: "22px 40px 22px 26px",
      borderRadius: 40,
      background: bg,
      color: "#fff",
      boxShadow: "0 18px 44px rgba(1, 30, 140, 0.25)",
      fontFamily: fonts.display,
      ...style,
    }}
  >
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: 28,
        background: "rgba(255,255,255,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={64} height={64} viewBox="0 0 40 40">
        {icon === "right" ? (
          <path d="M12 36V20a6 6 0 0 1 6-6h13M25 7l7 7-7 7" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        ) : icon === "reroute" ? (
          <path d="M31 20a11 11 0 1 1-4-8.5M28 4v8h-8" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 21l7 7L32 12" fill="none" stroke="#fff" strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ fontFamily: fonts.ui, fontSize: 32, opacity: 0.85, marginTop: 4, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </div>
);

// ---------- the drive (scene 2 and 3) ----------
/** Buddy's planned route to the bill's due date. */
export const ROUTE: Pt[] = [
  [140, 560],
  [300, 560],
  [300, 330],
  [760, 330],
  [760, 215],
];
/** Waypoints: mail 7 days and 2 days before the due date. */
export const STOPS: Pt[] = [
  [300, 430],
  [560, 330],
];
/** Destination pin, just off the road so Buddy can stop next to it. */
export const DEST: Pt = [860, 205];
/** Where the destination label sits (right edge, centre y). */
export const DEST_LABEL: Pt = [940, 52];

/** Waypoint dot. */
export const StopDot: React.FC<{ x: number; y: number; fill: string; ring: string; scale?: number }> = ({
  x,
  y,
  fill,
  ring,
  scale = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - 22,
      top: y - 22,
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: fill,
      border: `9px solid ${ring}`,
      boxSizing: "border-box",
      transform: `scale(${scale})`,
    }}
  />
);
