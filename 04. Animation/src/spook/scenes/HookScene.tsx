import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Bulb, MAIL_H, MAIL_W, MailCard, MONSTER_H, MONSTER_W, MonsterShadow, useNight, WallGlow } from "../components/Spook";
import type { SpookProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  grow: 4, // the shadow behind the mail starts to grow
  growLen: 30,
  flick: 14, // the bulb stutters
  eyes: 30, // red eyes open in the shadow
  whisper: 40, // "Hoeveel?", "Aanmaning?", "Te laat?" float in
  whisperStagger: 8,
  flick2: 70, // second stutter
};

const MAIL = { x: (1080 - MAIL_W) / 2, y: 610 };
const FOOT = { x: 540, y: MAIL.y + MAIL_H / 2 };
const WHISPERS = [
  { x: 20, y: 250, r: -8, alert: false },
  { x: 650, y: 130, r: 6, alert: true },
  { x: 760, y: 420, r: -4, alert: false },
];

/** Bulb stutter: off for a few frames around each flicker beat. */
export const bulbOn = (frame: number, beats: number[]) => {
  for (const b of beats) {
    const t = frame - b;
    if (t === 0 || t === 1 || t === 3) return 0.15;
    if (t === 2) return 0.7;
  }
  return 1;
};

export const HookScene: React.FC<{ props: SpookProps["hook"]; mail: SpookProps["mail"] }> = ({ props, mail }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const n = useNight();

  const on = bulbOn(frame, [HOOK_T.flick, HOOK_T.flick2]);
  const grow = interpolate(frame, [HOOK_T.grow, HOOK_T.grow + HOOK_T.growLen], [0.72, 1.16], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const breathe = 1 + Math.sin(frame / 7) * 0.012;
  const s = grow * breathe;
  const eyes = interpolate(frame, [HOOK_T.eyes, HOOK_T.eyes + 6], [0, 1], clamp);
  // The mail trembles a little, more once the eyes are open.
  const tremble = frame >= HOOK_T.eyes ? 3 : 1.2;
  const tx = Math.sin(frame * 2.3) * tremble;
  const tr = Math.sin(frame * 1.7) * tremble * 0.25;

  return (
    <SceneBg color={n.room}>
      <Stage offsetY={100}>
        <div style={{ position: "absolute", inset: 0, filter: `brightness(${0.55 + 0.45 * on})` }}>
          <WallGlow x={540} y={560} r={600} on={on} />
          <MonsterShadow
            color={n.shadow}
            teeth={n.wall}
            eyes={eyes * (on > 0.5 ? 1 : 0.6)}
            eyeColor={p.red}
            style={{
              left: FOOT.x - MONSTER_W / 2,
              top: FOOT.y - MONSTER_H,
              transform: `scale(${s})`,
              transformOrigin: "50% 100%",
              filter: "blur(2px)",
            }}
          />
          {props.whispers.map((w, i) => {
            const t = pop(frame, fps, HOOK_T.whisper + i * HOOK_T.whisperStagger, springs.smooth);
            const slot = WHISPERS[i];
            const drift = Math.sin((frame + i * 17) / 9) * 8;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: slot.x,
                  top: slot.y + drift + (1 - t) * 30,
                  fontFamily: fonts.display,
                  fontWeight: 600,
                  fontSize: 58,
                  letterSpacing: "-0.03em",
                  color: slot.alert ? p.red : p.blueSoft,
                  opacity: t * (0.7 + 0.3 * on),
                  transform: `rotate(${slot.r}deg) skewX(-10deg) scale(${0.8 + 0.2 * t})`,
                  filter: `blur(${(1 - t) * 8}px)`,
                  textShadow: slot.alert ? `0 0 24px ${p.red}66` : undefined,
                }}
              >
                {w}
              </div>
            );
          })}
          <MailCard
            sender={mail.sender}
            subject={mail.subject}
            preview={mail.preview}
            age={mail.age}
            style={{ left: MAIL.x + tx, top: MAIL.y, transform: `rotate(${tr}deg)` }}
          />
        </div>
        <Bulb x={150} y={40} on={on} />
      </Stage>

      <Headline text={props.headline} color={p.white} delay={-30} stagger={3} />
    </SceneBg>
  );
};
