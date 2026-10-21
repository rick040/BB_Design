import React from "react";
import { Buddy } from "../../components/Buddy";
import { PaletteProvider } from "../../lib/palette";
import { StaticPage } from "../StaticPage";
import { dec, decFonts, decTracking } from "../theme";
import { Chocolate } from "./components/AdventCalendar";
import type { StoryProps } from "./schema";

const FRAME_W = 640;
const FRAME_H = 780;
const PAD = 26;
const FRAME_X = 270;
const FRAME_Y = 430;

// Story-deurtje van de dag (1080 × 1920): deurtje open, rekening of tip erin, één zin eronder.
export const StoryDoor: React.FC<StoryProps> = (props) => {
  const door = props.doors[props.day - 1];
  const tag = props.tags[door.kind];
  const isBill = door.kind === "rekening";

  return (
    <PaletteProvider colors={props.colors}>
      <StaticPage tone="blue" chip={props.footerChip}>
        {/* Kaartje boven het deurtje */}
        <div
          style={{
            position: "absolute",
            top: 290,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: dec.white,
              color: dec.blue,
              borderRadius: 999,
              padding: "16px 34px",
              fontFamily: decFonts.ui,
              fontWeight: 600,
              fontSize: 32,
              lineHeight: 1,
            }}
          >
            {tag}
          </div>
        </div>

        {/* Het geopende blad, links van het kozijn */}
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
          <path
            d={`M${FRAME_X + PAD} ${FRAME_Y + PAD + 40} L${FRAME_X - 120} ${FRAME_Y + 90} L${FRAME_X - 120} ${FRAME_Y + FRAME_H - 70} L${FRAME_X + PAD} ${FRAME_Y + FRAME_H - 4}Z`}
            fill={dec.white}
          />
          <circle cx={FRAME_X - 80} cy={FRAME_Y + FRAME_H / 2} r="10" fill={dec.blue} opacity="0.6" />
        </svg>

        <div
          style={{
            position: "absolute",
            left: FRAME_X,
            top: FRAME_Y,
            width: FRAME_W,
            height: FRAME_H,
            borderRadius: "70px 70px 24px 24px",
            background: dec.deep,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: PAD,
              right: PAD,
              bottom: 0,
              borderRadius: "52px 52px 8px 8px",
              background: dec.ice,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {door.kind === "chocola" ? <Chocolate size={360} /> : null}
            {isBill ? (
              <div
                style={{
                  width: 470,
                  background: dec.white,
                  borderRadius: 40,
                  padding: "40px 40px 44px",
                  boxShadow: "0 24px 60px rgba(1, 40, 160, 0.16)",
                  boxSizing: "border-box",
                  fontFamily: decFonts.ui,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 40, color: dec.ink, lineHeight: 1.1 }}>{door.title}</div>
                <div
                  style={{
                    fontFamily: decFonts.display,
                    fontWeight: 500,
                    fontSize: door.amount.length > 6 ? 96 : 116,
                    letterSpacing: decTracking,
                    color: dec.blue,
                    lineHeight: 1.15,
                    margin: "14px 0 20px",
                  }}
                >
                  {door.amount}
                </div>
                <div
                  style={{
                    display: "inline-block",
                    background: dec.ice,
                    color: dec.blue,
                    fontWeight: 600,
                    fontSize: 30,
                    borderRadius: 999,
                    padding: "12px 26px",
                  }}
                >
                  {door.due}
                </div>
              </div>
            ) : null}
            {door.kind === "tip" || door.kind === "wens" ? (
              <Buddy
                size={330}
                body={dec.blue}
                eye={dec.white}
                look={{ x: 0, y: 0.2 }}
                style={{ position: "absolute", left: (FRAME_W - PAD * 2 - 330) / 2, bottom: 0 }}
              />
            ) : null}
          </div>
          {/* Nummer op het kozijn */}
          <div
            style={{
              position: "absolute",
              left: -50,
              top: -50,
              width: 170,
              height: 170,
              borderRadius: "50%",
              background: dec.white,
              color: dec.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: decFonts.display,
              fontWeight: 500,
              fontSize: 96,
              letterSpacing: decTracking,
              boxShadow: "0 16px 40px rgba(0, 20, 120, 0.3)",
            }}
          >
            {props.day}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: FRAME_Y + FRAME_H + 60,
            textAlign: "center",
            color: dec.white,
          }}
        >
          <div style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 92, lineHeight: 1.0, letterSpacing: decTracking, textWrap: "balance" }}>
            {door.kind === "rekening" ? props.doorLabel + " " + props.day : door.title}
          </div>
          <div
            style={{
              fontFamily: decFonts.text,
              fontWeight: 400,
              fontSize: 38,
              lineHeight: 1.3,
              color: dec.softBlue,
              marginTop: 18,
              textWrap: "balance",
            }}
          >
            {door.line}
          </div>
        </div>
      </StaticPage>
    </PaletteProvider>
  );
};

