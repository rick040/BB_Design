import React from "react";
import { Checkmark } from "../../components/Checkmark";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

// The few UI pieces of the hero VSL, rebuilt as vectors so the text stays
// editable. Kept deliberately sparse: one card on screen at a time.

export const CARD_W = 780;

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

const cardStyle = (white: string): React.CSSProperties => ({
  width: CARD_W,
  borderRadius: 48,
  background: white,
  boxShadow: "0 30px 80px rgba(1, 40, 160, 0.16)",
  boxSizing: "border-box",
  fontFamily: fonts.ui,
});

/** The bill: sender, due date, amount and one big "Doorsturen" button. */
export const BillCard: React.FC<{
  sender: string;
  dueLabel: string;
  amount: string;
  button: string;
  /** 0..1 press on the button. */
  press?: number;
  /** 0..1 ring around the button after the press. */
  ripple?: number;
}> = ({ sender, dueLabel, amount, button, press = 0, ripple = 0 }) => {
  const p = usePalette();
  return (
    <div style={{ ...cardStyle(p.white), padding: "34px 40px 36px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div
          style={{
            width: 82,
            height: 82,
            borderRadius: "50%",
            background: p.grey,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 600,
            color: p.blueMid,
            flexShrink: 0,
          }}
        >
          {sender[0] ?? "R"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 36, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{sender}</div>
          <div style={{ fontSize: 29, color: p.greyText, marginTop: 4, whiteSpace: "nowrap" }}>{dueLabel}</div>
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 72,
            lineHeight: 1,
            letterSpacing: headlineTracking,
            color: p.ink,
          }}
        >
          {amount}
        </div>
      </div>

      <div style={{ position: "relative", marginTop: 30 }}>
        <div
          style={{
            height: 86,
            borderRadius: 43,
            background: p.blue,
            color: p.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            fontSize: 34,
            fontWeight: 600,
            transform: `scale(${1 - press * 0.05})`,
          }}
        >
          <ForwardIcon size={36} color={p.white} />
          {button}
        </div>
        {ripple > 0 && ripple < 1 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 43,
              border: `5px solid ${p.blue}`,
              opacity: (1 - ripple) * 0.6,
              transform: `scale(${1 + ripple * 0.12}, ${1 + ripple * 0.5})`,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

/** The outcome: a big checkmark and "Betaald". */
export const PaidCard: React.FC<{ title: string; text: string; check: number }> = ({ title, text, check }) => {
  const p = usePalette();
  return (
    <div
      style={{
        ...cardStyle(p.white),
        height: 200,
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "0 44px",
      }}
    >
      <div
        style={{
          width: 124,
          height: 124,
          borderRadius: "50%",
          background: p.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Checkmark size={70} color={p.white} progress={check} strokeWidth={14} />
      </div>
      <div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 72,
            letterSpacing: headlineTracking,
            lineHeight: 1,
            color: p.ink,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 32, color: "#7d7d89", marginTop: 12, whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </div>
  );
};
