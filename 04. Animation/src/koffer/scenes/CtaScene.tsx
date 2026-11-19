import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { type KofferProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  zipStart: S,
  zipLen: 26,
  buddyIn: S + 20,
  button: wordAt("activeer"),
  logo: wordAt("activeer") + 6,
  subline: wordAt("activeer") + 12,
  tap: VOICE_END - 2,
};
const SPOKEN = [wordAt("geen"), wordAt("app", 2), wordAt("erbij")];

// Closed suitcase, front view, in stage coordinates.
const CASE = { x: 270, y: 70, w: 540, h: 330, r: 44 };
const BUDDY = 140;

export const CtaScene: React.FC<{ props: KofferProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const T = CTA_T;

  const words = props.headline.split(/\s+/).filter(Boolean);
  const caseIn = pop(frame, fps, S - 6, springs.bouncy);
  const zip = interpolate(frame, [T.zipStart, T.zipStart + T.zipLen], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const zipped = interpolate(frame, [T.zipStart + T.zipLen, T.zipStart + T.zipLen + 4, T.zipStart + T.zipLen + 12], [1, 0.94, 1], clamp);

  // zipper track: rounded rect inset 26; pull walks along its perimeter
  const ins = 26;
  const zw = CASE.w - ins * 2;
  const zh = CASE.h - ins * 2;
  const per = 2 * (zw + zh);
  const along = zip * per;
  const pull = (() => {
    let d = along;
    if (d <= zw) return { x: ins + d, y: ins };
    d -= zw;
    if (d <= zh) return { x: ins + zw, y: ins + d };
    d -= zh;
    if (d <= zw) return { x: ins + zw - d, y: ins + zh };
    d -= zw;
    return { x: ins, y: ins + zh - d };
  })();

  const buddyIn = pop(frame, fps, T.buddyIn, springs.bouncy);
  const swingT = Math.max(0, frame - T.buddyIn);
  const swing = Math.sin(swingT * 0.22) * 16 * Math.exp(-swingT / 40) + 4;
  const btnIn = pop(frame, fps, T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, T.button + 6, springs.pop);
  const tap = interpolate(frame, [T.tap, T.tap + 3, T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [T.tap + 1, T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, T.subline, springs.smooth);
  const logoIn = pop(frame, fps, T.logo, springs.smooth);
  const strapX = CASE.x + CASE.w;
  const strapY = CASE.y + 110;

  return (
    <SceneBg color={p.light}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 1.15,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
          color: p.blue,
        }}
      >
        {words.map((w, i) => {
          const s = pop(frame, fps, (SPOKEN[i] ?? SPOKEN[SPOKEN.length - 1]) - 3, springs.pop);
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  opacity: Math.min(1, s * 1.4),
                  transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                  filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                }}
              >
                {w}
              </span>{" "}
            </React.Fragment>
          );
        })}
      </div>

      <Stage offsetY={-40}>
        {/* closed suitcase */}
        <div
          style={{
            position: "absolute",
            left: CASE.x,
            top: CASE.y,
            width: CASE.w,
            height: CASE.h,
            transform: `scale(${(0.5 + 0.5 * caseIn) * zipped})`,
            transformOrigin: "50% 100%",
          }}
        >
          {/* top handle */}
          <div
            style={{
              position: "absolute",
              left: CASE.w / 2 - 80,
              top: -48,
              width: 160,
              height: 64,
              borderRadius: "30px 30px 0 0",
              border: `18px solid ${p.blueMascot}`,
              borderBottom: "none",
              boxSizing: "border-box",
            }}
          />
          <div style={{ position: "absolute", inset: 0, borderRadius: CASE.r, background: p.blue, boxShadow: "0 30px 70px rgba(1,40,160,0.22)" }} />
          <svg width={CASE.w} height={CASE.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <rect x={ins} y={ins} width={zw} height={zh} rx={22} fill="none" stroke={p.blueMid} strokeWidth={10} />
            <rect
              x={ins}
              y={ins}
              width={zw}
              height={zh}
              rx={22}
              fill="none"
              stroke={p.blueSoft}
              strokeWidth={10}
              strokeDasharray={`${along} ${per}`}
            />
            <g transform={`translate(${pull.x} ${pull.y})`}>
              <circle r={18} fill={p.yellow} />
              <rect x={-7} y={10} width={14} height={34} rx={7} fill={p.yellow} />
            </g>
          </svg>
          {[0.3, 0.7].map((f) => (
            <div key={f} style={{ position: "absolute", left: CASE.w * f - 12, top: CASE.h - 6, width: 24, height: 22, borderRadius: "0 0 10px 10px", background: p.blueMascot }} />
          ))}
        </div>

        {/* Buddy hangs from the side like a luggage tag */}
        <div
          style={{
            position: "absolute",
            left: strapX,
            top: strapY,
            transformOrigin: "0px 0px",
            transform: `rotate(${swing}deg) scale(${Math.min(1, buddyIn)})`,
            opacity: Math.min(1, buddyIn * 3),
          }}
        >
          <div style={{ position: "absolute", left: -6, top: -6, width: 70, height: 12, borderRadius: 6, background: p.yellow, transform: "rotate(40deg)", transformOrigin: "6px 6px" }} />
          <Buddy
            size={BUDDY}
            body={p.blueMascot}
            eye={p.white}
            blink={blinkScale(frame, [T.button + 10])}
            look={{ x: -0.6, y: 0.7 }}
            style={{ position: "absolute", left: 22, top: 44 }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 500,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.25 * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <div style={{ position: "relative" }}>
            <CtaPill text={props.button} arrowIn={arrowIn} outline style={{ background: p.white }} />
            <div
              style={{
                position: "absolute",
                left: CTA_H / 2 - 90,
                top: CTA_H / 2 - 90,
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: `5px solid ${p.blue}`,
                opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0,
                transform: `scale(${0.3 + ripple * 1.2})`,
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 680,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            color: p.blueMid,
            opacity: subIn,
          }}
        >
          {props.subline}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 780,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.blue} />
        </div>
      </Stage>
    </SceneBg>
  );
};
