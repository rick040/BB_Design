import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg } from "../../components/Stage";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Envelope, SpokenHeadline } from "../components/parts";
import { type DeurmatProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[1];
export const SUM_T = {
  envStagger: 4, // mini envelopes line up
  line: wordAt("vijf", 2) - 4, // sum line draws
  dates: wordAt("vervaldatums"), // red date chips drop under each envelope
  total: wordAt("vervaldatums") + 10, // big "= 5"
  mine: wordAt("allemaal"), // subline
};
const SPOKEN = [wordAt("vijf"), wordAt("rekeningen", 2), wordAt("vijf", 2), wordAt("vervaldatums")];

const EW = 160;
const GAP = 40;
const X0 = (1080 - (5 * EW + 4 * GAP)) / 2;

export const SumScene: React.FC<{ props: DeurmatProps["sum"]; bills: DeurmatProps["bills"] }> = ({ props, bills }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const line = interpolate(frame, [SUM_T.line, SUM_T.line + 12], [0, 1], clamp);
  const total = pop(frame, fps, SUM_T.total, springs.bouncy);
  const mine = pop(frame, fps, SUM_T.mine, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <SpokenHeadline text={props.headline} at={SPOKEN} c1={p.white} c2={p.blueSoft} top={250} size={104} />
      {bills.map((b, i) => {
        const x = X0 + i * (EW + GAP);
        const e = pop(frame, fps, S + 2 + i * SUM_T.envStagger, springs.pop);
        const d = pop(frame, fps, SUM_T.dates + i * 3, springs.bouncy);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x, top: 640, opacity: Math.min(1, e * 2), transform: `translateY(${(1 - e) * -60}px)` }}>
              <Envelope sender={b.sender} due={b.due} w={EW} compact />
            </div>
            {i < 4 ? (
              <div
                style={{
                  position: "absolute",
                  left: x + EW,
                  width: GAP,
                  top: 652,
                  textAlign: "center",
                  fontFamily: fonts.display,
                  fontSize: 58,
                  fontWeight: 500,
                  color: p.blueSoft,
                  opacity: e,
                }}
              >
                +
              </div>
            ) : null}
            <div
              style={{
                position: "absolute",
                left: x,
                width: EW,
                top: 880,
                display: "flex",
                justifyContent: "center",
                opacity: Math.min(1, d * 2),
                transform: `translateY(${(1 - d) * -40}px) scale(${0.6 + 0.4 * d})`,
              }}
            >
              <div
                style={{
                  background: p.red,
                  color: p.white,
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 32,
                  padding: "10px 0",
                  width: EW,
                  textAlign: "center",
                  borderRadius: 40,
                }}
              >
                {b.date}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {/* sum line */}
      <div style={{ position: "absolute", left: X0, top: 830, height: 8, width: (1080 - 2 * X0) * line, borderRadius: 4, background: p.white }} />
      {/* total */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1000,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 330,
          lineHeight: 1,
          letterSpacing: "-0.06em",
          color: p.blueSoft,
          opacity: Math.min(1, total * 2),
          transform: `scale(${0.6 + 0.4 * total})`,
        }}
      >
        = 5
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1400,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 64,
          letterSpacing: "-0.04em",
          color: p.white,
          opacity: mine,
          transform: `translateY(${(1 - mine) * 30}px)`,
        }}
      >
        {props.subline}
      </div>
    </SceneBg>
  );
};
