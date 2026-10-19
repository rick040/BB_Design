import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../../lib/anim";
import { Phone } from "../components/Phone";
import { StepPanel } from "../components/StepPanel";
import { pressed, Tap } from "../components/Tap";
import type { WalkthroughProps } from "../schema";
import { appIn, appOut, EditMenu, MailInbox, MailView, pushStyle, Sel, underStyle } from "../screens/mail";
import { Addr, Eyebrow, H2, InputField, Lead, Note, PageScreen, PageToast } from "../screens/page";
import { bb, wfonts } from "../tokens";

// Timeline (frames, scene-local).
export const STEP2_T = {
  item1: 14, // "Je krijgt een mail terug" lights up
  arrive: 30, // our reply lands on top of the inbox
  arriveLen: 14,
  item1Done: 52,
  tapMail: 62, // open it
  push: 66,
  pushLen: 14,
  item2: 82, // "Kopieer de hele mail"
  select: 96, // long press, the selection sweeps over the mail
  selectLen: 22,
  menu: 120, // edit menu "Kopieer"
  tapCopy: 134,
  item2Done: 140,
  item3: 152, // "Plak hem op de pagina"
  switchApp: 158, // back to the page, step 2
  switchLen: 16,
  scroll: 172,
  scrollLen: 16,
  tapField: 192, // tap the first box
  pasteMenu: 202,
  tapPaste: 216,
  fill: 220, // both boxes fill in at once
  item3Done: 230,
  note: 246,
};

export const Step2Scene: React.FC<{ props: WalkthroughProps["step2"]; example: WalkthroughProps["example"] }> = ({
  props,
  example,
}) => {
  const frame = useCurrentFrame();
  const T = STEP2_T;
  const ease = { ...clamp, easing: (x: number) => 1 - Math.pow(1 - x, 3) };

  const arrive = interpolate(frame, [T.arrive, T.arrive + T.arriveLen], [0, 1], ease);
  const push = interpolate(frame, [T.push, T.push + T.pushLen], [0, 1], ease);
  const sw = interpolate(frame, [T.switchApp, T.switchApp + T.switchLen], [0, 1], ease);
  const scroll = interpolate(frame, [T.scroll, T.scroll + T.scrollLen], [0, 128], ease);
  const sel = (i: number) => interpolate(frame, [T.select + i * 5, T.select + i * 5 + 8], [0, 1], clamp);
  const menu =
    interpolate(frame, [T.menu, T.menu + 6], [0, 1], clamp) * interpolate(frame, [T.tapCopy + 6, T.tapCopy + 10], [1, 0], clamp);
  const paste =
    interpolate(frame, [T.pasteMenu, T.pasteMenu + 6], [0, 1], clamp) *
    interpolate(frame, [T.tapPaste + 4, T.tapPaste + 8], [1, 0], clamp);
  const fill = interpolate(frame, [T.fill, T.fill + 8], [0, 1], ease);
  const filled = frame >= T.fill;
  const toast = interpolate(frame, [T.fill + 4, T.fill + 12, T.fill + 70, T.fill + 78], [0, 1, 1, 0], clamp);

  const mono: React.CSSProperties = { fontFamily: wfonts.mono, fontSize: 14, fontWeight: 600 };

  return (
    <AbsoluteFill style={{ background: bb.bg }}>
      <StepPanel
        step={2}
        title={props.title}
        items={[
          { text: props.items[0], at: T.item1, done: T.item1Done },
          { text: props.items[1], at: T.item2, done: T.item2Done },
          { text: props.items[2], at: T.item3, done: T.item3Done },
        ]}
        note={{ label: props.noteLabel, text: props.note, at: T.note }}
      />

      <Phone>
        {sw < 1 ? (
          <div style={{ position: "absolute", inset: 0, ...appOut(sw) }}>
            <MailInbox
              arrive={arrive}
              press={pressed(frame, T.tapMail)}
              style={underStyle(push)}
              mails={[
                {
                  from: "Betaalbuddy",
                  isBb: true,
                  unread: true,
                  subject: "Je Buddy staat klaar",
                  preview: `Je doorstuuradres: ${example.adres}`,
                  time: "9:42",
                  tap: "mail",
                },
                {
                  from: "Sportschool",
                  subject: "Je lidmaatschap",
                  preview: "Vanaf november gaan de lestijden op zaterdag iets anders.",
                  time: "9:12",
                },
                {
                  from: "Webshop",
                  subject: "Je pakket komt vandaag",
                  preview: "Je bestelling wordt tussen 14:00 en 16:00 bezorgd.",
                  time: "gisteren",
                },
                {
                  from: "Lisa",
                  subject: "Foto's van zaterdag",
                  preview: "Hier zijn ze! De laatste is echt de beste.",
                  time: "gisteren",
                },
                { from: "Gemeente", subject: "Nieuwsbrief oktober", preview: "Werkzaamheden in jouw buurt en meer.", time: "za" },
              ]}
            />
            {push > 0 ? (
              <MailView
                from="Betaalbuddy"
                isBb
                subject="Je Buddy staat klaar"
                time="9:42"
                toolbar={false}
                style={pushStyle(push)}
              >
                <div data-tap="body" style={{ position: "relative" }}>
                  <p style={{ margin: 0 }}>
                    <Sel p={sel(0)}>Hoi! Hier zijn je gegevens.</Sel>
                  </p>
                  <p style={{ margin: "12px 0 0", color: bb.muted, fontSize: 13.5 }}>
                    <Sel p={sel(1)}>Je doorstuuradres</Sel>
                  </p>
                  <p style={{ margin: "2px 0 0", ...mono }}>
                    <Sel p={sel(2)}>
                      <Addr value={example.adres} />
                    </Sel>
                  </p>
                  <p style={{ margin: "12px 0 0", color: bb.muted, fontSize: 13.5 }}>
                    <Sel p={sel(3)}>Je agendalink</Sel>
                  </p>
                  <p style={{ margin: "2px 0 0", ...mono, color: bb.app, overflowWrap: "anywhere" }}>
                    <Sel p={sel(4)}>{example.agenda}</Sel>
                  </p>
                  <p style={{ margin: "14px 0 0" }}>
                    <Sel p={sel(5)}>Plak deze mail op de instelpagina, dan vullen wij alles voor je in.</Sel>
                  </p>
                  <EditMenu
                    x={150}
                    y={-6}
                    show={menu}
                    items={["Kopieer", "Selecteer alles", "Deel…"]}
                    taps={["copy"]}
                    highlight={pressed(frame, T.tapCopy) > 0.5 ? 0 : -1}
                  />
                </div>
              </MailView>
            ) : null}
          </div>
        ) : null}

        {sw > 0 ? (
          <div style={{ position: "absolute", inset: 0, ...appIn(sw) }}>
            <PageScreen step={2} done={1} scroll={scroll}>
              <Eyebrow>Stap 2</Eyebrow>
              <H2>Plak wat je van ons terugkrijgt</H2>
              <Lead>
                Binnen een paar minuten krijg je een mail met twee dingen: je <b style={{ color: bb.ink }}>doorstuuradres</b> en
                je <b style={{ color: bb.ink }}>agendalink</b>.
              </Lead>
              <Note style={{ marginTop: 16 }}>
                <b>Makkelijk:</b> kopieer gewoon de hele mail en plak hem in een van de vakjes. Wij halen er zelf de goede stukken
                uit.
              </Note>
              <div style={{ marginTop: 18 }}>
                <InputField
                  label="Je doorstuuradres"
                  placeholder="bijv. a8f3k@in.betaalbuddy.nl"
                  value={filled ? example.adres : ""}
                  state={filled ? "ok" : frame >= T.tapField ? "focus" : "empty"}
                  fill={fill}
                  tap="field"
                  menu={
                    <EditMenu
                      x={52}
                      y={26}
                      show={paste}
                      items={["Plak"]}
                      taps={["paste"]}
                      highlight={pressed(frame, T.tapPaste) > 0.5 ? 0 : -1}
                    />
                  }
                />
              </div>
              <div style={{ marginTop: 18 }}>
                <InputField
                  label={
                    <>
                      Je agendalink <span style={{ color: bb.muted, fontWeight: 400 }}>(voor stap 4)</span>
                    </>
                  }
                  placeholder="https://api.betaalbuddy.nl/ics/....ics"
                  value={filled ? example.agenda : ""}
                  state={filled ? "ok" : "empty"}
                  fill={fill}
                />
              </div>
            </PageScreen>
            <PageToast text="Allebei gevonden en ingevuld" show={toast} />
          </div>
        ) : null}

        <Tap target="mail" at={T.tapMail} />
        <Tap target="body" at={T.select - 6} hold={14} dy={-20} />
        <Tap target="copy" at={T.tapCopy} />
        <Tap target="field" at={T.tapField} />
        <Tap target="paste" at={T.tapPaste} />
      </Phone>
    </AbsoluteFill>
  );
};
