import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneBg } from "../../components/Stage";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { useHeroLayout } from "../layout";
import type { HeroVslProps } from "../schema";

// Three USPs on blue, one row at a time, then they stay so you can read them.
export const USP_T = {
  first: 6, // first row fades in
  stagger: 9, // next rows
  len: 12, // fade length per row
};

type Icon = HeroVslProps["usps"][number]["icon"];

const UspIcon: React.FC<{ icon: Icon; size: number; color: string }> = ({ icon, size, color }) => {
  const stroke = { fill: "none", stroke: color, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (icon === "mail") {
    // envelope
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <rect x="4" y="7.5" width="24" height="17" rx="3.5" {...stroke} />
        <path d="M5.5 9.5l10.5 8 10.5-8" {...stroke} />
      </svg>
    );
  }
  if (icon === "privacy") {
    // lock
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <rect x="7" y="14" width="18" height="13" rx="3.5" {...stroke} />
        <path d="M11 14v-3.5a5 5 0 0 1 10 0V14" {...stroke} />
        <circle cx="16" cy="20.5" r="1.8" fill={color} />
      </svg>
    );
  }
  // sparkle (the usual "AI" symbol) with a slash through it
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path d="M15 6.5c.9 5 2.6 6.7 7.5 7.5-4.9.8-6.6 2.5-7.5 7.5-.9-5-2.6-6.7-7.5-7.5 4.9-.8 6.6-2.5 7.5-7.5z" {...stroke} />
      <path d="M23 21.5c.4 1.9 1 2.6 3 3-2 .4-2.6 1-3 3-.4-2-1-2.6-3-3 2-.4 2.6-1.1 3-3z" fill={color} />
      <path d="M5.5 26.5l21-21" {...stroke} strokeWidth={3.4} />
    </svg>
  );
};

export const UspScene: React.FC<{ usps: HeroVslProps["usps"] }> = ({ usps }) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const L = useHeroLayout();

  const textSize = L.wide ? 84 : 62;
  const circle = L.wide ? 128 : 100;

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: L.wide ? 46 : 40 }}>
          {usps.map((u, i) => {
            const at = USP_T.first + i * USP_T.stagger;
            const t = interpolate(frame, [at, at + USP_T.len], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: L.wide ? 34 : 26,
                  opacity: t,
                  transform: `translateX(${(1 - t) * -40}px)`,
                }}
              >
                <div
                  style={{
                    width: circle,
                    height: circle,
                    borderRadius: "50%",
                    background: p.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <UspIcon icon={u.icon} size={circle * 0.54} color={p.blue} />
                </div>
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontWeight: 500,
                    fontSize: textSize,
                    letterSpacing: headlineTracking,
                    lineHeight: 1,
                    color: p.white,
                    whiteSpace: "nowrap",
                    paddingBottom: 6,
                  }}
                >
                  {u.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneBg>
  );
};
