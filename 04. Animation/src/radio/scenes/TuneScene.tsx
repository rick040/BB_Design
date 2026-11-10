import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { AntennaBuddy } from "../components/AntennaBuddy";
import { KNOB, Radio } from "../components/Radio";
import { type RadioProps, VO_WORDS } from "../schema";

// Beats (scene-local = spoken word frame minus the scene start).
export const tuneBeats = (start: number) => ({
  push: 8, // Buddy leans into the knob
  clear: VO_WORDS.vervaldatum - start, // "vervaldatum": the signal is clean
  dueChip: VO_WORDS.vervaldatum - start + 8,
  week: VO_WORDS.agenda - start - 8, // the week pops in just before "agenda"
  land: VO_WORDS.agenda - start + 2, // "agenda": the bill lands on its day
  bell: VO_WORDS.herinnering - start, // "herinnering": the bell on the reminder day
  subline: VO_WORDS.wanneer - start, // "wanneer jij wilt"
});

const RADIO_SCALE = 0.8;
const RADIO_POS = { x: 16, y: 0 };
const BUDDY = 210;
// Buddy stands right of the radio, against the knob.
const KNOB_X = RADIO_POS.x + KNOB.cx * RADIO_SCALE;
const FEET = { x: KNOB_X + 300, y: RADIO_POS.y + (70 + 400) * RADIO_SCALE };
const TILE = { w: 186, h: 240, gap: 16, y: 480 };
const tileX = (i: number) => (1080 - (5 * TILE.w + 4 * TILE.gap)) / 2 + i * (TILE.w + TILE.gap);

export const TuneScene: React.FC<{
  props: RadioProps["tune"];
  stations: string[];
  bill: RadioProps["bill"];
  start: number;
}> = ({ props, stations, bill, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = tuneBeats(start);

  // Buddy leans into the knob three times; every push turns it further.
  const pushes = [T.push, T.push + 8, T.push + 16];
  let lean = 0;
  for (const s of pushes) lean += interpolate(frame, [s, s + 3, s + 7], [0, 1, 0], clamp);
  const knob = interpolate(frame, [T.push, T.clear], [-40, 260], { ...clamp, easing: Easing.out(Easing.quad) });
  const clarity = interpolate(frame, [T.push, T.clear], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const displayIn = interpolate(frame, [T.clear - 6, T.clear + 4], [0, 1], clamp);
  const dueIn = pop(frame, fps, T.dueChip, springs.pop);
  const happy = frame > T.clear && frame < T.clear + 14 ? 0.2 : 1;

  const weekIn = (i: number) => pop(frame, fps, T.week + i * 2, springs.pop);
  // Bill token: from the dial down onto the due day.
  const fly = interpolate(frame, [T.land - 10, T.land], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const landSq = interpolate(frame, [T.land, T.land + 3, T.land + 9], [1, 0.9, 1], clamp);
  const bellIn = pop(frame, fps, T.bell, springs.bouncy);
  const ring = frame > T.bell ? Math.sin((frame - T.bell) / 1.6) * 14 * Math.max(0, 1 - (frame - T.bell) / 24) : 0;

  const due = props.dueIndex;
  const rem = props.reminderIndex;
  const tokenFrom = { x: RADIO_POS.x + 300 * RADIO_SCALE, y: RADIO_POS.y + 200 * RADIO_SCALE };
  const tokenTo = { x: tileX(due) + TILE.w / 2, y: TILE.y + 150 };

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={4} stagger={3} />
      <Stage offsetY={50}>
        <Radio
          frame={frame}
          needle={0.62}
          clarity={clarity}
          knob={knob}
          stations={stations}
          display={bill.amount}
          displayIn={displayIn}
          style={{
            position: "absolute",
            left: RADIO_POS.x,
            top: RADIO_POS.y,
            transform: `scale(${RADIO_SCALE})`,
            transformOrigin: "0 0",
          }}
        />
        {/* Due chip under the radio, when the signal is clean. */}
        <div
          style={{
            position: "absolute",
            left: RADIO_POS.x + 44 * RADIO_SCALE,
            width: 520 * RADIO_SCALE,
            top: RADIO_POS.y + 480 * RADIO_SCALE - 6,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, dueIn * 2),
            transform: `scale(${0.6 + 0.4 * dueIn})`,
          }}
        >
          <div
            style={{
              padding: "12px 26px",
              borderRadius: 34,
              background: p.blue,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 38,
              whiteSpace: "nowrap",
            }}
          >
            {props.dueChip}
          </div>
        </div>

        <AntennaBuddy
          feetX={FEET.x}
          feetY={FEET.y}
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          squash={1 - lean * 0.08}
          rotate={-lean * 18}
          blink={happy < 1 ? 0.2 : blinkScale(frame, [T.land + 20])}
          look={{ x: -0.8, y: frame > T.week ? 0.7 : 0 }}
          glow={clarity}
          waves={frame > T.clear ? (frame - T.clear) / 26 : 0}
          waveColor={p.blueSoft}
          tipColor={clarity > 0.9 ? p.yellow : p.blueSoft}
          stickColor={p.blue}
        />

        {/* The week, as a strip of day tiles. */}
        {props.days.map((d, i) => {
          const s = weekIn(i);
          const isDue = i === due;
          const filled = isDue && fly >= 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: tileX(i),
                top: TILE.y,
                width: TILE.w,
                height: TILE.h,
                borderRadius: 30,
                background: filled ? p.blue : p.white,
                boxShadow: "0 14px 40px rgba(1, 30, 140, 0.12)",
                opacity: Math.min(1, s * 2),
                transform: `translateY(${(1 - s) * 40}px) scale(${isDue ? landSq : 1})`,
                fontFamily: fonts.display,
                textAlign: "center",
                color: filled ? p.white : p.blue,
              }}
            >
              <div style={{ fontSize: 38, marginTop: 24, opacity: 0.7 }}>{d.day}</div>
              <div style={{ fontSize: 88, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1 }}>{d.date}</div>
              {filled ? (
                <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 34, marginTop: 10 }}>{bill.amount}</div>
              ) : null}
            </div>
          );
        })}

        {/* Bill token flying into the due day. */}
        {fly > 0 && fly < 1 ? (
          <div
            style={{
              position: "absolute",
              left: interpolate(fly, [0, 1], [tokenFrom.x, tokenTo.x]),
              top: interpolate(fly, [0, 1], [tokenFrom.y, tokenTo.y]) - Math.sin(fly * Math.PI) * 120,
              transform: "translate(-50%, -50%)",
              padding: "10px 22px",
              borderRadius: 30,
              background: p.blue,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 32,
              whiteSpace: "nowrap",
            }}
          >
            {bill.amount}
          </div>
        ) : null}

        {/* Reminder bell on the day you chose. */}
        <div
          style={{
            position: "absolute",
            left: tileX(rem) + TILE.w / 2,
            top: TILE.y + TILE.h + 24,
            transform: `translateX(-50%) scale(${bellIn})`,
            transformOrigin: "50% 0",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 24px 12px 16px",
            borderRadius: 34,
            background: p.yellow,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 38,
            color: p.ink,
            whiteSpace: "nowrap",
            opacity: Math.min(1, bellIn * 3),
          }}
        >
          <svg width={48} height={48} viewBox="0 0 24 24" style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%" }}>
            <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v.7A6.5 6.5 0 0 1 18.5 10.5v4.2l1.8 2.6c.4.6 0 1.4-.8 1.4H4.5c-.8 0-1.2-.8-.8-1.4l1.8-2.6v-4.2A6.5 6.5 0 0 1 10.5 4.2v-.7A1.5 1.5 0 0 1 12 2Zm-2.6 18h5.2a2.6 2.6 0 0 1-5.2 0Z" fill={p.ink} />
          </svg>
          {props.reminderLabel}
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={T.subline} />
    </SceneBg>
  );
};

