import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_PATH, BUDDY_RATIO, BUDDY_VIEWBOX } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Callout, DashLine, TickBadge } from "../components/Manual";
import type { HandleidingProps } from "../schema";

// Timeline (frames, scene-local).
export const PARTS_T = {
  outline: 0, // dashed Buddy-shaped slot draws in
  drop: 16, // Buddy drops towards the slot
  click: 26, // ... and clicks into place (squash + burst)
  label: 32, // callout "A" with its line
  list: 38, // parts list rows pop in one by one
  listStagger: 6,
  blink: 84,
};

const BUDDY = 270;
const SLOT = { x: 540 - BUDDY / 2, feet: 340 };
const LIST = { x: 160, y: 410, w: 760, rowH: 98 };

export const PartsScene: React.FC<{ props: HandleidingProps["parts"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const outline = interpolate(frame, [PARTS_T.outline, PARTS_T.outline + 14], [0, 1], clamp);
  // Drop: from above into the slot, then a squash on the click.
  const drop = interpolate(frame, [PARTS_T.drop, PARTS_T.click], [0, 1], {
    ...clamp,
    easing: (t) => t * t,
  });
  const squash =
    frame < PARTS_T.click
      ? interpolate(drop, [0, 1], [1.08, 1.12])
      : interpolate(frame, [PARTS_T.click, PARTS_T.click + 4, PARTS_T.click + 10, PARTS_T.click + 16], [1.12, 0.78, 1.06, 1], clamp);
  const burst = interpolate(frame, [PARTS_T.click, PARTS_T.click + 12], [0, 1], clamp);
  const label = pop(frame, fps, PARTS_T.label, springs.pop);
  const blink = blinkScale(frame, [PARTS_T.blink]);
  const look = interpolate(frame, [PARTS_T.list, PARTS_T.list + 12], [0, 0.8], clamp);

  const buddyTop = SLOT.feet - BUDDY * BUDDY_RATIO - (1 - drop) * 110;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={-4} stagger={3} />

      <Stage offsetY={30}>
        {/* Dashed Buddy-shaped slot */}
        <svg
          width={BUDDY}
          height={BUDDY * BUDDY_RATIO}
          viewBox={`0 0 ${BUDDY_VIEWBOX.width} ${BUDDY_VIEWBOX.height}`}
          style={{
            position: "absolute",
            left: SLOT.x,
            top: SLOT.feet - BUDDY * BUDDY_RATIO,
            overflow: "visible",
            opacity: frame < PARTS_T.click + 2 ? outline : interpolate(frame, [PARTS_T.click + 2, PARTS_T.click + 8], [1, 0], clamp),
          }}
        >
          <path
            d={BUDDY_PATH}
            fill="none"
            stroke={p.blueSoft}
            strokeWidth={14}
            strokeDasharray="38 26"
            strokeLinecap="round"
          />
        </svg>

        {/* Click burst */}
        {frame >= PARTS_T.click
          ? [-150, -110, -70, 70, 110, 150].map((deg, i) => {
              const r1 = BUDDY * 0.62 + burst * 40;
              const r2 = r1 + 46 * (1 - burst * 0.6);
              const a = ((deg - 90) * Math.PI) / 180;
              const cx = 540;
              const cy = SLOT.feet - (BUDDY * BUDDY_RATIO) / 2;
              return (
                <svg key={i} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - burst }} width={1} height={1}>
                  <line
                    x1={cx + Math.cos(a) * r1}
                    y1={cy + Math.sin(a) * r1}
                    x2={cx + Math.cos(a) * r2}
                    y2={cy + Math.sin(a) * r2}
                    stroke={p.white}
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                </svg>
              );
            })
          : null}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: look * 0.2, y: look }}
          style={{
            position: "absolute",
            left: SLOT.x,
            top: buddyTop,
            opacity: interpolate(frame, [PARTS_T.drop, PARTS_T.drop + 6], [0, 1], clamp),
          }}
        />

        {/* Callout A */}
        <div style={{ opacity: label }}>
          <DashLine x1={302} y1={150} x2={410} y2={196} color={p.white} progress={label} width={5} />
        </div>
        <Callout
          n={props.partLabel}
          size={74}
          color={p.white}
          fill={p.blue}
          style={{ left: 232, top: 112, transform: `scale(${label})` }}
        />

        {/* Parts list */}
        <div
          style={{
            position: "absolute",
            left: LIST.x,
            top: LIST.y,
            width: LIST.w,
            height: LIST.rowH * 4 + 30,
            borderRadius: 28,
            border: `5px solid ${p.white}`,
            boxSizing: "border-box",
            opacity: interpolate(frame, [PARTS_T.list - 6, PARTS_T.list], [0, 1], clamp),
          }}
        >
          {props.list.map((row, i) => {
            const t = pop(frame, fps, PARTS_T.list + i * PARTS_T.listStagger, springs.pop);
            const none = row.count === 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 40,
                  right: 40,
                  top: 15 + i * LIST.rowH,
                  height: LIST.rowH,
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  fontFamily: fonts.display,
                  fontSize: 50,
                  letterSpacing: "-0.03em",
                  color: none ? p.blueText : p.white,
                  borderTop: i > 0 ? `3px solid ${p.white}33` : "none",
                  opacity: Math.min(1, t * 1.5),
                  transform: `translateX(${(1 - t) * 40}px)`,
                }}
              >
                <span style={{ fontWeight: 700, width: 70 }}>{row.count}x</span>
                <span style={{ flex: 1, fontWeight: 500, position: "relative" }}>
                  {row.name}
                </span>
                {none ? (
                  <svg width={56} height={56} viewBox="0 0 100 100">
                    <path d="M26 26 L74 74 M74 26 L26 74" stroke={p.blueText} strokeWidth={12} strokeLinecap="round" />
                  </svg>
                ) : (
                  <div style={{ position: "relative", width: 56, height: 56 }}>
                    <TickBadge size={56} bg={p.white} fg={p.blue} style={{ left: 0, top: 0, transform: `scale(${t})` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Stage>
    </SceneBg>
  );
};
