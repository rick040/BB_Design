import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg } from "../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Avatar, Chip } from "../components/ui";
import { DetailText, VisualBox } from "../layout";
import type { HeroVslProps } from "../schema";

// Step 2 in detail: Buddy picks amount, due date, reference and payment link
// out of the forwarded mail. Each line gets marked, then lands as a chip.
export const READ_T = {
  card: 2, // forwarded mail is there
  mark: 12, // first line marked
  markStagger: 9, // next lines
  chipDelay: 5, // chip pops after its line is marked
  nod: 54, // Buddy nods: got it
};

const CARD = { left: 90, top: 20, w: 820, h: 528 };
const BUDDY = 170;
const BUDDY_H = BUDDY * BUDDY_RATIO;
const FEET = 846;
const BX = 830;

const Bar: React.FC<{ w: string; color: string }> = ({ w, color }) => (
  <div style={{ height: 14, width: w, borderRadius: 7, background: color, marginTop: 12 }} />
);

export const ReadScene: React.FC<{
  props: HeroVslProps["read"];
  bill: HeroVslProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, READ_T.card, springs.smooth);
  const marks = props.fields.map((_, i) =>
    interpolate(frame, [READ_T.mark + i * READ_T.markStagger, READ_T.mark + i * READ_T.markStagger + 7], [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const chips = props.fields.map((_, i) =>
    pop(frame, fps, READ_T.mark + i * READ_T.markStagger + READ_T.chipDelay, springs.pop),
  );
  // Buddy looks at each line as it is marked, then at the chips.
  const lastMark = READ_T.mark + 3 * READ_T.markStagger;
  const lookY = interpolate(frame, [0, READ_T.mark, lastMark, lastMark + 10], [-0.9, -0.9, -0.3, 0.4], clamp);
  const nod = interpolate(frame, [READ_T.nod, READ_T.nod + 4, READ_T.nod + 10, READ_T.nod + 15], [1, 0.86, 1.05, 1], clamp);
  const enter = pop(frame, fps, 0, springs.bouncy);
  const blink = blinkScale(frame, [READ_T.nod + 2, 86]);
  const idle = Math.sin(frame / 9) * 3;

  return (
    <SceneBg color={p.blue}>
      <DetailText title={props.title} body={props.body} />

      <VisualBox>
        <div
          style={{
            position: "absolute",
            left: CARD.left,
            top: CARD.top,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 46,
            background: p.white,
            boxShadow: "0 30px 80px rgba(0, 10, 90, 0.28)",
            padding: "32px 40px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            opacity: Math.min(1, cardIn * 1.5),
            transform: `translateY(${(1 - cardIn) * 30}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Avatar letter={bill.sender[0] ?? "R"} size={70} />
            <div>
              <div style={{ fontSize: 31, fontWeight: 600, color: p.ink }}>{bill.sender}</div>
              <div style={{ fontSize: 25, color: p.greyText }}>{bill.subject}</div>
            </div>
          </div>
          <div style={{ fontSize: 25, color: p.greyText, marginTop: 24 }}>{props.greeting}</div>
          <Bar w="88%" color={p.grey} />
          <Bar w="64%" color={p.grey} />

          <div style={{ marginTop: 18 }}>
            {props.fields.map((f, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  height: 58,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 14px",
                  margin: "0 -14px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 5,
                    bottom: 5,
                    width: `${marks[i] * 100}%`,
                    borderRadius: 14,
                    background: `${p.blueSoft}88`,
                  }}
                />
                <span style={{ position: "relative", fontSize: 27, color: "#6b6b78", width: 220 }}>{f.label}</span>
                <span
                  style={{
                    position: "relative",
                    fontSize: 29,
                    fontWeight: 600,
                    color: i === 3 ? p.blueMid : p.ink,
                    textDecoration: i === 3 ? "underline" : "none",
                    textUnderlineOffset: 5,
                  }}
                >
                  {f.value}
                </span>
              </div>
            ))}
          </div>
          <Bar w="72%" color={p.grey} />
        </div>

        {/* What Buddy keeps */}
        <div
          style={{
            position: "absolute",
            left: CARD.left,
            top: 590,
            width: 640,
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          {props.fields.map((f, i) => (
            <div
              key={i}
              style={{
                opacity: Math.min(1, chips[i] * 1.6),
                transform: `translateY(${(1 - chips[i]) * -40}px) scale(${0.7 + 0.3 * chips[i]})`,
              }}
            >
              <Chip text={f.chip} check />
            </div>
          ))}
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={interpolate(enter, [0, 0.6, 1], [0.7, 1.08, 1]) * nod}
          look={{ x: -0.8, y: lookY }}
          style={{
            position: "absolute",
            left: BX - BUDDY / 2,
            top: FEET - BUDDY_H + idle,
            opacity: Math.min(1, enter * 3),
          }}
        />
      </VisualBox>
    </SceneBg>
  );
};
