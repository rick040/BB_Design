import { iris } from "@remotion/transitions/iris";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { blinkScale, clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { BacklogFrame, endFrames } from "../BacklogFrame";
import { baseSchema, bgSchema, sec, seriesTotal } from "../common";
import { Head, Sub, useBg } from "../parts";
import { VisualView } from "../visuals";
import { CheckIcon, lin, sp } from "../visuals/Card";
import { z } from "zod";

// Template 8 · Getallen-reveal. One giant number counts (or jumps) from step
// to step; the previous value shrinks up and gets struck through; a badge
// shows the difference. Optional achievement chips. Then a payoff.
export const numberSchema = baseSchema.extend({
  headline: z.string(),
  bg: bgSchema,
  steps: z
    .array(
      z.object({
        prefix: z.string(),
        from: z.number(),
        to: z.number(),
        decimals: z.number().min(0).max(2),
        suffix: z.string(),
        /** Shown instead of the number once counting is done; empty = the number. */
        finalText: z.string(),
        label: z.string(),
        /** Red pill next to the number ("+€40"); empty = none. */
        badge: z.string(),
        countSeconds: z.number().min(0).max(4),
      }),
    )
    .min(1)
    .max(3),
  stepSeconds: z.number().min(1.5).max(6),
  chips: z.array(z.string()).max(4),
  final: z.object({ headline: z.string(), subline: z.string(), seconds: z.number().min(2).max(6) }),
});
export type NumberProps = z.infer<typeof numberSchema>;

export const NUMBER_T = {
  countStart: 8, // frames into a step before it starts counting
  badge: 6, // badge, frames after the count ends
  chipStagger: 8,
  finalBuddy: 10,
};

const numberSeconds = (p: NumberProps) => p.steps.length * p.stepSeconds + (p.chips.length ? p.chips.length * 0.3 + 0.8 : 0);
export const numberFrames = (p: NumberProps) => [sec(numberSeconds(p)), sec(p.final.seconds), endFrames(p)];
export const numberTotal = (p: NumberProps) => seriesTotal(numberFrames(p), p.transition);

const fmt = (n: number, d: number) => n.toFixed(d).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const NumberScene: React.FC<{ props: NumberProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const c = useBg(props.bg);
  const per = sec(props.stepSeconds);
  const cur = Math.min(props.steps.length - 1, Math.floor(frame / per));
  const local = frame - cur * per;
  const st = props.steps[cur];
  const cLen = Math.max(1, sec(st.countSeconds));
  const k = lin(local, NUMBER_T.countStart, NUMBER_T.countStart + cLen);
  const eased = 1 - Math.pow(1 - k, 3);
  const value = st.from + (st.to - st.from) * eased;
  const done = k >= 1;
  const text = done && st.finalText ? st.finalText : `${st.prefix}${fmt(value, st.decimals)}${st.suffix}`;
  const pulse = interpolate(local, [NUMBER_T.countStart + cLen, NUMBER_T.countStart + cLen + 5, NUMBER_T.countStart + cLen + 12], [1, 1.07, 1], clamp);
  const badgeIn = st.badge ? sp(local, NUMBER_T.countStart + cLen + NUMBER_T.badge, 11, 210) : 0;
  const prev = cur > 0 ? props.steps[cur - 1] : null;
  const prevText = prev ? (prev.finalText || `${prev.prefix}${fmt(prev.to, prev.decimals)}${prev.suffix}`) : "";
  const prevUp = prev ? sp(local, 0, 16, 160) : 0;
  const strike = prev ? lin(local, 6, 16) : 0;
  const lastStep = props.steps[props.steps.length - 1];
  const chipsAt = (props.steps.length - 1) * per + NUMBER_T.countStart + Math.max(1, sec(lastStep.countSeconds)) + 12;
  const size = text.length > 6 ? 230 : 300;
  const solo = !prev && props.chips.length === 0;
  const numTop = prev ? 190 : solo ? 240 : 150;
  return (
    <SceneBg color={c.bg}>
      <Head text={props.headline} color={c.fg} hook />
      <Stage offsetY={props.chips.length ? -40 : 0}>
        {prev ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: interpolate(prevUp, [0, 1], [180, 0]),
              display: "flex",
              justifyContent: "center",
              opacity: interpolate(prevUp, [0, 1], [1, 0.55]),
            }}
          >
            <span style={{ position: "relative", fontFamily: fonts.display, fontWeight: 500, fontSize: interpolate(prevUp, [0, 1], [size, 120]), letterSpacing: headlineTracking, color: c.fg, lineHeight: 1 }}>
              {prevText}
              <span style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 10, borderRadius: 5, background: p.red, transform: `scaleX(${strike})`, transformOrigin: "0% 50%" }} />
            </span>
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: numTop,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            opacity: prev ? lin(local, 4, 12) : 1,
          }}
        >
          <span
            style={{
              position: "relative",
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: size,
              lineHeight: 1,
              letterSpacing: headlineTracking,
              color: c.fg,
              transform: `scale(${pulse})`,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {text}
            {st.badge ? (
              <span
                style={{
                  position: "absolute",
                  right: -40,
                  top: -50,
                  padding: "12px 26px",
                  borderRadius: 36,
                  background: p.red,
                  color: "#fff",
                  fontSize: 58,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  opacity: badgeIn,
                  transform: `rotate(8deg) scale(${0.4 + 0.6 * badgeIn})`,
                }}
              >
                {st.badge}
              </span>
            ) : null}
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: numTop + size + 30,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 52,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            color: c.sub,
            opacity: lin(local, 2, 12),
            textWrap: "balance",
          }}
        >
          {st.label}
        </div>
        {solo ? (
          <Buddy
            size={210}
            body={c.onBlue ? p.white : p.blueMascot}
            eye={c.onBlue ? p.blueMascot : p.white}
            blink={blinkScale(frame, [40, 100])}
            look={{ x: 0, y: -0.9 }}
            squash={1 + Math.sin(frame / 9) * 0.02}
            style={{ position: "absolute", left: 540 - 105, top: 930 - 210 * BUDDY_RATIO }}
          />
        ) : null}
        {props.chips.length ? (
          <div style={{ position: "absolute", left: 80, right: 80, top: 640, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
            {props.chips.map((ch, i) => {
              const s = sp(frame, chipsAt + i * NUMBER_T.chipStagger, 12, 200);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 30px 14px 16px",
                    borderRadius: 40,
                    background: p.white,
                    fontFamily: fonts.ui,
                    fontSize: 36,
                    fontWeight: 600,
                    color: p.ink,
                    boxShadow: "0 12px 30px rgba(1, 30, 140, 0.15)",
                    opacity: Math.min(1, s * 1.6),
                    transform: `translateY(${(1 - s) * 30}px) scale(${0.7 + 0.3 * s})`,
                  }}
                >
                  <CheckIcon size={46} color={p.blue} />
                  {ch}
                </div>
              );
            })}
          </div>
        ) : null}
      </Stage>
    </SceneBg>
  );
};

const FinalScene: React.FC<{ props: NumberProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const c = useBg(props.bg === "blue" ? "light" : "blue");
  return (
    <SceneBg color={c.bg}>
      <Head text={props.final.headline} color={c.fg} />
      <Stage offsetY={40}>
        <VisualView v={{ kind: "buddy", text: "", mood: "happy" }} t={frame - NUMBER_T.finalBuddy} onBlue={c.onBlue} />
      </Stage>
      <Sub text={props.final.subline} color={c.sub} />
    </SceneBg>
  );
};

export const NumberReveal: React.FC<NumberProps> = (props) => {
  const { width, height } = useVideoConfig();
  return (
    <BacklogFrame
      base={props}
      presentation={() => iris({ width, height })}
      scenes={[
        { name: "Getal", frames: sec(numberSeconds(props)), node: <NumberScene props={props} /> },
        { name: "Payoff", frames: sec(props.final.seconds), node: <FinalScene props={props} /> },
      ]}
    />
  );
};
