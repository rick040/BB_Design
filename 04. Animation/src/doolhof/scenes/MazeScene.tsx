import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { CalendarIcon, Envelope, Maze, MAZE_H, MAZE_W } from "../components/Maze";
import { buildMaze } from "../maze";
import { type DoolhofProps, SCENE_STARTS, wordAt } from "../schema";

// Scenes 1 and 2 in one piece: the maze shrinks into the left half while the
// blue "Met Buddy" half slides in from the right (the split seam transition).
const S2 = SCENE_STARTS[1];
const S3 = SCENE_STARTS[2];
export const MAZE_T = {
  gate: wordAt("app"), // chip "Downloaden" at the entrance, the dot starts walking
  account: wordAt("account"), // dead end 1
  password: wordAt("wachtwoord"), // dead end 2
  updates: wordAt("updates"), // dead end 3
  split: S2, // seam opens, centred on "Hoeft"
  no: wordAt("niet"), // strike through "Nog een app" + chip "Hoeft niet."
  buddy: wordAt("buddy"), // Buddy pops in at the top of the straight line
  dash: wordAt("rechtdoor"), // Buddy slides straight down
  arrive: wordAt("rechtdoor") + 12, // lands on the calendar, check
};

export const MazeScene: React.FC<{ props: DoolhofProps; T: number }> = ({ props, T }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const m = buildMaze(props.mazeSeed);
  const half = T / 2;

  // Split progress 0 (full maze) .. 1 (maze in the left half).
  const k = interpolate(frame, [S2 - half - 2, S2 + half + 2], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  // Dot walk: start at the gate, hit three dead ends on the spoken words, then keep wandering.
  const de = m.deadEnds;
  const keys: [number, number][] = [
    [MAZE_T.gate + 4, 0],
    [MAZE_T.account, de[0]],
    [MAZE_T.account + 5, de[0]],
    [MAZE_T.password, de[1]],
    [MAZE_T.password + 4, de[1]],
    [MAZE_T.updates, de[2]],
    [MAZE_T.updates + 5, de[2]],
    [S3 + 10, Math.min(m.walk.length - 1, de[2] + 24)],
  ];
  const chipTimes = [MAZE_T.gate, MAZE_T.account, MAZE_T.password, MAZE_T.updates];
  const chips = props.hook.chips.map((label, i) => ({
    label,
    at: chipTimes[i],
    pop: pop(frame, fps, chipTimes[i] - 2, springs.bouncy),
  }));

  // Maze placement (frame coordinates).
  const sFull = Math.min(0.98, (width - 2 * L.sidePadding + 40) / MAZE_W) * (L.tall ? 1 : 0.8);
  const sHalf = (width / 2 - 70) / MAZE_W;
  const s = sFull + (sHalf - sFull) * k;
  const cyFull = L.stageCenterY + (L.tall ? 90 : 40) * L.stageScale;
  const cyHalf = L.stageCenterY + 90 * L.stageScale;
  const cx = width / 2 + (width / 4 - width / 2) * k;
  const cy = cyFull + (cyHalf - cyFull) * k;

  // Right blue half.
  const panelX = width - (width / 2) * k;
  const PW = width / 2;
  const sc = L.stageScale;
  const labelSize = L.headlineSize * 0.66;
  const lineTop = L.stageCenterY - 290 * sc;
  const lineBottom = L.stageCenterY + 360 * sc;
  const buddyIn = pop(frame, fps, MAZE_T.buddy - 3, springs.bouncy);
  const dashU = interpolate(frame, [MAZE_T.dash, MAZE_T.arrive], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const BS = 120 * sc;
  const stretch = frame >= MAZE_T.dash && frame < MAZE_T.arrive ? 1.25 : 1;
  const land = interpolate(frame, [MAZE_T.arrive, MAZE_T.arrive + 3, MAZE_T.arrive + 10], [1, 0.75, 1], clamp);
  const feetTop = lineTop + 80 * sc + BS * BUDDY_RATIO;
  const feetBottom = lineBottom - 78 * sc;
  const feet = feetTop + (feetBottom - feetTop) * dashU;
  const check = interpolate(frame, [MAZE_T.arrive + 2, MAZE_T.arrive + 12], [0, 1], clamp);
  const calPop = interpolate(frame, [MAZE_T.arrive, MAZE_T.arrive + 4, MAZE_T.arrive + 10], [1, 1.15, 1], clamp);
  const wordIn = pop(frame, fps, MAZE_T.dash - 2, springs.pop);
  const leftLabelIn = interpolate(frame, [S2, S2 + 8], [0, 1], clamp);
  const strike = interpolate(frame, [MAZE_T.no - 4, MAZE_T.no + 4], [0, 1], clamp);
  const noIn = pop(frame, fps, MAZE_T.no, springs.bouncy);
  const headOut = interpolate(frame, [S2 - half, S2 + 2], [0, 1], clamp);

  const label = (text: string, color: string, size: number): React.CSSProperties => ({
    fontFamily: fonts.display,
    fontWeight: 500,
    fontSize: size,
    lineHeight: 1.0,
    letterSpacing: headlineTracking,
    color,
    textAlign: "center",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ position: "absolute", inset: 0, background: p.light, overflow: "hidden" }}>
      {/* Hook headline, pushed up and out when the seam opens. */}
      <div style={{ opacity: 1 - headOut, transform: `translateY(${-80 * headOut}px)` }}>
        <Headline text={props.hook.headline} color={p.blue} delay={-22} stagger={2} />
      </div>

      {/* Left label (appears with the split). */}
      <div
        style={{
          position: "absolute",
          top: L.safeTop + 6,
          left: 0,
          width: width / 2,
          opacity: leftLabelIn,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", ...label(props.split.leftLabel, p.blue, labelSize) }}>
          {props.split.leftLabel}
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "52%",
              height: 10 * sc,
              width: `calc(${strike * 100}% + ${20 * strike}px)`,
              background: p.ink,
              borderRadius: 6,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 26 * sc,
            background: p.ink,
            color: p.white,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 40 * sc,
            padding: `${12 * sc}px ${30 * sc}px`,
            borderRadius: 40,
            opacity: Math.min(1, noIn * 2),
            transform: `scale(${0.5 + 0.5 * noIn}) rotate(-3deg)`,
          }}
        >
          {props.split.noChip}
        </div>
      </div>

      {/* The maze. */}
      <div
        style={{
          position: "absolute",
          left: cx - (MAZE_W * s) / 2,
          top: cy - (MAZE_H * s) / 2,
          width: MAZE_W,
          height: MAZE_H,
          transform: `scale(${s})`,
          transformOrigin: "0 0",
        }}
      >
        <Maze frame={frame} seed={props.mazeSeed} keys={keys} chips={chips} wall={p.blue} chipScale={1 + 0.3 * k} />
      </div>

      {/* Right half: blue, one straight line. */}
      {k > 0 ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: panelX, width: PW, background: p.blue, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: L.safeTop + 6, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={label(props.split.rightLabel, p.white, labelSize)}>{props.split.rightLabel}</div>
            <div
              style={{
                ...label(props.split.rightWord, p.blueSoft, labelSize * 1.12),
                marginTop: 14 * sc,
                opacity: Math.min(1, wordIn * 1.4),
                transform: `translateY(${(1 - wordIn) * 30}px)`,
              }}
            >
              {props.split.rightWord}
            </div>
          </div>
          {/* straight dashed line */}
          <div
            style={{
              position: "absolute",
              left: PW / 2 - 5 * sc,
              top: lineTop + 70 * sc,
              height: lineBottom - lineTop - 150 * sc,
              width: 10 * sc,
              backgroundImage: `linear-gradient(${p.blueSoft} 55%, transparent 55%)`,
              backgroundSize: `100% ${34 * sc}px`,
              opacity: 0.9,
            }}
          />
          <div style={{ position: "absolute", left: PW / 2 - 60 * sc, top: lineTop - 20 * sc }}>
            <Envelope size={120 * sc} color={p.white} line={p.blue} />
          </div>
          <div
            style={{
              position: "absolute",
              left: PW / 2 - 70 * sc,
              top: lineBottom - 90 * sc,
              transform: `scale(${calPop})`,
            }}
          >
            <CalendarIcon size={140 * sc} color={p.white} accent={p.blueSoft} check={check} />
          </div>
          <Buddy
            size={BS}
            body={p.white}
            eye={p.blueMascot}
            squash={frame >= MAZE_T.arrive ? land : stretch}
            blink={blinkScale(frame, [MAZE_T.arrive + 16])}
            look={{ x: 0, y: frame < MAZE_T.arrive ? 1 : 0.2 }}
            style={{
              position: "absolute",
              left: PW / 2 - BS / 2,
              top: feet - BS * BUDDY_RATIO,
              opacity: Math.min(1, buddyIn * 3),
              transform: `scale(${0.4 + 0.6 * buddyIn})`,
              transformOrigin: "50% 100%",
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
