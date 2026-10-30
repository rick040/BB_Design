import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Chip, DRAPE, Drapes, HatBack, HatFront, HatMouth, hatGeom, Sparkle } from "../components/Magic";
import type { GoochelProps } from "../schema";

// Timeline (frames, scene-local).
export const HAT_T = {
  drop: 18, // the forwarded mail drops into the hat
  dropLen: 14,
  bounce: 32, // the hat hops once it has swallowed the mail
  buddy: 38, // Buddy rises out of the hat like the rabbit
  look: 50, // looks left, then right
  chip1: 62, // Buddy pulls the chips out like a string of scarves
  chip2: 70,
  chip3: 78,
  subline: 84,
};

const HAT_W = 380;
const HAT = { x: 540 - HAT_W / 2, y: 830 - hatGeom(HAT_W).h };
const MAIL = { w: 640, h: 200, x: 220, y: 40 };
const BUDDY = 240;
// Chip targets (stage coords, centre), an arc over Buddy's head.
const CHIPS = [
  { x: 220, y: 320, r: -6 },
  { x: 540, y: 150, r: 2 },
  { x: 850, y: 310, r: 6 },
];

export const HatScene: React.FC<{
  props: GoochelProps["hat"];
  bill: GoochelProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const g = hatGeom(HAT_W);
  const rimX = HAT.x + HAT_W / 2;
  const rimY = HAT.y + g.rimY;

  // Forwarded mail drops into the hat (hat-local coordinates, clipped at the rim).
  const drop = interpolate(frame, [HAT_T.drop, HAT_T.drop + HAT_T.dropLen], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const mailX = interpolate(drop, [0, 1], [MAIL.x - HAT.x, (HAT_W - MAIL.w * 0.5) / 2]);
  const mailY = interpolate(drop, [0, 1], [MAIL.y - HAT.y, g.rimY + 40]);
  const mailS = interpolate(drop, [0, 1], [1, 0.5]);
  const float = Math.sin(frame / 8) * 5 * (1 - drop);

  // Hat hops after swallowing the mail, and again when Buddy pops out.
  const hop =
    interpolate(frame, [HAT_T.bounce, HAT_T.bounce + 4, HAT_T.bounce + 10], [0, -26, 0], clamp) +
    interpolate(frame, [HAT_T.buddy, HAT_T.buddy + 3, HAT_T.buddy + 8], [0, 10, 0], clamp);

  // Buddy rises out of the hat.
  const rise = pop(frame, fps, HAT_T.buddy, { damping: 11, stiffness: 150, mass: 0.8 });
  const buddyH = BUDDY * BUDDY_RATIO;
  const buddyTop = interpolate(rise, [0, 1], [g.rimY + 20, g.rimY + 34 - buddyH]);
  const squash = interpolate(rise, [0, 0.5, 0.8, 1], [1.2, 1.15, 0.92, 1]);
  const lookX = interpolate(frame, [HAT_T.look, HAT_T.look + 5, HAT_T.look + 12, HAT_T.look + 17, HAT_T.look + 22], [0, -1, -1, 1, 0.3], clamp);
  const lookY = frame >= HAT_T.chip1 ? -0.5 : 0;
  const blink = blinkScale(frame, [HAT_T.buddy + 10, HAT_T.subline + 6]);
  // A little tug each time a chip comes out.
  const tug = [HAT_T.chip1, HAT_T.chip2, HAT_T.chip3].reduce(
    (acc, c) => acc * interpolate(frame, [c - 2, c + 1, c + 6], [1, 0.9, 1], clamp),
    1,
  );

  const chips = [HAT_T.chip1, HAT_T.chip2, HAT_T.chip3].map((start) => pop(frame, fps, start, { damping: 13, stiffness: 150 }));
  const chipPos = chips.map((t, i) => ({
    x: interpolate(t, [0, 1], [rimX, CHIPS[i].x]),
    y: interpolate(t, [0, 1], [rimY - 10, CHIPS[i].y]) - Math.sin(t * Math.PI) * 60,
  }));
  const visibleChips = chips.map((_, i) => frame >= [HAT_T.chip1, HAT_T.chip2, HAT_T.chip3][i]);
  // The string that ties the chips together, from the hat to the last chip out.
  const stringPts = [{ x: rimX, y: rimY - 6 }, ...chipPos.filter((_, i) => visibleChips[i])];
  const stringPath = stringPts
    .map((pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = stringPts[i - 1];
      const mx = (prev.x + pt.x) / 2;
      const my = Math.max(prev.y, pt.y) + 50;
      return `Q ${mx} ${my} ${pt.x} ${pt.y}`;
    })
    .join(" ");

  return (
    <SceneBg color={p.blue}>
      <Drapes close={0} edge={46} color={DRAPE.color} dark={DRAPE.dark} />
      <Headline text={props.headline} color={p.white} delay={6} stagger={3} />

      <Stage offsetY={40}>
        <div style={{ position: "absolute", inset: 0, transform: "scale(1.14)", transformOrigin: "50% 50%" }}>
        <div
          style={{
            position: "absolute",
            left: 190,
            width: 700,
            top: 770,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(255,255,255,0.28), rgba(255,255,255,0))",
          }}
        />

        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 900, transform: `translateY(${hop}px)` }}>
          <HatBack w={HAT_W} style={{ left: HAT.x, top: HAT.y }} />
          <HatMouth w={HAT_W} left={HAT.x} top={HAT.y} height={900}>
            {/* forwarded mail, dropping into the hat */}
            {drop < 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: mailX,
                  top: mailY + float,
                  width: MAIL.w,
                  height: MAIL.h,
                  transform: `scale(${mailS}) rotate(${drop * 8}deg)`,
                  transformOrigin: "0 0",
                  borderRadius: 30,
                  background: p.white,
                  boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
                  padding: "28px 36px",
                  boxSizing: "border-box",
                  fontFamily: fonts.ui,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 20px",
                    borderRadius: 999,
                    background: p.blue,
                    color: p.white,
                    fontSize: 26,
                    fontWeight: 600,
                  }}
                >
                  {props.forwardedChip} →
                </div>
                <div style={{ marginTop: 18, fontSize: 38, fontWeight: 600, color: p.ink }}>{bill.sender}</div>
                <div style={{ fontSize: 30, color: p.greyText, marginTop: 2 }}>{bill.subject}</div>
              </div>
            ) : null}
            {/* Buddy, rising out of the hat */}
            {frame >= HAT_T.buddy ? (
              <Buddy
                size={BUDDY}
                body={p.white}
                eye={p.blueMascot}
                blink={blink}
                squash={squash * tug}
                look={{ x: lookX, y: lookY }}
                style={{ position: "absolute", left: (HAT_W - BUDDY) / 2, top: buddyTop }}
              />
            ) : null}
          </HatMouth>
          <HatFront w={HAT_W} band={p.blueSoft} style={{ left: HAT.x, top: HAT.y }} />
        </div>

        {/* the string of chips Buddy pulls out */}
        {stringPts.length > 1 ? (
          <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={stringPath} fill="none" stroke={p.blueSoft} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 14" />
          </svg>
        ) : null}
        {props.chips.map((c, i) =>
          visibleChips[i] ? (
            <Chip
              key={i}
              text={c}
              bg={i === 1 ? p.yellow : p.white}
              color={i === 1 ? p.ink : p.blue}
              size={42}
              style={{
                left: chipPos[i].x,
                top: chipPos[i].y,
                transform: `translate(-50%, -50%) scale(${0.3 + 0.7 * chips[i]}) rotate(${CHIPS[i].r * chips[i]}deg)`,
              }}
            />
          ) : null,
        )}
        {frame >= HAT_T.buddy && frame < HAT_T.buddy + 20
          ? [
              { x: 380, y: 520, s: 46 },
              { x: 700, y: 500, s: 38 },
              { x: 450, y: 420, s: 30 },
            ].map((s, i) => {
              const t = (frame - HAT_T.buddy) / 20;
              return (
                <Sparkle
                  key={i}
                  size={s.s}
                  color={p.yellow}
                  style={{ left: s.x, top: s.y - t * 50, opacity: Math.sin(t * Math.PI), transform: `scale(${0.5 + t})` }}
                />
              );
            })
          : null}
        </div>
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={HAT_T.subline} />
    </SceneBg>
  );
};
