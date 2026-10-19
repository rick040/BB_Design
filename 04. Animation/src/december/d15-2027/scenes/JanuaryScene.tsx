import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { SceneBg, Stage } from "../../../components/Stage";
import { pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { Flag } from "../../d02-advent/components/AdventCalendar";
import { DHeadline, DSubline } from "../../text";
import { dec, decFonts } from "../../theme";
import type { AftellenProps } from "../schema";

// Timeline (frames, scene-local).
export const JAN_T = {
  grid: -4, // de maand staat er al bij het begin
  item: 20, // eerste rekening wordt gemarkeerd
  itemStagger: 26, // duur: tussen twee rekeningen
  flagFar: 8, // het 7-vlaggetje komt een paar frames na de markering
  flagNear: 14, // en het 2-vlaggetje
  sub: 70,
};

// Januari 2027 begint op een vrijdag; het raster loopt van ma 28 december t/m zo 31 januari.
const CELLS = 35;
const FIRST_JAN = 4; // index van 1 januari in het raster
const dayOf = (i: number) => (i < FIRST_JAN ? 28 + i : i - FIRST_JAN + 1);
const isDec = (i: number) => i < FIRST_JAN;

const COL_W = 134;
const ROW_H = 112;
const GAP = 6;
const GX = (1080 - (7 * COL_W + 6 * GAP)) / 2;
const GY = 112;

const cellPos = (i: number) => ({
  x: GX + (i % 7) * (COL_W + GAP),
  y: GY + Math.floor(i / 7) * (ROW_H + GAP),
});

export const JanuaryScene: React.FC<{ props: AftellenProps["january"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const BUDDY = 150;
  const breathe = 1 + Math.sin(frame / 14) * 0.025;
  const grid = pop(frame, fps, JAN_T.grid, springs.smooth);

  return (
    <SceneBg color={p.light}>
      <DHeadline text={props.headline} color={p.blue} delay={-6} stagger={3} sizeFactor={0.7} />
      <Stage offsetY={10}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            textAlign: "center",
            fontFamily: decFonts.display,
            fontSize: 46,
            letterSpacing: "-0.02em",
            color: dec.ink,
            opacity: grid,
          }}
        >
          {props.month}
        </div>
        {props.weekdays.map((w, i) => (
          <div
            key={w}
            style={{
              position: "absolute",
              left: GX + i * (COL_W + GAP),
              width: COL_W,
              top: 66,
              textAlign: "center",
              fontFamily: decFonts.text,
              fontWeight: 600,
              fontSize: 26,
              color: dec.greyText,
              opacity: grid,
            }}
          >
            {w}
          </div>
        ))}

        {Array.from({ length: CELLS }, (_, i) => {
          const pos = cellPos(i);
          const itemIdx = props.items.findIndex((it) => FIRST_JAN - 1 + it.day === i);
          const item = itemIdx >= 0 ? props.items[itemIdx] : null;
          const at = JAN_T.item + itemIdx * JAN_T.itemStagger;
          const mark = item ? pop(frame, fps, at, springs.pop) : 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: COL_W,
                height: ROW_H,
                borderRadius: 26,
                background: item && mark > 0.05 ? dec.blue : dec.white,
                opacity: (isDec(i) ? 0.55 : 1) * Math.min(1, grid * 1.5),
                transform: `scale(${0.9 + 0.1 * grid + (item ? mark * 0.04 : 0)})`,
                fontFamily: decFonts.text,
                boxShadow: "0 10px 26px rgba(1, 40, 160, 0.08)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 16,
                  top: 10,
                  fontWeight: 600,
                  fontSize: 28,
                  color: item && mark > 0.05 ? dec.white : dec.ink,
                }}
              >
                {dayOf(i)}
              </span>
              {item ? (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 12,
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: 19,
                    color: dec.white,
                    opacity: Math.min(1, mark * 2),
                  }}
                >
                  {item.label}
                </span>
              ) : null}
            </div>
          );
        })}

        {/* Vlaggetjes: 7 en 2 dagen voor elke rekening */}
        {props.items.map((it, k) => {
          const at = JAN_T.item + k * JAN_T.itemStagger;
          const target = FIRST_JAN - 1 + it.day;
          return [
            { idx: target - 7, label: props.flagFar, start: at + JAN_T.flagFar },
            { idx: target - 2, label: props.flagNear, start: at + JAN_T.flagNear },
          ].map((f) => {
            const t = pop(frame, fps, f.start, springs.bouncy);
            if (frame < f.start) return null;
            const pos = cellPos(f.idx);
            return (
              <Flag
                key={`${k}-${f.label}`}
                x={pos.x + 84}
                y={pos.y + ROW_H - 12}
                label={f.label}
                pennant={dec.blue}
                ink={dec.white}
                scale={0.62 * t}
                rotate={(1 - t) * 40}
                wave={Math.sin((frame - f.start) / 3) * 3}
              />
            );
          });
        })}

        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={dec.white}
          blink={0.18}
          squash={breathe}
          look={{ x: 0, y: 0.2 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: 886 - BUDDY * BUDDY_RATIO,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
      <DSubline text={props.subline} color={p.blue} delay={JAN_T.sub} />
    </SceneBg>
  );
};
