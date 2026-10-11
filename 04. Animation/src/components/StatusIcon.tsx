import React from "react";
import { usePalette } from "../lib/palette";

// Drawn as SVG instead of emoji so every machine renders the same icons.
export type StatusKind = "new" | "warning" | "alert";

export const StatusIcon: React.FC<{ kind: StatusKind; size: number }> = ({
  kind,
  size,
}) => {
  const p = usePalette();

  if (kind === "new") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
        <rect x="1" y="3" width="30" height="26" rx="5" fill={p.teal} />
        <text
          x="16"
          y="20"
          textAnchor="middle"
          fontFamily="Geist, sans-serif"
          fontWeight={800}
          fontSize="9"
          fill="#fff"
          letterSpacing="0.3"
        >
          NEW
        </text>
      </svg>
    );
  }

  if (kind === "warning") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
        <path
          d="M14.3 4.2a2 2 0 0 1 3.4 0l12.6 21.9a2 2 0 0 1-1.7 3H3.4a2 2 0 0 1-1.7-3Z"
          fill={p.yellow}
        />
        <rect x="14.6" y="11" width="2.8" height="10" rx="1.4" fill="#231f20" />
        <circle cx="16" cy="24.6" r="1.7" fill="#231f20" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
      <rect x="12.5" y="2" width="7" height="20" rx="3.5" fill={p.red} />
      <circle cx="16" cy="27" r="3.6" fill={p.red} />
    </svg>
  );
};
