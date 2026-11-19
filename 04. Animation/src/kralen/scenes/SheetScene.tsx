import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Bead, useBeadColors } from "../components/Bead";
import { type KralenProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
// Absolute frames, hung on the spoken words.
export const SHEET_T = {
  headline: S + 2,
  card: S + 4,
  firstRow: wordAt("spreadsheet") - 4, // beads slide down the thread into rows
  rowStagger: 6,
  press: wordAt("exporteer"), // Buddy pushes Exporteer
  formats: wordAt("exporteer") + 6,
  file: wordAt("zo"), // rekeningen.csv ready
};

const CARD = { x: 90, y: -20, w: 900 };
const HEAD_H = 92;
const COL_H = 60;
const ROW_H = 92;
const BEAD = 74;
const THREAD_X = CARD.x + 62;
const COLS = [CARD.x + 125, CARD.x + 330, CARD.x + 860]; // vervalt, van (left), bedrag (right edge)

export const SheetScene: React.FC<{ props: KralenProps["sheet"]; beads: KralenProps["beads"] }> = ({
  props,
  beads,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const colors = useBeadColors();

  const cardIn = pop(frame, fps, SHEET_T.card, springs.smooth);
  const rowsTop = CARD.y + HEAD_H + COL_H;
  const cardH = HEAD_H + COL_H + ROW_H * beads.length + 16;
  const threadLen = interpolate(frame, [SHEET_T.card, SHEET_T.firstRow + 4], [0, 1], clamp);

  const btnY = CARD.y + cardH + 46;
  const press = interpolate(frame, [SHEET_T.press - 2, SHEET_T.press + 2, SHEET_T.press + 9], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [SHEET_T.press + 1, SHEET_T.press + 16], [0, 1], clamp);
  const lean = interpolate(frame, [SHEET_T.press - 8, SHEET_T.press, SHEET_T.press + 10], [0, 1, 0], clamp);
  const buddyIn = pop(frame, fps, S + 6, springs.bouncy);
  const fileIn = pop(frame, fps, SHEET_T.file, springs.bouncy);
  const fileCheck = interpolate(frame, [SHEET_T.file + 4, SHEET_T.file + 14], [0, 1], clamp);
  const BUDDY = 150;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={SHEET_T.headline} stagger={3} />
      <Stage offsetY={30}>
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: cardH,
            background: p.white,
            borderRadius: 34,
            boxShadow: "0 30px 70px rgba(1, 59, 255, 0.16)",
            overflow: "hidden",
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 40}px)`,
          }}
        >
          <div
            style={{
              height: HEAD_H,
              background: p.blue,
              color: p.white,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 46,
              display: "flex",
              alignItems: "center",
              paddingLeft: 40,
              letterSpacing: "-0.03em",
            }}
          >
            {props.fileTitle}
          </div>
          <div
            style={{
              position: "absolute",
              top: HEAD_H,
              left: 0,
              right: 0,
              height: COL_H,
              borderBottom: `2px solid ${p.grey}`,
              fontFamily: fonts.ui,
              fontWeight: 500,
              fontSize: 30,
              color: "#8a8f9c",
            }}
          >
            <span style={{ position: "absolute", left: COLS[0] - CARD.x - 10, top: 14 }}>{props.columns[0]}</span>
            <span style={{ position: "absolute", left: COLS[1] - CARD.x, top: 14 }}>{props.columns[1]}</span>
            <span style={{ position: "absolute", right: CARD.x + CARD.w - COLS[2], top: 14 }}>{props.columns[2]}</span>
          </div>
        </div>

        {/* vertical thread down the left of the sheet */}
        <div
          style={{
            position: "absolute",
            left: THREAD_X - 4,
            top: rowsTop - 10,
            width: 8,
            height: (ROW_H * beads.length + 10) * threadLen,
            borderRadius: 4,
            background: p.yellow,
            opacity: cardIn,
          }}
        />

        {beads.map((b, i) => {
          const a = SHEET_T.firstRow + i * SHEET_T.rowStagger;
          const cy = rowsTop + ROW_H * i + ROW_H / 2;
          const u = interpolate(frame, [a - 8, a], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const rowIn = pop(frame, fps, a + 1, springs.smooth);
          return (
            <React.Fragment key={i}>
              {i > 0 ? (
                <div
                  style={{
                    position: "absolute",
                    left: CARD.x + 110,
                    width: CARD.w - 140,
                    top: rowsTop + ROW_H * i,
                    height: 2,
                    background: p.grey,
                    opacity: cardIn,
                  }}
                />
              ) : null}
              {u > 0 ? (
                <Bead
                  size={BEAD}
                  fill={colors[i].fill}
                  text={colors[i].text}
                  day={b.day}
                  month=""
                  style={{
                    left: THREAD_X - BEAD / 2,
                    top: cy - BEAD / 2 - (1 - u) * 160,
                    opacity: Math.min(1, u * 2),
                  }}
                />
              ) : null}
              <div
                style={{
                  position: "absolute",
                  top: cy - 23,
                  left: COLS[0] - 10,
                  right: 1080 - COLS[2],
                  height: 40,
                  fontFamily: fonts.ui,
                  fontSize: 37,
                  color: p.ink,
                  opacity: rowIn,
                  transform: `translateX(${(1 - rowIn) * 30}px)`,
                }}
              >
                <span style={{ position: "absolute", left: 0, fontWeight: 600 }}>
                  {b.day} {b.month}
                </span>
                <span style={{ position: "absolute", left: COLS[1] - COLS[0] + 10 }}>{b.sender}</span>
                <span style={{ position: "absolute", right: 0, fontWeight: 600 }}>{b.amount}</span>
              </div>
            </React.Fragment>
          );
        })}

        {/* Export row: Buddy pushes the button, formats pop out */}
        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          blink={blinkScale(frame, [S + 30, SHEET_T.file + 8])}
          squash={1 - 0.08 * lean}
          look={{ x: 1, y: 0.1 }}
          style={{
            position: "absolute",
            left: 190 - BUDDY / 2 + lean * 18,
            top: btnY + 104 - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.5 + 0.5 * buddyIn}) rotate(${lean * 10}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 290,
            top: btnY,
            height: 104,
            padding: "0 46px",
            borderRadius: 52,
            background: p.blue,
            color: p.white,
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 44,
            display: "flex",
            alignItems: "center",
            transform: `scale(${press})`,
            opacity: cardIn,
            boxShadow: "0 16px 40px rgba(1, 59, 255, 0.3)",
          }}
        >
          {props.button}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              borderRadius: 52,
              border: `5px solid ${p.blue}`,
              opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0,
              transform: `scale(${1 + ripple * 0.35})`,
            }}
          />
        </div>
        {props.formats.map((f, i) => {
          const s = pop(frame, fps, SHEET_T.formats + i * 6, springs.bouncy);
          return (
            <div
              key={f}
              style={{
                position: "absolute",
                left: 690 + i * 160,
                top: btnY + 14,
                height: 76,
                width: 140,
                borderRadius: 38,
                background: i === 0 ? p.yellow : p.teal,
                color: p.ink,
                fontFamily: fonts.ui,
                fontWeight: 700,
                fontSize: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: Math.min(1, s * 2),
                transform: `scale(${s})`,
              }}
            >
              {f}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: btnY + 140,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, fileIn * 2),
            transform: `scale(${0.5 + 0.5 * fileIn})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "#111827",
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 40,
              padding: "16px 36px 16px 20px",
              borderRadius: 50,
            }}
          >
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: p.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Checkmark size={32} color="#111827" progress={fileCheck} strokeWidth={16} />
            </div>
            {props.fileChip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
