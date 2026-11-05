import { clockWipe } from "@remotion/transitions/clock-wipe";
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Notification, NOTIFICATION_W } from "../../components/Notification";
import { RollingNumber, rollSequence } from "../../components/RollingNumber";
import { SceneBg, Stage } from "../../components/Stage";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BacklogFrame, endFrames } from "../BacklogFrame";
import { baseSchema, bgSchema, sec, seriesTotal } from "../common";
import { Head, Sub, useBg } from "../parts";
import { VisualView, visualSchema } from "../visuals";
import { lin, sp } from "../visuals/Card";
import { z } from "zod";

// Template 4 · Countdown. A giant number rolls from step to step (days left,
// or diary days), each step with a caption and a notification.
export const countdownTplSchema = baseSchema.extend({
  headline: z.string(),
  bg: bgSchema,
  /** Small label above the number ("Dag", "dagen tot je salaris"…). */
  unit: z.string(),
  steps: z
    .array(
      z.object({
        value: z.string(),
        caption: z.string(),
        /** Notification under the number; empty text = none. */
        noteTitle: z.string(),
        noteText: z.string(),
        noteTime: z.string(),
        noteIcon: z.enum(["new", "warning", "alert"]),
      }),
    )
    .min(2)
    .max(4),
  stepSeconds: z.number().min(1).max(4),
  final: z.object({ headline: z.string(), subline: z.string(), visual: visualSchema, seconds: z.number().min(2).max(7) }),
});
export type CountdownTplProps = z.infer<typeof countdownTplSchema>;

export const COUNTDOWN_T = {
  rollLen: 16, // frames a roll between two values takes
  caption: 10, // caption/notification of a step, frames after its roll ends
  hold: 24, // frames the last step stays up
  finalVisual: 8,
};

const countSeconds = (p: CountdownTplProps) => (p.steps.length - 1) * p.stepSeconds + p.stepSeconds * 0.6 + COUNTDOWN_T.hold / 30;
export const countdownTplFrames = (p: CountdownTplProps) => [sec(countSeconds(p)), sec(p.final.seconds), endFrames(p)];
export const countdownTplTotal = (p: CountdownTplProps) => seriesTotal(countdownTplFrames(p), p.transition);

const CountScene: React.FC<{ props: CountdownTplProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const c = useBg(props.bg);
  const step = sec(props.stepSeconds);
  // Which step are we on, and how far is the roll into it?
  const cur = Math.min(props.steps.length - 1, Math.floor(frame / step));
  const rollStart = cur * step;
  const prev = cur > 0 ? props.steps[cur - 1].value : props.steps[0].value;
  const seq = cur > 0 ? rollSequence(prev, props.steps[cur].value) : [props.steps[0].value];
  const roll = cur > 0 ? interpolate(frame, [rollStart, rollStart + COUNTDOWN_T.rollLen], [0, 1], clamp) : 0;
  const rollEased = 1 - Math.pow(1 - roll, 3);
  const blur = roll > 0 && roll < 1 ? Math.sin(roll * Math.PI) * 12 : 0;
  const s = props.steps[cur];
  const capIn = lin(frame, rollStart + (cur > 0 ? COUNTDOWN_T.rollLen : 0) - 4, rollStart + (cur > 0 ? COUNTDOWN_T.rollLen : 0) + 8);
  const noteIn = sp(frame, rollStart + (cur > 0 ? COUNTDOWN_T.rollLen : 0) + COUNTDOWN_T.caption, 13, 190);
  const bump = cur > 0 ? interpolate(frame, [rollStart + COUNTDOWN_T.rollLen, rollStart + COUNTDOWN_T.rollLen + 5, rollStart + COUNTDOWN_T.rollLen + 12], [1, 1.08, 1], clamp) : 1;
  return (
    <SceneBg color={c.bg}>
      <Head text={props.headline} color={c.fg} hook />
      <Stage>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center", fontFamily: fonts.display, fontSize: 46, fontWeight: 500, color: c.sub }}>
          {props.unit}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, transform: `scale(${bump})` }}>
          <RollingNumber values={seq} progress={rollEased} size={380} color={c.fg} blur={blur} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 470,
            textAlign: "center",
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 54,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: c.fg,
            opacity: capIn,
            transform: `translateY(${(1 - capIn) * 20}px)`,
            textWrap: "balance",
          }}
        >
          {s.caption}
        </div>
        {s.noteText ? (
          <div
            style={{
              position: "absolute",
              left: (1080 - NOTIFICATION_W) / 2,
              top: 660,
              opacity: Math.min(1, noteIn * 1.6),
              transform: `translateY(${(1 - noteIn) * -30}px) scale(${0.85 + 0.15 * noteIn})`,
            }}
          >
            <Notification title={s.noteTitle} text={s.noteText} time={s.noteTime} icon={s.noteIcon} />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", gap: 14 }}>
          {props.steps.map((_, i) => (
            <div key={i} style={{ width: i === cur ? 48 : 16, height: 16, borderRadius: 8, background: i <= cur ? c.fg : p.blueSoft + "88" }} />
          ))}
        </div>
      </Stage>
    </SceneBg>
  );
};

const FinalScene: React.FC<{ props: CountdownTplProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const c = useBg(props.bg === "blue" ? "light" : "blue");
  return (
    <SceneBg color={c.bg}>
      <Head text={props.final.headline} color={c.fg} />
      <Stage offsetY={20}>
        <VisualView v={props.final.visual} t={frame - COUNTDOWN_T.finalVisual} onBlue={c.onBlue} />
      </Stage>
      <Sub text={props.final.subline} color={c.sub} />
    </SceneBg>
  );
};

export const CountdownTpl: React.FC<CountdownTplProps> = (props) => {
  const { width, height } = useVideoConfig();
  return (
    <BacklogFrame
      base={props}
      presentation={() => clockWipe({ width, height })}
      scenes={[
        { name: "Aftellen", frames: sec(countSeconds(props)), node: <CountScene props={props} /> },
        { name: "Uitkomst", frames: sec(props.final.seconds), node: <FinalScene props={props} /> },
      ]}
    />
  );
};
