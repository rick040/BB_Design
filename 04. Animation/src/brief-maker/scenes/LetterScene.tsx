import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Signature } from "../components/Signature";
import type { BriefProps } from "../schema";

// Timeline (frames, global; this Reel is one continuous shot). Defaults of the
// props, for timeline.py; the scene reads the real values from the props.
export const LETTER_T = {
  p2: 99, // "Buddy leest je mail niet. …" starts typing (3,3 s)
  p3: 228, // "Geen bankkoppeling, …" (7,6 s)
  p4: 312, // "Vragen? Mail me gewoon." (10,4 s)
  sign: 348, // signature draws (11,6 s)
  signLen: 22,
  buddy: 369, // Buddy hops into the corner (12,3 s)
  cta: 387, // CTA pill (12,9 s)
};

const SHEET = { x: 100, y: 10, w: 880, h: 740 };
const BUDDY = 120;

export const LetterScene: React.FC<{ props: BriefProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const t = frame / fps;
  const tm = props.timing;

  const sheetIn = pop(frame, fps, -12, springs.smooth);
  const sign = interpolate(t, [tm.sign, tm.sign + LETTER_T.signLen / fps], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const buddyIn = pop(frame, fps, tm.buddy * fps, springs.bouncy);
  const hop = interpolate(frame, [tm.buddy * fps, tm.buddy * fps + 10], [0, 1], clamp);
  const wave = frame > tm.buddy * fps + 14 ? Math.sin((frame - tm.buddy * fps - 14) / 4) * 0.06 * Math.max(0, 1 - (frame - tm.buddy * fps - 14) / 40) : 0;
  const btn = pop(frame, fps, tm.cta * fps, springs.bouncy);
  const arrow = pop(frame, fps, tm.cta * fps + 6, springs.pop);
  const nudge = frame > tm.cta * fps + 14 ? Math.max(0, Math.sin((frame - tm.cta * fps - 14) / 4)) * 8 : 0;
  const caretOn = Math.floor(frame / 8) % 2 === 0;

  // Which paragraph is typing right now (gets the caret).
  const typed = props.paragraphs.map((para) => Math.max(0, Math.min(para.text.length, Math.floor((t - para.at) * tm.typeSpeed))));
  let typingIdx = -1;
  typed.forEach((n, i) => {
    if (n > 0 && n < props.paragraphs[i].text.length) typingIdx = i;
  });
  if (typingIdx === -1) {
    // Rest the caret after the last paragraph that has started.
    typed.forEach((n, i) => {
      if (n > 0) typingIdx = i;
    });
  }
  const signing = sign > 0;

  return (
    <SceneBg color={props.colors.paper}>
      <Headline text={props.headline} color={p.blue} delay={-14} stagger={3} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: SHEET.x,
            top: SHEET.y,
            width: SHEET.w,
            height: SHEET.h,
            background: p.white,
            borderRadius: 18,
            boxShadow: "0 30px 70px rgba(1, 40, 160, 0.12)",
            padding: "56px 64px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            fontSize: 34,
            lineHeight: 1.4,
            color: p.ink,
            opacity: sheetIn,
            transform: `translateY(${(1 - sheetIn) * 30}px)`,
          }}
        >
          <div style={{ marginBottom: 18 }}>{props.greeting}</div>
          {props.paragraphs.map((para, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <span>{para.text.slice(0, typed[i])}</span>
              {i === typingIdx && !signing ? (
                <span
                  style={{
                    display: "inline-block",
                    width: 4,
                    height: "1.05em",
                    marginLeft: 3,
                    verticalAlign: "-0.15em",
                    background: p.blue,
                    opacity: caretOn ? 1 : 0,
                  }}
                />
              ) : null}
              <span style={{ opacity: 0 }}>{para.text.slice(typed[i])}</span>
            </div>
          ))}

          <div style={{ marginTop: 6, marginLeft: -6 }}>
            <Signature width={210} color={p.blue} progress={sign} />
            <div style={{ fontSize: 24, color: p.greyText, marginTop: 4, marginLeft: 6, opacity: sign }}>
              {props.signName}, {props.signRole}
            </div>
          </div>
        </div>

        {frame >= tm.buddy * fps ? (
          <Buddy
            size={BUDDY}
            body={p.blueMascot}
            eye={p.white}
            blink={blinkScale(frame, [tm.buddy * fps + 30])}
            look={{ x: -0.6, y: 0.4 }}
            squash={interpolate(hop, [0, 0.5, 1], [0.7, 1.12, 1]) + wave}
            style={{
              position: "absolute",
              left: SHEET.x + SHEET.w - BUDDY - 50,
              top: SHEET.y + SHEET.h - 46 - BUDDY * BUDDY_RATIO - Math.sin(Math.PI * hop) * 60,
              opacity: Math.min(1, buddyIn * 3),
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: SHEET.y + SHEET.h + 28,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, btn * 2),
            transform: `scale(${btn})`,
          }}
        >
          <CtaPill text={props.cta.button} arrowIn={arrow} arrowNudge={nudge} />
        </div>
      </Stage>
    </SceneBg>
  );
};
