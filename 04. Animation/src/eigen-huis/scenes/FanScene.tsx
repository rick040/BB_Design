import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { SENDER_H, SENDER_W, SenderCard } from "../components/SenderCard";
import type { EigenHuisProps } from "../schema";

// Timeline (frames, scene-local).
export const FAN_T = {
  split: 4, // the contract splits into seven cards that fan out
  splitStagger: 4,
  splitLen: 16,
  chips: 26, // each card's date chip pops (yellow)
  chipStagger: 3,
};

/** Grid slots: two columns, the last odd card centred. */
export const fanSlots = (n: number) => {
  const gapX = 30;
  const x0 = (1080 - (2 * SENDER_W + gapX)) / 2;
  return Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const lastOdd = n % 2 === 1 && i === n - 1;
    return {
      x: lastOdd ? (1080 - SENDER_W) / 2 : x0 + col * (SENDER_W + gapX),
      y: 40 + row * (SENDER_H + 50),
      r: i % 2 ? 2 : -2,
    };
  });
};

export const FanScene: React.FC<{ props: EigenHuisProps["fan"]; bills: EigenHuisProps["bills"] }> = ({
  props,
  bills,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const slots = fanSlots(bills.length);
  const center = { x: 540 - SENDER_W / 2, y: 380 };

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={2} stagger={3} />
      <Stage>
        {bills.map((b, i) => {
          const at = FAN_T.split + i * FAN_T.splitStagger;
          const u = interpolate(frame, [at, at + FAN_T.splitLen], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.back(1.2)),
          });
          const s = slots[i];
          const x = center.x + (s.x - center.x) * u;
          const y = center.y + (s.y - center.y) * u;
          const chip = pop(frame, fps, FAN_T.chips + i * FAN_T.chipStagger, springs.bouncy);
          return (
            <SenderCard
              key={i}
              sender={b.sender}
              dateLabel={b.dateLabel}
              chip={frame >= FAN_T.chips + i * FAN_T.chipStagger ? chip : 0}
              style={{
                position: "absolute",
                left: x,
                top: y,
                zIndex: bills.length - i,
                opacity: interpolate(u, [0, 0.15], [0, 1], clamp),
                transform: `rotate(${s.r * u + (1 - u) * (i - 3) * 6}deg) scale(${0.8 + 0.2 * u})`,
              }}
            />
          );
        })}
      </Stage>
    </SceneBg>
  );
};
