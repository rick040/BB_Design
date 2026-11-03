import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// Instant photo: white frame with a wide bottom strip for a caption.
// `develop` 0 = still dark (freshly ejected), 1 = fully developed.
// `fade` 0 = sharp, 1 = washed out like an overexposed, forgotten photo.
export const polaroidSize = (width: number) => {
  const border = width * 0.06;
  const photo = width - border * 2;
  const strip = width * 0.24;
  return { border, photo, strip, height: border + photo + strip };
};

export const Polaroid: React.FC<{
  width: number;
  children: React.ReactNode;
  caption?: string;
  develop?: number;
  fade?: number;
  style?: React.CSSProperties;
}> = ({ width, children, caption, develop = 1, fade = 0, style }) => {
  const p = usePalette();
  const { border, photo, strip, height } = polaroidSize(width);
  const dark = 1 - develop;

  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        background: "#fdfdfb",
        borderRadius: width * 0.012,
        boxShadow: "0 24px 60px rgba(10, 20, 80, 0.28), 0 2px 6px rgba(10, 20, 80, 0.18)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: border,
          top: border,
          width: photo,
          height: photo,
          overflow: "hidden",
          background: "#dfe5f7",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            // Washed out: lower contrast, brighter, less colour.
            filter:
              fade > 0.01
                ? `contrast(${1 - 0.7 * fade}) brightness(${1 + 0.35 * fade}) saturate(${1 - fade})`
                : undefined,
          }}
        >
          {children}
        </div>
        {/* Overexposure haze */}
        <div style={{ position: "absolute", inset: 0, background: "#fbfaf5", opacity: fade * 0.9 }} />
        {/* Undeveloped: dark blue-grey that clears from the edges inward */}
        {dark > 0.005 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, #26304d ${Math.max(0, 70 - develop * 80)}%, #3a4568 100%)`,
              opacity: Math.min(1, dark * 1.15),
            }}
          />
        ) : null}
      </div>
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: border,
            right: border,
            top: border + photo,
            height: strip,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontWeight: 500,
            fontStyle: "italic",
            fontSize: strip * 0.36,
            letterSpacing: "-0.02em",
            color: p.blue,
            opacity: 1 - fade * 0.85,
            transform: "rotate(-2deg)",
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};
