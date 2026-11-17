import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { PaperPlane } from "../components/Paper";
import { SCENE_STARTS, type VliegtuigProps, wordAt } from "../schema";

const S = SCENE_STARTS[2];
export const AGENDA_T = {
  fly: S, // Buddy rides the plane in from the left
  drop: wordAt("vervaldatum") + 8, // Buddy hops off above the due date
  land: wordAt("vervaldatum") + 16, // lands on the tile, it turns blue
  bell: wordAt("agenda"), // reminder chip on the chosen day
  subline: wordAt("agenda") + 6,
};

const TW = 170;
const TH = 220;
const GAP = 20;
const X0 = (1080 - (5 * TW + 4 * GAP)) / 2;
const TOP = 400;
const tileX = (i: number) => X0 + i * (TW + GAP);
const BUDDY = 130;
const BH = BUDDY * BUDDY_RATIO;

const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path d="M16 4c-5 0-8 3.6-8 8.5V18l-3 4h22l-3-4v-5.5C24 7.6 21 4 16 4Z" fill={color} />
    <circle cx="16" cy="26" r="3" fill={color} />
  </svg>
);

export const AgendaScene: React.FC<{ props: VliegtuigProps["agenda"]; bill: VliegtuigProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const ink = p.red;

  const dueCx = tileX(props.dueIndex) + TW / 2;
  // plane path: in from the left, over the due tile, out to the top right
  const u = interpolate(frame, [AGENDA_T.fly, AGENDA_T.drop], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const v = interpolate(frame, [AGENDA_T.drop, AGENDA_T.drop + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const ride = { x: -160 + (dueCx + 160) * u, y: 190 + 70 * Math.sin(Math.PI * u * 0.9) };
  const plane = frame < AGENDA_T.drop ? ride : { x: dueCx + 700 * v, y: ride.y - 320 * v };
  const tilt = frame < AGENDA_T.drop ? 8 - 14 * u : -24;

  // Buddy: on the plane, then a little hop and drop onto the tile
  const dropK = interpolate(frame, [AGENDA_T.drop, AGENDA_T.land], [0, 1], clamp);
  const onPlaneFeet = { x: ride.x - 10, y: ride.y + 4 };
  const tileFeet = { x: dueCx, y: TOP };
  const feet =
    frame < AGENDA_T.drop
      ? onPlaneFeet
      : {
          x: onPlaneFeet.x + (tileFeet.x - onPlaneFeet.x) * dropK,
          y: onPlaneFeet.y + (tileFeet.y - onPlaneFeet.y) * dropK * dropK - 70 * Math.sin(Math.PI * dropK),
        };
  const landed = frame >= AGENDA_T.land;
  const landSq = interpolate(frame, [AGENDA_T.land, AGENDA_T.land + 3, AGENDA_T.land + 10], [1, 0.72, 1], clamp);
  const tileIn = pop(frame, fps, AGENDA_T.land, springs.pop);
  const bellIn = pop(frame, fps, AGENDA_T.bell, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={S - 4} stagger={2} />
      <Stage offsetY={-10}>
        <div
          style={{
            position: "absolute",
            left: X0,
            top: TOP - 70,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 34,
            color: p.greyText,
          }}
        >
          {props.month}
        </div>
        {props.days.map((d, i) => {
          const due = i === props.dueIndex;
          const k = due ? Math.min(1, tileIn) : 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: tileX(i),
                top: TOP,
                width: TW,
                height: TH,
                borderRadius: 30,
                background: due && landed ? p.blue : p.white,
                boxShadow: "0 20px 50px rgba(1, 59, 255, 0.12)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: due && landed ? `scale(${0.92 + 0.08 * tileIn})` : undefined,
              }}
            >
              <div style={{ fontFamily: fonts.ui, fontSize: 32, color: due && landed ? p.blueSoft : p.greyText }}>{d.day}</div>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 500,
                  fontSize: 84,
                  letterSpacing: "-0.05em",
                  color: due && landed ? p.white : p.blue,
                  lineHeight: 1,
                }}
              >
                {d.date}
              </div>
              {due ? (
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: fonts.ui,
                    fontWeight: 600,
                    fontSize: 28,
                    color: p.white,
                    opacity: k,
                  }}
                >
                  {bill.amount}
                </div>
              ) : null}
            </div>
          );
        })}
        {/* sender under the due tile */}
        <div
          style={{
            position: "absolute",
            left: dueCx - 200,
            width: 400,
            top: TOP + TH + 26,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, tileIn * 2),
            transform: `translateY(${(1 - Math.min(1, tileIn)) * 20}px)`,
          }}
        >
          <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 30, color: p.blue, padding: "12px 24px", borderRadius: 30, background: "#e6ecff" }}>
            {bill.sender}
          </div>
        </div>
        {/* reminder chip */}
        <div
          style={{
            position: "absolute",
            left: tileX(props.reminderIndex) + TW / 2 - 150,
            width: 300,
            top: TOP + TH + 26,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, bellIn * 2),
            transform: `scale(${0.5 + 0.5 * bellIn})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 30,
              color: p.white,
              padding: "12px 24px",
              borderRadius: 30,
              background: ink,
            }}
          >
            <Bell size={30} color={p.yellow} />
            {props.reminderLabel}
          </div>
        </div>

        {/* plane */}
        <div
          style={{
            position: "absolute",
            left: plane.x - 120,
            top: plane.y - 30,
            transform: `rotate(${tilt}deg)`,
            opacity: frame < AGENDA_T.drop + 14 ? 1 : 1 - (frame - AGENDA_T.drop - 14) / 6,
          }}
        >
          <PaperPlane size={240} fill={p.white} line={ink} />
        </div>
        {/* Buddy */}
        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          blink={blinkScale(frame, [AGENDA_T.bell + 8])}
          squash={landed ? landSq : 1}
          look={landed ? { x: -0.7, y: 0.5 } : { x: 0.8, y: 0.3 }}
          style={{
            position: "absolute",
            left: feet.x - BUDDY / 2,
            top: feet.y - BH,
          }}
        />
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
