import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { CtaPill } from "../components/CtaPill";
import { SafeZones } from "../components/SafeZones";
import { Headline, Subline } from "../components/Text";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, shake, springs } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { PaletteProvider } from "../lib/palette";
import { brand } from "../theme";
import {
  AgendaTile,
  AgendaWidget,
  APP_BADGES,
  APP_COLORS,
  APP_GLYPHS,
  AppTile,
  DateChip,
  InstallSheet,
  MailCard,
  MailTile,
  PHONE,
  PhoneBody,
  SCREEN,
} from "./components/PhoneParts";
import { BEATS as B, type GeenAppProps, SCENE_STARTS, VO_FILE } from "./schema";

// Concept 67 · "Geen app. Je mail is genoeg." (volle telefoon)
// One continuous shot: no scene cuts. The phone tilts when Buddy bumps it
// (the apps tumble out), and at the end the camera dives into the screen so
// its blue wallpaper becomes the CTA background. All beats sit on spoken words.

const ICON = 78;
const COLS = [-147, -49, 49, 147];
const ROWS = [-300, -190, -80, 30];
const DOCK_Y = 330;
const MAIL_X = -55;
const AGENDA_X = 55;
// Order in which the 16 apps drop out (looks random, stays deterministic).
const FALL_ORDER = [5, 0, 11, 3, 14, 8, 1, 12, 6, 15, 2, 9, 13, 4, 10, 7];

const BUDDY_SIZE = 190;
const BUDDY_H = BUDDY_SIZE * BUDDY_RATIO;
const BUDDY_X = 330;
const GROUND = PHONE.h / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Fade a block out over 6 frames ending at `end`. */
const visible = (frame: number, start: number, end: number) =>
  frame < start - 1 || frame >= end ? 0 : interpolate(frame, [end - 6, end], [1, 0], clamp);

export const GeenAppAd: React.FC<GeenAppProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const c = props.colors;
  const [, S2, S3, S4] = SCENE_STARTS;

  // ── camera ──────────────────────────────────────────────────────────────
  // Phone starts centred, slides left when Buddy arrives.
  const px = interpolate(frame, [B.buddyIn - 6, B.buddyIn + 8], [0, -90], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const dive = interpolate(frame, [B.dive, B.dive + B.diveLen], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const zoom = lerp(1, 5.5, dive);
  const camX = L.width / 2;
  const camY = lerp(L.stageCenterY, L.height / 2, dive);
  const focusX = lerp(0, px, dive);
  const showStage = frame < B.dive + B.diveLen;
  const ctaBg = frame >= B.dive + B.diveLen - 1 ? 1 : 0;

  // ── phone ───────────────────────────────────────────────────────────────
  const tilt = interpolate(frame, [B.bump - 1, B.bump + 4, B.bump + 22], [0, -9, 0], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const sh = shake(frame, B.storageFull, 12, 10);

  // Install sheet: slides up, dropped on "niet".
  const sheetUp = pop(frame, fps, B.sheetIn, springs.smooth);
  const sheetDown = interpolate(frame, [B.cancel, B.cancel + 12], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const sheetY = SCREEN.h / 2 - 250 + (1 - sheetUp) * 320 + sheetDown * 420;

  // Mail card on the screen.
  const mailUp = pop(frame, fps, B.mailIn, springs.pop);
  const press = interpolate(frame, [B.forwardTap - 2, B.forwardTap + 2, B.forwardTap + 8], [0, 1, 0], clamp);
  const flyStart = B.forwardTap + 4;
  const fly = interpolate(frame, [flyStart, B.catchMail], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });

  // Date chip: pops above Buddy, thrown into the agenda tile.
  const chipPop = pop(frame, fps, B.dateChip, springs.pop);
  const chipFly = interpolate(frame, [B.throwDate, B.agendaLand], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const chipFrom = { x: BUDDY_X, y: GROUND - BUDDY_H - 95 };
  const chipTo = { x: -90 + AGENDA_X, y: DOCK_Y };
  const agendaBounce = pop(frame, fps, B.agendaLand, springs.bouncy);
  const widget = pop(frame, fps, B.agendaLand, springs.pop);
  const widgetFade = interpolate(frame, [B.dive - 2, B.dive + 8], [1, 0], clamp);

  // ── Buddy (blue on light) ───────────────────────────────────────────────
  let bx = 900;
  let by = 0;
  let squash = 1;
  let lookX = 0;
  let lookY = 0;
  if (frame >= B.buddyIn - 6) {
    const j = interpolate(frame, [B.buddyIn - 6, B.buddyIn + 8], [0, 1], clamp);
    bx = lerp(900, BUDDY_X, j);
    by = -Math.sin(j * Math.PI) * 220;
    if (frame >= B.buddyIn + 8) squash = 1 - 0.25 * Math.max(0, 1 - (frame - B.buddyIn - 8) / 6);
    lookX = -0.6;
  }
  if (frame >= B.cancel && frame < B.cancel + 16) lookX = Math.sin((frame - B.cancel) * 0.8) * 0.9;
  if (frame >= B.bump - 10 && frame < B.bump) {
    // wind-up, then dash into the phone
    const w = interpolate(frame, [B.bump - 10, B.bump - 5, B.bump], [0, 1, 0], clamp);
    const d = interpolate(frame, [B.bump - 5, B.bump], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    bx = BUDDY_X + 30 * w - 95 * d;
    squash = 1 - 0.15 * w;
    lookX = -1;
  }
  if (frame >= B.bump) {
    const r = interpolate(frame, [B.bump, B.bump + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    bx = lerp(BUDDY_X - 95, BUDDY_X, r);
    by = -Math.sin(r * Math.PI) * 60;
    if (frame < B.bump + 4) squash = 0.8;
    lookX = -0.8;
  }
  if (frame >= B.mailIn) lookX = -0.9;
  if (frame >= B.catchMail - 4) {
    squash = frame < B.catchMail + 5 ? 1 - 0.2 * Math.sin(((frame - B.catchMail + 4) / 9) * Math.PI) : 1;
    lookX = -0.2;
    lookY = -0.6;
  }
  if (frame >= B.throwDate - 4 && frame < B.agendaLand) {
    const h = interpolate(frame, [B.throwDate - 4, B.throwDate + 8], [0, 1], clamp);
    by = -Math.sin(h * Math.PI) * 70;
    lookX = -1;
    lookY = 0.6;
  }
  if (frame >= B.agendaLand) {
    lookX = -0.8;
    lookY = 0.2;
  }
  const happy = (frame >= B.appsGone && frame < B.appsGone + 12) || (frame >= B.agendaLand + 4 && frame < B.agendaLand + 20);
  const blink = happy ? 0.18 : blinkScale(frame, [B.buddyIn + 40, B.mailIn + 2]);

  // ── stage (camera space, origin = stage centre) ─────────────────────────
  const stage = (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transformOrigin: "0 0",
        transform: `translate(${camX}px, ${camY}px) scale(${L.stageScale * zoom}) translate(${-focusX}px, 0px)`,
      }}
    >
      {/* phone */}
      <div
        style={{
          position: "absolute",
          left: px + sh.x,
          top: sh.y,
          transform: `rotate(${tilt + sh.r}deg)`,
          transformOrigin: `${-PHONE.w / 2}px ${PHONE.h / 2}px`,
        }}
      >
        <PhoneBody wallpaper={`linear-gradient(160deg, ${brand.blueMid}, ${c.blue})`}>
          {/* dock */}
          <div
            style={{
              position: "absolute",
              left: -170,
              top: DOCK_Y - 58,
              width: 340,
              height: 116,
              borderRadius: 40,
              background: "rgba(255,255,255,0.18)",
              opacity: widgetFade,
            }}
          />
          <MailTile size={84} style={{ left: MAIL_X - 42, top: DOCK_Y - 42, opacity: widgetFade }} />
          <AgendaTile
            size={84}
            day={props.forward.day}
            date={props.forward.date}
            style={{
              left: AGENDA_X - 42,
              top: DOCK_Y - 42,
              opacity: widgetFade,
              transform: `scale(${frame >= B.agendaLand ? 1 + 0.25 * Math.sin(Math.min(1, (frame - B.agendaLand) / 10) * Math.PI) * (1 - agendaBounce * 0.2) : 1})`,
            }}
          />
          {/* install sheet */}
          {frame < B.cancel + 14 ? (
            <div style={{ position: "absolute", left: -(SCREEN.w - 28) / 2, top: sheetY, transform: `rotate(${sheetDown * 6}deg)` }}>
              <InstallSheet
                title={props.hook.installTitle}
                installing={props.hook.installing}
                chip={props.hook.storageChip}
                progress={interpolate(frame, [B.sheetIn, B.cancel], [0.06, 0.74], clamp)}
                chipIn={pop(frame, fps, B.storageFull, springs.pop)}
                width={SCREEN.w - 28}
              />
            </div>
          ) : null}
          {/* forwarded mail on the screen */}
          {frame >= B.mailIn - 2 && frame < flyStart ? (
            <div
              style={{
                position: "absolute",
                left: -(SCREEN.w - 36) / 2,
                top: lerp(-SCREEN.h / 2 - 300, -SCREEN.h / 2 + 90, mailUp),
              }}
            >
              <MailCard {...props.bill} button={props.forward.button} press={press} width={SCREEN.w - 36} />
            </div>
          ) : null}
          {/* agenda widget grows out of the agenda tile */}
          {frame >= B.agendaLand ? (
            <div
              style={{
                position: "absolute",
                left: -170,
                top: -230,
                transformOrigin: `${170 + AGENDA_X}px ${230 + DOCK_Y}px`,
                transform: `scale(${0.15 + 0.85 * widget})`,
                opacity: Math.min(1, widget * 2) * widgetFade,
              }}
            >
              <AgendaWidget
                month={props.forward.month}
                day={props.forward.day}
                date={props.forward.date}
                event={`${props.bill.sender} ${props.bill.amount}`}
                reminder={props.forward.reminder}
                eventIn={pop(frame, fps, B.agendaLand + 6, springs.smooth)}
                width={340}
              />
            </div>
          ) : null}
        </PhoneBody>
        {/* app grid: drawn outside the screen clip so the apps can tumble out */}
        {COLS.flatMap((x, ci) =>
          ROWS.map((y, ri) => {
            const i = ri * 4 + ci;
            const start = B.bump + 1 + FALL_ORDER[i] * 1.7;
            const t = Math.max(0, frame - start);
            const dy = 2.6 * t * t;
            if (dy > 2400) return null;
            const vx = ((i * 37) % 11) - 5;
            const jiggle = frame < B.bump ? Math.sin(frame * 0.8 + i * 1.7) * 2.5 : 0;
            return (
              <AppTile
                key={i}
                size={ICON}
                color={APP_COLORS[i]}
                glyph={APP_GLYPHS[i % APP_GLYPHS.length]}
                badge={APP_BADGES[i]}
                style={{
                  left: x - ICON / 2 + vx * t,
                  top: y - ICON / 2 + dy,
                  transform: `rotate(${jiggle + t * (vx * 2.2 + 3)}deg)`,
                }}
              />
            );
          }),
        )}
      </div>

      {/* mail flying from the screen to Buddy */}
      {frame >= flyStart && frame < B.catchMail + 2 ? (
        <div
          style={{
            position: "absolute",
            left: lerp(px - (SCREEN.w - 36) / 2, BUDDY_X - 90, fly),
            top: lerp(-SCREEN.h / 2 + 106, GROUND - BUDDY_H * 0.7, fly) - Math.sin(fly * Math.PI) * 160,
            transformOrigin: "0 0",
            transform: `scale(${lerp(1, 0.45, fly)}) rotate(${fly * 14}deg)`,
          }}
        >
          <MailCard {...props.bill} button={props.forward.button} press={0} width={SCREEN.w - 36} />
        </div>
      ) : null}

      {/* date chip */}
      {frame >= B.dateChip && frame < B.agendaLand + 1 ? (
        <div
          style={{
            position: "absolute",
            left: lerp(chipFrom.x, chipTo.x, chipFly),
            top: lerp(chipFrom.y, chipTo.y, chipFly) - Math.sin(chipFly * Math.PI) * 260,
            transform: `translate(-50%, -50%) scale(${chipPop * lerp(1, 0.4, chipFly)}) rotate(${chipFly * -20}deg)`,
          }}
        >
          <DateChip text={props.bill.dateChip} />
        </div>
      ) : null}

      {/* Buddy */}
      <div style={{ position: "absolute", left: bx - BUDDY_SIZE / 2, top: GROUND - BUDDY_H + by }}>
        <Buddy
          size={BUDDY_SIZE}
          body={brand.blueMascot}
          eye="#ffffff"
          blink={blink}
          look={{ x: lookX, y: lookY }}
          squash={squash}
        />
      </div>
    </div>
  );

  // ── text per beat (no cuts, the copy swaps on the voice) ────────────────
  const texts = (
    <>
      <div style={{ opacity: visible(frame, 0, S2 - 2) }}>
        <Headline text={props.hook.headline} color={c.blue} delay={-22} stagger={3} />
      </div>
      <div style={{ opacity: visible(frame, S2 - 2, S3 - 2) }}>
        <Headline text={props.noApp.headline} color={c.blue} delay={S2 - 2} stagger={4} />
      </div>
      <div style={{ opacity: visible(frame, S3 - 2, B.dive + 6) }}>
        <Headline text={props.forward.headline} color={c.blue} delay={S3 - 2} stagger={3} />
      </div>
      <div style={{ opacity: visible(frame, 0, S2 - 4) }}>
        <Subline text={props.hook.subline} color={brand.ink} delay={B.storageFull - 14} />
      </div>
      <div style={{ opacity: visible(frame, B.bump, S3 - 4) }}>
        <Subline text={props.noApp.subline} color={brand.ink} delay={B.bump + 10} />
      </div>
      <div style={{ opacity: visible(frame, B.agendaLand, B.dive + 6) }}>
        <Subline text={props.forward.subline} color={brand.ink} delay={B.agendaLand} />
      </div>
    </>
  );

  // ── CTA (on the dived-into wallpaper) ───────────────────────────────────
  const s = L.stageScale;
  const ground = L.stageCenterY + 40 * s;
  const ctaBuddySize = 200 * s;
  const ctaBuddyH = ctaBuddySize * BUDDY_RATIO;
  const ctaBuddyIn = pop(frame, fps, S4 + 2, springs.bouncy);
  const kick = S4 + 30;
  const iconSize = 110 * s;
  const iconX = L.width / 2 + 30 * s;
  // The last app rolls in along the ground from the right.
  const rollIn = interpolate(frame, [S4 + 6, S4 + 22], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const iconFallY = ground - iconSize - Math.abs(Math.sin(rollIn * Math.PI * 2)) * 40 * s;
  const kickT = interpolate(frame, [kick, kick + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const lunge = interpolate(frame, [kick - 6, kick, kick + 10], [0, 1, 0], clamp);
  const tapPress = interpolate(frame, [B.tap - 2, B.tap + 2, B.tap + 8], [0, 1, 0], clamp);
  const pill = pop(frame, fps, S4 + 4, springs.pop);

  const cta =
    frame >= B.dive + B.diveLen - 1 ? (
      <AbsoluteFill style={{ opacity: ctaBg }}>
        <AbsoluteFill style={{ background: `linear-gradient(160deg, ${brand.blueMid}, ${c.blue})` }} />
        <CtaTagline text={props.cta.tagline} delay={B.dive + B.diveLen - 3} soft={c.softBlue} />
        {/* last app drops in, Buddy kicks it out of frame */}
        <div
          style={{
            position: "absolute",
            left: iconX + rollIn * 700 * s + kickT * 900 * s,
            top: iconFallY - kickT * 260 * s - Math.sin(kickT * Math.PI) * 80 * s,
            transform: `rotate(${rollIn * -360 + kickT * 540}deg)`,
          }}
        >
          <AppTile size={iconSize} color={APP_COLORS[3]} glyph="tri" badge={5} style={{ position: "relative" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: L.width / 2 - 120 * s - ctaBuddySize / 2 + lunge * 40 * s,
            top: ground - ctaBuddyH + (1 - ctaBuddyIn) * 300 * s,
          }}
        >
          <Buddy
            size={ctaBuddySize}
            body="#ffffff"
            eye={brand.blueMascot}
            blink={frame >= kick + 4 && frame < kick + 18 ? 0.18 : blinkScale(frame, [S4 + 14])}
            look={{ x: frame < kick + 4 ? 0.9 : 0.5, y: frame < kick ? 0.3 : -0.2 }}
            squash={1 - 0.2 * lunge}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: L.stageCenterY + 200 * s - 52,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${(0.6 + 0.4 * pill) * (1 - 0.06 * tapPress)})`,
            opacity: Math.min(1, pill * 2),
          }}
        >
          <CtaPill text={props.cta.button} arrowIn={pill} arrowNudge={tapPress * 10} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: L.stageCenterY + 320 * s,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [S4 + 10, S4 + 20], [0, 1], clamp),
          }}
        >
          <Wordmark size={64 * (L.tall ? 1 : 0.85)} betaal={c.softBlue} buddy="#ffffff" />
        </div>
        <Subline text={props.cta.subline} color={c.bodyOnBlue} delay={S4 + 8} />
      </AbsoluteFill>
    ) : null;

  return (
    <PaletteProvider colors={c}>
      <AbsoluteFill style={{ background: c.light, overflow: "hidden" }}>
        {showStage ? stage : null}
        {texts}
        {cta}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};

/** Two-tone tagline: first line white, the rest soft blue. */
const CtaTagline: React.FC<{ text: string; delay: number; soft: string }> = ({ text, delay, soft }) => {
  const [first, ...rest] = text.split("\n");
  const firstWords = first.split(/\s+/).filter(Boolean).length;
  return (
    <>
      <Headline text={first} color="#ffffff" delay={delay} stagger={2} />
      <TaglineRest text={rest.join("\n")} color={soft} delay={delay + firstWords * 2} />
    </>
  );
};

const TaglineRest: React.FC<{ text: string; color: string; delay: number }> = ({ text, color, delay }) => {
  const L = useLayout();
  return <Headline text={text} color={color} delay={delay} stagger={2} top={L.safeTop + L.headlineSize * 1.0} />;
};
