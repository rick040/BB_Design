import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { DIALOG_H, DIALOG_W, PermissionDialog } from "../components/PermissionDialog";
import { MAIL_H, MAIL_W, PrivateMailCard } from "../components/PrivateMailCard";
import type { PrivacyProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  fan: 6, // private mails fan out from behind the dialog
  fanStagger: 5,
  flag: 44, // "Al je e-mails lezen" turns red, dialog shakes
  seen: 52, // red eye badges pop on the private mails
  seenStagger: 4,
  pulse: 66, // "Toestaan" starts to breathe
};

const DIALOG = { x: (1080 - DIALOG_W) / 2, y: 190 };
// Where each private mail ends up (stage coordinates, top-left + rotation).
const SLOTS = [
  { x: 40, y: 30, r: -5 },
  { x: 570, y: 66, r: 4 },
  { x: 50, y: 716, r: 4 },
  { x: 560, y: 704, r: -5 },
];
const START = { x: 540 - MAIL_W / 2, y: DIALOG.y + DIALOG_H / 2 - MAIL_H / 2 };

export const HookScene: React.FC<{
  props: PrivacyProps["hook"];
  mails: PrivacyProps["privateMails"];
}> = ({ props, mails }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const settle = pop(frame, fps, -8, springs.pop);
  const s = shake(frame, HOOK_T.flag, 16, 12);
  const flag = pop(frame, fps, HOOK_T.flag, { damping: 12, stiffness: 200 });
  const pulse = frame > HOOK_T.pulse ? 1 + Math.max(0, Math.sin((frame - HOOK_T.pulse) / 5)) * 0.05 : 1;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-12} stagger={3} />

      <Stage offsetY={50}>
        {/* Private mails fan out from behind the dialog */}
        {mails.map((m, i) => {
          const t = pop(frame, fps, HOOK_T.fan + i * HOOK_T.fanStagger, { damping: 14, stiffness: 120 });
          const slot = SLOTS[i];
          const x = interpolate(t, [0, 1], [START.x, slot.x]);
          const y = interpolate(t, [0, 1], [START.y, slot.y]);
          const seen = pop(frame, fps, HOOK_T.seen + i * HOOK_T.seenStagger, springs.bouncy);
          return (
            <PrivateMailCard
              key={i}
              from={m.from}
              subject={m.subject}
              seen={frame >= HOOK_T.seen + i * HOOK_T.seenStagger ? seen : 0}
              style={{
                left: x,
                top: y,
                transform: `rotate(${slot.r * t}deg) scale(${0.8 + 0.2 * t})`,
                opacity: interpolate(t, [0, 0.25], [0, 1], clamp),
              }}
            />
          );
        })}

        <PermissionDialog
          title={props.dialogTitle}
          permissions={props.permissions}
          deny={props.deny}
          allow={props.allow}
          flag={frame >= HOOK_T.flag ? flag : 0}
          allowPulse={pulse}
          style={{
            left: DIALOG.x,
            top: DIALOG.y,
            transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg) scale(${0.94 + 0.06 * settle})`,
          }}
        />
      </Stage>
    </SceneBg>
  );
};
