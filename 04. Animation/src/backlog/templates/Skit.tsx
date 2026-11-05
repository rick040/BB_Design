import { slide } from "@remotion/transitions/slide";
import React from "react";
import { useCurrentFrame } from "remotion";
import { Buddy } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BacklogFrame, endFrames } from "../BacklogFrame";
import { baseSchema, bgSchema, sec, seriesTotal } from "../common";
import { Head, Sub, useBg } from "../parts";
import { VisualView } from "../visuals";
import { Avatar, lin, sp } from "../visuals/Card";
import { z } from "zod";

// Template 7 · Skit. An animated chat thread (left/right/system bubbles,
// typing dots, "niet bezorgd"), then a punchline.
export const skitSchema = baseSchema.extend({
  headline: z.string(),
  bg: bgSchema,
  chat: z.object({
    title: z.string(),
    /** Small line under the title, e.g. "per mail". */
    subtitle: z.string(),
    avatar: z.enum(["buddy", "letter"]),
  }),
  messages: z
    .array(
      z.object({
        side: z.enum(["left", "right", "system"]),
        /** Name above a left bubble in a group chat; empty = none. */
        sender: z.string(),
        text: z.string(),
        failed: z.boolean(),
      }),
    )
    .min(2)
    .max(6),
  /** Seconds between two messages. */
  messageGap: z.number().min(0.6).max(3),
  hold: z.number().min(0.5).max(4),
  punch: z.object({ headline: z.string(), subline: z.string(), seconds: z.number().min(2).max(6) }),
});
export type SkitProps = z.infer<typeof skitSchema>;

export const SKIT_T = {
  first: -8, // first message is already there on frame 0 (cover)
  typingLen: 12, // typing dots before every left message
  punchBuddy: 8,
};

const chatSeconds = (p: SkitProps) => 0.4 + (p.messages.length - 1) * p.messageGap + p.hold;
export const skitFrames = (p: SkitProps) => [sec(chatSeconds(p)), sec(p.punch.seconds), endFrames(p)];
export const skitTotal = (p: SkitProps) => seriesTotal(skitFrames(p), p.transition);

const ChatScene: React.FC<{ props: SkitProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const c = useBg(props.bg);
  const arrive = (i: number) => SKIT_T.first + sec(i * props.messageGap);
  // Bubbles are laid out bottom-up; heights are estimated from text length.
  const est = (m: SkitProps["messages"][number]) => {
    const lines = m.text.split("\n").reduce((a, l) => a + Math.max(1, Math.ceil(l.length / 26)), 0);
    return (m.side === "system" ? 84 : 58 * lines + 52) + (m.sender ? 40 : 0) + (m.failed ? 44 : 0) + 22;
  };
  const visible = props.messages.filter((_, i) => frame >= arrive(i) - 1);
  const typingFor = props.messages.findIndex((m, i) => m.side === "left" && frame >= arrive(i) - SKIT_T.typingLen && frame < arrive(i));
  let y = 820 - (typingFor >= 0 ? 100 : 0);
  const pos: number[] = [];
  for (let i = visible.length - 1; i >= 0; i--) {
    y -= est(visible[i]);
    pos[i] = y;
  }
  return (
    <SceneBg color={c.bg}>
      <Head text={props.headline} color={c.fg} hook sizeFactor={0.92} />
      <Stage offsetY={20}>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 0,
            width: 940,
            height: 900,
            borderRadius: 56,
            background: p.light,
            border: `4px solid ${c.onBlue ? p.blueSoft : p.grey}`,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(1, 40, 160, 0.18)",
          }}
        >
          <div style={{ position: "relative", zIndex: 5, height: 120, background: p.white, display: "flex", alignItems: "center", gap: 22, padding: "0 34px", borderBottom: `2px solid ${p.grey}` }}>
            {props.chat.avatar === "buddy" ? (
              <div style={{ width: 76, height: 76, borderRadius: 38, background: p.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Buddy size={46} body={p.white} eye={p.blueMascot} />
              </div>
            ) : (
              <Avatar letter={props.chat.title} size={76} />
            )}
            <div style={{ fontFamily: fonts.ui }}>
              <div style={{ fontSize: 36, fontWeight: 650, color: p.ink }}>{props.chat.title}</div>
              {props.chat.subtitle ? <div style={{ fontSize: 26, color: p.greyText }}>{props.chat.subtitle}</div> : null}
            </div>
          </div>
          {visible.map((m, i) => {
            const s = sp(frame, arrive(i), 13, 200);
            const right = m.side === "right";
            const system = m.side === "system";
            const failIn = m.failed ? lin(frame, arrive(i) + 14, arrive(i) + 22) : 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 30,
                  right: 30,
                  top: pos[i],
                  display: "flex",
                  flexDirection: "column",
                  alignItems: system ? "center" : right ? "flex-end" : "flex-start",
                  // fade out as a bubble scrolls up under the chat header
                  opacity: Math.min(1, s * 1.6) * Math.max(0, Math.min(1, (pos[i] - 110) / 50)),
                  transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + 0.1 * s})`,
                  transformOrigin: right ? "100% 100%" : "0% 100%",
                }}
              >
                {m.sender ? <div style={{ fontFamily: fonts.ui, fontSize: 26, color: p.blueMid, fontWeight: 600, margin: "0 0 6px 18px" }}>{m.sender}</div> : null}
                <div
                  style={{
                    maxWidth: system ? 840 : 720,
                    padding: system ? "14px 28px" : "20px 30px",
                    borderRadius: system ? 26 : 38,
                    borderBottomRightRadius: right ? 10 : undefined,
                    borderBottomLeftRadius: !right && !system ? 10 : undefined,
                    background: system ? (m.failed ? p.red : p.grey) : right ? p.blue : p.white,
                    color: system ? (m.failed ? p.white : p.ink) : right ? p.white : p.ink,
                    fontFamily: fonts.ui,
                    fontSize: system ? 34 : 46,
                    fontWeight: system ? 600 : 450,
                    lineHeight: 1.25,
                    whiteSpace: "pre-line",
                    textAlign: system ? "center" : "left",
                    boxShadow: system ? "none" : "0 8px 20px rgba(1, 30, 140, 0.08)",
                  }}
                >
                  {m.text}
                </div>
                {m.failed && !system ? (
                  <div style={{ marginTop: 8, fontFamily: fonts.ui, fontSize: 26, fontWeight: 600, color: p.red, opacity: failIn, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 14, background: p.red, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>!</span>
                    Niet bezorgd
                  </div>
                ) : null}
              </div>
            );
          })}
          {typingFor >= 0 ? (
            <div style={{ position: "absolute", left: 30, top: 720, padding: "24px 30px", borderRadius: 38, borderBottomLeftRadius: 10, background: p.white, display: "flex", gap: 12 }}>
              {[0, 1, 2].map((d) => (
                <div key={d} style={{ width: 18, height: 18, borderRadius: 9, background: p.greyText, transform: `translateY(${Math.sin((frame - d * 4) / 3) * 5}px)` }} />
              ))}
            </div>
          ) : null}
        </div>
      </Stage>
    </SceneBg>
  );
};

const PunchScene: React.FC<{ props: SkitProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const c = useBg(props.bg === "blue" ? "light" : "blue");
  return (
    <SceneBg color={c.bg}>
      <Head text={props.punch.headline} color={c.fg} />
      <Stage offsetY={40}>
        <VisualView v={{ kind: "buddy", text: "", mood: "happy" }} t={frame - SKIT_T.punchBuddy} onBlue={c.onBlue} />
      </Stage>
      <Sub text={props.punch.subline} color={c.sub} />
    </SceneBg>
  );
};

export const Skit: React.FC<SkitProps> = (props) => (
  <BacklogFrame
    base={props}
    presentation={() => slide({ direction: "from-right" })}
    scenes={[
      { name: "Chat", frames: sec(chatSeconds(props)), node: <ChatScene props={props} /> },
      { name: "Punchline", frames: sec(props.punch.seconds), node: <PunchScene props={props} /> },
    ]}
  />
);

