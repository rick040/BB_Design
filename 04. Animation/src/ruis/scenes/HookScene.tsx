import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BillCard, BILL_H, BILL_W } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { MailRow, ROW_W } from "../components/MailRow";
import { Noise } from "../components/Noise";
import { Radio, screenSize } from "../components/Radio";
import type { RuisProps } from "../schema";

// Timeline (frames, scene-local = global, the scene starts at frame 0).
// Spoken: "energierekening" 47-71, "zoek" 74-84, "aanmaning" 100-118.
export const HOOK_T = {
  lose: 50, // the energy bill starts to dissolve into the static
  loseLen: 34,
  slam: 100, // "Aanmaning" card slams out of the static
  stamp: 104,
  chip: 112, // "Kan uitlopen op €40"
};

const RADIO_H = 900;
const RADIO_X = (1080 - 960) / 2;
const SCREEN = screenSize(RADIO_H);
const ROW_X = (SCREEN.w - ROW_W) / 2;
const ROWS_Y = [24, 199, 374, 549];
const ROWS_R = [-2, 1.5, -1, 2];

export const HookScene: React.FC<{ props: RuisProps["hook"]; bill: RuisProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const lose = interpolate(frame, [HOOK_T.lose, HOOK_T.lose + HOOK_T.loseLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const slam = pop(frame, fps, HOOK_T.slam, { damping: 14, stiffness: 260, mass: 0.7 });
  const stampIn = pop(frame, fps, HOOK_T.stamp, springs.pop);
  const chip = pop(frame, fps, HOOK_T.chip, springs.bouncy);
  const s = shake(frame, HOOK_T.slam + 3, 16, 14);
  // The needle keeps hunting for a station.
  const needle = 0.45 + Math.sin(frame / 7) * 0.18 + Math.sin(frame / 2.3) * 0.04;
  const noise = 0.45 + lose * 0.4;

  // Order: three noise mails with the bill in slot 2.
  const rows = [
    { ...props.noiseMails[0], bill: false },
    { ...props.noiseMails[1], bill: false },
    { from: bill.sender, subject: bill.subject, bill: true },
    { ...props.noiseMails[2], bill: false },
  ];

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-24} stagger={3} />

      <Stage offsetY={70}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${s.x}px, ${s.y}px)` }}>
          <Radio
            height={RADIO_H}
            needle={needle}
            body={p.white}
            scaleBg={p.grey}
            ink={p.ink}
            needleColor={p.red}
            screenBg="#d9e0ec"
            style={{ left: RADIO_X, top: 0 }}
          >
            {rows.map((r, i) => {
              const drift = Math.sin(frame / 9 + i * 1.7) * 6;
              const gone = r.bill ? lose : 0;
              return (
                <MailRow
                  key={i}
                  from={r.from}
                  subject={r.subject}
                  bg={p.white}
                  ink={p.ink}
                  dot={r.bill ? p.yellow : p.blueSoft}
                  style={{
                    left: ROW_X + drift,
                    top: ROWS_Y[i],
                    transform: `rotate(${ROWS_R[i]}deg) scale(${1 - gone * 0.08})`,
                    opacity: 1 - gone * 0.92,
                    filter: gone > 0.02 ? `blur(${gone * 14}px)` : undefined,
                  }}
                />
              );
            })}
            <Noise
              width={SCREEN.w}
              height={SCREEN.h}
              amount={noise}
              frame={frame}
              colors={[p.white, p.blueSoft, "#9aa6bd", p.ink]}
              seed="hook"
              style={{ opacity: 0.85 }}
            />
          </Radio>
        </div>

        {frame >= HOOK_T.slam ? (
          <BillCard
            sender={bill.sender}
            subject={bill.subject}
            amount={bill.amount}
            dueLabel={props.overdue}
            urgent
            stamp={props.overdue}
            stampIn={stampIn}
            style={{
              position: "absolute",
              left: (1080 - BILL_W) / 2,
              top: 300,
              transform: `scale(${interpolate(slam, [0, 1], [1.7, 1])}) rotate(${interpolate(slam, [0, 1], [6, -2])}deg)`,
              opacity: Math.min(1, slam * 3),
              boxShadow: "0 40px 90px rgba(255,90,121,0.35)",
            }}
          />
        ) : null}

        {frame >= HOOK_T.chip ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 300 + BILL_H + 40,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "0 40px",
                height: 92,
                lineHeight: "92px",
                borderRadius: 46,
                background: p.red,
                color: p.white,
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize: 46,
                transform: `scale(${chip})`,
                boxShadow: "0 16px 40px rgba(255,90,121,0.4)",
              }}
            >
              {props.costChip}
            </div>
          </div>
        ) : null}
      </Stage>
    </SceneBg>
  );
};
