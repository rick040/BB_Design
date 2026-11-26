import React from "react";
import { fonts } from "../../theme";

/**
 * Jack-in-the-box drawn in plain divs/SVG, positioned by its bottom centre.
 * `lid` 0..1 opens the lid (hinged at the back left), `spring` is how far the
 * spring has shot out (px), `children` ride on top of the spring.
 */
export const JackBox: React.FC<{
  cx: number;
  bottom: number;
  w: number;
  body: string;
  trim: string;
  label?: string;
  crank: number; // degrees
  lid: number;
  spring: number;
  springColor: string;
  crankColor?: string;
  dx?: number;
  rot?: number;
  children?: React.ReactNode;
}> = ({ cx, bottom, w, body, trim, label, crank, lid, spring, springColor, crankColor, dx = 0, rot = 0, children }) => {
  const h = w * 0.78;
  const top = bottom - h;
  const coils = 7;
  const sw = w * 0.32;
  const pts: string[] = [];
  for (let i = 0; i <= coils * 2; i++) {
    const y = -(spring * i) / (coils * 2);
    const x = i === 0 || i === coils * 2 ? 0 : i % 2 ? -sw / 2 : sw / 2;
    pts.push(`${x},${y}`);
  }
  const crankR = w * 0.2;
  const ax = w + 8;
  const ay = h * 0.42;
  const rad = (crank * Math.PI) / 180;
  const cc = crankColor ?? trim;

  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2 + dx,
        top,
        width: w,
        height: h,
        transform: `rotate(${rot}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      {/* spring + payload sit behind the lid, above the box */}
      {spring > 2 ? (
        <>
          <svg
            width={sw + 20}
            height={spring + 10}
            style={{ position: "absolute", left: w / 2 - sw / 2 - 10, top: -spring - 5, overflow: "visible" }}
          >
            <polyline
              points={pts.join(" ")}
              transform={`translate(${sw / 2 + 10}, ${spring + 5})`}
              fill="none"
              stroke={springColor}
              strokeWidth={9}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: w / 2,
              top: -spring + 6,
              transform: "translate(-50%, -100%)",
            }}
          >
            {children}
          </div>
        </>
      ) : null}

      {/* crank on the right side */}
      <svg
        width={crankR * 2 + 60}
        height={crankR * 2 + 60}
        style={{ position: "absolute", left: ax - crankR - 30, top: ay - crankR - 30, overflow: "visible" }}
      >
        <g transform={`translate(${crankR + 30}, ${crankR + 30})`}>
          <line x1={0} y1={0} x2={Math.cos(rad) * crankR} y2={Math.sin(rad) * crankR} stroke={cc} strokeWidth={14} strokeLinecap="round" />
          <circle cx={Math.cos(rad) * crankR} cy={Math.sin(rad) * crankR} r={15} fill={cc} />
          <circle cx={0} cy={0} r={11} fill={cc} />
        </g>
      </svg>

      {/* body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: body,
          borderRadius: w * 0.06,
          boxShadow: "0 30px 60px rgba(1, 20, 90, 0.18)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: w * 0.07,
            border: `${Math.max(4, w * 0.018)}px solid ${trim}`,
            borderRadius: w * 0.04,
            opacity: 0.55,
          }}
        />
        {label ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              textAlign: "center",
              color: trim,
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: w * (label.length > 10 ? 0.1 : 0.13),
              letterSpacing: "-0.02em",
            }}
          >
            {label}
          </div>
        ) : null}
      </div>

      {/* lid, hinged at the back left */}
      <div
        style={{
          position: "absolute",
          left: -w * 0.04,
          top: -w * 0.07,
          width: w * 1.08,
          height: w * 0.09,
          background: body,
          border: `4px solid ${trim}`,
          borderRadius: w * 0.03,
          transformOrigin: "0% 100%",
          transform: `rotate(${-lid * 115}deg)`,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};
