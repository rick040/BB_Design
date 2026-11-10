import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BillCard } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Sea, useStageToFrame } from "../components/Sea";
import type { VloedProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  rise: 6, // first wave creeps up over the bill
  drag: 18, // ... and drags it into the sea
  ebb: 32, // water back down, the sand is empty
  wave: 40, // the next wave rolls in
  notice: 52, // water recedes: an AANMANING lies where the bill was
  chip: 60, // "Kan uitlopen op €40"
};

const CARD_Y = 380; // stage y of the card centre
const CARD_SCALE = 0.98;

export const HookScene: React.FC<{ props: VloedProps["hook"]; bill: VloedProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const S = useStageToFrame(0);

  // Waterline (stage y): rest just under the card, up over it twice.
  const rest = 760;
  const levelStage = interpolate(
    frame,
    [0, HOOK_T.rise, HOOK_T.drag + 4, HOOK_T.ebb, HOOK_T.wave, HOOK_T.notice - 4, HOOK_T.notice + 10, 120],
    [rest, rest, CARD_Y + 40, rest + 30, rest, CARD_Y - 230, rest - 20, rest + 10],
    { ...clamp, easing: Easing.inOut(Easing.sin) },
  );
  const level = S.y(levelStage);

  // The bill gets pulled into the sea.
  const drag = interpolate(frame, [HOOK_T.drag, HOOK_T.ebb], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const billY = CARD_Y + drag * 520;
  const billR = drag * 14;
  const billOpacity = interpolate(drag, [0.5, 1], [1, 0], clamp);

  // The notice washes up under the second wave.
  const noticeOn = frame >= HOOK_T.notice - 8;
  const sk = shake(frame, HOOK_T.notice, 16, 14);
  const chip = pop(frame, fps, HOOK_T.chip, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      {/* Wet sand stripe that follows the waterline. */}
      <Sea level={level - 70 * S.scale} color={p.grey} amplitude={12} speed={0.06} phase={1.2} />

      <Stage>
        {!noticeOn ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: billY,
              transform: `translate(-50%, -50%) rotate(${billR}deg) scale(${CARD_SCALE})`,
              opacity: billOpacity,
            }}
          >
            <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              left: 540 + sk.x,
              top: CARD_Y + sk.y,
              transform: `translate(-50%, -50%) rotate(${-3 + sk.r}deg) scale(${CARD_SCALE})`,
            }}
          >
            <BillCard
              sender={bill.sender}
              subject={props.noticeSubject}
              amount={bill.amount}
              dueLabel={props.noticeDue}
              urgent
            />
          </div>
        )}
      </Stage>

      <Sea level={level} color={p.blueSoft} foam={p.white} amplitude={16} phase={0} />
      <Sea level={level + 34 * S.scale} color={p.blue} amplitude={20} speed={0.11} phase={2} opacity={0.9} />

      <Stage>
        <div
          style={{
            position: "absolute",
            left: 540,
            top: CARD_Y - 268,
            transform: `translate(-50%, 0) rotate(-4deg) scale(${0.5 + 0.5 * chip})`,
            opacity: Math.min(1, chip * 2),
            height: 88,
            padding: "0 36px",
            borderRadius: 44,
            background: p.red,
            color: "#fff",
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 46,
            letterSpacing: "-0.03em",
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            boxShadow: "0 16px 40px rgba(255, 90, 121, 0.35)",
          }}
        >
          {props.costChip}
        </div>
      </Stage>

      <Headline text={props.headline} color={p.blue} delay={-26} stagger={3} />
    </SceneBg>
  );
};
