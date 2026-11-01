import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { Peeling } from "../../lib/peel";
import { fonts, headlineTracking } from "../../theme";
import { LabelTape } from "../components/Labels";
import { MINI_H, MINI_W, MiniBill } from "../components/MiniBill";
import { NAME_BOX, NamePlate, PLATE_W } from "../components/NamePlate";
import type { NaambordProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  peel: 8, // the housemate's sticker peels off the name plate
  peelLen: 18,
  fly: 25, // the peeled sticker drops out of frame
  flyLen: 14,
  line2: 28, // "Nu op jouw naam." pops in under line 1
  line2Stagger: 4,
  own: 44, // yellow "op jouw naam" label slaps over the housemate's label on each bill
  ownStagger: 7,
  subline: 72, // "Drie rekeningen. Drie datums om te onthouden."
};

const PLATE = { x: (1080 - PLATE_W) / 2, y: 0 };
const BILLS = [
  { x: 24, y: 372, r: -4 },
  { x: 379, y: 392, r: 2 },
  { x: 734, y: 372, r: -2 },
];
// Housemate sticker: label tape over the engraved name.
const STICKER = { w: NAME_BOX.w + 20, h: NAME_BOX.h + 4 };
const DARK_TAPE = "#1f2129";

export const HookScene: React.FC<{
  props: NaambordProps["hook"];
  bills: NaambordProps["bills"];
  dueLabel: string;
}> = ({ props, bills, dueLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  // Corner already lifted a little on frame 0, then the peel.
  const peel = interpolate(frame, [0, HOOK_T.peel, HOOK_T.peel + HOOK_T.peelLen], [0.06, 0.09, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const fly = interpolate(frame, [HOOK_T.fly, HOOK_T.fly + HOOK_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const plateShake = shake(frame, HOOK_T.peel + HOOK_T.peelLen - 4, 10, 5);

  // Line 2: "Nu op" + yellow label "jouw naam."
  const leadWords = props.line2Lead.split(/\s+/).filter(Boolean);
  const labelIn = pop(frame, fps, HOOK_T.line2 + leadWords.length * HOOK_T.line2Stagger, springs.bouncy);
  const line1Size = L.headlineSize * 0.8;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.line1} color={p.blue} delay={-22} stagger={3} sizeFactor={0.8} />
      <div
        style={{
          position: "absolute",
          top: L.safeTop + line1Size * 1.2,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
          color: p.blue,
          whiteSpace: "nowrap",
        }}
      >
        {leadWords.map((w, i) => {
          const s = pop(frame, fps, HOOK_T.line2 + i * HOOK_T.line2Stagger, springs.pop);
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  transform: `translateY(${(1 - s) * 0.5}em) scale(${0.9 + 0.1 * s})`,
                  opacity: Math.min(1, s * 1.4),
                  filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                }}
              >
                {w}
              </span>{" "}
            </React.Fragment>
          );
        })}
        <span
          style={{
            display: "inline-block",
            padding: "0.04em 0.2em 0.1em",
            marginLeft: "0.02em",
            background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.08) 100%), ${p.yellow}`,
            borderRadius: "0.08em",
            boxShadow: "0 8px 22px rgba(0, 20, 90, 0.14)",
            color: p.ink,
            opacity: Math.min(1, labelIn * 2),
            transform: `rotate(${-2 * labelIn}deg) scale(${1.25 - 0.25 * labelIn})`,
          }}
        >
          {props.line2Label}
        </span>
      </div>

      <Stage offsetY={120}>
        <NamePlate
          name={props.yourName}
          style={{
            left: PLATE.x,
            top: PLATE.y,
            transform: `translate(${plateShake.x * 0.5}px, ${plateShake.y * 0.5}px)`,
          }}
          cover={
            fly < 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: NAME_BOX.x - 10,
                  top: NAME_BOX.y - 2,
                  transform: `translate(${fly * -260}px, ${fly * 900}px) rotate(${fly * -50}deg)`,
                  transformOrigin: "50% 50%",
                  opacity: 1 - interpolate(fly, [0.6, 1], [0, 1], clamp),
                }}
              >
                <Peeling w={STICKER.w} h={STICKER.h} progress={peel} corner="br" angle={24} backing="#e9e6dc" shadow={0.3} radius={8}>
                  <LabelTape
                    text={props.housemate}
                    tape={DARK_TAPE}
                    ink={p.white}
                    fontSize={64}
                    style={{ width: STICKER.w, height: STICKER.h, justifyContent: "center", borderRadius: 8, letterSpacing: "0.22em" }}
                  />
                </Peeling>
              </div>
            ) : null
          }
        />

        {bills.map((b, i) => {
          const slot = BILLS[i];
          const ownAt = HOOK_T.own + i * HOOK_T.ownStagger;
          const own = pop(frame, fps, ownAt, { damping: 11, stiffness: 260, mass: 0.6 });
          const hit = shake(frame, ownAt + 2, 8, 6);
          const settle = pop(frame, fps, -10 + i * 2, springs.smooth);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: slot.x,
                top: slot.y,
                width: MINI_W,
                height: MINI_H,
                transform: `translate(${hit.x}px, ${hit.y + (1 - settle) * 30}px) rotate(${slot.r}deg)`,
              }}
            >
              <MiniBill bill={b} dueLabel={dueLabel} style={{ left: 0, top: 0 }} />
              {/* the housemate's label on the bill */}
              <div style={{ position: "absolute", right: -14, top: 30, transform: "rotate(-7deg)", transformOrigin: "100% 0%" }}>
                <LabelTape text={props.housemate} tape={DARK_TAPE} ink={p.white} fontSize={23} padX={0.8} />
              </div>
              {/* ...covered by yours */}
              {frame >= ownAt ? (
                <div
                  style={{
                    position: "absolute",
                    right: -18,
                    top: 26,
                    transform: `rotate(${-5 + (1 - own) * -8}deg) scale(${1.5 - 0.5 * own})`,
                    transformOrigin: "100% 0%",
                    opacity: Math.min(1, own * 3),
                  }}
                >
                  <LabelTape text={props.ownLabel} tape={p.yellow} ink={p.ink} fontSize={23} padX={0.55} />
                </div>
              ) : null}
            </div>
          );
        })}
      </Stage>

      <Subline text={props.subline} color={p.ink} delay={HOOK_T.subline} />
    </SceneBg>
  );
};
