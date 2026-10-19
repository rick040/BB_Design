import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../../lib/anim";
import { CheckIcon, MailIcon } from "../components/Icons";
import { Phone } from "../components/Phone";
import { StepPanel } from "../components/StepPanel";
import { pressed, Tap } from "../components/Tap";
import type { WalkthroughProps } from "../schema";
import { appIn, appOut, Compose, MailInbox, MailView, pushStyle, Sheet, Token, underStyle } from "../screens/mail";
import { Addr, Btn, Chip, Eyebrow, H2, Label, Lead, Method, PageScreen, Pill } from "../screens/page";
import { bb } from "../tokens";

// Timeline (frames, scene-local).
export const STEP5_T = {
  item1: 14, // "Tik op Open proefmail"
  tapTest: 48,
  sheet: 54, // the test bill of € 1,00 is ready to send
  sheetLen: 16,
  item1Done: 62,
  item2: 74, // "Druk op Verstuur"
  tapSend: 112,
  sheetDown: 118,
  item2Done: 126,
  item3: 138, // "Je krijgt een mail terug"
  switchApp: 142, // to the mail app
  switchLen: 16,
  arrive: 172, // Buddy's confirmation lands
  arriveLen: 14,
  tapMail: 200,
  push: 204,
  pushLen: 14,
  item3Done: 222,
  note: 238, // "Proefmail? Tik op Al betaald"
  tapPaid: 272,
};

export const Step5Scene: React.FC<{ props: WalkthroughProps["step5"]; example: WalkthroughProps["example"] }> = ({
  props,
  example,
}) => {
  const frame = useCurrentFrame();
  const T = STEP5_T;
  const ease = { ...clamp, easing: (x: number) => 1 - Math.pow(1 - x, 3) };

  const sheet =
    interpolate(frame, [T.sheet, T.sheet + T.sheetLen], [0, 1], ease) -
    interpolate(frame, [T.sheetDown, T.sheetDown + T.sheetLen], [0, 1], ease);
  const sw = interpolate(frame, [T.switchApp, T.switchApp + T.switchLen], [0, 1], ease);
  const arrive = interpolate(frame, [T.arrive, T.arrive + T.arriveLen], [0, 1], ease);
  const push = interpolate(frame, [T.push, T.push + T.pushLen], [0, 1], ease);
  const paid = frame >= T.tapPaid + 4;

  const testBody = `Testrekening Betaalbuddy\n\nBedrag: € 1,00\nVervaldatum: ${example.testDue}\nAan: Betaalbuddy test\n\nDit is een proef. Tik op "al betaald" om hem weg te halen.`;

  return (
    <AbsoluteFill style={{ background: bb.bg }}>
      <StepPanel
        step={5}
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
            <PageScreen step={5} done={4}>
              <Eyebrow>Stap 5</Eyebrow>
              <H2>Doe één test</H2>
              <Lead>Zo weet je vandaag al dat het werkt, en niet pas over drie weken.</Lead>
              <div style={{ marginTop: 18 }}>
                <Label>Kies wat het makkelijkst is</Label>
                <Method
                  title={
                    <>
                      Stuur een echte rekening door <Pill>Beste test</Pill>
                    </>
                  }
                >
                  <div style={{ marginTop: 4, fontSize: 13.5, color: bb.muted, lineHeight: 1.5 }}>
                    Zoek een rekening die je nog moet betalen en stuur hem door naar{" "}
                    <Chip>
                      <Addr value={example.adres} />
                    </Chip>
                  </div>
                </Method>
                <Method title="Of stuur een proefmail" style={{ marginTop: 10 }}>
                  <div style={{ marginTop: 4, fontSize: 13.5, color: bb.muted }}>
                    Wij zetten een nep-rekening van € 1,00 klaar. Druk alleen op Verstuur.
                  </div>
                  <Btn tap="test" press={pressed(frame, T.tapTest)} style={{ marginTop: 11 }}>
                    <MailIcon size={20} /> Open proefmail
                  </Btn>
                </Method>
              </div>
            </PageScreen>
            <Sheet p={sheet}>
              <Compose
                to={
                  <Token>
                    <Addr value={example.adres} />
                  </Token>
                }
                from={example.yourMail}
                subject="Factuur test Betaalbuddy"
                body={testBody}
                sendPress={pressed(frame, T.tapSend)}
              />
            </Sheet>
          </div>
        ) : null}

        {sw > 0 ? (
          <div style={{ position: "absolute", inset: 0, ...appIn(sw) }}>
            <MailInbox
              arrive={arrive}
              press={pressed(frame, T.tapMail)}
              style={underStyle(push)}
              mails={[
                {
                  from: "Betaalbuddy",
                  isBb: true,
                  unread: true,
                  subject: "Genoteerd: Betaalbuddy test",
                  preview: `€ 1,00, vervalt op ${example.testDueLong}.`,
                  time: "9:51",
                  tap: "confirm",
                },
                {
                  from: example.billSender,
                  subject: example.billSubject,
                  preview: `Te betalen: ${example.billAmount}. Vervaldatum: ${example.billDue}.`,
                  time: "8:05",
                },
                {
                  from: "Betaalbuddy",
                  isBb: true,
                  subject: "Je Buddy staat klaar",
                  preview: `Je doorstuuradres: ${example.adres}`,
                  time: "gisteren",
                },
                {
                  from: "Sportschool",
                  subject: "Je lidmaatschap",
                  preview: "Vanaf november gaan de lestijden op zaterdag iets anders.",
                  time: "gisteren",
                },
                {
                  from: "Webshop",
                  subject: "Je pakket komt vandaag",
                  preview: "Je bestelling wordt tussen 14:00 en 16:00 bezorgd.",
                  time: "ma",
                },
              ]}
            />
            {push > 0 ? (
              <MailView
                from="Betaalbuddy"
                isBb
                subject="Genoteerd: Betaalbuddy test"
                time="9:51"
                toolbar={false}
                style={pushStyle(push)}
              >
                <p style={{ margin: 0 }}>Gelukt! Deze rekening houden we voor je in de gaten.</p>
                <div
                  style={{
                    marginTop: 12,
                    borderRadius: 14,
                    background: bb.tint2,
                    border: `1px solid ${bb.tintLine}`,
                    padding: "4px 14px",
                  }}
                >
                  {[
                    ["Aan", "Betaalbuddy test"],
                    ["Bedrag", "€ 1,00"],
                    ["Vervaldatum", example.testDueLong],
                  ].map(([k, v], i) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "9px 0",
                        borderTop: i ? `1px solid ${bb.tintLine}` : undefined,
                        fontSize: 14.5,
                      }}
                    >
                      <span style={{ color: bb.muted }}>{k}</span>
                      <b style={{ fontWeight: 600 }}>{v}</b>
                    </div>
                  ))}
                </div>
                <p style={{ margin: "12px 0 0", fontSize: 14, color: bb.muted }}>
                  Klopt dit? Dan hoef je niets te doen.
                </p>
                <div style={{ marginTop: 16 }}>
                  {paid ? (
                    <Btn tap="paid" style={{ background: bb.ok, boxShadow: "none" }}>
                      <CheckIcon size={18} /> Betaald, hij is weg
                    </Btn>
                  ) : (
                    <Btn tap="paid" press={pressed(frame, T.tapPaid)}>
                      Al betaald
                    </Btn>
                  )}
                </div>
              </MailView>
            ) : null}
          </div>
        ) : null}

        <Tap target="test" at={T.tapTest} />
        <Tap target="send" at={T.tapSend} />
        <Tap target="confirm" at={T.tapMail} />
        <Tap target="paid" at={T.tapPaid} />
      </Phone>
    </AbsoluteFill>
  );
};
