import React from "react";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Notification } from "../../components/Notification";
import { PaletteProvider } from "../../lib/palette";
import { StaticPage } from "../StaticPage";
import { dec, decFonts, decTracking } from "../theme";
import { MailRow, Rich, SlideTop, SwipeHint } from "./parts";
import type { RijmProps } from "./schema";

const TEXT_TOP = 214;
const LINE_H = 84;

const buddyAt = (size: number, left: number, feet: number): React.CSSProperties => ({
  position: "absolute",
  left,
  top: feet - size * BUDDY_RATIO,
});

/** Gedichtenpapier: liniaal, kantlijn en drie gaatjes. */
const Paper: React.FC = () => (
  <>
    {Array.from({ length: 13 }, (_, i) => (
      <div
        key={i}
        style={{ position: "absolute", left: 0, right: 0, top: TEXT_TOP + LINE_H * (i + 1) - 14, height: 3, background: "#cdd8ff" }}
      />
    ))}
    <div style={{ position: "absolute", left: 66, top: 0, bottom: 0, width: 3, background: dec.softBlue }} />
    {[250, 640, 1030].map((y) => (
      <div key={y} style={{ position: "absolute", left: 18, top: y, width: 26, height: 26, borderRadius: "50%", background: "#c3d0ff" }} />
    ))}
  </>
);

const Pencil: React.FC = () => (
  <svg width={380} height={90} viewBox="0 0 380 90" style={{ overflow: "visible" }}>
    <rect x={0} y={20} width={56} height={50} rx={12} fill={dec.deep} />
    <rect x={56} y={20} width={20} height={50} fill={dec.softBlue} />
    <rect x={76} y={20} width={210} height={50} fill={dec.yellow} />
    <polygon points="286,20 366,45 286,70" fill={dec.ice} stroke={dec.ink} strokeWidth={0} />
    <polygon points="338,36 380,45 338,54" fill={dec.ink} />
    <rect x={76} y={34} width={210} height={6} fill="#e6b400" />
  </svg>
);

const Gift: React.FC = () => (
  <svg width={230} height={210} viewBox="0 0 230 210">
    <rect x={10} y={70} width={210} height={130} rx={14} fill={dec.deep} />
    <rect x={0} y={44} width={230} height={50} rx={12} fill={dec.blue} />
    <rect x={92} y={44} width={46} height={156} fill={dec.softBlue} />
    <path d="M115 44 C70 -4 40 18 66 42 C80 52 105 48 115 44Z" fill={dec.softBlue} />
    <path d="M115 44 C160 -4 190 18 164 42 C150 52 125 48 115 44Z" fill={dec.softBlue} />
  </svg>
);

const Slide1: React.FC<{ p: RijmProps }> = ({ p }) => (
  <>
    <div style={{ position: "absolute", left: 560, top: 660, transform: "rotate(-4deg)" }}>
      <div
        style={{
          background: dec.white,
          borderRadius: 60,
          padding: "26px 40px",
          fontFamily: decFonts.text,
          fontWeight: 500,
          fontSize: 34,
          color: dec.ink,
          boxShadow: "0 10px 30px rgba(1, 40, 160, 0.12)",
          whiteSpace: "nowrap",
        }}
      >
        {p.thought}
      </div>
    </div>
    <div style={{ position: "absolute", left: 500, top: 770, width: 26, height: 26, borderRadius: "50%", background: dec.white }} />
    <div style={{ position: "absolute", left: 460, top: 812, width: 16, height: 16, borderRadius: "50%", background: dec.white }} />
    <Buddy size={320} body={dec.blue} eye={dec.white} look={{ x: 0.6, y: -0.5 }} style={buddyAt(320, 150, 1150)} />
    <div style={{ position: "absolute", left: 460, top: 900, transform: "rotate(-24deg)", transformOrigin: "0 50%" }}>
      <Pencil />
    </div>
    <div style={{ position: "absolute", left: 770, top: 960 }}>
      <Gift />
    </div>
  </>
);

const Slide2: React.FC<{ p: RijmProps }> = ({ p }) => (
  <>
    <MailRow sender={p.mail.senders[0]} width={820} style={{ position: "absolute", left: 130, top: 624 }} />
    <MailRow sender={p.mail.senders[1]} width={820} style={{ position: "absolute", left: 130, top: 740 }} />
    <MailRow sender={p.mail.senders[2]} width={820} style={{ position: "absolute", left: 130, top: 856 }} />
    <MailRow
      sender={p.mail.webshopSender}
      subject={p.mail.webshopSubject}
      tag={p.mail.dayTag}
      highlight
      width={820}
      opacity={0.62}
      style={{ position: "absolute", left: 130, top: 972, transform: "rotate(-1.5deg)" }}
    />
    <MailRow sender="" width={820} opacity={0.28} style={{ position: "absolute", left: 130, top: 1088 }} />
    <svg width={90} height={110} viewBox="0 0 90 110" style={{ position: "absolute", left: 30, top: 990 }}>
      <path d="M45 8v76M18 58l27 28 27-28" fill="none" stroke={dec.blue} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </>
);

const Slide3: React.FC<{ p: RijmProps }> = ({ p }) => (
  <>
    <MailRow
      sender={p.mail.webshopSender}
      subject={p.mail.webshopSubject}
      tag={p.mail.dayTag}
      highlight
      width={590}
      style={{ position: "absolute", left: 110, top: 640 }}
    />
    <svg width={160} height={150} viewBox="0 0 160 150" style={{ position: "absolute", left: 340, top: 760 }}>
      <path d="M80 8v108M42 82l38 38 38-38" fill="none" stroke={dec.blue} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 920,
        width: 590,
        height: 104,
        borderRadius: 52,
        background: dec.white,
        border: `4px solid ${dec.blue}`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: decFonts.ui,
        fontWeight: 600,
        fontSize: 30,
        color: dec.blue,
      }}
    >
      {p.forward.address}
    </div>
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 1046,
        fontFamily: decFonts.text,
        fontWeight: 500,
        fontSize: 30,
        color: dec.deep,
      }}
    >
      {p.forward.action}
    </div>
    <Buddy size={280} body={dec.blue} eye={dec.white} blink={0.2} look={{ x: -0.6, y: 0.3 }} style={buddyAt(280, 750, 1150)} />
  </>
);

const Slide4: React.FC<{ p: RijmProps }> = ({ p }) => (
  <>
    <Buddy size={220} body={dec.blue} eye={dec.white} blink={0.18} look={{ x: 0.5, y: 0 }} style={buddyAt(220, 50, 1150)} />
    <div style={{ position: "absolute", left: 296, top: 640, width: 3, height: 440, background: dec.softBlue }} />
    <Notification
      text={p.agenda.first.text}
      time={p.agenda.first.time}
      icon="new"
      width={690}
      style={{ position: "absolute", left: 300, top: 650 }}
    />
    <Notification
      text={p.agenda.second.text}
      time={p.agenda.second.time}
      icon="warning"
      width={690}
      style={{ position: "absolute", left: 300, top: 806 }}
    />
    <div
      style={{
        position: "absolute",
        left: 300,
        top: 974,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: dec.blue,
        color: dec.white,
        borderRadius: 999,
        padding: "20px 36px",
        fontFamily: decFonts.display,
        fontWeight: 500,
        letterSpacing: decTracking,
        fontSize: 38,
      }}
    >
      <svg width={40} height={40} viewBox="0 0 40 40">
        <rect x={4} y={7} width={32} height={29} rx={7} fill="none" stroke={dec.white} strokeWidth={3.4} />
        <path d="M4 17h32M12 3v8M28 3v8" stroke={dec.white} strokeWidth={3.4} strokeLinecap="round" />
      </svg>
      {p.agenda.chip}
    </div>
  </>
);

export const RijmSlide: React.FC<RijmProps> = (props) => {
  const i = props.slide - 1;
  const c = props.couplets[i];
  return (
    <PaletteProvider colors={props.colors}>
      <StaticPage tone="ice" chip={props.slide === 4 ? props.chip : undefined}>
        <Paper />
        <SlideTop label={props.label} index={props.slide} total={4} color={dec.blue} dim={dec.softBlue} />
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: TEXT_TOP,
            fontFamily: decFonts.text,
            fontWeight: 400,
            fontSize: 56,
            lineHeight: `${LINE_H}px`,
            color: dec.ink,
            whiteSpace: "pre-line",
          }}
        >
          <div>
            <Rich text={c.a} mark={dec.softBlue} />
          </div>
          <div>
            <Rich text={c.b} mark={dec.softBlue} />
          </div>
        </div>
        {props.slide === 1 ? <Slide1 p={props} /> : null}
        {props.slide === 2 ? <Slide2 p={props} /> : null}
        {props.slide === 3 ? <Slide3 p={props} /> : null}
        {props.slide === 4 ? <Slide4 p={props} /> : null}
        {props.slide === 1 ? (
          <div style={{ position: "absolute", right: 90, bottom: 74 }}>
            <SwipeHint text={props.swipe} color={dec.blue} />
          </div>
        ) : null}
      </StaticPage>
    </PaletteProvider>
  );
};
