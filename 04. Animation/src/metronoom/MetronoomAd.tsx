import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CTA_H, CtaPill } from "../components/CtaPill";
import { SafeZones } from "../components/SafeZones";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../lib/anim";
import { PaletteProvider, usePalette } from "../lib/palette";
import { fonts, headlineTracking } from "../theme";
import "../theme";
import { BEATS, swingKeys } from "./beats";
import { AiCloud } from "./components/AiCloud";
import { Metronome } from "./components/Metronome";
import { BILL_W, RuleBill } from "./components/RuleBill";
import { type MetronoomProps, SCENE_STARTS, sceneWordIndex, VO_FILE, WORDS } from "./schema";

// Concept 89 · "Geen AI. Gewoon op de maat." (metronoom)
// One continuous shot: no scene cuts. The light hook is flooded by blue as
// the metronome rises; from then on the pendulum ticks on the spoken words.

const HEAD_TOP = 250;
const HEAD_SIZE = 100;

const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, t)));

/** Pendulum angle (in swing units) at a frame, eased between key poses. */
const swingAt = (frame: number, keys: [number, number][]) => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, a0] = keys[i];
    const [f1, a1] = keys[i + 1];
    if (frame <= f1) return a0 + (a1 - a0) * ease((frame - f0) / Math.max(1, f1 - f0));
  }
  return keys[keys.length - 1][1];
};

/** Headline whose words pop on the matching spoken words. */
const SpokenHeadline: React.FC<{
  text: string;
  firstWord: number; // index into WORDS for the first word, or -1 = static
  from: number;
  to: number;
  colors: [string, string];
  size?: number;
}> = ({ text, firstWord, from, to, colors, size = HEAD_SIZE }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from - 6 || frame > to + 8) return null;
  const out = interpolate(frame, [to, to + 8], [1, 0], clamp);
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        top: HEAD_TOP,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing: headlineTracking,
        opacity: out,
        transform: `translateY(${(1 - out) * -30}px)`,
      }}
    >
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((w, i) => {
            const idx = firstWord < 0 ? -1 : Math.min(WORDS.length - 1, firstWord + wi);
            wi++;
            const at = idx < 0 ? -100 : WORDS[idx].start - 3;
            const s = pop(frame, fps, at, springs.pop);
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: "inline-block",
                    color: li === 0 ? colors[0] : colors[1],
                    opacity: Math.min(1, s * 1.4),
                    transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                  }}
                >
                  {w}
                </span>{" "}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Shot: React.FC<MetronoomProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const keys = swingKeys();
  const swing = props.swingDegrees;
  const angle = swingAt(frame, keys) * swing;

  // last tick (only real ticks, after the pendulum started)
  const ticks = keys.filter(([f, a]) => f >= BEATS.ticking + 1 && Math.abs(a) === 1);
  const last = [...ticks].reverse().find(([f]) => f <= frame);
  const tickFlash = last ? (frame - last[0]) / 14 : 0;

  const flood = pop(frame, fps, BEATS.blueRise, springs.smooth);
  const rise = pop(frame, fps, BEATS.blueRise + 2, springs.smooth);

  // AI cloud: wobbles, then gets swatted away by the arm on "Nee."
  const k = interpolate(frame, [BEATS.knock - 1, BEATS.knock + 20], [0, 1], clamp);
  const kE = 1 - (1 - k) * (1 - k);

  // Buddy drops onto the weight
  const fall = interpolate(frame, [BEATS.buddyLand - 6, BEATS.buddyLand], [1, 0], clamp);
  const buddyDrop = 160 * fall * fall;
  const landSq = interpolate(frame, [BEATS.buddyLand, BEATS.buddyLand + 3, BEATS.buddyLand + 10], [1, 0.72, 1], clamp);
  const nod = Math.min(
    1,
    ...BEATS.pulses.map((f) => interpolate(frame, [f, f + 3, f + 9], [1, 0.86, 1], clamp)),
  );
  const happy = frame >= BEATS.logo + 6 ? 0.18 : 1;
  const blink = Math.min(happy, blinkScale(frame, [BEATS.buddyLand + 16, BEATS.fields[2] + 14, BEATS.billSwap + 30]));
  const lookDown = frame > BEATS.ticking && frame < BEATS.billOut ? 0.9 : 0.3;
  const look = frame < BEATS.buddyLand + 6 ? { x: 0, y: -0.4 } : { x: -angle / swing / 2, y: lookDown };

  // Bills
  const lit1 = BEATS.fields.map((f) => pop(frame, fps, f - 2, springs.pop));
  const lit2 = BEATS.fastFields.map((f) => pop(frame, fps, f - 2, springs.pop));
  const out1 = interpolate(frame, [BEATS.billSwap, BEATS.billSwap + 14], [0, 1], clamp);
  const in2 = pop(frame, fps, BEATS.billSwap + 6, springs.smooth);
  const out2 = interpolate(frame, [BEATS.billOut, BEATS.billOut + 14], [0, 1], clamp);
  const billX = (1080 - BILL_W) / 2;

  // Field word headline (scene 3)
  const fieldIdx = BEATS.fields.filter((f) => f - 3 <= frame).length - 1;
  const fieldPop = fieldIdx >= 0 ? pop(frame, fps, BEATS.fields[fieldIdx] - 3, springs.pop) : 0;
  const fieldOut = interpolate(frame, [BEATS.billSwap - 10, BEATS.billSwap - 2], [1, 0], clamp);

  // CTA
  const btnIn = pop(frame, fps, BEATS.button, springs.bouncy);
  const arrowIn = pop(frame, fps, BEATS.button + 6, springs.pop);
  const pulse = Math.min(
    1,
    ...BEATS.pulses.slice(1).map((f) => interpolate(frame, [f, f + 3, f + 9], [1, 0.93, 1], clamp)),
  );
  const ripple = interpolate(frame, [BEATS.pulses[2] + 1, BEATS.pulses[2] + 18], [0, 1], clamp);
  const logoIn = pop(frame, fps, BEATS.logo, springs.smooth);
  const subIn = pop(frame, fps, BEATS.subline, springs.smooth);

  return (
    <AbsoluteFill style={{ background: p.light }}>
      {/* blue floods up from below */}
      <AbsoluteFill style={{ background: p.blue, transform: `translateY(${(1 - flood) * 1920}px)` }} />

      <SpokenHeadline
        text={props.hook.headline}
        firstWord={-1}
        from={0}
        to={SCENE_STARTS[1] - 8}
        colors={[p.blue, p.blue]}
      />
      <SpokenHeadline
        text={props.rules.headline}
        firstWord={sceneWordIndex(1)}
        from={SCENE_STARTS[1]}
        to={BEATS.fields[0] - 8}
        colors={[p.white, p.blueSoft]}
      />
      {fieldIdx >= 0 && frame < BEATS.billSwap + 8 ? (
        <div
          style={{
            position: "absolute",
            top: HEAD_TOP - 10,
            left: 40,
            right: 40,
            textAlign: "center",
            opacity: fieldOut,
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 120,
              letterSpacing: headlineTracking,
              lineHeight: 1,
              color: p.white,
              transform: `scale(${0.8 + 0.2 * fieldPop})`,
              opacity: Math.min(1, fieldPop * 1.5),
            }}
          >
            {props.bill.fields[fieldIdx].label}.
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: fonts.display,
              fontSize: 44,
              color: p.blueSoft,
            }}
          >
            {props.rules.counter.replace("{n}", String(fieldIdx + 1))}
          </div>
        </div>
      ) : null}
      <SpokenHeadline
        text={props.repeat.headline}
        firstWord={sceneWordIndex(3)}
        from={SCENE_STARTS[3]}
        to={SCENE_STARTS[4] - 8}
        colors={[p.white, p.blueSoft]}
      />
      <SpokenHeadline
        text={props.cta.tagline}
        firstWord={sceneWordIndex(4)}
        from={SCENE_STARTS[4]}
        to={99999}
        colors={[p.white, p.blueSoft]}
      />

      <Metronome
        angle={angle}
        rise={rise}
        buddy={frame >= BEATS.buddyLand - 6 ? 1 : 0}
        buddyDrop={buddyDrop}
        squash={Math.min(landSq, nod)}
        blink={blink}
        look={look}
        tickFlash={tickFlash}
        tickSide={last ? Math.sign(last[1]) : 1}
        swing={swing}
      />

      {k < 1 ? (
        <AiCloud
          frame={frame}
          label={props.hook.cloudLabel}
          guesses={props.hook.guesses}
          x={540 + kE * 900}
          y={760 - kE * 420}
          rot={kE * 300}
          opacity={1 - k * 0.6}
        />
      ) : null}

      {out1 < 1 ? (
        <RuleBill
          {...props.bill}
          lit={lit1}
          style={{ left: billX - out1 * 1100, top: 1090, transform: `rotate(${-out1 * 8}deg)` }}
        />
      ) : null}
      {frame >= BEATS.billSwap && out2 < 1 ? (
        <RuleBill
          {...props.secondBill}
          lit={lit2}
          style={{ left: billX + (1 - in2) * 1100, top: 1090 + out2 * 900 }}
        />
      ) : null}

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1150,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${1.3 * btnIn * pulse})`,
          opacity: Math.min(1, btnIn * 2),
        }}
      >
        <div style={{ position: "relative" }}>
          <CtaPill text={props.cta.button} arrowIn={arrowIn} />
          <div
            style={{
              position: "absolute",
              left: CTA_H / 2 - 90,
              top: CTA_H / 2 - 90,
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: `5px solid ${p.white}`,
              opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
              transform: `scale(${0.3 + ripple * 1.2})`,
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1330,
          display: "flex",
          justifyContent: "center",
          opacity: logoIn,
          transform: `translateY(${(1 - logoIn) * 40}px)`,
        }}
      >
        <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1460,
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: 44,
          color: p.blueText,
          opacity: subIn,
        }}
      >
        {props.cta.subline}
      </div>
    </AbsoluteFill>
  );
};

export const MetronoomAd: React.FC<MetronoomProps> = (props) => (
  <PaletteProvider colors={props.colors}>
    <Shot {...props} />
    {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
    {props.showSafeZones ? <SafeZones /> : null}
  </PaletteProvider>
);
