import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { Checkmark } from "../../../components/Checkmark";
import { SceneBg, Stage } from "../../../components/Stage";
import { blinkScale, clamp, pop, shake, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline } from "../../text";
import { dec, decFonts, decTracking } from "../../theme";
import { Envelope, FRIEND_BODY, SpeechBubble, Zoom } from "../components/Props";
import type { VriendProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  blinkLeft: 16, // de rustige Buddy knippert
  tick: 22, // vinkjes in de agenda
  tickStagger: 8, // duur: tussen twee vinkjes
  sigh: 40, // de berg schudt, de vriend zucht
  bubble: 46, // "O ja, die rekening…"
  glance: 66, // de rustige Buddy kijkt naar zijn vriend
};

export const BUDDY_SIZE = 300;
export const FEET_Y = 690;
const BUDDY_H = BUDDY_SIZE * BUDDY_RATIO;
const LEFT_X = 90;
const RIGHT_X = 650;

// Waar de enveloppen op de rechter Buddy liggen (midden, draaiing).
export const PILE = [
  { x: 800, y: 655, r: -8 },
  { x: 725, y: 628, r: 7 },
  { x: 880, y: 632, r: 11 },
  { x: 770, y: 585, r: -13 },
  { x: 850, y: 572, r: 9 },
  { x: 730, y: 548, r: -5 },
  { x: 805, y: 528, r: 4 },
  { x: 760, y: 508, r: -11 },
];

export const HookScene: React.FC<{ props: VriendProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const s = shake(frame, HOOK_T.sigh, 16, 7);
  const bubble = pop(frame, fps, HOOK_T.bubble, springs.pop);
  const glance = interpolate(frame, [HOOK_T.glance, HOOK_T.glance + 8], [0, 1], clamp);
  const nod = interpolate(frame, [HOOK_T.glance + 14, HOOK_T.glance + 18, HOOK_T.glance + 24], [1, 0.86, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <DHeadline text={props.headline} color={p.blue} delay={-20} stagger={3} sizeFactor={0.92} />
      <Stage offsetY={0}>
        <Zoom k={1.12} dy={-10}>
        {/* Links: rustig, met een nette agenda */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 90,
            width: 410,
            borderRadius: 40,
            background: dec.white,
            padding: "26px 30px 30px",
            boxSizing: "border-box",
            boxShadow: "0 24px 60px rgba(1, 40, 160, 0.14)",
            fontFamily: decFonts.ui,
          }}
        >
          <div style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 40, color: dec.blue, letterSpacing: decTracking, marginBottom: 14 }}>
            {props.agendaTitle}
          </div>
          {props.agendaRows.map((r, i) => {
            const t = interpolate(frame, [HOOK_T.tick + i * HOOK_T.tickStagger, HOOK_T.tick + i * HOOK_T.tickStagger + 8], [0, 1], clamp);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 52 }}>
                <div style={{ width: 38, height: 38, borderRadius: 19, background: t > 0.05 ? dec.blue : dec.ice, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Checkmark size={24} color={dec.white} progress={t} strokeWidth={14} />
                </div>
                <span style={{ fontSize: 30, fontWeight: 500, color: dec.ink }}>{r}</span>
              </div>
            );
          })}
        </div>

        <Buddy
          size={BUDDY_SIZE}
          body={p.blue}
          eye={dec.white}
          squash={nod}
          blink={blinkScale(frame, [HOOK_T.blinkLeft, 58])}
          look={{ x: glance * 0.9, y: 0.1 }}
          style={{ position: "absolute", left: LEFT_X, top: FEET_Y - BUDDY_H }}
        />

        {/* Rechts: de vriend onder de enveloppen */}
        <div style={{ position: "absolute", left: 540, top: 262, opacity: Math.min(1, bubble * 2), transform: `scale(${0.7 + 0.3 * bubble})`, transformOrigin: "80% 100%" }}>
          <SpeechBubble text={props.bubble} tail="right" />
        </div>
        <Buddy
          size={BUDDY_SIZE}
          body={FRIEND_BODY}
          eye={p.blueMascot}
          look={{ x: -0.3, y: 0.4 }}
          blink={blinkScale(frame, [30, 52])}
          style={{ position: "absolute", left: RIGHT_X, top: FEET_Y - BUDDY_H, transform: `translate(${s.x}px, ${s.y}px)` }}
        />
        {PILE.map((e, i) => (
          <Envelope
            key={i}
            width={190}
            style={{
              position: "absolute",
              left: e.x - 95,
              top: e.y - 66,
              transform: `translate(${s.x * (1 + i * 0.1)}px, ${s.y}px) rotate(${e.r}deg)`,
            }}
          />
        ))}
        </Zoom>
      </Stage>
    </SceneBg>
  );
};
