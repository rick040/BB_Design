import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

export const PLATE_W = 820;
export const PLATE_H = 300;
// Where the name sits on the plate (the housemate's sticker covers this).
export const NAME_BOX = { x: 70, y: 92, w: 470, h: 116 };

const Screw: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div
    style={{
      position: "absolute",
      left: x - 11,
      top: y - 11,
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #d5dbe6 55%, #aeb6c6 100%)",
      boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.18)",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 4,
        right: 4,
        top: 10,
        height: 2.5,
        borderRadius: 2,
        background: "rgba(80, 90, 120, 0.45)",
        transform: "rotate(-35deg)",
      }}
    />
  </div>
);

/**
 * A name plate next to the front door: light plate with screws, the name
 * engraved on the left, a round bell button on the right. `cover` is drawn
 * over the name (the housemate's sticker).
 */
export const NamePlate: React.FC<{
  name: string;
  cover?: React.ReactNode;
  /** Press on the bell button, 0..1. */
  bell?: number;
  style?: React.CSSProperties;
}> = ({ name, cover, bell = 0, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: PLATE_W,
        height: PLATE_H,
        borderRadius: 40,
        background: "linear-gradient(160deg, #ffffff 0%, #f1f4fa 45%, #e3e8f2 100%)",
        boxShadow: "0 34px 70px rgba(1, 40, 160, 0.16), inset 0 2px 0 #ffffff, inset 0 -3px 0 rgba(0, 20, 90, 0.07)",
        ...style,
      }}
    >
      <Screw x={34} y={34} />
      <Screw x={PLATE_W - 34} y={34} />
      <Screw x={34} y={PLATE_H - 34} />
      <Screw x={PLATE_W - 34} y={PLATE_H - 34} />

      {/* engraved name */}
      <div
        style={{
          position: "absolute",
          left: NAME_BOX.x,
          top: NAME_BOX.y,
          width: NAME_BOX.w,
          height: NAME_BOX.h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 92,
          letterSpacing: headlineTracking,
          color: p.blue,
          textShadow: "0 2px 0 rgba(255,255,255,0.9), 0 -1px 0 rgba(0, 20, 90, 0.18)",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>

      {/* bell button */}
      <div
        style={{
          position: "absolute",
          right: 70,
          top: PLATE_H / 2 - 78,
          width: 156,
          height: 156,
          borderRadius: "50%",
          background: "linear-gradient(160deg, #e7ebf3 0%, #cdd4e2 100%)",
          boxShadow: "inset 0 3px 6px rgba(0, 20, 90, 0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: "50%",
            background: `radial-gradient(circle at 40% 35%, #ffffff 0%, ${p.light} 60%, #dfe5f0 100%)`,
            boxShadow: `0 ${8 - bell * 6}px ${14 - bell * 8}px rgba(0, 20, 90, 0.22)`,
            transform: `scale(${1 - bell * 0.06})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 30, height: 30, borderRadius: "50%", border: `5px solid ${p.blueSoft}` }} />
        </div>
      </div>

      {cover ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: PLATE_W, height: PLATE_H }}>{cover}</div>
      ) : null}
    </div>
  );
};
