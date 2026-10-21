import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../../components/Stage";
import { clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { fonts } from "../../../theme";
import { DHeadline, DSubline } from "../../text";
import { Phone, PHONE_W } from "../Phone";
import type { SintProps } from "../schema";

// Beats (frames, scene-lokaal).
export const INBOX_T = {
  phone: 2, // telefoon ploft in beeld
  type: 12, // zoekterm wordt getypt
  typeStagger: 3, // per letter
  results: 38, // zoekresultaten verschijnen
  resultStagger: 2,
  scroll: 52, // de lijst scrolt door: de inbox is vol
  scrollLen: 46,
  subline: 74,
};
const ROW_H = 128;

const Highlight: React.FC<{ text: string; term: string; bg: string }> = ({ text, term, bg }) => {
  const i = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ background: bg, borderRadius: 6, padding: "0 4px", color: "#111827" }}>{text.slice(i, i + term.length)}</span>
      {text.slice(i + term.length)}
    </>
  );
};

export const InboxScene: React.FC<{ props: SintProps["inbox"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const phone = pop(frame, fps, INBOX_T.phone, springs.smooth);
  const chars = Math.max(0, Math.min(props.search.length, Math.floor((frame - INBOX_T.type) / INBOX_T.typeStagger) + 1));
  const typed = frame < INBOX_T.type ? "" : props.search.slice(0, chars);
  const cursor = Math.floor(frame / 8) % 2 === 0;
  const scroll =
    interpolate(frame, [INBOX_T.scroll, INBOX_T.scroll + INBOX_T.scrollLen], [0, ROW_H * 3.4], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }) || 0;

  return (
    <SceneBg color={p.blue}>
      <DHeadline text={props.headline} color={p.white} delay={2} stagger={3} />

      <Stage offsetY={40}>
        <Phone
          bezel={p.ink}
          screen={p.white}
          style={{
            left: (1080 - PHONE_W) / 2,
            top: 40,
            opacity: phone,
            transform: `translateY(${(1 - phone) * 70}px)`,
          }}
        >
          {/* zoekbalk */}
          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              top: 70,
              height: 76,
              borderRadius: 38,
              background: "#eef1f8",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 24px",
              fontFamily: fonts.ui,
              fontSize: 32,
              color: p.ink,
              zIndex: 3,
            }}
          >
            <svg width={32} height={32} viewBox="0 0 32 32">
              <circle cx={14} cy={14} r={9} fill="none" stroke="#6b7280" strokeWidth={3.2} />
              <path d="M21 21l8 8" stroke="#6b7280" strokeWidth={3.2} strokeLinecap="round" />
            </svg>
            <span>
              {typed}
              <span style={{ display: "inline-block", width: 3, height: 34, marginLeft: 2, verticalAlign: "-6px", background: p.blue, opacity: cursor ? 1 : 0 }} />
            </span>
          </div>

          {/* resultaten */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 168, bottom: 0, overflow: "hidden" }}>
            <div style={{ transform: `translateY(${-scroll}px)` }}>
              {props.mails.map((m, i) => {
                const s = pop(frame, fps, INBOX_T.results + i * INBOX_T.resultStagger, springs.pop);
                return (
                  <div
                    key={i}
                    style={{
                      height: ROW_H,
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      padding: "0 24px",
                      fontFamily: fonts.ui,
                      opacity: Math.min(1, s * 1.6),
                      transform: `translateX(${(1 - s) * 40}px)`,
                      borderBottom: "2px solid #f0f2f8",
                    }}
                  >
                    <div
                      style={{
                        width: 68,
                        height: 68,
                        borderRadius: "50%",
                        background: p.grey,
                        color: p.blueMid,
                        fontWeight: 600,
                        fontSize: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {m.from[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 30, fontWeight: 600, color: p.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {m.from}
                        </span>
                        <span style={{ fontSize: 22, color: p.greyText, flexShrink: 0 }}>{m.time}</span>
                      </div>
                      <div style={{ fontSize: 26, color: "#4a4a55", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Highlight text={m.subject} term={props.search} bg={p.blueSoft} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Phone>
      </Stage>

      <DSubline text={props.subline} color={p.blueSoft} delay={INBOX_T.subline} />
    </SceneBg>
  );
};
