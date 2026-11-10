import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { brand, fonts } from "../../theme";
import { MiniBill, panPos, Scale } from "../components/Scale";
import { SCENE_STARTS, type WeegschaalProps, wordAt } from "../schema";

// Scene 4: what the €3,49 buys. A reminder chip rings on an agenda tile and
// the bill hops off the scale into the agenda.
const S = SCENE_STARTS[3];
export const AGENDA_T = {
  headline: S - 4,
  headlineStagger: 3,
  tile: S + 4,
  reminder: wordAt("herinnering"),
  billHop: wordAt("agenda") - 10,
  billLand: wordAt("agenda"),
};
const PIVOT = 360;
const BS = 190;
const TILE = { x: 200, y: -20, w: 680, h: 270 };

const Bell: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6Z" fill={color} />
    <circle cx="12" cy="19.5" r="2.2" fill={color} />
  </svg>
);

export const AgendaScene: React.FC<{ props: WeegschaalProps["agenda"]; bill: WeegschaalProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const tileIn = pop(frame, fps, AGENDA_T.tile, springs.pop);
  const bellIn = pop(frame, fps, AGENDA_T.reminder, springs.pop);
  const ring = Math.sin((frame - AGENDA_T.reminder) / 1.6) * 16 * interpolate(frame, [AGENDA_T.reminder, AGENDA_T.reminder + 20], [1, 0], clamp);
  const lift = spring({ frame: frame - AGENDA_T.billHop, fps, config: { damping: 10, stiffness: 120 } });
  const angle = -10 - 6 * lift;

  const from = panPos("right", angle, PIVOT);
  const to = { x: TILE.x + TILE.w - 150, y: TILE.y + TILE.h - 10 };
  const h = interpolate(frame, [AGENDA_T.billHop, AGENDA_T.billLand], [0, 1], { ...clamp, easing: (t) => t * (2 - t) });
  const onPan = frame < AGENDA_T.billHop;
  const landed = frame >= AGENDA_T.billLand;
  const rowIn = pop(frame, fps, AGENDA_T.billLand, springs.pop);

  const buddyPan = panPos("left", angle, PIVOT);
  const happy = landed ? interpolate(frame - AGENDA_T.billLand, [0, 4, 20, 24], [1, 0.18, 0.18, 1], clamp) : blinkScale(frame, [S + 14]);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={AGENDA_T.headline} stagger={AGENDA_T.headlineStagger} />
      <Stage offsetY={10}>
        <Scale
          angle={angle}
          pivotY={PIVOT}
          line={p.blue}
          pan={p.light}
          right={onPan ? <MiniBill sender={bill.sender} amount={bill.amount} alert={p.red} style={{ transform: "rotate(-3deg)" }} /> : null}
        />
        <Buddy
          size={BS}
          body={p.blueMascot}
          eye={p.white}
          blink={happy}
          look={{ x: 0.5, y: -0.8 }}
          style={{ position: "absolute", left: buddyPan.x - BS / 2, top: buddyPan.y + 4 - BS * BUDDY_RATIO }}
        />
        {/* agenda tile */}
        <div
          style={{
            position: "absolute",
            left: TILE.x,
            top: TILE.y,
            width: TILE.w,
            height: TILE.h,
            borderRadius: 34,
            background: brand.white,
            boxShadow: "0 20px 60px rgba(0,20,120,0.16)",
            display: "flex",
            overflow: "hidden",
            transform: `scale(${tileIn})`,
            opacity: Math.min(1, tileIn * 2),
            fontFamily: fonts.display,
          }}
        >
          <div style={{ width: 210, background: p.blueMid, color: brand.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{props.month}</div>
            <div style={{ fontSize: 130, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.05em" }}>{props.day}</div>
          </div>
          <div style={{ flex: 1, padding: "28px 30px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 48, fontWeight: 600, color: brand.ink, letterSpacing: "-0.03em" }}>
              {props.weekday} {props.day} {props.month}
            </div>
            <div
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                alignItems: "center",
                gap: 10,
                background: p.yellow,
                borderRadius: 40,
                padding: "8px 20px 8px 14px",
                fontFamily: fonts.ui,
                fontSize: 34,
                fontWeight: 600,
                color: brand.ink,
                transform: `scale(${bellIn})`,
                transformOrigin: "0% 50%",
              }}
            >
              <div style={{ transform: `rotate(${ring}deg)`, display: "flex" }}>
                <Bell color={brand.ink} size={38} />
              </div>
              {props.reminder}
            </div>
            <div style={{ fontFamily: fonts.ui, fontSize: 32, color: "#6b6b78", opacity: rowIn, transform: `translateY(${(1 - rowIn) * 14}px)`, whiteSpace: "nowrap" }}>
              {bill.sender} <b style={{ color: brand.ink }}>{bill.amount}</b>
            </div>
          </div>
        </div>
        {/* the bill hops from the pan into the agenda */}
        {!onPan && !landed ? (
          <div
            style={{
              position: "absolute",
              left: from.x + (to.x - from.x) * h,
              top: from.y + (to.y - from.y) * h - Math.sin(Math.PI * h) * 180,
              width: 0,
              height: 0,
            }}
          >
            <MiniBill
              sender={bill.sender}
              amount={bill.amount}
              alert={p.red}
              style={{ position: "absolute", left: -125, top: -150, transform: `scale(${1 - 0.6 * h}) rotate(${-3 + h * 20}deg)` }}
            />
          </div>
        ) : null}
      </Stage>
    </SceneBg>
  );
};
