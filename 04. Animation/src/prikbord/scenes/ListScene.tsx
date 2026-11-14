import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BillNote, NOTE_H, NOTE_W, Pin } from "../components/Board";
import { SyncHeadline } from "../components/SyncLine";
import { MARKERS, type PrikbordProps, wordAt } from "../schema";

const S = MARKERS[2];
// Absolute frames; notes fly in on "Stuur ze door", rows sort on "vervaldatum".
export const LIST_T = {
  firstNote: S + 6,
  noteStagger: 11,
  flyLen: 12,
  swapHeadline: wordAt("één"),
  sort: wordAt("vervaldatum") + 2,
  happy: wordAt("vervaldatum") + 18,
};

const CARD = { x: 130, y: 220, w: 820, head: 110, row: 106 };
const MOUTH = { x: 540, y: 150 };
const BUDDY = 170;

export const rowY = (slot: number) => CARD.y + CARD.head + slot * CARD.row;

export const ListRow: React.FC<{ due: string; sender: string; amount: string; width: number }> = ({
  due,
  sender,
  amount,
  width,
}) => {
  const p = usePalette();
  return (
    <div
      style={{
        width,
        height: 90,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 30px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
      }}
    >
      <div
        style={{
          width: 150,
          textAlign: "center",
          background: p.blueSoft,
          color: p.blue,
          fontWeight: 600,
          fontSize: 30,
          borderRadius: 30,
          padding: "10px 0",
        }}
      >
        {due}
      </div>
      <div style={{ flex: 1, fontSize: 32, fontWeight: 500, color: p.ink }}>{sender}</div>
      <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 500, color: p.blue, letterSpacing: "-0.03em" }}>
        {amount}
      </div>
    </div>
  );
};

export const ListScene: React.FC<{ props: PrikbordProps["list"]; bills: PrikbordProps["bills"] }> = ({
  props,
  bills,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = LIST_T;

  const arrive = (i: number) => T.firstNote + i * T.noteStagger;
  const sortP = spring({ frame: frame - T.sort, fps, config: { damping: 15, stiffness: 120 } });
  const cardIn = pop(frame, fps, S - 6, springs.smooth);

  // Buddy gulps on every arrival.
  let squash = 1;
  for (let i = 0; i < bills.length; i++) {
    const a = arrive(i) + T.flyLen;
    squash = Math.min(squash, interpolate(frame, [a - 2, a, a + 6], [1, 0.82, 1], clamp));
  }
  const sortHop = interpolate(frame, [T.sort - 4, T.sort, T.sort + 6, T.sort + 12], [1, 0.85, 1.12, 1], clamp);
  squash = frame >= T.sort - 4 ? sortHop : squash;
  const nextNote = bills.findIndex((_, i) => frame < arrive(i) + T.flyLen);
  const look =
    nextNote >= 0 ? { x: nextNote % 2 === 0 ? -0.8 : 0.8, y: -0.3 } : { x: 0, y: 0.7 };

  const count = bills.filter((_, i) => frame >= arrive(i) + T.flyLen).length;

  return (
    <SceneBg color={p.blue}>
      <SyncHeadline text={props.headlineSend} at={[wordAt("stuur"), wordAt("ze"), wordAt("door")]} color={p.white} hideFrom={T.swapHeadline - 1} />
      {frame >= T.swapHeadline - 1 ? (
        <SyncHeadline
          text={props.headlineList}
          at={[wordAt("één"), wordAt("lijst"), wordAt("op", 2), wordAt("vervaldatum")]}
          color={p.white}
          accent={p.blueSoft}
        />
      ) : null}
      <Stage offsetY={30}>
        {/* the list card */}
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.head + bills.length * CARD.row + 20,
            background: p.white,
            borderRadius: 34,
            boxShadow: "0 30px 80px rgba(0, 10, 90, 0.35)",
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 60}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 34,
              right: 34,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: fonts.display,
              fontSize: 38,
              fontWeight: 500,
              color: p.ink,
              letterSpacing: "-0.03em",
            }}
          >
            <span>{props.title}</span>
            <span style={{ color: p.blue }}>{count}</span>
          </div>
        </div>
        {/* rows */}
        {bills.map((b, i) => {
          const landed = arrive(i) + T.flyLen;
          const rowIn = pop(frame, fps, landed, springs.pop);
          if (frame < landed) return null;
          const slot = interpolate(sortP, [0, 1], [i, b.sortIndex]);
          const moving = Math.abs(b.sortIndex - i) > 0 && sortP > 0.02 && sortP < 0.98;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CARD.x + 10,
                top: rowY(slot) + 4,
                opacity: Math.min(1, rowIn * 2),
                transform: `translateY(${(1 - rowIn) * -30}px) scale(${(0.9 + 0.1 * rowIn) * (moving ? 1.03 : 1)})`,
                zIndex: moving ? 2 : 1,
                background: moving ? p.light : "transparent",
                borderRadius: 24,
                boxShadow: moving ? "0 12px 30px rgba(0,20,120,0.18)" : "none",
              }}
            >
              <ListRow due={b.due} sender={b.sender} amount={b.amount} width={CARD.w - 20} />
            </div>
          );
        })}
        {/* Buddy on the top edge of the card */}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          look={look}
          blink={frame >= T.happy ? 0.2 : blinkScale(frame, [S + 30])}
          style={{
            position: "absolute",
            left: MOUTH.x - BUDDY / 2,
            top: CARD.y + 6 - BUDDY * BUDDY_RATIO,
            transformOrigin: "50% 100%",
            opacity: cardIn,
            zIndex: 3,
          }}
        />
        {/* forwarded notes fly in from alternating sides into Buddy */}
        {bills.map((b, i) => {
          const a = arrive(i);
          if (frame < a || frame >= a + T.flyLen) return null;
          const u = interpolate(frame, [a, a + T.flyLen], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
          const fromX = i % 2 === 0 ? -380 : 1460;
          const x = interpolate(u, [0, 1], [fromX, MOUTH.x]);
          const y = interpolate(u, [0, 1], [40, MOUTH.y + 60]) - 120 * Math.sin(Math.PI * u);
          const s = interpolate(u, [0, 1], [0.8, 0.12]);
          return (
            <div
              key={`n${i}`}
              style={{
                position: "absolute",
                left: x - NOTE_W / 2,
                top: y - NOTE_H / 2,
                transform: `scale(${s}) rotate(${(i % 2 ? 1 : -1) * 20 * (1 - u)}deg)`,
                zIndex: 4,
              }}
            >
              <BillNote sender={b.sender} amount={b.amount} due="" pin />
            </div>
          );
        })}
        <Pin size={34} style={{ left: CARD.x + CARD.w - 60, top: CARD.y - 14, zIndex: 3, opacity: cardIn }} />
      </Stage>
    </SceneBg>
  );
};
