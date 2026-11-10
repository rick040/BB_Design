import React from "react";
import { Checkmark } from "../../components/Checkmark";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

type Rect = { x: number; y: number; w: number; h: number };

/**
 * A stencil plate with rectangular holes. Only what sits under a hole shows.
 * `lit` (0..1 per hole) clears the hole and ticks its rule label.
 */
export const Stencil: React.FC<{
  w: number;
  h: number;
  holes: Rect[];
  color: string;
  lit?: number[];
  labels?: string[];
  labelX?: number;
  radius?: number;
  pad?: number;
  style?: React.CSSProperties;
}> = ({ w, h, holes, color, lit, labels, labelX = 418, radius = 36, pad = 8, style }) => {
  const p = usePalette();
  const r = radius;
  let d = `M${r} 0H${w - r}Q${w} 0 ${w} ${r}V${h - r}Q${w} ${h} ${w - r} ${h}H${r}Q0 ${h} 0 ${h - r}V${r}Q0 0 ${r} 0Z`;
  for (const o of holes) {
    const x = o.x - pad;
    const y = o.y - pad;
    const hw = o.w + pad * 2;
    const hh = o.h + pad * 2;
    const k = 22;
    d += `M${x + k} ${y}H${x + hw - k}Q${x + hw} ${y} ${x + hw} ${y + k}V${y + hh - k}Q${x + hw} ${y + hh} ${x + hw - k} ${y + hh}H${x + k}Q${x} ${y + hh} ${x} ${y + hh - k}V${y + k}Q${x} ${y} ${x + k} ${y}Z`;
  }
  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      <svg width={w} height={h} style={{ position: "absolute", overflow: "visible" }}>
        <path d={d} fill={color} fillRule="evenodd" />
        {holes.map((o, i) => {
          const l = lit ? lit[i] : 1;
          return (
            <React.Fragment key={i}>
              {/* dimmed until its rule fires */}
              <rect x={o.x - pad} y={o.y - pad} width={o.w + pad * 2} height={o.h + pad * 2} rx={22} fill={color} opacity={0.82 * (1 - Math.min(1, l))} />
              <rect
                x={o.x - pad}
                y={o.y - pad}
                width={o.w + pad * 2}
                height={o.h + pad * 2}
                rx={22}
                fill="none"
                stroke={p.yellow}
                strokeWidth={8}
                opacity={Math.min(1, l)}
              />
            </React.Fragment>
          );
        })}
      </svg>
      {labels
        ? holes.map((o, i) => {
            const l = lit ? lit[i] : 1;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: labelX,
                  top: o.y + o.h / 2 - 34,
                  height: 68,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 32,
                  color: p.white,
                  opacity: 0.45 + 0.55 * Math.min(1, l),
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    border: `4px solid ${l > 0.05 ? p.yellow : "rgba(255,255,255,0.5)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <Checkmark size={34} color={p.yellow} progress={l} strokeWidth={16} />
                </div>
                {labels[i]}
              </div>
            );
          })
        : null}
    </div>
  );
};
