import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Bell, BillSlip, DayTile, SnowGlobe } from "../components/SnowGlobe";
import type { SneeuwbolProps } from "../schema";
import { wordAt } from "../vo";

// Beats (scene-local) on the spoken words "vangt", "zet" and "agenda".
export const catchBeats = (start: number) => ({
  fall: wordAt("want") - start + 2, // bill tumbles down through the flakes
  hop: wordAt("vangt") - start - 6, // Buddy hops up
  caught: wordAt("vangt") - start, // and catches it on his head
  lift: wordAt("zet") - start, // bill floats out of the globe
  land: wordAt("agenda") - start, // lands on the due day in the agenda
  bell: wordAt("agenda") - start + 8, // reminder bell on the chosen day
});

const R = 250;
const GX = 540 - R;
const GY = 0;
const BUDDY = 150;
const FEET = GY + R * 1.74; // feet on the floor of the glass (stage coords)
const SLIP_W = 140;
const TILE_W = 168;
const GAP = 20;
const ROW_Y = 650;
const rowX = (i: number) => (1080 - (5 * TILE_W + 4 * GAP)) / 2 + i * (TILE_W + GAP);

export const CatchScene: React.FC<{
  props: SneeuwbolProps["catch"];
  bill: SneeuwbolProps["bill"];
  start: number;
}> = ({ props, bill, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const B = catchBeats(start);

  const swirl = 3 + frame * 0.05;
  const spread = interpolate(frame, [0, 30, 60], [1, 0.7, 0.35], clamp);

  // Buddy hop
  const hopT = interpolate(frame, [B.hop, B.caught + 6], [0, 1], clamp);
  const hopY = -Math.sin(hopT * Math.PI) * 60;
  const squash =
    frame < B.hop
      ? interpolate(frame, [B.hop - 5, B.hop], [1, 0.85], clamp)
      : interpolate(frame, [B.hop, B.hop + 4, B.caught + 6, B.caught + 10, B.caught + 15], [0.85, 1.12, 1, 0.88, 1], clamp);
  const headY = FEET + hopY - BUDDY * BUDDY_RATIO * squash;

  // Bill: falls from the top of the glass onto Buddy's head, then floats out to the agenda.
  const fallT = interpolate(frame, [B.fall, B.caught], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const onHead = { x: 540, y: headY - SLIP_W * 0.33 };
  const fallPos = { x: 540 + Math.sin(frame / 4) * 40 * (1 - fallT), y: interpolate(fallT, [0, 1], [GY + 40, onHead.y]) };
  const flyT = interpolate(frame, [B.lift, B.land], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const target = { x: rowX(props.billDay) + TILE_W / 2, y: ROW_Y + TILE_W * 1.15 + 6 };
  let slip = frame < B.caught ? fallPos : onHead;
  if (frame >= B.lift) {
    slip = {
      x: interpolate(flyT, [0, 1], [onHead.x, target.x]),
      y: interpolate(flyT, [0, 1], [onHead.y, target.y]) - Math.sin(flyT * Math.PI) * 140,
    };
  }
  const slipScale = interpolate(flyT, [0, 1], [1, 1.3]);
  const slipRot = frame < B.caught ? Math.sin(frame / 3) * 25 : interpolate(flyT, [0, 1], [0, -4]);

  const rowIn = pop(frame, fps, B.lift - 10, springs.smooth);
  const landBump = interpolate(frame, [B.land, B.land + 4, B.land + 10], [1, 0.92, 1], clamp);
  const bell = pop(frame, fps, B.bell, springs.bouncy);
  const ring = frame > B.bell ? Math.sin((frame - B.bell) / 1.6) * 18 * Math.max(0, 1 - (frame - B.bell) / 24) : 0;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-6} stagger={2} />
      <Stage offsetY={30}>
        <SnowGlobe
          r={R}
          swirl={swirl}
          spread={spread}
          flakes={30}
          childrenOnTop
          water="#e9eeff"
          glass={p.blueSoft}
          base={p.blue}
          slip={p.white}
          slipLine={p.blueSoft}
          style={{ position: "absolute", left: GX, top: GY }}
        >
          <Buddy
            size={BUDDY}
            body={p.blueMascot}
            eye={p.white}
            squash={squash}
            blink={blinkScale(frame, [B.land + 4])}
            look={{ x: 0, y: frame < B.caught ? -0.8 : frame < B.lift ? 0 : 0.6 }}
            style={{ position: "absolute", left: R - BUDDY / 2, top: FEET - GY + hopY - BUDDY * BUDDY_RATIO }}
          />
        </SnowGlobe>

        {/* Agenda row */}
        <div style={{ opacity: rowIn, transform: `translateY(${(1 - rowIn) * 40}px)` }}>
          {props.days.map((d, i) => {
            const isBill = i === props.billDay;
            const isRem = i === props.reminderDay;
            const lit = (isBill && frame >= B.land) || (isRem && frame >= B.bell);
            return (
              <DayTile
                key={i}
                w={TILE_W}
                day={d.day}
                date={d.date}
                bg={lit ? p.blue : p.white}
                fg={lit ? p.white : p.ink}
                sub={lit ? p.blueSoft : p.greyText}
                style={{
                  position: "absolute",
                  left: rowX(i),
                  top: ROW_Y,
                  boxShadow: "0 14px 34px rgba(1,40,160,0.12)",
                  transform: isBill && frame >= B.land ? `scale(${landBump})` : undefined,
                }}
              />
            );
          })}
          {/* Reminder bell + label */}
          <div
            style={{
              position: "absolute",
              left: rowX(props.reminderDay) + TILE_W / 2 - 34,
              top: ROW_Y - 50,
              opacity: frame >= B.bell ? Math.min(1, bell * 2) : 0,
              transform: `scale(${0.5 + 0.5 * bell}) rotate(${ring}deg)`,
              transformOrigin: "50% 10%",
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: p.yellow,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(1,40,160,0.2)",
              }}
            >
              <Bell size={40} color={p.ink} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: rowX(props.reminderDay) - 10,
              top: ROW_Y + TILE_W * 1.15 + 14,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 30,
              color: p.blue,
              opacity: frame >= B.bell ? Math.min(1, bell * 2) : 0,
            }}
          >
            {props.reminderLabel}
          </div>
        </div>

        <BillSlip
          w={SLIP_W}
          label={bill.shortSender}
          amount={bill.amount}
          header={p.blue}
          ink={p.ink}
          style={{
            position: "absolute",
            left: slip.x - SLIP_W / 2,
            top: slip.y - SLIP_W * 0.33,
            opacity: frame < B.fall ? 0 : 1,
            transform: `rotate(${slipRot}deg) scale(${slipScale})`,
            zIndex: 5,
          }}
        />
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={B.bell} />
    </SceneBg>
  );
};
