import React from "react";
import { dec } from "../theme";

// Sjaal als accessory voor <Buddy>: getekend in Buddy's eigen viewBox (465 × 506)
// en door Buddy geknipt op zijn silhouet. Een band onder de ogen en een slip die naar voren valt.
const STRIPES = [30, 120, 210, 300, 390];

export const Scarf: React.FC<{ color?: string; stripe?: string }> = ({
  color = dec.deep,
  stripe = dec.softBlue,
}) => (
  <g>
    {/* de slip, onder de band getekend */}
    <rect x={292} y={300} width={92} height={196} rx={16} fill={color} />
    <rect x={292} y={396} width={92} height={16} fill={stripe} />
    <rect x={292} y={436} width={92} height={16} fill={stripe} />
    {/* de band */}
    <rect x={-20} y={244} width={510} height={80} fill={color} />
    {STRIPES.map((x) => (
      <rect key={x} x={x} y={244} width={26} height={80} fill={stripe} />
    ))}
  </g>
);
