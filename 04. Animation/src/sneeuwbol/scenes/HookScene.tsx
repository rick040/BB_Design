import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BillSlip, SnowGlobe } from "../components/SnowGlobe";
import type { SneeuwbolProps } from "../schema";
import { wordAt } from "../vo";

// Beats (scene-local frames) hang on spoken words: "weg", "aanmaning", "ligt".
export const hookBeats = (start: number) => ({
  drift: wordAt("rekening") - start, // bill starts to drift off in the swirl
  gone: wordAt("weg") - start + 10, // bill has vanished in the flakes
  slam: wordAt("aanmaning") - start, // reminder slams onto the stage
  chip: wordAt("ligt") - start, // "Kan uitlopen op €40"
});

const R = 340;
const GLOBE_X = 540 - R;
const GLOBE_Y = 0;

export const HookScene: React.FC<{
  props: SneeuwbolProps["hook"];
  bill: SneeuwbolProps["bill"];
  start: number;
}> = ({ props, bill, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const B = hookBeats(start);

  const swirl = 1.2 + frame * 0.055;

  // The one bill orbits inside the glass, then drifts off and vanishes.
  const orbitA = -0.9 + frame * 0.045;
  const out = interpolate(frame, [B.drift, B.gone], [0, 1], clamp);
  const ring = R * (0.3 + out * 0.5);
  const slipX = R + Math.cos(orbitA) * ring;
  const slipY = R * 0.95 + Math.sin(orbitA) * ring * 0.7;
  const slipScale = 1 - out * 0.8;
  const slipOpacity = interpolate(out, [0.55, 1], [1, 0], clamp);
  const SLIP_W = 280;

  const slam = pop(frame, fps, B.slam, { damping: 12, stiffness: 190 });
  const s = shake(frame, B.slam + 3, 16, 16);
  const chip = pop(frame, fps, B.chip, springs.bouncy);
  const k = 0.8;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-20} stagger={3} />

      <Stage offsetY={70}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)` }}>
          <SnowGlobe
            r={R}
            swirl={swirl}
            spread={1}
            flakes={44}
            childrenOnTop
            water="#e9eeff"
            glass={p.blueSoft}
            base={p.blue}
            slip={p.white}
            slipLine={p.blueSoft}
            style={{ position: "absolute", left: GLOBE_X, top: GLOBE_Y }}
          >
            <BillSlip
              w={SLIP_W}
              label={bill.shortSender}
              amount={bill.amount}
              header={p.blue}
              ink={p.ink}
              style={{
                position: "absolute",
                left: slipX - SLIP_W / 2,
                top: slipY - SLIP_W * 0.33,
                opacity: slipOpacity,
                transform: `rotate(${Math.sin(frame / 9) * 14 + out * 160}deg) scale(${slipScale})`,
              }}
            />
          </SnowGlobe>

          {/* The reminder that lands instead */}
          <div
            style={{
              position: "absolute",
              left: 540 - (BILL_W * k) / 2,
              top: 560,
              width: BILL_W * k,
              height: BILL_H * k,
              opacity: frame >= B.slam ? Math.min(1, slam * 3) : 0,
              transform: `translateY(${(1 - slam) * -220}px) scale(${1.5 - 0.5 * slam}) rotate(${(1 - slam) * -6 + 2}deg)`,
            }}
          >
            <BillCard
              sender={bill.sender}
              subject={props.reminderSubject}
              amount={bill.amount}
              dueLabel={props.reminderDue}
              urgent
              stamp={props.reminderStamp}
              stampIn={pop(frame, fps, B.slam + 5, springs.pop)}
              style={{ transform: `scale(${k})`, transformOrigin: "0 0" }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 560 + BILL_H * k + 26,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "16px 36px",
                borderRadius: 999,
                background: p.red,
                color: "#fff",
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 40,
                opacity: frame >= B.chip ? Math.min(1, chip * 2) : 0,
                transform: `scale(${0.6 + 0.4 * chip})`,
              }}
            >
              {props.costChip}
            </div>
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
