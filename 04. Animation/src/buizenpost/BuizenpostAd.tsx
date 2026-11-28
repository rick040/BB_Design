import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { Checkmark } from "../components/Checkmark";
import { CTA_H, CtaPill } from "../components/CtaPill";
import { SafeZones } from "../components/SafeZones";
import { Headline } from "../components/Text";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../lib/anim";
import { PaletteProvider, usePalette } from "../lib/palette";
import { fonts, headlineTracking } from "../theme";
import "../theme";
import { BAND_H, BOX, Capsule, END_Y, FUNNEL, MailRow, PAN, Plug, Tube, TUBE_END, tubeAngle, tubeX } from "./parts";
import { type BuizenpostProps, SCENE_STARTS, VO_FILE, VO_MEASURED, VOICE_END, wordAt } from "./schema";

// Concept 128 · "Alleen wat jij erin stopt." (buizenpost)
// One continuous shot, no cuts. All beats hang on spoken words (timing.json).
const [S1, S2, S3, S4, S5] = SCENE_STARTS;
export const BP_T = {
  no: wordAt("hoeft"), // stamp "Hoeft niet." on the plug, plug is yanked out
  lift: S2 + 4, // the bill row lifts out of the mailbox
  pick: wordAt("één"), // bill flies to the funnel
  drop: wordAt("in"), // capsule drops into the funnel
  pan: S3, // capsule rides down the tube, the camera follows it
  arrive: S4 - 2, // capsule shoots out of the tube end
  catch: S4 + 8, // Buddy catches it
  open: wordAt("leest"), // capsule opens, read card unfolds
  row1: wordAt("leest") + 4,
  row2: wordAt("alleen") + 4,
  row3: wordAt("wat") + 2,
  row4: wordAt("aankomt"),
  cta: S5, // card leaves, tagline on the voice
  drop2: S5 + 8, // second capsule with the button
  button: wordAt("activeer"),
  tap: VOICE_END - 2,
};
void S1;

const BILL_ROW = 2; // position of the bill among the mail rows
const BUDDY = 170;
// Screen positions once the camera has arrived (screen = world - PAN).
const CATCH_Y = 1010; // Buddy's feet on screen

const easeIO = Easing.inOut(Easing.cubic);

/** Capsule position in the tube (world y) during the ride. */
const capRide = (frame: number) =>
  interpolate(frame, [BP_T.pan, BP_T.arrive], [FUNNEL.bottom - 20, TUBE_END - 70], { ...clamp, easing: easeIO });
/** Camera follows the capsule; the capsule's screen position drifts from low to the tube mouth. */
export const cameraY = (frame: number) => {
  if (frame <= BP_T.pan) return 0;
  const offset = interpolate(frame, [BP_T.pan, BP_T.arrive], [FUNNEL.bottom - 20, END_Y - 70], clamp);
  return Math.min(PAN, Math.max(0, capRide(frame) - offset));
};

const World: React.FC<{ props: BuizenpostProps; camY: number }> = ({ props, camY }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = BP_T;

  // Plug: drifts towards the mailbox, gets the stamp, is yanked out.
  const plugX = interpolate(frame, [0, T.no], [900, 850], { ...clamp, easing: Easing.out(Easing.quad) })
    + interpolate(frame, [T.no + 8, T.no + 20], [0, 420], { ...clamp, easing: Easing.in(Easing.cubic) });
  const stamp = pop(frame, fps, T.no - 2, springs.pop);
  const stampOut = interpolate(frame, [S2, S2 + 8], [1, 0], clamp);

  // Bill row: lift → fly to funnel → shrink into capsule.
  const lift = pop(frame, fps, T.lift, springs.smooth);
  const fly = interpolate(frame, [T.pick, T.drop - 4], [0, 1], { ...clamp, easing: easeIO });
  const shrink = interpolate(frame, [T.drop - 10, T.drop - 2], [0, 1], clamp);
  const rowY0 = BOX.y + BOX.header + BILL_ROW * BOX.rowH;
  const rowX = interpolate(fly, [0, 1], [BOX.x + 20, 540 - (BOX.w - 40) / 2]);
  const rowY = interpolate(fly, [0, 1], [rowY0 - lift * 26, FUNNEL.top - 150]);
  const others = interpolate(frame, [T.lift, T.lift + 12], [1, 0.45], clamp);

  // Capsule: sits above the funnel, drops in, rides the tube.
  const capWorldY = (() => {
    if (frame < T.drop) return FUNNEL.top - 120;
    if (frame < T.pan) return interpolate(frame, [T.drop, T.drop + 8], [FUNNEL.top - 120, FUNNEL.bottom - 20], { ...clamp, easing: Easing.in(Easing.quad) });
    return capRide(frame);
  })();
  const inTube = frame >= T.drop && frame < T.arrive;
  const capVisible = frame >= T.drop - 2 && frame < T.arrive;

  const boxRows = [...props.mailbox.senders];
  boxRows.splice(BILL_ROW, 0, "__bill__");

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: TUBE_END + 1400, transform: `translateY(${-camY}px)` }}>
      {/* Background: light at the mailbox, blue at Buddy. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${p.light} 0px, ${p.light} 1700px, ${p.blue} 1880px, ${p.blue} 100%)`,
        }}
      />
      <Tube />

      {/* Capsule in the tube (drawn above the tube, clipped visually by speed lines). */}
      {capVisible ? (
        <div
          style={{
            position: "absolute",
            left: tubeX(capWorldY) - 48,
            top: capWorldY - 78,
            transform: `rotate(${inTube ? tubeAngle(capWorldY) : 0}deg)`,
          }}
        >
          <Capsule />
        </div>
      ) : null}

      {/* Mailbox */}
      <div
        style={{
          position: "absolute",
          left: BOX.x,
          top: BOX.y,
          width: BOX.w,
          height: BOX.header + boxRows.length * BOX.rowH + 24,
          borderRadius: 44,
          background: p.white,
          boxShadow: "0 30px 80px rgba(1,40,160,0.14)",
          border: `3px solid ${p.grey}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            height: BOX.header,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 32px",
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 38,
            letterSpacing: "-0.03em",
            color: p.blue,
            borderBottom: `3px solid ${p.grey}`,
          }}
        >
          <svg width={44} height={34} viewBox="0 0 44 34">
            <rect x={2} y={2} width={40} height={30} rx={6} fill="none" stroke={p.blue} strokeWidth={4} />
            <path d="M4 6 L22 19 L40 6" fill="none" stroke={p.blue} strokeWidth={4} strokeLinejoin="round" />
          </svg>
          {props.mailbox.label}
        </div>
        <div style={{ padding: "10px 10px 0" }}>
          {boxRows.map((s, i) =>
            s === "__bill__" ? (
              <div key={i} style={{ height: BOX.rowH }} />
            ) : (
              <div key={i} style={{ height: BOX.rowH, opacity: others }}>
                <MailRow sender={s} />
              </div>
            ),
          )}
        </div>
      </div>

      {/* The one bill: lifts, flies to the funnel, becomes the capsule. */}
      {frame < T.drop ? (
        <div
          style={{
            position: "absolute",
            left: rowX,
            top: rowY + 10,
            width: BOX.w - 40,
            transform: `scale(${(1 + lift * 0.06) * (1 - shrink * 0.85)})`,
            transformOrigin: "50% 50%",
            boxShadow: `0 ${10 + lift * 20}px ${30 + lift * 30}px rgba(1,40,160,${0.08 + lift * 0.12})`,
            borderRadius: 18,
            opacity: 1 - shrink,
          }}
        >
          <MailRow sender={props.bill.sender} amount={props.bill.amount} highlight />
        </div>
      ) : null}
      {frame >= T.drop - 6 && frame < T.drop ? (
        <div style={{ position: "absolute", left: 540 - 48, top: FUNNEL.top - 198, transform: `scale(${shrink})` }}>
          <Capsule />
        </div>
      ) : null}

      {/* Plug and stamp */}
      {frame < T.no + 22 ? <Plug x={plugX} y={BOX.y + 330} label={props.mailbox.plugLabel} /> : null}
      {frame >= T.no - 2 ? (
        <div
          style={{
            position: "absolute",
            left: 640,
            top: BOX.y + 285,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 64,
            letterSpacing: "-0.04em",
            color: p.red,
            border: `7px solid ${p.red}`,
            borderRadius: 22,
            padding: "6px 26px 12px",
            background: "rgba(255,255,255,0.92)",
            whiteSpace: "nowrap",
            transform: `rotate(-9deg) scale(${1.6 - 0.6 * stamp})`,
            opacity: Math.min(1, stamp * 2) * stampOut,
          }}
        >
          {props.headlines.hookAnswer}
        </div>
      ) : null}
    </div>
  );
};

const ReadCard: React.FC<{ props: BuizenpostProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = BP_T;
  const rows: [string, string, number][] = [
    [props.read.amountLabel, props.bill.amount, T.row1],
    [props.read.dueLabel, props.bill.due.replace(/^Vervalt\s+/, ""), T.row2],
    [props.read.linkLabel, "", T.row3],
    [props.read.referenceLabel, props.bill.reference.replace(/^Kenmerk\s+/, ""), T.row4],
  ];
  return (
    <div
      style={{
        width: 860,
        borderRadius: 44,
        background: p.white,
        boxShadow: "0 30px 80px rgba(0,20,120,0.3)",
        padding: "30px 40px 22px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 12 }}>
        <div style={{ width: 14, height: 46, borderRadius: 7, background: p.yellow }} />
        <div style={{ fontSize: 36, fontWeight: 600, color: p.ink }}>{props.bill.sender}</div>
      </div>
      {rows.map(([label, value, at], i) => {
        const s = pop(frame, fps, at, springs.pop);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              height: 72,
              borderTop: `3px solid ${p.grey}`,
              gap: 18,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: interpolateColors(s, [0, 1], [p.grey, p.blueMid]),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Checkmark size={26} color={p.white} progress={interpolate(frame, [at, at + 8], [0, 1], clamp)} strokeWidth={16} />
            </div>
            <div style={{ fontSize: 30, color: "#6b6b78" }}>{label}</div>
            <div style={{ marginLeft: "auto", fontSize: 32, fontWeight: 700, color: p.ink, opacity: Math.min(1, s * 1.5) }}>
              {value || (
                <span style={{ color: p.blueMid, textDecoration: "underline", textUnderlineOffset: 6 }}>betalen</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Overlay: React.FC<{ props: BuizenpostProps; camY: number }> = ({ props, camY }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = BP_T;

  const win = (a: number, b: number) =>
    interpolate(frame, [a - 1, a, b - 5, b], [0, 1, 1, 0], clamp);
  const bandColor = interpolateColors(camY, [1200, 1600], [p.light, p.blue]);
  const tubeColor = camY < 1400 ? p.blue : p.white;

  // Buddy: pops in as the camera arrives, catches the capsule, steps aside for the CTA.
  const buddyIn = pop(frame, fps, T.arrive - 10, springs.bouncy);
  const fall = interpolate(frame, [T.arrive, T.catch], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const capY = interpolate(fall, [0, 1], [END_Y - 70, CATCH_Y - BUDDY * BUDDY_RATIO - 150]);
  const catchSq = interpolate(frame, [T.catch, T.catch + 3, T.catch + 10], [1, 0.8, 1], clamp);
  const open = interpolate(frame, [T.open - 6, T.open + 6], [0, 1], clamp);
  const card = pop(frame, fps, T.open, springs.pop);
  const cardOut = interpolate(frame, [T.cta, T.cta + 10], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const aside = interpolate(frame, [T.cta, T.cta + 14], [0, 1], { ...clamp, easing: easeIO });
  const buddyX = interpolate(aside, [0, 1], [540, 870]);
  const hop = Math.sin(Math.PI * aside) * 90;
  const lookAt = frame < T.catch ? { x: 0, y: -0.9 } : frame < T.cta ? { x: 0, y: 0.8 } : { x: -0.9, y: 0.4 };

  // Second capsule with the button.
  const fall2 = interpolate(frame, [T.drop2, T.drop2 + 12], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const cap2Y = interpolate(fall2, [0, 1], [END_Y - 70, 1010]);
  const burst = interpolate(frame, [T.button - 8, T.button], [0, 1], clamp);
  const btn = pop(frame, fps, T.button - 2, springs.bouncy);
  const arrowIn = pop(frame, fps, T.button + 6, springs.pop);
  const tap = interpolate(frame, [T.tap, T.tap + 3, T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [T.tap + 1, T.tap + 18], [0, 1], clamp);
  const logo = pop(frame, fps, T.button + 10, springs.smooth);
  const sub = pop(frame, fps, T.button + 16, springs.smooth);

  // Tagline words land on the spoken words.
  const spoken = [wordAt("alleen", 2), wordAt("wat", 2), wordAt("jij", 2), wordAt("erin"), wordAt("stopt", 2)];
  const lines = props.cta.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  return (
    <AbsoluteFill>
      {/* Fixed headline band: the world slides underneath it. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: BAND_H,
          background: bandColor,
          boxShadow: camY > 20 ? `0 18px 40px rgba(0,20,120,${Math.min(0.18, camY / 3000)})` : "none",
        }}
      />
      <div style={{ opacity: win(-30, S2 + 4) }}>
        <Headline text={props.headlines.hook} color={p.blue} delay={-20} stagger={3} />
      </div>
      <div style={{ opacity: win(S2, T.pan + 6) }}>
        <Headline text={props.headlines.pick} color={p.blue} delay={S2 + 2} stagger={3} />
      </div>
      <div style={{ opacity: win(T.pan + 2, T.arrive + 2) }}>
        <Headline text={props.headlines.tube} color={tubeColor} delay={T.pan + 2} stagger={3} />
      </div>
      <div style={{ opacity: win(S4, T.cta + 2) }}>
        <Headline text={props.headlines.read} color={p.white} delay={S4 + 2} stagger={3} />
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 70,
          right: 70,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 120,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const at = spoken[wi] ?? spoken[spoken.length - 1];
              wi++;
              const s = pop(frame, fps, at - 3, springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      color: li === 0 ? p.white : p.blueSoft,
                      opacity: frame < T.cta ? 0 : Math.min(1, s * 1.4),
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
        ))}
      </div>

      {/* Falling capsule → Buddy */}
      {frame >= T.arrive && frame < T.open + 8 ? (
        <div style={{ position: "absolute", left: 540 - 48, top: capY, transform: `rotate(${fall * 10}deg)`, opacity: 1 - Math.max(0, open - 0.7) * 3 }}>
          <Capsule open={open} />
        </div>
      ) : null}

      {/* Read card */}
      {frame >= T.open - 2 ? (
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 1070,
            transform: `translateY(${cardOut * 700}px) scale(${(0.5 + 0.5 * card) * 0.98})`,
            transformOrigin: "50% 0%",
            opacity: Math.min(1, card * 2) * (1 - cardOut),
          }}
        >
          <ReadCard props={props} />
        </div>
      ) : null}

      {/* Buddy */}
      {frame >= T.arrive - 12 ? (
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [T.row4 + 10, T.button + 20])}
          squash={frame < T.arrive + 6 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : catchSq}
          look={lookAt}
          style={{
            position: "absolute",
            left: buddyX - BUDDY / 2,
            top: CATCH_Y - BUDDY * BUDDY_RATIO - hop,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      ) : null}

      {/* Second capsule with the button */}
      {frame >= T.drop2 && frame < T.button + 6 ? (
        <div style={{ position: "absolute", left: 540 - 48, top: cap2Y, opacity: 1 - Math.max(0, burst - 0.5) * 2 }}>
          <Capsule open={burst} content="button" />
        </div>
      ) : null}

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1090,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${1.3 * btn * tap})`,
          opacity: frame >= T.button - 2 ? Math.min(1, btn * 2) : 0,
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
          left: 60,
          right: 60,
          top: 1290,
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: 44,
          color: p.blueText,
          opacity: sub,
        }}
      >
        {props.cta.subline}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1400,
          display: "flex",
          justifyContent: "center",
          opacity: logo,
          transform: `translateY(${(1 - logo) * 40}px)`,
        }}
      >
        <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
      </div>
    </AbsoluteFill>
  );
};

export const BuizenpostAd: React.FC<BuizenpostProps> = (props) => {
  const frame = useCurrentFrame();
  const camY = cameraY(frame);
  return (
    <PaletteProvider colors={props.colors}>
      <AbsoluteFill style={{ background: props.colors.light, overflow: "hidden" }}>
        <World props={props} camY={camY} />
        <Overlay props={props} camY={camY} />
        {props.withVoice && VO_MEASURED ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};
