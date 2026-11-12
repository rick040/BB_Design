import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { MailPanel, Net, Paddle, rowCenterY, Table, TABLE } from "../components/Table";
import { SCENE_STARTS, type TafeltennisProps, wordAt } from "../schema";

const S = SCENE_STARTS[2];
// You pick one bill out of your mailbox and play it over the net;
// Buddy returns it straight onto its due date in your agenda.
export const SERVE_T = {
  headline: S - 4,
  pick: wordAt("rekening"),
  swing: wordAt("toe"),
  bounce: wordAt("toe") + 12,
  hit: wordAt("kiest"),
  strip: wordAt("en"),
  subline: wordAt("zet"),
  land: wordAt("agenda"),
};

const BUDDY = 220;
const BUDDY_X = 800;
const TILE_W = 170;
const TILE_H = 170;
const GAP = 18;
const STRIP_X = (1080 - (5 * TILE_W + 4 * GAP)) / 2;
const STRIP_Y = 680;
const CARD = 0.3;

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

export const ServeScene: React.FC<{
  props: TafeltennisProps["serve"];
  mailbox: TafeltennisProps["mailbox"];
  bill: TafeltennisProps["bill"];
}> = ({ props, mailbox, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const T = SERVE_T;
  const rowY = rowCenterY(mailbox.billIndex);
  const highlight = interpolate(frame, [T.pick - 4, T.pick + 4], [0, 1], clamp);

  // Your paddle slides in from the left and swings on "toe".
  const padIn = interpolate(frame, [T.pick - 6, T.swing - 4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const padSwing = interpolate(frame, [T.swing - 4, T.swing, T.swing + 8], [-30, 35, 10], clamp);
  const padOut = interpolate(frame, [T.swing + 10, T.swing + 22], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

  // Buddy's paddle hits back on "kiest".
  const buddySwing = interpolate(frame, [T.hit - 5, T.hit, T.hit + 8], [30, -40, 0], clamp);
  const buddySq = interpolate(frame, [T.hit - 5, T.hit, T.hit + 6], [1, 0.84, 1.06], clamp);
  const padX = BUDDY_X + 84;
  const padY = TABLE.top - 236;
  const hitPoint = { x: padX + 20, y: padY + 40 };

  // Bill path: out of the row, over the net, bounce, Buddy, agenda tile.
  const tile = { x: STRIP_X + props.dueIndex * (TILE_W + GAP) + TILE_W / 2, y: STRIP_Y + TILE_H / 2 };
  const serveFrom = { x: 295, y: 110 };
  const bouncePt = { x: 650, y: TABLE.top - 30 };
  let pos = { x: 295, y: rowY };
  let rot = 0;
  let sc = 0;
  if (frame >= T.pick) {
    const u = interpolate(frame, [T.pick, T.swing], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
    pos = { x: 295, y: lerp(rowY, serveFrom.y, u) };
    sc = CARD * Math.min(1, u * 1.6);
    rot = -4 * u;
  }
  if (frame >= T.swing) {
    const u = interpolate(frame, [T.swing, T.bounce], [0, 1], clamp);
    pos = { x: lerp(serveFrom.x, bouncePt.x, u), y: lerp(serveFrom.y, bouncePt.y, u) - 170 * Math.sin(Math.PI * u) };
    rot = 200 * u;
    sc = CARD;
  }
  if (frame >= T.bounce) {
    const u = interpolate(frame, [T.bounce, T.hit], [0, 1], clamp);
    pos = { x: lerp(bouncePt.x, hitPoint.x, u), y: lerp(bouncePt.y, hitPoint.y, u) - 60 * Math.sin(Math.PI * u) };
    rot = 200 + 120 * u;
  }
  if (frame >= T.hit) {
    const u = interpolate(frame, [T.hit, T.land], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
    pos = { x: lerp(hitPoint.x, tile.x, u), y: lerp(hitPoint.y, tile.y, u) - 430 * Math.sin(Math.PI * u) };
    rot = 320 + 400 * u;
    sc = CARD * (1 - 0.55 * u);
  }
  const landed = frame >= T.land;

  const strip = pop(frame, fps, T.strip, springs.smooth);
  const tileHit = pop(frame, fps, T.land, springs.bouncy);
  const squashBounce = frame >= T.bounce && frame < T.bounce + 3 ? 0.8 : 1;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={T.headline} stagger={3} />
      <Stage offsetY={90}>
        <MailPanel
          title={mailbox.title}
          senders={mailbox.senders}
          highlight={mailbox.billIndex}
          highlightIn={highlight}
        />
        <Table color={p.blue} line={p.blueMid} legs={false} />
        <Net height={74} color={p.blue} />

        {/* Agenda strip under the table */}
        <div style={{ position: "absolute", left: 0, top: STRIP_Y, width: 1080, opacity: strip, transform: `translateY(${(1 - strip) * 60}px)` }}>
          {props.days.map((d, i) => {
            const due = i === props.dueIndex && landed;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: STRIP_X + i * (TILE_W + GAP),
                  top: 0,
                  width: TILE_W,
                  height: TILE_H,
                  borderRadius: 28,
                  background: due ? p.blue : p.white,
                  boxShadow: "0 12px 34px rgba(0, 30, 140, 0.12)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.display,
                  transform: due ? `scale(${0.9 + 0.1 * tileHit})` : undefined,
                }}
              >
                <div style={{ fontSize: 32, color: due ? p.blueSoft : p.greyText }}>{d.day}</div>
                <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.05em", color: due ? p.white : p.blue, lineHeight: 1 }}>
                  {d.date}
                </div>
                {due ? (
                  <div style={{ fontFamily: fonts.ui, fontSize: 30, fontWeight: 600, color: p.yellow, marginTop: 6, opacity: tileHit }}>
                    {bill.amount}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          squash={buddySq}
          look={{ x: frame < T.hit ? -0.8 : -0.6, y: frame < T.hit ? 0 : 0.6 }}
          blink={blinkScale(frame, [T.land + 4])}
          style={{ position: "absolute", left: BUDDY_X - BUDDY / 2, top: TABLE.top - BUDDY * BUDDY_RATIO, transformOrigin: "50% 100%" }}
        />
        <Paddle
          size={104}
          rubber={p.yellow}
          handle={p.blueMascot}
          style={{ left: padX, top: padY, transform: `rotate(${18 + buddySwing}deg)`, transformOrigin: "50% 90%" }}
        />

        {/* Your paddle */}
        <Paddle
          size={110}
          rubber={p.red}
          handle={p.ink}
          style={{
            left: lerp(-200, 40, padIn) - 420 * padOut,
            top: 40,
            transform: `rotate(${padSwing - 20}deg)`,
            transformOrigin: "50% 90%",
            opacity: padIn * (1 - padOut),
          }}
        />

        {sc > 0 && !landed ? (
          <div
            style={{
              position: "absolute",
              left: pos.x - BILL_W / 2,
              top: pos.y - BILL_H / 2,
              width: BILL_W,
              height: BILL_H,
              transform: `rotate(${rot}deg) scale(${sc * squashBounce}, ${sc / squashBounce})`,
            }}
          >
            <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
          </div>
        ) : null}
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={T.subline} />
    </SceneBg>
  );
};
