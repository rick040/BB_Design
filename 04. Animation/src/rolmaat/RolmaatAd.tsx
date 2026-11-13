import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { CtaPill, CTA_H } from "../components/CtaPill";
import { SafeZones } from "../components/SafeZones";
import { Subline } from "../components/Text";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../lib/anim";
import { PaletteProvider, usePalette } from "../lib/palette";
import { fonts, headlineTracking } from "../theme";
import "../theme";
import { BillTag, CARD_TOP, CARD_W, DAY, Housing, HOUSING, MailPill, Ruler, Tape, TAPE_Y, ZERO_X } from "./parts";
import { type RolmaatProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE, wordAt } from "./schema";

// Concept 83 · "Afgemeten. Altijd in te zien." (rolmaat)
// One continuous shot. No scene cuts: the camera follows the tape tip, zooms
// out to show vervaldatum + 14 dagen, whips back with the snapping tape, and a
// blue flood from the housing carries the CTA. All beats are spoken words.

const [, S2, S3, S4, S5] = SCENE_STARTS;

/** Beats, all read from the voice-over alignment. */
export const ROL_T = {
  look: wordAt("rekening"),
  grab: S2,
  pullStart: S2 + 6,
  due: wordAt("vervaldatum"),
  plus: S3,
  keepEnd: wordAt("dagen") + 14,
  gone: wordAt("weg"),
  letGo: S4,
  home: S4 + 22,
  mail: wordAt("eén"),
  flip: wordAt("mailtje") + 12,
  see: wordAt("ziet"),
  flood: S5,
  button: S5 + 4,
  tug: wordAt("buddy", 2) + 8,
  rowStagger: 5,
} as const;

const ease = Easing.inOut(Easing.cubic);
const BUDDY = 180;
const ZOOM_OUT = 0.62;
const BASE = 1.12; // world scale at rest

/** Headline whose words pop on given frames; leaves before `out`. */
const TimedHeadline: React.FC<{ text: string; at: number[]; out?: number; colors: [string, string]; size?: number }> = ({
  text,
  at,
  out,
  colors,
  size = 100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  const leave = out === undefined ? 0 : interpolate(frame, [out - 10, out - 3], [0, 1], clamp);
  if (leave >= 1) return null;
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing: headlineTracking,
        opacity: 1 - leave,
        transform: `translateY(${-leave * 40}px)`,
      }}
    >
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((w, i) => {
            const t = at[Math.min(wi++, at.length - 1)];
            const s = pop(frame, fps, t - 2, springs.pop);
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: "inline-block",
                    color: colors[li === 0 ? 0 : 1],
                    opacity: Math.min(1, s * 1.4),
                    transform: `translateY(${(1 - s) * 0.4}em) scale(${0.88 + 0.12 * s})`,
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
  );
};

const range = (from: number, step: number, n: number) => Array.from({ length: n }, (_, i) => from + i * step);

const Shot: React.FC<RolmaatProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = ROL_T;
  const { ruler } = props;
  const dueX = ZERO_X + ruler.dueDays * DAY;
  const endDays = ruler.dueDays + ruler.keepDays;
  const endX = ZERO_X + endDays * DAY;

  // Tape tip: out to the due date, on to +14, then snaps home.
  let tipX: number;
  if (frame < T.letGo) {
    tipX = interpolate(frame, [T.pullStart, T.due + 8, T.plus + 2, T.keepEnd], [ZERO_X, dueX, dueX, endX], {
      ...clamp,
      easing: ease,
    });
  } else {
    tipX = interpolate(frame, [T.letGo, T.home], [endX, ZERO_X], { ...clamp, easing: Easing.in(Easing.cubic) });
  }
  const zipping = frame >= T.letGo && frame < T.home;
  const tipSpeed = Math.abs(
    tipX -
      (frame - 1 < T.letGo
        ? interpolate(frame - 1, [T.pullStart, T.due + 8, T.plus + 2, T.keepEnd], [ZERO_X, dueX, dueX, endX], { ...clamp, easing: ease })
        : interpolate(frame - 1, [T.letGo, T.home], [endX, ZERO_X], { ...clamp, easing: Easing.in(Easing.cubic) })),
  );

  // Camera: locked on the tip, zooms out during "plus veertien dagen".
  const zoomOut = interpolate(frame, [T.plus, T.keepEnd], [0, 1], { ...clamp, easing: ease });
  const zoomBack = interpolate(frame, [T.letGo, T.home + 6], [0, 1], { ...clamp, easing: ease });
  const z = 1 - (1 - ZOOM_OUT) * zoomOut * (1 - zoomBack);
  const wideCam = dueX + (endX - dueX) / 2 + 120;
  const followCam = Math.max(ZERO_X, tipX);
  const camX = interpolate(zoomOut * (1 - zoomBack), [0, 1], [followCam, wideCam]);
  const blur = Math.min(12, tipSpeed * (zipping ? 0.12 : 0.05));

  // Card fields: dissolve on "weg", come back home, highlight on "ziet".
  const present = props.bill.fields.map((_, i) => {
    const out = interpolate(frame, [T.gone - 4 + i * 4, T.gone + 8 + i * 4], [1, 0], clamp);
    const back = pop(frame, fps, T.home + 2 + i * 3, springs.pop);
    return frame < T.home ? out : Math.min(1, back);
  });
  const inzage = interpolate(frame, [T.flip, T.flip + 10], [0, 1], { ...clamp, easing: ease });
  const highlight = props.bill.fields.map((_, i) =>
    interpolate(frame, [T.see - 10 + i * T.rowStagger, T.see - 2 + i * T.rowStagger], [0, 1], clamp),
  );
  const cardFlip = interpolate(frame, [T.flip - 6, T.flip, T.flip + 6], [0, 90, 0], clamp);

  // Buddy: holds the tip, walks while the tape runs, gets yanked home.
  const walking = !zipping && tipSpeed > 0.8;
  const step = walking ? Math.abs(Math.sin(frame * 0.55)) : 0;
  const land = frame >= T.home ? pop(frame, fps, T.home, springs.bouncy) : 1;
  const grab = pop(frame, fps, T.grab, springs.bouncy);
  let squash = 1 + step * 0.08 - (1 - land) * 0.3 + (1 - grab) * -0.12;
  let lift = step * 16;
  if (zipping) {
    squash = 1.18;
    lift = 50 * Math.sin(Math.PI * interpolate(frame, [T.letGo, T.home], [0, 1], clamp));
  }
  const look =
    frame < T.look
      ? { x: 0, y: 0 }
      : frame < T.grab
        ? { x: -0.6, y: -0.9 }
        : frame < T.mail
          ? { x: zipping ? -1 : 1, y: 0 }
          : frame < T.flip
            ? { x: 0.2, y: 0.8 }
            : { x: -0.6, y: -0.9 };
  const blink = frame >= T.gone - 2 && frame < T.letGo ? 0.18 : blinkScale(frame, [18, T.due + 14, T.see + 8]);
  const buddyX = tipX + 14;

  // Counter chip "+N dagen" during the zoom.
  const days = Math.round(interpolate(tipX, [dueX, endX], [0, ruler.keepDays], clamp));
  const counterIn = frame >= T.plus && frame < T.letGo ? pop(frame, fps, T.plus, springs.pop) : 0;

  // Mail pill under the tape.
  const mailIn = frame >= T.mail ? pop(frame, fps, T.mail - 2, springs.pop) : 0;

  const world = (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1080,
        height: 1920,
        transformOrigin: "0 0",
        transform: `translate(540px, 1000px) scale(${z * BASE}) translate(${-camX}px, -1000px)`,
        filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
      }}
    >
      <Ruler
        days={endDays + 3}
        todayDate={ruler.todayDate}
        today={ruler.today}
        dueDays={ruler.dueDays}
        dueLabel={ruler.dueLabel}
        endDays={endDays}
        endLabel={ruler.endLabel}
        dueGlow={interpolate(frame, [T.due + 4, T.due + 12], [0, 1], clamp)}
        endGlow={interpolate(frame, [T.keepEnd - 6, T.keepEnd + 2], [0, 1], clamp)}
      />
      <Tape tipX={tipX} />
      <Housing />
      {/* string from tag to tip */}
      <div
        style={{
          position: "absolute",
          left: tipX - 2,
          top: CARD_TOP + 420,
          width: 4,
          height: TAPE_Y - (CARD_TOP + 420) - 10,
          background: p.greyText,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: tipX - CARD_W / 2,
          top: CARD_TOP,
          transform: `perspective(1600px) rotateY(${cardFlip}deg) rotate(${zipping ? -4 : 0}deg)`,
        }}
      >
        <BillTag
          sender={props.bill.sender}
          subject={props.bill.subject}
          fields={props.bill.fields}
          present={present}
          inzage={inzage}
          inzageTitle={props.inzage.title}
          keptLabel={props.inzage.keptLabel}
          keptValue={ruler.endLabel}
          highlight={highlight}
          goneLabel={ruler.goneLabel}
        />
      </div>
      {counterIn > 0 ? (
        <div
          style={{
            position: "absolute",
            left: tipX - 250,
            top: TAPE_Y - 96,
            width: 220,
            display: "flex",
            justifyContent: "flex-end",
            transform: `scale(${counterIn})`,
            transformOrigin: "100% 100%",
          }}
        >
          <div
            style={{
              padding: "8px 22px 10px",
              borderRadius: 30,
              background: p.yellow,
              color: p.ink,
              fontFamily: fonts.ui,
              fontWeight: 700,
              fontSize: 36,
              whiteSpace: "nowrap",
            }}
          >
            +{days} {ruler.counterUnit}
          </div>
        </div>
      ) : null}
      <Buddy
        size={BUDDY}
        body={p.blueMascot}
        eye={p.white}
        blink={blink}
        look={look}
        squash={squash}
        style={{
          position: "absolute",
          left: buddyX,
          top: TAPE_Y - BUDDY * BUDDY_RATIO - lift,
          transform: `rotate(${zipping ? -14 : walking ? 4 : 0}deg)`,
          transformOrigin: "50% 100%",
        }}
      />
    </div>
  );

  // Blue flood from the housing carries the CTA.
  const housingScreen = { x: (HOUSING.x + HOUSING.w / 2 - camX) * z * BASE + 540, y: 1000 + (TAPE_Y - 1000) * BASE };
  const flood = interpolate(frame, [T.flood - 2, T.flood + 16], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });

  return (
    <AbsoluteFill style={{ background: p.light, overflow: "hidden" }}>
      {flood < 1 ? world : null}
      {flood < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1478,
            display: "flex",
            justifyContent: "center",
            opacity: mailIn > 0 ? Math.min(1, mailIn * 1.5) : 0,
            transform: `translateY(${(1 - mailIn) * 40}px) scale(${0.8 + 0.2 * mailIn})`,
          }}
        >
          <MailPill text={props.inzage.mail} />
        </div>
      ) : null}
      {flood < 1 ? (
        <>
          <TimedHeadline text={props.headlines.hook} at={range(-24, 2, 6)}
            size={94} out={S2} colors={[p.blue, p.blue]} />
          <TimedHeadline
            text={props.headlines.measure}
            at={[S2, wordAt("meet"), wordAt("het"), wordAt("af")]}
            out={S3}
            colors={[p.blue, p.blue]}
          />
          <TimedHeadline
            text={props.headlines.keep}
            at={[S3, wordAt("veertien"), wordAt("dagen"), wordAt("daarna"), wordAt("is"), wordAt("het", 2), wordAt("weg")]}
            out={S4}
            colors={[p.blue, p.blue]}
          />
          <TimedHeadline
            text={props.headlines.look}
            at={[S4, wordAt("hij", 2), wordAt("nu"), wordAt("heeft"), wordAt("eén"), wordAt("mailtje"), wordAt("en"), wordAt("je"), wordAt("ziet"), wordAt("het", 3)]}
            out={S5}
            colors={[p.blue, p.blueMid]}
            size={92}
          />
        </>
      ) : null}
      {flood > 0 ? (
        <div
          style={{
            position: "absolute",
            left: housingScreen.x - 2400 * flood,
            top: housingScreen.y - 2400 * flood,
            width: 4800 * flood,
            height: 4800 * flood,
            borderRadius: "50%",
            background: p.blue,
          }}
        />
      ) : null}
      {frame >= T.flood ? <CtaEnd {...props} /> : null}
    </AbsoluteFill>
  );
};

/** End frame: the CTA button comes out of the rolmaat like tape, Buddy pulls it. */
const CtaEnd: React.FC<RolmaatProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = ROL_T;
  const H = { x: 90, y: 880, w: 170, h: 150 };
  const pillW = 520;
  const out = interpolate(frame, [T.button + 4, T.button + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const hIn = pop(frame, fps, T.button - 2, springs.pop);
  const tug = frame >= T.tug ? pop(frame, fps, T.tug, springs.bouncy) : 0;
  const tugPulse = frame >= T.tug ? Math.sin(Math.min(1, (frame - T.tug) / 10) * Math.PI) : 0;
  const pillLeft = H.x + H.w - 30;
  const visibleW = pillW * out;
  const buddyIn = pop(frame, fps, T.button, springs.bouncy);
  const logoIn = pop(frame, fps, T.button + 16, springs.smooth);
  const subIn = T.button + 22;
  const pillTop = H.y + H.h / 2 - CTA_H / 2;
  const lines = props.cta.tagline.split("\n");
  return (
    <>
      <TimedHeadline
        text={props.cta.tagline}
        at={range(T.flood + 4, 4, lines.join(" ").split(/\s+/).length)}
        colors={[p.white, p.blueSoft]}
        size={112}
      />
      <div
        style={{
          position: "absolute",
          left: pillLeft,
          top: pillTop,
          width: visibleW + tugPulse * 12,
          height: CTA_H + 40,
          marginTop: -20,
          overflow: "hidden",
          paddingTop: 20,
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "absolute", right: 0, top: 20 }}>
          <CtaPill text={props.cta.button} arrowIn={1} arrowNudge={tugPulse * 10} style={{ width: pillW }} />
        </div>
      </div>
      <div style={{ transform: `scale(${hIn})`, transformOrigin: `${H.x + H.w / 2}px ${H.y + H.h / 2}px`, position: "absolute", inset: 0 }}>
        <div
          style={{
            position: "absolute",
            left: H.x,
            top: H.y,
            width: H.w,
            height: H.h,
            borderRadius: 40,
            background: p.white,
            boxShadow: "0 24px 50px rgba(0, 20, 120, 0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 22,
              width: 106,
              height: 106,
              borderRadius: "50%",
              border: `13px solid ${p.blueSoft}`,
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
      <Buddy
        size={170}
        body={p.white}
        eye={p.blueMascot}
        blink={blinkScale(frame, [T.tug + 12])}
        look={{ x: -0.8, y: 0.1 }}
        squash={1 - tugPulse * 0.18 + (1 - buddyIn) * -0.2}
        style={{
          position: "absolute",
          left: pillLeft + visibleW + 10 + tugPulse * 12,
          top: pillTop + CTA_H - 170 * BUDDY_RATIO + 20,
          opacity: Math.min(1, buddyIn * 2),
          transform: `rotate(${8 + tug * 0}deg)`,
          transformOrigin: "50% 100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1150,
          display: "flex",
          justifyContent: "center",
          opacity: logoIn,
          transform: `translateY(${(1 - logoIn) * 30}px)`,
        }}
      >
        <Wordmark size={110} betaal={p.blueSoft} buddy={p.white} />
      </div>
      <Subline text={props.cta.subline} color={p.blueText} delay={subIn} />
    </>
  );
};

export const RolmaatAd: React.FC<RolmaatProps> = (props) => (
  <PaletteProvider colors={props.colors}>
    <AbsoluteFill>
      <Shot {...props} />
      {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
      {props.showSafeZones ? <SafeZones /> : null}
    </AbsoluteFill>
  </PaletteProvider>
);

export { TOTAL_FRAMES };
