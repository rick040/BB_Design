import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Checkmark } from "../../components/Checkmark";
import { clamp, pop, springs } from "../../lib/anim";
import { useWalkLayout } from "../layout";
import { bb, wfonts } from "../tokens";
import { InfoIcon } from "./Icons";
import { Rich } from "./Rich";

export type PanelItem = {
  text: string;
  /** Frame the line appears (and becomes the active one). */
  at: number;
  /** Frame it gets ticked off. */
  done: number;
};

/**
 * The instruction side of a step, in the page's own style: the 5-segment
 * progress bar, "STAP n VAN 5", the step title and a numbered list whose
 * lines light up and get ticked off in sync with the phone.
 */
export const StepPanel: React.FC<{
  step: number;
  title: string;
  items: PanelItem[];
  note?: { label: string; text: string; at: number };
}> = ({ step, title, items, note }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useWalkLayout();
  const T = L.text;

  const fill = interpolate(frame, [4, 18], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const noteIn = note ? pop(frame, fps, note.at, springs.smooth) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: L.col.left,
        top: L.col.top,
        width: L.col.width,
        fontFamily: wfonts.body,
        color: bb.ink,
      }}
    >
      {/* progress, like the mobile stepper on the page */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, width: L.tall ? "100%" : 560 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{ position: "relative", height: 12, borderRadius: 99, background: bb.barOff }}>
            {n <= step ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 99,
                  background: bb.blue,
                  transformOrigin: "0 50%",
                  transform: `scaleX(${n < step ? 1 : fill})`,
                  boxShadow: n === step ? `0 0 0 ${5 * fill}px rgba(1,59,255,.16)` : undefined,
                }}
              />
            ) : null}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: L.tall ? 34 : 46,
          fontSize: T.eyebrow,
          fontWeight: 650,
          letterSpacing: "0.08em",
          color: bb.blue,
          textTransform: "uppercase",
        }}
      >
        Stap {step} van 5
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: wfonts.heading,
          fontWeight: 600,
          fontSize: T.title,
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          whiteSpace: "pre-line",
        }}
      >
        {title}
      </div>

      <div style={{ display: "grid", gap: L.tall ? 12 : 16, marginTop: L.tall ? 28 : 44 }}>
        {items.map((it, i) => {
          const s = pop(frame, fps, it.at, springs.smooth);
          const active = frame >= it.at && frame < it.done;
          const isDone = frame >= it.done;
          const tick = interpolate(frame, [it.done, it.done + 10], [0, 1], clamp);
          const bump = pop(frame, fps, it.done, springs.pop);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 22,
                alignItems: "flex-start",
                padding: L.tall ? "16px 22px" : "20px 24px",
                borderRadius: 22,
                border: `2px solid ${isDone ? bb.okLine : active ? bb.blue : bb.line}`,
                background: isDone ? bb.okSoft : active ? bb.tint2 : bb.card,
                boxShadow: active ? "0 10px 30px rgba(1,59,255,.10)" : "0 1px 2px rgba(17,24,39,.04)",
                opacity: Math.min(1, s * 1.3),
                transform: `translateX(${(1 - s) * -24}px)`,
                fontSize: T.item,
                lineHeight: 1.32,
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: T.num,
                  height: T.num,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: (T.item * 1.32 - T.num) / 2,
                  border: `2.5px solid ${isDone ? bb.ok : active ? bb.blue : bb.field}`,
                  background: isDone ? bb.ok : active ? bb.blue : "#fff",
                  color: isDone || active ? "#fff" : bb.muted,
                  fontWeight: 700,
                  fontSize: T.num * 0.46,
                  transform: isDone ? `scale(${0.85 + 0.15 * bump})` : undefined,
                }}
              >
                {isDone ? <Checkmark size={T.num * 0.56} color="#fff" progress={tick} strokeWidth={15} /> : i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0, whiteSpace: "pre-line", color: isDone ? "#33503F" : bb.ink }}>
                <Rich text={it.text} />
              </div>
            </div>
          );
        })}
      </div>

      {note ? (
        <div
          style={{
            display: "flex",
            gap: 18,
            alignItems: "flex-start",
            marginTop: L.tall ? 18 : 28,
            padding: "18px 22px",
            borderRadius: 20,
            background: bb.tint2,
            border: `2px solid ${bb.tintLine}`,
            fontSize: T.note,
            lineHeight: 1.38,
            opacity: noteIn,
            transform: `translateY(${(1 - noteIn) * 16}px)`,
          }}
        >
          <div
            style={{
              flex: "none",
              width: T.note * 1.45,
              height: T.note * 1.45,
              marginTop: (T.note * 1.38 - T.note * 1.45) / 2,
              borderRadius: "50%",
              background: bb.blue,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InfoIcon size={T.note * 0.95} />
          </div>
          <div>
            <b style={{ fontWeight: 650 }}>{/[?!.:]$/.test(note.label) ? `${note.label} ` : `${note.label}: `}</b>
            <Rich text={note.text} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
