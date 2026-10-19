import React from "react";

/** Plain text where **this** is bold and "\n" breaks the line. */
export const Rich: React.FC<{ text: string; boldColor?: string }> = ({ text, boldColor }) => (
  <>
    {text.split("**").map((part, i) =>
      i % 2 === 1 ? (
        <b key={i} style={{ fontWeight: 650, color: boldColor }}>
          {part}
        </b>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);
