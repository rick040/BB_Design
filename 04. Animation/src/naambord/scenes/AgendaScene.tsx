import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { MailIcon, Marker, MARKER_H } from "../components/Labels";
import type { NaambordProps } from "../schema";

// Timeline (frames, scene-local).
export const AGENDA_T = {
  card: 6, // agenda card pops in
  buddyIn: 12, // Buddy slides in with his marker, tip down
  write: 24, // Buddy writes row 1, then row 2 and 3
  writeLen: 15,
  writeStagger: 21,
  mails: 86, // chips "Mail 7 dagen vooraf" and "Mail 2 dagen vooraf"
  mailStagger: 5,
  subline: 94, // "Jij betaalt. Buddy onthoudt."
  happy: 98, // Buddy steps back, happy squint
};

const CARD = { x: 110, y: 0, w: 860, head: 120, row: 170 };
const TEXT_X = 186; // written text starts here (card-relative)
const FONT = 56;
const BUDDY = 150;
const MARKER_ANGLE = 40; // body down and to the right (like a pen in a right hand), tip on the paper

// Rough width of a Space Grotesk Medium string; slightly generous so the
// reveal box never cuts off the last letter.
const textWidth = (s: string, size: number) => s.length * size * 0.56 + size * 0.2;

export const AgendaScene: React.FC<{
  props: NaambordProps["agenda"];
  bills: NaambordProps["bills"];
}> = ({ props, bills }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, AGENDA_T.card, { damping: 16, stiffness: 130 });

  // Where the marker tip is (stage coordinates).
  const rowBase = (i: number) => CARD.y + CARD.head + CARD.row * i + CARD.row * 0.64;
  const starts = bills.map((_, i) => ({ x: CARD.x + TEXT_X, y: rowBase(i) }));
  const ends = bills.map((b, i) => ({ x: CARD.x + TEXT_X + textWidth(b.sender, FONT), y: rowBase(i) }));
  const writeAt = (i: number) => AGENDA_T.write + i * AGENDA_T.writeStagger;
  const progress = (i: number) =>
    interpolate(frame, [writeAt(i), writeAt(i) + AGENDA_T.writeLen], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.sin),
    });

  let tip = { x: -320, y: starts[0].y };
  let writing = false;
  if (frame < writeAt(0)) {
    const t = interpolate(frame, [AGENDA_T.buddyIn, writeAt(0)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    tip = { x: interpolate(t, [0, 1], [-320, starts[0].x]), y: starts[0].y - (1 - t) * 60 };
  } else {
    for (let i = 0; i < bills.length; i++) {
      const w0 = writeAt(i);
      const w1 = w0 + AGENDA_T.writeLen;
      const next = i + 1 < bills.length ? writeAt(i + 1) : Infinity;
      if (frame >= w0 && frame < w1) {
        const w = progress(i);
        tip = {
          x: interpolate(w, [0, 1], [starts[i].x, ends[i].x]),
          y: starts[i].y + Math.sin(w * Math.PI * 9) * 7,
        };
        writing = true;
        break;
      }
      if (frame >= w1 && frame < next) {
        if (next === Infinity) {
          tip = ends[i];
          break;
        }
        const t = interpolate(frame, [w1, next], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        const to = i + 1 < bills.length ? starts[i + 1] : ends[i];
        tip = {
          x: interpolate(t, [0, 1], [ends[i].x, to.x]),
          y: interpolate(t, [0, 1], [ends[i].y, to.y]) - Math.sin(t * Math.PI) * 40,
        };
        break;
      }
    }
  }
  // After the last row: lift the marker off the paper.
  const back = interpolate(frame, [AGENDA_T.happy, AGENDA_T.happy + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tipShown = { x: tip.x + back * 30, y: tip.y + back * 24 };

  // Buddy holds the back end of the marker, below the row he writes in
  // (that row and the ones under it are still empty).
  const rad = (MARKER_ANGLE * Math.PI) / 180;
  const backEnd = { x: tipShown.x + Math.cos(rad) * 200, y: tipShown.y + Math.sin(rad) * 200 };
  const bob = writing ? Math.abs(Math.sin(frame / 2.4)) * 8 : 0;
  const happy = frame >= AGENDA_T.happy ? interpolate(frame, [AGENDA_T.happy, AGENDA_T.happy + 6], [1, 0.2], clamp) : 1;
  const blink = Math.min(happy, blinkScale(frame, [AGENDA_T.write + 30]));
  const squash = frame >= AGENDA_T.happy
    ? interpolate(frame, [AGENDA_T.happy, AGENDA_T.happy + 5, AGENDA_T.happy + 11, AGENDA_T.happy + 16], [1, 0.86, 1.1, 1], clamp)
    : 1 + (writing ? Math.sin(frame / 2.4) * 0.03 : 0);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={2} stagger={3} />

      <Stage offsetY={44}>
        {/* Agenda card */}
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.head + CARD.row * bills.length + 18,
            borderRadius: 40,
            background: p.white,
            boxShadow: "0 30px 80px rgba(1, 40, 160, 0.14)",
            transform: `translateY(${(1 - cardIn) * 120}px) scale(${0.92 + 0.08 * cardIn})`,
            opacity: Math.min(1, cardIn * 2),
            fontFamily: fonts.ui,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: CARD.head,
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "0 44px",
              borderBottom: `3px solid ${p.grey}`,
            }}
          >
            <svg width={50} height={50} viewBox="0 0 40 40">
              <rect x="5" y="8" width="30" height="27" rx="6" fill="none" stroke={p.blue} strokeWidth="3" />
              <path d="M5 16h30M13 4v8M27 4v8" stroke={p.blue} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div
              style={{
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 50,
                letterSpacing: headlineTracking,
                color: p.ink,
              }}
            >
              {props.month}
            </div>
          </div>

          {bills.map((b, i) => {
            const w = progress(i);
            const boxW = textWidth(b.sender, FONT);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: CARD.head + CARD.row * i,
                  height: CARD.row,
                  borderBottom: i < bills.length - 1 ? `2px solid ${p.grey}` : "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 40,
                    top: (CARD.row - 120) / 2,
                    width: 120,
                    height: 120,
                    borderRadius: 26,
                    background: w > 0.02 ? p.blue : p.grey,
                    color: w > 0.02 ? p.white : "#8a8a98",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 500, opacity: 0.8 }}>{b.weekday}</div>
                  <div style={{ fontFamily: fonts.display, fontSize: 56, fontWeight: 500, marginTop: 4 }}>{b.day}</div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: TEXT_X,
                    top: 0,
                    height: CARD.row,
                    width: boxW,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: fonts.display,
                    fontWeight: 500,
                    fontSize: FONT,
                    letterSpacing: "-0.03em",
                    color: p.blue,
                    whiteSpace: "nowrap",
                    transform: "rotate(-1.5deg)",
                    transformOrigin: "0% 50%",
                    clipPath: `inset(-20px ${(1 - w) * 100}% -20px -10px)`,
                  }}
                >
                  {b.sender}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mail chips under the agenda */}
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y + CARD.head + CARD.row * bills.length + 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 14,
          }}
        >
          {[props.mail7, props.mail2].map((t, i) => {
            const s = pop(frame, fps, AGENDA_T.mails + i * AGENDA_T.mailStagger, springs.pop);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 82,
                  padding: "0 30px 0 16px",
                  borderRadius: 41,
                  background: p.white,
                  boxShadow: "0 14px 34px rgba(1, 40, 160, 0.13)",
                  fontFamily: fonts.ui,
                  fontSize: 32,
                  fontWeight: 600,
                  color: p.ink,
                  whiteSpace: "nowrap",
                  opacity: Math.min(1, s * 2),
                  transform: `translateY(${(1 - s) * 30}px) scale(${0.8 + 0.2 * s})`,
                }}
              >
                <MailIcon size={54} color={p.white} bg={p.blue} />
                {t}
              </div>
            );
          })}
        </div>

        {/* Marker (tip on the paper) with Buddy on its back end */}
        <div
          style={{
            position: "absolute",
            left: tipShown.x,
            top: tipShown.y - MARKER_H / 2,
            transformOrigin: `0px ${MARKER_H / 2}px`,
            transform: `rotate(${MARKER_ANGLE + (writing ? Math.sin(frame / 1.8) * 3 : 0)}deg)`,
          }}
        >
          <Marker body={p.yellow} ink={p.ink} capOn={false} />
        </div>
        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          squash={squash}
          look={{ x: -0.8, y: -0.7 }}
          style={{
            position: "absolute",
            left: backEnd.x - 40,
            top: backEnd.y - 70 - bob,
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.ink} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
