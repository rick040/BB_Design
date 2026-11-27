import React from "react";

// A plain shipping box, front view, no logos. `open` 0..1 swings the two
// top flaps open (used when Buddy pops out of a box).
export const PARCEL_RATIO = 0.78; // height / width of the body

export const Parcel: React.FC<{
  width: number;
  body: string;
  tape: string;
  edge?: string;
  open?: number;
  style?: React.CSSProperties;
}> = ({ width, body, tape, edge = "rgba(1,30,140,0.18)", open = 0, style }) => {
  const h = width * PARCEL_RATIO;
  const flapT = width * 0.09;
  return (
    <div style={{ position: "relative", width, height: h, ...style }}>
      {open > 0 ? (
        <>
          {/* Flaps: hinged at the top corners, they swing up and outwards */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: -flapT / 2,
              width: width / 2,
              height: flapT,
              background: body,
              border: `${width * 0.02}px solid ${edge}`,
              boxSizing: "border-box",
              borderRadius: width * 0.02,
              transformOrigin: "0% 50%",
              transform: `rotate(${-125 * open}deg)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: -flapT / 2,
              width: width / 2,
              height: flapT,
              background: body,
              border: `${width * 0.02}px solid ${edge}`,
              boxSizing: "border-box",
              borderRadius: width * 0.02,
              transformOrigin: "100% 50%",
              transform: `rotate(${125 * open}deg)`,
            }}
          />
        </>
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: body,
          borderRadius: width * 0.06,
          border: `${width * 0.02}px solid ${edge}`,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {open < 0.05 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: width * 0.16,
              marginLeft: -width * 0.08,
              background: tape,
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            right: width * 0.1,
            bottom: width * 0.1,
            width: width * 0.26,
            height: width * 0.16,
            borderRadius: width * 0.02,
            background: tape,
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
};
