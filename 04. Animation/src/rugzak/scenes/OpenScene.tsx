import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { brand, fonts } from "../../theme";
import { ItemCard, ITEM_H, ITEM_W } from "../components/ItemCard";
import { Rugzak, RUGZAK_H, RUGZAK_W } from "../components/Rugzak";
import { type RugzakProps, SCENE_STARTS, wordAt } from "../schema";

// Absolute frames, all hung on spoken words.
export const OPEN_T = {
  start: SCENE_STARTS[1],
  mail: wordAt("mailtje"), // gegevens@ chip flies into the bag
  mailIn: wordAt("mailtje") + 16,
  lift: wordAt("rugzak"), // Buddy tosses the bag up
  flip: wordAt("om"), // bag turns upside down, flap opens
  items: [wordAt("bedrag"), wordAt("datum"), wordAt("link"), wordAt("kenmerk")],
  subline: wordAt("bedrag") + 4,
  flipLen: 14,
  fallLen: 12,
};

const GROUND = 890;
const BAG = 250;
const BUD = 170;
const bagH = (BAG * RUGZAK_H) / RUGZAK_W;
// Bag centre: resting on the ground right of Buddy, then high up in the middle.
const REST = { x: 700, y: GROUND - bagH / 2 };
const HIGH = { x: 540, y: 150 };
const SLOTS = [
  { x: 120, y: 370 },
  { x: 560, y: 370 },
  { x: 120, y: 530 },
  { x: 560, y: 530 },
];

export const OpenScene: React.FC<{ props: RugzakProps["open"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const lift = interpolate(frame, [OPEN_T.lift, OPEN_T.lift + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flip = interpolate(frame, [OPEN_T.flip, OPEN_T.flip + OPEN_T.flipLen], [0, 1], { ...clamp, easing: Easing.inOut(Easing.back(1.4)) });
  const bx = REST.x + (HIGH.x - REST.x) * lift;
  const by = REST.y + (HIGH.y - REST.y) * lift - Math.sin(lift * Math.PI) * 120;
  // little shake each time an item drops out
  const shakeAt = OPEN_T.items.find((t) => frame >= t - 4 && frame < t + 6);
  const shakeX = shakeAt !== undefined ? Math.sin((frame - shakeAt) * 1.8) * 10 : 0;
  const mailLand = interpolate(frame, [OPEN_T.mailIn, OPEN_T.mailIn + 8], [1, 0.9], clamp);
  const bagSquash = frame >= OPEN_T.mailIn && frame < OPEN_T.mailIn + 10 ? mailLand + (1 - mailLand) * ((frame - OPEN_T.mailIn) / 10) : 1;

  // Buddy: stands left, hops on "rugzak" (the toss), then slides to the middle and looks up.
  const hop = interpolate(frame, [OPEN_T.lift - 6, OPEN_T.lift, OPEN_T.lift + 12, OPEN_T.lift + 18], [0, 0, 1, 0], clamp);
  const crouch = interpolate(frame, [OPEN_T.lift - 6, OPEN_T.lift, OPEN_T.lift + 2], [1, 0.78, 1.12], clamp);
  const settle = interpolate(frame, [OPEN_T.lift + 2, OPEN_T.lift + 10], [1.12, 1], clamp);
  const squash = frame < OPEN_T.lift + 2 ? crouch : settle;
  const budX = interpolate(frame, [OPEN_T.lift + 4, OPEN_T.lift + 24], [260, 540], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lookUp = interpolate(frame, [OPEN_T.lift, OPEN_T.lift + 8], [0, -0.8], clamp);
  const happy = frame > OPEN_T.items[3] + 10 ? 0.22 : blinkScale(frame, [OPEN_T.start + 14]);

  // mail chip
  const mailT = interpolate(frame, [OPEN_T.mail, OPEN_T.mailIn], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const mailX = -320 + (REST.x - 150 + 320) * mailT;
  const mailY = 200 + (REST.y - 60 - 200) * mailT - Math.sin(mailT * Math.PI) * 140;
  const mailVisible = frame >= OPEN_T.mail - 2 && frame < OPEN_T.mailIn + 2;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={OPEN_T.start - 4} stagger={2} />
      <Stage offsetY={30}>
        {/* items drop out of the upturned bag into a 2 × 2 grid */}
        {props.items.map((it, i) => {
          const t0 = OPEN_T.items[i];
          if (frame < t0 - 2) return null;
          const f = interpolate(frame, [t0 - 2, t0 + OPEN_T.fallLen], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
          const land = pop(frame, fps, t0 + OPEN_T.fallLen, springs.bouncy);
          const sx = HIGH.x - ITEM_W / 2;
          const sy = HIGH.y + 40;
          const x = sx + (SLOTS[i].x - sx) * f;
          const y = sy + (SLOTS[i].y - sy) * f;
          const r = (1 - f) * (i % 2 === 0 ? -25 : 25);
          const s = 0.55 + 0.45 * f;
          const squ = frame >= t0 + OPEN_T.fallLen ? 1 - 0.08 * Math.sin(land * Math.PI) : 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: ITEM_W,
                height: ITEM_H,
                transform: `rotate(${r}deg) scale(${s * (2 - squ)}, ${s * squ})`,
                transformOrigin: "50% 100%",
                zIndex: 2 + i,
              }}
            >
              <ItemCard label={it.label} value={it.value} />
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: bx - BAG / 2 + shakeX,
            top: by - bagH / 2,
            transform: `rotate(${flip * 180}deg) scale(${bagSquash})`,
            transformOrigin: "50% 50%",
            zIndex: 10,
          }}
        >
          <Rugzak width={BAG} body={p.white} flap={p.blueSoft} pocket={p.blueSoft} accent={brand.blueMascot} open={flip} />
        </div>
        {mailVisible ? (
          <div
            style={{
              position: "absolute",
              left: mailX,
              top: mailY,
              padding: "16px 30px",
              borderRadius: 40,
              background: brand.yellow,
              color: brand.ink,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 40,
              transform: `rotate(${(1 - mailT) * -12}deg) scale(${1 - 0.5 * Math.max(0, mailT - 0.7) / 0.3})`,
              zIndex: 11,
              whiteSpace: "nowrap",
            }}
          >
            <svg width={44} height={32} viewBox="0 0 44 32" style={{ marginRight: 14, verticalAlign: "-4px" }}>
              <rect x={2} y={2} width={40} height={28} rx={5} fill="none" stroke={brand.ink} strokeWidth={4} />
              <path d="M4 5 L22 18 L40 5" fill="none" stroke={brand.ink} strokeWidth={4} strokeLinejoin="round" />
            </svg>
            {props.mailChip}
          </div>
        ) : null}
        <Buddy
          size={BUD}
          body={p.white}
          eye={brand.blueMascot}
          blink={happy}
          look={{ x: 0, y: lookUp }}
          squash={squash}
          style={{ position: "absolute", left: budX - BUD / 2, top: GROUND - BUD * BUDDY_RATIO - hop * 110, zIndex: 1 }}
        />
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={OPEN_T.subline} />
    </SceneBg>
  );
};
