import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { IceSpray, SkaterBuddy } from "../components/SkaterBuddy";
import type { IjsProps } from "../schema";
import { wordAt } from "../vo";

export const agendaBeats = (start: number) => ({
  headline: wordAt("hij") - start - 2, // "en HIJ zet hem"
  skate: wordAt("zet") - start, // Buddy starts skating along the week
  reminder: wordAt("herinnering") - start, // bell rings on the reminder day
  toss: wordAt("agenda") - start - 8, // tosses the bill up to the due day
  land: wordAt("agenda") - start, // "in je AGENDA": bill lands on the day
  subline: wordAt("herinnering") - start + 10,
});

const TILE_W = 140;
const TILE_H = 240;
const GAP = 10;
const ROW_X = (1080 - (7 * TILE_W + 6 * GAP)) / 2;
const ROW_Y = 100;
const FEET = 800;
const BUDDY = 250;
const tileCx = (i: number) => ROW_X + i * (TILE_W + GAP) + TILE_W / 2;

const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <path d="M12 3a6 6 0 0 0-6 6v3.5L4.5 16h15L18 12.5V9a6 6 0 0 0-6-6Z" fill={color} />
    <circle cx={12} cy={19} r={2.2} fill={color} />
  </svg>
);

export const AgendaScene: React.FC<{ props: IjsProps["agenda"]; bill: IjsProps["bill"]; start: number }> = ({
  props,
  bill,
  start,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const B = agendaBeats(start);

  const remX = tileCx(props.reminderIndex);
  const dueX = tileCx(props.dueIndex);
  const bx = interpolate(frame, [B.skate - 4, B.reminder, B.toss, B.land + 6], [-160, remX, dueX - 30, dueX], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const moving = frame > B.skate - 4 && frame < B.land + 4;
  const lean = moving ? 9 + Math.sin(frame / 3.2) * 5 : interpolate(frame, [B.land + 4, B.land + 10], [-10, 0], clamp);
  const bob = moving ? Math.abs(Math.sin(frame / 3.2)) * -8 : 0;

  // the bill rides above Buddy's head, then flies up into the due tile
  const toss = interpolate(frame, [B.toss, B.land], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const carryY = FEET - BUDDY * 1.25 - 70 + bob;
  const slipX = interpolate(toss, [0, 1], [bx, dueX]);
  const slipY = interpolate(toss, [0, 1], [carryY, ROW_Y + TILE_H / 2]) - Math.sin(toss * Math.PI) * 110;
  const slipS = interpolate(toss, [0, 1], [1, 0.55]);
  const landed = frame >= B.land;
  const landPop = pop(frame, fps, B.land, springs.bouncy);
  const ring = pop(frame, fps, B.reminder, springs.bouncy);
  const swing = frame >= B.reminder ? Math.sin((frame - B.reminder) / 2.2) * 22 * Math.max(0, 1 - (frame - B.reminder) / 24) : 0;
  const rowIn = pop(frame, fps, -10, springs.smooth);
  const spray = interpolate(frame, [B.land + 2, B.land + 18], [0, 1], clamp);

  // skate trail behind Buddy
  const trailFrom = -160;
  const trailTo = Math.max(trailFrom, bx - 40);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={B.headline} stagger={3} />
      <Stage offsetY={30}>
        <div style={{ position: "absolute", left: ROW_X, top: ROW_Y - 66, fontFamily: fonts.display, fontSize: 44, fontWeight: 500, color: p.blue, letterSpacing: "-0.03em", opacity: rowIn }}>
          {props.month}
        </div>
        {props.days.map((d, i) => {
          const isDue = i === props.dueIndex && landed;
          const isRem = i === props.reminderIndex && frame >= B.reminder;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: ROW_X + i * (TILE_W + GAP),
                top: ROW_Y,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 26,
                boxSizing: "border-box",
                background: isDue ? p.blue : isRem ? p.blueSoft : "#e4ecff",
                border: `3px solid ${isDue ? p.blue : p.blueSoft}`,
                fontFamily: fonts.display,
                color: isDue ? p.white : p.blue,
                textAlign: "center",
                paddingTop: 22,
                opacity: rowIn,
                transform: isDue ? `scale(${0.9 + 0.1 * landPop + Math.max(0, 1 - landPop) * 0.1})` : isRem ? `scale(${0.92 + 0.08 * ring})` : undefined,
                boxShadow: isDue ? "0 18px 36px rgba(1,59,255,0.3)" : undefined,
              }}
            >
              <div style={{ fontSize: 30, opacity: 0.75 }}>{d.dow}</div>
              <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05 }}>{d.day}</div>
              {isDue ? (
                <div style={{ fontFamily: fonts.ui, fontSize: 24, fontWeight: 600, marginTop: 10, opacity: landPop }}>{bill.amount}</div>
              ) : null}
              {isRem ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 8, transform: `rotate(${swing}deg) scale(${ring})`, transformOrigin: "50% 10%" }}>
                  <Bell size={46} color={p.blue} />
                </div>
              ) : null}
            </div>
          );
        })}
        {frame >= B.reminder ? (
          <div
            style={{
              position: "absolute",
              left: remX - 110,
              top: ROW_Y + TILE_H + 18,
              width: 220,
              textAlign: "center",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 28,
              color: p.blue,
              opacity: ring,
            }}
          >
            {props.reminderLabel}
          </div>
        ) : null}

        {/* ice lane + trail */}
        <div style={{ position: "absolute", left: -40, right: -40, top: FEET - 6, height: 56, borderRadius: 28, background: "#e1e9ff" }} />
        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path
            d={`M ${trailFrom} ${FEET + 18} Q ${(trailFrom + trailTo) / 2} ${FEET + 4} ${trailTo} ${FEET + 18}`}
            stroke="#ffffff"
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${trailFrom} ${FEET + 34} Q ${(trailFrom + trailTo) / 2} ${FEET + 24} ${trailTo} ${FEET + 34}`}
            stroke={p.blueSoft}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <SkaterBuddy
          size={BUDDY}
          x={bx}
          feetY={FEET}
          body={p.blue}
          eye={p.white}
          beanie={p.blueSoft}
          blade={p.blue}
          lean={lean}
          squash={1}
          blink={blinkScale(frame, [B.land + 14])}
          look={{ x: landed ? 0 : 0.5, y: -0.7 }}
          style={{ marginTop: bob }}
        />
        <IceSpray x={bx + 50} y={FEET} progress={spray} color={p.blueSoft} dir={-1} />

        {!landed ? (
          <div
            style={{
              position: "absolute",
              left: slipX - 130,
              top: slipY - 55,
              width: 260,
              height: 110,
              borderRadius: 20,
              background: p.card,
              border: `2px solid ${p.blueSoft}`,
              boxSizing: "border-box",
              padding: "14px 18px",
              fontFamily: fonts.ui,
              transform: `scale(${slipS}) rotate(${toss * 10 - 4}deg)`,
              boxShadow: "0 12px 26px rgba(1,59,255,0.18)",
              opacity: interpolate(frame, [B.skate - 6, B.skate], [0, 1], clamp),
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 600, color: p.ink }}>{bill.sender}</div>
            <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 600, color: p.blue, letterSpacing: "-0.04em", marginTop: 4 }}>
              {bill.amount}
            </div>
          </div>
        ) : null}
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={B.subline} />
    </SceneBg>
  );
};
