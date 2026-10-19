import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { Wordmark } from "../../components/Wordmark";
import { clamp, pop, springs } from "../../lib/anim";
import { brand } from "../../theme";
import { useWalkLayout } from "../layout";
import type { WalkthroughProps } from "../schema";
import { bb, wfonts } from "../tokens";

// Timeline (frames, scene-local).
export const DONE_T = {
  hop: 8, // Buddy jumps for joy
  card: 12, // the summary from the page's "Klaar" screen
  row: 22, // rows tick off one by one
  rowStagger: 8,
  happy: 64, // happy eyes (almost closed)
  hop2: 96,
  url: 70,
};

export const DoneScene: React.FC<{ props: WalkthroughProps["done"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useWalkLayout();
  const T = DONE_T;

  const jump = (start: number, h: number) => {
    const t = interpolate(frame, [start, start + 16], [0, 1], clamp);
    return -h * 4 * t * (1 - t);
  };
  const squashAt = (s: number) =>
    interpolate(frame, [s - 4, s, s + 4, s + 16, s + 20, s + 26], [1, 0.84, 1.12, 1, 0.9, 1], clamp);
  const hop = jump(T.hop, 80) + jump(T.hop2, 50);
  const squash = squashAt(T.hop) * squashAt(T.hop2);
  const happy = interpolate(frame, [T.happy, T.happy + 6], [1, 0.2], clamp);
  const card = pop(frame, fps, T.card, springs.smooth);
  const url = pop(frame, fps, T.url, springs.smooth);

  const buddySize = L.tall ? 170 : 190;
  const col = L.tall ? { left: 72, top: 110, width: L.width - 144 } : { left: 150, top: 170, width: 800 };
  const cardBox = L.tall ? { left: 72, top: 860, width: L.width - 144 } : { left: 1010, top: 210, width: 760 };

  return (
    <AbsoluteFill style={{ background: bb.blue, fontFamily: wfonts.body }}>
      <div style={{ position: "absolute", ...col }}>
        <Buddy size={buddySize} blink={happy} squash={squash} style={{ transform: `translateY(${hop}px)` }} />
        <div
          style={{
            marginTop: 46,
            fontFamily: wfonts.heading,
            fontWeight: 600,
            fontSize: L.tall ? 104 : 96,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            color: "#fff",
            whiteSpace: "pre-line",
          }}
        >
          {props.title}
        </div>
        <div style={{ marginTop: 24, fontSize: L.tall ? 40 : 36, lineHeight: 1.35, color: bb.onBlue, whiteSpace: "pre-line" }}>
          {props.lead}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          ...cardBox,
          padding: 18,
          borderRadius: 34,
          background: "#fff",
          boxShadow: "0 30px 80px rgba(0,20,120,.35)",
          opacity: card,
          transform: L.tall ? `translateY(${(1 - card) * 60}px)` : `translateX(${(1 - card) * 80}px)`,
          display: "grid",
          gap: 10,
        }}
      >
        {props.summary.map((s, i) => {
          const at = T.row + i * T.rowStagger;
          const it = pop(frame, fps, at, springs.pop);
          const tick = interpolate(frame, [at + 2, at + 12], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: L.tall ? "24px 24px" : "20px 22px",
                borderRadius: 22,
                background: bb.fieldBg,
                fontSize: L.tall ? 36 : 32,
                fontWeight: 500,
                color: bb.ink,
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: bb.ok,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${it})`,
                }}
              >
                <Checkmark size={26} color="#fff" progress={tick} strokeWidth={15} />
              </div>
              {s}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: L.tall ? 72 : 150,
          bottom: L.tall ? 70 : 90,
          display: "flex",
          alignItems: "baseline",
          gap: 26,
          opacity: url,
          transform: `translateY(${(1 - url) * 14}px)`,
        }}
      >
        <Wordmark size={L.tall ? 60 : 54} betaal={brand.blueSoft} buddy="#fff" />
        <span style={{ fontSize: L.tall ? 32 : 30, color: bb.onBlue }}>{props.url}</span>
      </div>
    </AbsoluteFill>
  );
};
