import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BOX_H, BOX_W, LID_H, PillBox, slotX } from "../components/PillBox";
import { NOTA_H, NOTA_W, NotaCard } from "../components/NotaCard";
import { SCENE_STARTS, type WeekdoosProps, wordAt } from "../schema";

const S = SCENE_STARTS[2];
// Slips fly into Buddy on "door"; Buddy fills one compartment per spoken beat.
export const FORWARD_T = {
  chip: S + 2,
  swallow: [0, 1, 2].map((i) => wordAt("door") + i * 6),
  swallowLen: 12,
  fill: [wordAt("elke"), wordAt("nota"), wordAt("dag")],
  hopLen: 9,
  agenda: wordAt("agenda"),
};

const BOX_LEFT = (1080 - BOX_W) / 2;
const BOX_TOP = 500;
const BUDDY = 150;
const HOVER_FEET = BOX_TOP - 30;
const HOME = { x: 540, feet: HOVER_FEET - 60 };

export const ForwardScene: React.FC<{ props: WeekdoosProps["forward"]; notas: WeekdoosProps["notas"] }> = ({
  props,
  notas,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = FORWARD_T;

  // Buddy path: home, then hop over each compartment just before its beat.
  const stops = [HOME, ...T.fill.map((_, i) => ({ x: BOX_LEFT + slotX(i), feet: HOVER_FEET }))];
  let pos = { x: HOME.x, y: HOME.feet };
  let hopping = false;
  for (let k = 0; k < T.fill.length; k++) {
    const arrive = T.fill[k] - 2;
    const leave = arrive - T.hopLen;
    if (frame >= leave) {
      const u = interpolate(frame, [leave, arrive], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
      const a = stops[k];
      const b = stops[k + 1];
      pos = { x: a.x + (b.x - a.x) * u, y: a.feet + (b.feet - a.feet) * u - Math.sin(Math.PI * u) * 110 };
      hopping = u > 0 && u < 1;
    }
  }
  const land = Math.max(...T.fill.map((f) => (frame >= f - 2 ? f - 2 : -99)));
  const landSq = interpolate(frame, [land, land + 3, land + 8], [1, 0.82, 1], clamp);
  const lastSwallow = Math.max(...T.swallow.map((f) => (frame >= f + T.swallowLen ? f + T.swallowLen : -99)));
  const gulp = interpolate(frame, [lastSwallow, lastSwallow + 3, lastSwallow + 8], [1, 1.14, 1], clamp);
  const squash = hopping ? 1.08 : Math.min(landSq, 1) * gulp;
  const buddyIn = pop(frame, fps, S - 2, springs.bouncy);

  const open = T.fill.map((f) =>
    interpolate(frame, [f - 6, f - 1, f + 9, f + 14], [0, 1, 1, 0], { ...clamp, easing: Easing.out(Easing.cubic) }),
  );
  const filled = T.fill.map((f) => interpolate(frame, [f - 1, f + 8], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }));
  const checked = T.fill.map((f) => interpolate(frame, [f + 14, f + 22], [0, 1], clamp));
  const hl = interpolate(frame, [T.agenda, T.agenda + 2], [0, 1], clamp);
  const chipIn = pop(frame, fps, T.chip, springs.pop);
  const chipOut = interpolate(frame, [T.swallow[2] + T.swallowLen, T.swallow[2] + T.swallowLen + 8], [1, 0], clamp);
  const agendaIn = pop(frame, fps, T.agenda, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={S - 2} stagger={3} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 10,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2) * chipOut,
            transform: `scale(${0.6 + 0.4 * chipIn})`,
          }}
        >
          <div
            style={{
              background: p.blue,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 40,
              padding: "16px 34px",
              borderRadius: 40,
            }}
          >
            {props.chip} ✓
          </div>
        </div>

        <PillBox
          slots={notas.map((n) => n.slot)}
          open={open}
          filled={filled}
          checked={checked}
          highlight={hl}
          style={{ left: BOX_LEFT, top: BOX_TOP }}
        />

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          squash={squash}
          blink={frame > T.agenda + 4 ? 0.2 : blinkScale(frame, [S + 20])}
          look={hopping ? { x: 0, y: 0.6 } : { x: 0, y: -0.2 }}
          style={{
            position: "absolute",
            left: pos.x - BUDDY / 2,
            top: pos.y - BUDDY * BUDDY_RATIO,
            transform: `scale(${buddyIn})`,
            transformOrigin: "50% 100%",
            zIndex: 3,
          }}
        />

        {notas.map((n, i) => {
          const f0 = T.swallow[i];
          const u = interpolate(frame, [f0, f0 + T.swallowLen], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
          if (frame < S - 6 || u >= 1) return null;
          const from = { x: 540 + (i - 1) * 330, y: 230 };
          const to = { x: HOME.x, y: HOME.feet - 70 };
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: from.x + (to.x - from.x) * u - NOTA_W / 2,
                top: from.y + (to.y - from.y) * u - NOTA_H / 2,
                transform: `scale(${0.5 * (1 - u) + 0.05}) rotate(${(i - 1) * 6 + u * 90}deg)`,
                zIndex: 4,
              }}
            >
              <NotaCard sender={n.sender} amount={n.amount} due={n.due} />
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BOX_TOP + BOX_H + LID_H + 26,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, agendaIn * 2),
            transform: `scale(${0.6 + 0.4 * agendaIn})`,
          }}
        >
          <div
            style={{
              background: p.yellow,
              color: p.ink,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 40,
              padding: "14px 32px",
              borderRadius: 40,
            }}
          >
            <svg width={34} height={34} viewBox="0 0 34 34" style={{ verticalAlign: "-4px", marginRight: 12 }}>
              <rect x={3} y={6} width={28} height={25} rx={5} fill="none" stroke={p.ink} strokeWidth={3.5} />
              <path d="M3 14h28M11 3v7M23 3v7" stroke={p.ink} strokeWidth={3.5} strokeLinecap="round" />
            </svg>
            {props.agendaChip}
          </div>
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={T.agenda + 4} />
    </SceneBg>
  );
};
