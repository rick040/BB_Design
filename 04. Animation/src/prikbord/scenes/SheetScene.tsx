import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Tag } from "../components/Board";
import { SyncHeadline } from "../components/SyncLine";
import { MARKERS, type PrikbordProps, wordAt } from "../schema";

const S = MARKERS[3];
// Absolute frames; Buddy stomps on "Exporteer" and the sheet fills.
export const SHEET_T = {
  windowIn: S - 6,
  crouch: wordAt("exporteer") - 6,
  hop: wordAt("exporteer"),
  land: wordAt("exporteer") + 12,
  rowStagger: 4,
  formats: wordAt("hem") + 2,
};

const WIN = { x: 80, y: 190, w: 920, bar: 78, letters: 48, row: 82 };
const COLS = [0.26, 0.48, 0.26];
const BUDDY = 150;

export const SheetScene: React.FC<{ props: PrikbordProps["sheet"]; bills: PrikbordProps["bills"] }> = ({
  props,
  bills,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = SHEET_T;

  const winIn = pop(frame, fps, T.windowIn, springs.smooth);
  const hopU = interpolate(frame, [T.hop, T.land], [0, 1], clamp);
  const hopY = -70 * Math.sin(Math.PI * hopU);
  const squash =
    frame < T.hop
      ? interpolate(frame, [T.crouch, T.hop], [1, 0.8], clamp)
      : frame < T.land
        ? 1.12
        : interpolate(frame, [T.land, T.land + 3, T.land + 10], [1, 0.78, 1], clamp);
  const sheetBump = interpolate(frame, [T.land, T.land + 3, T.land + 10], [0, 10, 0], clamp);
  const sorted = [...bills].sort((a, b) => a.sortIndex - b.sortIndex);
  const H = WIN.bar + WIN.letters + WIN.row * (sorted.length + 1);
  const cellW = (k: number) => (WIN.w - 70) * COLS[k];
  const fmtIn = (k: number) => pop(frame, fps, T.formats + k * 5, springs.bouncy);

  const Row: React.FC<{ cells: string[]; header?: boolean; index: number; fill: number }> = ({
    cells,
    header,
    index,
    fill,
  }) => (
    <div
      style={{
        display: "flex",
        height: WIN.row,
        borderTop: `2px solid ${p.grey}`,
        background: header ? "#f3f6fa" : p.white,
      }}
    >
      <div
        style={{
          width: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f6fa",
          color: p.greyText,
          fontFamily: fonts.ui,
          fontSize: 24,
          borderRight: `2px solid ${p.grey}`,
        }}
      >
        {index}
      </div>
      {cells.map((c, k) => (
        <div
          key={k}
          style={{
            width: cellW(k),
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            boxSizing: "border-box",
            borderRight: k < 2 ? `2px solid ${p.grey}` : "none",
            fontFamily: k === 2 && !header ? fonts.display : fonts.ui,
            fontSize: header ? 26 : 32,
            fontWeight: header ? 600 : 500,
            color: header ? p.greyText : k === 2 ? p.blue : p.ink,
            justifyContent: k === 2 ? "flex-end" : "flex-start",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ opacity: fill, transform: `translateX(${(1 - fill) * -40}px)`, display: "inline-block" }}>{c}</span>
        </div>
      ))}
    </div>
  );

  return (
    <SceneBg color={p.light}>
      <SyncHeadline
        text={props.headline}
        at={[wordAt("liever"), wordAt("in"), wordAt("je", 3), wordAt("eigen"), wordAt("sheet")].map((f) => Math.max(f, S - 4))}
        color={p.blue}
      />
      <Stage offsetY={10}>
        <div
          style={{
            position: "absolute",
            left: WIN.x,
            top: WIN.y + sheetBump,
            width: WIN.w,
            height: H,
            borderRadius: 26,
            overflow: "hidden",
            background: p.white,
            boxShadow: "0 30px 80px rgba(0, 20, 120, 0.18)",
            opacity: winIn,
            transform: `translateY(${(1 - winIn) * 50}px)`,
          }}
        >
          <div
            style={{
              height: WIN.bar,
              background: p.blue,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 28px",
              fontFamily: fonts.ui,
              fontSize: 30,
              fontWeight: 600,
              color: p.white,
            }}
          >
            {[0, 1, 2].map((d) => (
              <div key={d} style={{ width: 18, height: 18, borderRadius: 9, background: p.blueSoft, opacity: 0.8 }} />
            ))}
            <span style={{ marginLeft: 14 }}>{props.fileName}</span>
          </div>
          <div style={{ display: "flex", height: WIN.letters, background: "#f3f6fa" }}>
            <div style={{ width: 70, borderRight: `2px solid ${p.grey}` }} />
            {["A", "B", "C"].map((l, k) => (
              <div
                key={l}
                style={{
                  width: cellW(k),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.ui,
                  fontSize: 22,
                  color: p.greyText,
                  borderRight: k < 2 ? `2px solid ${p.grey}` : "none",
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <Row cells={props.columns} header index={1} fill={1} />
          {sorted.map((b, i) => {
            const fill = pop(frame, fps, T.land + i * T.rowStagger, springs.pop);
            return <Row key={i} cells={[b.due, b.sender, b.amount]} index={i + 2} fill={Math.min(1, fill)} />;
          })}
        </div>
        {/* Buddy stands on the window and stomps */}
        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          squash={squash}
          look={{ x: -0.4, y: frame >= T.land ? 0.9 : 0.3 }}
          blink={frame >= T.land + 24 ? 0.2 : 1}
          style={{
            position: "absolute",
            left: WIN.x + WIN.w - 230,
            top: WIN.y + sheetBump + 4 - BUDDY * BUDDY_RATIO + hopY,
            transformOrigin: "50% 100%",
            opacity: winIn,
          }}
        />
        {/* export formats */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: WIN.y + H + 50,
            display: "flex",
            justifyContent: "center",
            gap: 30,
          }}
        >
          {props.formats.map((f, k) => (
            <div key={f} style={{ transform: `scale(${fmtIn(k)})`, opacity: Math.min(1, fmtIn(k) * 2) }}>
              <Tag text={f} bg={k === 0 ? p.blue : p.blueMid} color={p.white} size={42} />
            </div>
          ))}
        </div>
      </Stage>
    </SceneBg>
  );
};
