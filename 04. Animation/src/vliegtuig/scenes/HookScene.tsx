import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { EyeIcon, MailRow } from "../components/Paper";
import { type VliegtuigProps, wordAt } from "../schema";

// Absolute frames; beats hang on the spoken words.
export const HOOK_T = {
  read: wordAt("koppelen"), // the chained app starts reading every mail
  readStagger: 4,
  snap: wordAt("hoeft"), // the chain breaks
  chip: wordAt("niet"), // "Hoeft niet."
};

export const CARD = { x: 40, y: 120, w: 640, pad: 22, rowH: 96, gap: 14 };
export const rowTop = (i: number) => CARD.y + CARD.pad + i * (CARD.rowH + CARD.gap);
const TILE = { cx: 905, cy: 400, s: 160 };
const CHAIN_Y = TILE.cy;
const CHAIN_X0 = CARD.x + CARD.w - 6;
const CHAIN_X1 = TILE.cx - TILE.s / 2 + 6;

export const HookScene: React.FC<{ props: VliegtuigProps["hook"]; bill: VliegtuigProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const ink = p.red; // dark ink (alert colour), never red in these ads

  const names = [...props.mails, bill.sender];
  const snapped = frame >= HOOK_T.snap;
  const fall = interpolate(frame, [HOOK_T.snap, HOOK_T.snap + 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.6)),
  });
  const tension = frame >= HOOK_T.read && !snapped ? Math.sin(frame * 2.1) * 2.5 : 0;
  const sh = shake(frame, HOOK_T.snap, 12, 14);
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.bouncy);
  const tilePulse = 1 + 0.06 * Math.max(0, Math.sin(((frame - 10) / 24) * Math.PI * 2)) * (frame < HOOK_T.snap ? 1 : 0);
  const tileAway = interpolate(frame, [HOOK_T.snap, HOOK_T.snap + 14], [0, 1], clamp);

  // Chain: alternating rings and edge-on links between card and app tile.
  const n = 5;
  const step = (CHAIN_X1 - CHAIN_X0) / n;
  const links = Array.from({ length: n }, (_, i) => CHAIN_X0 + step * (i + 0.5));
  const mid = n / 2;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-15} stagger={2} />
      <Stage offsetY={60}>
        <div style={{ position: "absolute", left: sh.x, top: sh.y, width: 1080, height: 900 }}>
          {/* chain */}
          {links.map((x, i) => {
            const leftSide = i < mid;
            const anchorX = leftSide ? CHAIN_X0 : CHAIN_X1;
            const ang = snapped ? (leftSide ? 1 : -1) * 75 * fall : 0;
            const ring = i % 2 === 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 1080,
                  height: 900,
                  transformOrigin: `${anchorX}px ${CHAIN_Y}px`,
                  transform: `rotate(${ang}deg) translateY(${tension}px)`,
                }}
              >
                <div
                  style={
                    ring
                      ? {
                          position: "absolute",
                          left: x - 34,
                          top: CHAIN_Y - 22,
                          width: 68,
                          height: 44,
                          borderRadius: 999,
                          border: `10px solid ${ink}`,
                          boxSizing: "border-box",
                        }
                      : {
                          position: "absolute",
                          left: x - 30,
                          top: CHAIN_Y - 7,
                          width: 60,
                          height: 14,
                          borderRadius: 7,
                          background: ink,
                        }
                  }
                />
              </div>
            );
          })}

          {/* mailbox card */}
          <div
            style={{
              position: "absolute",
              left: CARD.x,
              top: CARD.y,
              width: CARD.w,
              height: CARD.pad * 2 + 5 * CARD.rowH + 4 * CARD.gap,
              borderRadius: 40,
              background: p.white,
              boxShadow: "0 30px 80px rgba(1, 59, 255, 0.14)",
            }}
          />
          {names.map((name, i) => {
            const at = HOOK_T.read + i * HOOK_T.readStagger;
            const lit = frame >= at && !snapped ? pop(frame, fps, at, springs.pop) : 0;
            const unlit = snapped ? 1 - interpolate(frame, [HOOK_T.snap, HOOK_T.snap + 8], [0, 1], clamp) : 1;
            const k = Math.min(1, lit) * unlit + (snapped ? 0 : 0);
            return (
              <div key={name} style={{ position: "absolute", left: CARD.x + CARD.pad, top: rowTop(i) }}>
                <MailRow
                  name={name}
                  width={CARD.w - CARD.pad * 2}
                  bg={k > 0.02 ? "#fff3c4" : p.white}
                  ink={p.ink}
                  avatar={p.blueSoft}
                  bar={p.grey}
                  right={
                    <div style={{ opacity: k, transform: `scale(${0.5 + 0.5 * k})` }}>
                      <EyeIcon size={58} color={ink} />
                    </div>
                  }
                />
              </div>
            );
          })}

          {/* chained app tile */}
          <div
            style={{
              position: "absolute",
              left: TILE.cx - TILE.s / 2 + tileAway * 60,
              top: TILE.cy - TILE.s / 2,
              width: TILE.s,
              height: TILE.s,
              borderRadius: 40,
              background: ink,
              color: p.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 110,
              transform: `scale(${tilePulse})`,
              opacity: 1 - 0.55 * tileAway,
            }}
          >
            ?
          </div>
          <div
            style={{
              position: "absolute",
              left: TILE.cx - 140 + tileAway * 60,
              width: 280,
              top: TILE.cy + TILE.s / 2 + 18,
              textAlign: "center",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 32,
              color: ink,
              opacity: 1 - 0.55 * tileAway,
            }}
          >
            {props.appLabel}
          </div>
        </div>

        {/* "Hoeft niet." */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 790,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `scale(${0.5 + 0.5 * chipIn})`,
          }}
        >
          <div
            style={{
              background: p.blue,
              color: p.white,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 56,
              letterSpacing: "-0.03em",
              padding: "18px 46px",
              borderRadius: 60,
              boxShadow: "0 20px 50px rgba(1, 59, 255, 0.3)",
            }}
          >
            {props.chip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
