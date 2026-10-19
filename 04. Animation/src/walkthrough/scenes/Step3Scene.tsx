import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../../lib/anim";
import { Phone } from "../components/Phone";
import { StepPanel } from "../components/StepPanel";
import { pressed, Tap } from "../components/Tap";
import type { WalkthroughProps } from "../schema";
import {
  appIn,
  appOut,
  Caret,
  Compose,
  EditMenu,
  MailInbox,
  MailView,
  pushStyle,
  Sheet,
  Token,
  underStyle,
} from "../screens/mail";
import {
  Addr,
  Chip,
  CopyField,
  Eyebrow,
  H2,
  Label,
  Lead,
  Method,
  MiniList,
  Path,
  PageScreen,
  Pill,
  Tile,
  Tiny,
} from "../screens/page";
import { bb } from "../tokens";

// Timeline (frames, scene-local).
export const STEP3_T = {
  item1: 14, // "Open de rekening in je mail"
  tapBill: 40,
  push: 44,
  pushLen: 14,
  item1Done: 56,
  item2: 66, // "Kies Doorsturen"
  tapForward: 96,
  sheet: 102,
  sheetLen: 16,
  item2Done: 110,
  item3: 122, // "Plak je doorstuuradres en verstuur"
  tapTo: 140,
  pasteMenu: 150,
  tapPaste: 164,
  token: 168, // the address lands in "Aan"
  tapSend: 196,
  sheetDown: 202,
  item3Done: 212,
  note: 232, // "Optioneel: liever automatisch?"
  switchApp: 244, // to the page, the "Automatisch" part
  switchLen: 16,
  scroll: 256,
  scrollLen: 26,
  tapTile: 300, // pick a mail program
  reveal: 306, // its steps appear
  scroll2: 318,
  scroll2Len: 22,
};

export const Step3Scene: React.FC<{ props: WalkthroughProps["step3"]; example: WalkthroughProps["example"] }> = ({
  props,
  example,
}) => {
  const frame = useCurrentFrame();
  const T = STEP3_T;
  const ease = { ...clamp, easing: (x: number) => 1 - Math.pow(1 - x, 3) };
  const smooth = { ...clamp, easing: (x: number) => x * x * (3 - 2 * x) };

  const push = interpolate(frame, [T.push, T.push + T.pushLen], [0, 1], ease);
  const sheet =
    interpolate(frame, [T.sheet, T.sheet + T.sheetLen], [0, 1], ease) -
    interpolate(frame, [T.sheetDown, T.sheetDown + T.sheetLen], [0, 1], ease);
  const paste =
    interpolate(frame, [T.pasteMenu, T.pasteMenu + 6], [0, 1], clamp) *
    interpolate(frame, [T.tapPaste + 4, T.tapPaste + 8], [1, 0], clamp);
  const token = interpolate(frame, [T.token, T.token + 8], [0, 1], ease);
  const sw = interpolate(frame, [T.switchApp, T.switchApp + T.switchLen], [0, 1], ease);
  const scroll =
    interpolate(frame, [T.scroll, T.scroll + T.scrollLen], [430, 640], smooth) +
    interpolate(frame, [T.scroll2, T.scroll2 + T.scroll2Len], [0, 250], smooth);
  const prov = frame >= T.tapTile + 2;
  const reveal = interpolate(frame, [T.reveal, T.reveal + 10], [0, 1], ease);

  return (
    <AbsoluteFill style={{ background: bb.bg }}>
      <StepPanel
        step={3}
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
              press={pressed(frame, T.tapBill)}
              style={underStyle(push)}
              mails={[
                {
                  from: example.billSender,
                  unread: true,
                  subject: example.billSubject,
                  preview: `Te betalen: ${example.billAmount}. Vervaldatum: ${example.billDue}.`,
                  time: "8:05",
                  tap: "bill",
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
                {
                  from: "Lisa",
                  subject: "Foto's van zaterdag",
                  preview: "Hier zijn ze! De laatste is echt de beste.",
                  time: "zo",
                },
              ]}
            />
            {push > 0 ? (
              <MailView
                from={example.billSender}
                subject={example.billSubject}
                time="8:05"
                forwardPress={pressed(frame, T.tapForward)}
                style={pushStyle(push)}
              >
                <p style={{ margin: 0 }}>Beste klant,</p>
                <p style={{ margin: "10px 0 0" }}>Je factuur van oktober staat voor je klaar.</p>
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "#F4F5F7",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  <div>
                    Te betalen: <b>{example.billAmount}</b>
                  </div>
                  <div>
                    Vervaldatum: <b>{example.billDue}</b>
                  </div>
                  <div>Kenmerk: 4471 0923 5518</div>
                </div>
                <p style={{ margin: "12px 0 0" }}>
                  Met vriendelijke groet,
                  <br />
                  {example.billSender}
                </p>
              </MailView>
            ) : null}
            <Sheet p={sheet}>
              <Compose
                title="Doorsturen"
                to={
                  frame >= T.token ? (
                    <Token pop={token}>
                      <Addr value={example.adres} />
                    </Token>
                  ) : frame >= T.tapTo ? (
                    <Caret frame={frame} />
                  ) : null
                }
                from={example.yourMail}
                subject={`Fwd: ${example.billSubject}`}
                sendPress={pressed(frame, T.tapSend)}
                body={
                  <span style={{ color: bb.muted, fontSize: 13.5 }}>
                    {`Doorgestuurd bericht\nVan: ${example.billSender}\nOnderwerp: ${example.billSubject}\n\nBeste klant,\nJe factuur van oktober staat voor je klaar.`}
                  </span>
                }
              />
              <EditMenu
                x={120}
                y={62}
                show={paste}
                items={["Plak"]}
                taps={["paste"]}
                highlight={pressed(frame, T.tapPaste) > 0.5 ? 0 : -1}
              />
            </Sheet>
          </div>
        ) : null}

        {sw > 0 ? (
          <div style={{ position: "absolute", inset: 0, ...appIn(sw) }}>
            <PageScreen step={3} done={2} scroll={scroll}>
              <Eyebrow>Stap 3</Eyebrow>
              <H2>Stuur je rekeningen door</H2>
              <Lead>Elke rekening die je doorstuurt naar je eigen adres, houden wij voor je in de gaten.</Lead>
              <div style={{ marginTop: 18 }}>
                <Label>Jouw doorstuuradres</Label>
                <CopyField value={example.adres} />
              </div>
              <Method
                title={
                  <>
                    Met de hand <Pill>Werkt meteen</Pill>
                  </>
                }
                style={{ marginTop: 18 }}
              >
                <Tiny style={{ marginTop: 4 }}>Drie tikken per rekening. Genoeg om te beginnen.</Tiny>
                <div style={{ marginTop: 11 }}>
                  <MiniList
                    items={[
                      "Open de rekening in je mail.",
                      <>
                        Kies <Path>Doorsturen</Path>.
                      </>,
                      "Plak je doorstuuradres en verstuur.",
                    ]}
                  />
                </div>
              </Method>
              <Method
                title={
                  <>
                    Automatisch <Pill grey>Optioneel, 3 minuten</Pill>
                  </>
                }
                style={{ marginTop: 10 }}
              >
                <Tiny style={{ marginTop: 4 }}>Een regel in je mail die alleen rekeningen doorstuurt. Nooit je hele inbox.</Tiny>
                <Label style={{ marginTop: 13 }}>Welke mail gebruik je?</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <Tile name="Gmail" sub="gmail.com" on={prov} tap="tile" press={pressed(frame, T.tapTile)} />
                  <Tile name="Outlook" sub="Hotmail, Live" />
                  <Tile name="iCloud" sub="icloud.com, me.com" />
                  <Tile name="Proton" sub="proton.me" />
                  <Tile name="Iets anders" sub="KPN, Ziggo, werk" />
                </div>
                {prov ? (
                  <div style={{ marginTop: 16, opacity: reveal, transform: `translateY(${(1 - reveal) * 10}px)` }}>
                    <Tiny style={{ color: bb.faint, marginBottom: 7 }}>Tik een stap aan als je hem gedaan hebt.</Tiny>
                    <Label>Deel 1: adres toevoegen</Label>
                    <MiniList
                      items={[
                        <>
                          Open de instellingen voor doorsturen:{" "}
                          <span style={{ color: bb.blue, textDecoration: "underline" }}>Doorsturen en POP/IMAP</span>
                        </>,
                        <>
                          Klik op <Path>Een doorstuuradres toevoegen</Path> en plak{" "}
                          <Chip>
                            <Addr value={example.adres} />
                          </Chip>
                        </>,
                        "Wacht op de mail met de code en vul die in.",
                      ]}
                    />
                  </div>
                ) : null}
              </Method>
            </PageScreen>
          </div>
        ) : null}

        <Tap target="bill" at={T.tapBill} />
        <Tap target="forward" at={T.tapForward} />
        <Tap target="to" at={T.tapTo} dx={-40} />
        <Tap target="paste" at={T.tapPaste} />
        <Tap target="send" at={T.tapSend} />
        <Tap target="tile" at={T.tapTile} />
      </Phone>
    </AbsoluteFill>
  );
};
