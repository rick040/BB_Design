import React from "react";
import { BEZEL, PHONE_H, PHONE_W, SCREEN_H, SCREEN_W, STATUS_H, useWalkLayout } from "../layout";
import { bb, wfonts } from "../tokens";

// A neutral phone: no brand, just a dark frame, status bar and home bar.

const StatusBar: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const c = dark ? "#fff" : bb.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: STATUS_H,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4px 26px 0 30px",
        boxSizing: "border-box",
        fontFamily: wfonts.body,
        fontWeight: 600,
        fontSize: 15,
        color: c,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <span>9:41</span>
      <svg width="62" height="12" viewBox="0 0 62 12" aria-hidden>
        {[3, 5.5, 8, 10.5].map((h, i) => (
          <rect key={i} x={i * 4.6} y={12 - h} width={3.2} height={h} rx={0.8} fill={c} />
        ))}
        <path
          d="M27 4.2a8.5 8.5 0 0 1 11 0M29.2 6.7a5.3 5.3 0 0 1 6.6 0M31.5 9.1a2 2 0 0 1 2 0"
          stroke={c}
          strokeWidth={1.7}
          fill="none"
          strokeLinecap="round"
        />
        <rect x={42} y={1} width={17} height={10} rx={3} fill="none" stroke={c} strokeWidth={1.2} opacity={0.5} />
        <rect x={43.8} y={2.8} width={12} height={6.4} rx={1.6} fill={c} />
        <rect x={60} y={4} width={1.6} height={4} rx={0.8} fill={c} opacity={0.5} />
      </svg>
    </div>
  );
};

export const Phone: React.FC<{
  children: React.ReactNode;
  /** Light status bar text (for dark screens). */
  darkStatus?: boolean;
  style?: React.CSSProperties;
}> = ({ children, darkStatus, style }) => {
  const L = useWalkLayout();

  return (
    <div
      style={{
        position: "absolute",
        width: PHONE_W,
        height: PHONE_H,
        left: L.phone.cx - PHONE_W / 2,
        top: L.phone.cy - PHONE_H / 2,
        transform: `scale(${L.phone.scale})`,
        transformOrigin: "50% 50%",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 58,
          background: "#14161B",
          boxShadow: "0 0 0 1.5px #2A2D34 inset, 0 40px 80px rgba(17,24,39,.22), 0 12px 24px rgba(17,24,39,.12)",
        }}
      />
      {/* data-screen: <Tap target="..."> looks up elements within this screen */}
      <div
        data-screen
        style={{
          position: "absolute",
          left: BEZEL,
          top: BEZEL,
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: 47,
          overflow: "hidden",
          background: "#fff",
          isolation: "isolate",
        }}
      >
        {children}
        <StatusBar dark={darkStatus} />
        {/* camera pill */}
        <div
          style={{
            position: "absolute",
            top: 11,
            left: SCREEN_W / 2 - 46,
            width: 92,
            height: 27,
            borderRadius: 14,
            background: "#0B0C0F",
            zIndex: 60,
          }}
        />
        {/* home bar */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: SCREEN_W / 2 - 62,
            width: 124,
            height: 5,
            borderRadius: 3,
            background: darkStatus ? "rgba(255,255,255,.7)" : "rgba(17,24,39,.85)",
            zIndex: 60,
          }}
        />
      </div>
    </div>
  );
};
