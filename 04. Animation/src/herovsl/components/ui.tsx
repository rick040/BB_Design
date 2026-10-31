import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

// Small UI pieces for the hero VSL, rebuilt as vectors so the text stays
// editable. Generic mail UI: no logos of mail providers.

export const ForwardIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: "block", flexShrink: 0 }}>
    <path
      d="M18 7l9 8.5-9 8.5M27 15.5H13c-4.4 0-8 3.6-8 8V26"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlaneIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: "block", flexShrink: 0 }}>
    <path d="M4 15.2L27.5 5.5 21 27l-5.2-8.4L4 15.2z" fill={color} />
    <path d="M15.8 18.6L27.5 5.5" stroke="#fff" strokeOpacity={0.55} strokeWidth={1.6} />
  </svg>
);

export const EnvelopeIcon: React.FC<{ size: number; color: string; flap?: string }> = ({
  size,
  color,
  flap = "#fff",
}) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 50 36" style={{ display: "block", overflow: "visible" }}>
    <rect x="1" y="1" width="48" height="34" rx="6" fill={color} />
    <path d="M3 4l22 16L47 4" fill="none" stroke={flap} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

export const ClockIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0, display: "block" }}>
    <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="2.8" />
    <path d="M16 9v7.5l5 3" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);

export const CalendarIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0, display: "block" }}>
    <rect x="4" y="6.5" width="24" height="21" rx="4.5" fill="none" stroke={color} strokeWidth="2.8" />
    <path d="M4 13h24M10.5 3.5v5M21.5 3.5v5" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);

/** Little "signal" arcs, e.g. above Buddy when he sends a reminder. */
export const SignalArcs: React.FC<{ progress: number; color: string; size: number }> = ({
  progress,
  color,
  size,
}) => {
  if (progress <= 0 || progress >= 1) return null;
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60" style={{ overflow: "visible", display: "block" }}>
      {[0, 1, 2].map((i) => {
        const t = interpolate(progress, [i * 0.15, i * 0.15 + 0.55], [0, 1], clamp);
        const r = 18 + i * 16;
        return (
          <path
            key={i}
            d={`M ${50 - r} ${58 - r * 0.25} A ${r} ${r} 0 0 1 ${50 + r} ${58 - r * 0.25}`}
            fill="none"
            stroke={color}
            strokeWidth={7}
            strokeLinecap="round"
            opacity={Math.sin(t * Math.PI)}
            transform={`translate(0 ${-t * 8})`}
          />
        );
      })}
    </svg>
  );
};

/** Round sender avatar with the first letter. */
export const Avatar: React.FC<{ letter: string; size: number }> = ({ letter, size }) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: p.grey,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.ui,
        fontSize: size * 0.46,
        fontWeight: 600,
        color: p.blueMid,
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
};

/** The incoming bill as a mail, with a "Doorsturen" action. */
export const MailCard: React.FC<{
  sender: string;
  subject: string;
  amount: string;
  dueLabel: string;
  forwardLabel: string;
  /** 0..1 press on the forward button. */
  press?: number;
  style?: React.CSSProperties;
}> = ({ sender, subject, amount, dueLabel, forwardLabel, press = 0, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: 820,
        height: 300,
        borderRadius: 46,
        background: p.white,
        boxShadow: "0 30px 80px rgba(1, 40, 160, 0.16)",
        padding: "34px 40px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        position: "relative",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <Avatar letter={sender[0] ?? "R"} size={80} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 34, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{sender}</div>
          <div style={{ fontSize: 28, color: p.greyText, marginTop: 2, whiteSpace: "nowrap" }}>{subject}</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          bottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 76,
              lineHeight: 1,
              letterSpacing: headlineTracking,
              color: p.ink,
            }}
          >
            {amount}
          </div>
          <div
            style={{
              height: 58,
              padding: "0 22px 0 16px",
              borderRadius: 29,
              background: p.grey,
              color: "#6b6b78",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 27,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            <ClockIcon size={28} color="#6b6b78" />
            {dueLabel}
          </div>
        </div>
        <div
          style={{
            height: 70,
            padding: "0 30px 0 22px",
            borderRadius: 35,
            background: p.blue,
            color: p.white,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 29,
            fontWeight: 600,
            whiteSpace: "nowrap",
            transform: `scale(${1 - press * 0.08})`,
            boxShadow: `0 10px 26px ${p.blue}55`,
          }}
        >
          <ForwardIcon size={30} color={p.white} />
          {forwardLabel}
        </div>
      </div>
    </div>
  );
};

/** A fingertip that taps: appears, presses, ripples. */
export const Tap: React.FC<{ frame: number; at: number; x: number; y: number; color?: string }> = ({
  frame,
  at,
  x,
  y,
  color = "rgba(17, 17, 20, 0.28)",
}) => {
  const appear = interpolate(frame, [at - 8, at - 2], [0, 1], clamp);
  const leave = interpolate(frame, [at + 8, at + 14], [1, 0], clamp);
  const press = interpolate(frame, [at - 2, at, at + 4], [1, 0.82, 1], clamp);
  const ripple = interpolate(frame, [at, at + 16], [0, 1], clamp);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 34,
          top: y - 34,
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: color,
          border: "4px solid rgba(255,255,255,0.85)",
          opacity: appear * leave,
          transform: `scale(${press})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 70,
          top: y - 70,
          width: 140,
          height: 140,
          borderRadius: "50%",
          border: "5px solid rgba(255,255,255,0.9)",
          opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.9 : 0,
          transform: `scale(${0.3 + ripple})`,
        }}
      />
    </>
  );
};

/** A rounded chip with an optional check, e.g. what Buddy picked out. */
export const Chip: React.FC<{
  text: string;
  check?: boolean;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({ text, check = false, dark = false, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        height: 76,
        padding: check ? "0 30px 0 14px" : "0 30px",
        borderRadius: 38,
        background: dark ? p.blue : p.white,
        color: dark ? p.white : p.blue,
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        fontFamily: fonts.ui,
        fontSize: 32,
        fontWeight: 600,
        whiteSpace: "nowrap",
        boxShadow: "0 16px 40px rgba(0, 20, 120, 0.22)",
        ...style,
      }}
    >
      {check ? (
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: dark ? p.white : p.blue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={28} height={28} viewBox="0 0 100 100">
            <path
              d="M18 54 L40 75 L84 26"
              fill="none"
              stroke={dark ? p.blue : p.white}
              strokeWidth={15}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : null}
      {text}
    </div>
  );
};

/** Step indicator for the detail scenes: 1 · 2 · 3, active one in white. */
export const StepRail: React.FC<{
  steps: string[];
  /** Fractional index of the active step, e.g. 1.4 during a transition. */
  active: number;
  /** Scale of the whole rail. */
  scale: number;
}> = ({ steps, active, scale }) => {
  const p = usePalette();
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        transform: `scale(${scale})`,
        transformOrigin: "50% 0%",
      }}
    >
      {steps.map((label, i) => {
        const on = Math.max(0, 1 - Math.abs(active - i));
        const done = active - i > 0.5;
        return (
          <div
            key={i}
            style={{
              height: 66,
              padding: "0 28px 0 9px",
              borderRadius: 33,
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: `rgba(255,255,255,${0.12 + on * 0.88})`,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 30,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              color: on > 0.5 ? p.blue : p.blueText,
              transform: `scale(${1 + on * 0.06})`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: on > 0.5 ? p.blue : "rgba(255,255,255,0.2)",
                color: p.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 27,
                fontWeight: 600,
              }}
            >
              {done ? (
                <svg width={24} height={24} viewBox="0 0 100 100">
                  <path
                    d="M16 54 L40 76 L86 24"
                    fill="none"
                    stroke={p.white}
                    strokeWidth={16}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {label}
          </div>
        );
      })}
    </div>
  );
};
