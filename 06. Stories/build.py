#!/usr/bin/env python3
"""Bouwt de statische Instagram Stories (1080x1920) van BetaalBuddy.

Twee series over de instelpagina (/stel-je-buddy-in/):
- "Simpel": vijf compacte stories in de stijl van de highlight "Meet Buddy"
  (grote kop, één beeld, één zin);
- "Instellen": een highlight-cover plus zeven stories met alle vijf stappen in detail.

Elke story = één HTML-bestand in ./src/ (open het in je browser en pas tekst aan)
en één PNG in ./renders/. Alles staat in STORIES onderaan dit bestand.

Gebruik (vanuit deze map):
    python3 build.py              # alle stories
    python3 build.py simpel       # alleen de serie Simpel
    python3 build.py simpel-03    # alleen story 03 van Simpel

Vereist: pip install playwright && playwright install chromium.
Staat Chromium ergens anders, zet dan CHROME_PATH=/pad/naar/chrome.
"""
import os
import pathlib
import sys

from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
FONTS = HERE.parent / "04. Animation" / "public" / "fonts"
SRC = HERE / "src"
OUT = HERE / "renders"
W, H = 1080, 1920

C = dict(
    blue="#013bff", blueMid="#2459fd", blueMascot="#0046e2", blueSoft="#b6c7ff",
    blueText="#99b1ff", light="#fafbff", grey="#e8edf2", greyText="#9b9aa3",
    ink="#111114", yellow="#ffce31", tint="#e8eeff",
)

# ---------- merkelementen (zelfde paden als de Remotion-componenten) ----------
BUDDY_BODY = ("M196.66,288.64c66.71-12.11,101.71-55.41,117.98-116.76,73.03-13.14,144.94,50.85,149.65,131.87,6.68,115.03-70.87,199.8-186.16,201.88-67.22,1.21-134.49.66-201.73.13-45.07-.36-74.89-28.16-75.36-73.08C-.13,323.18-.4,213.65.68,104.15,1.16,55.47,28.08,24.42,75.78,11.47c55.01-14.93,109.72-17.97,162.91,7.26,56.92,27,67.02,77.99,64.48,133.09-2.11,45.74-37.48,63.69-74.33,77.97-39.19,15.19-39.33,14.82-32.17,58.86Z")
EYES = [(96.67, 105.1, 93.74, 146.11), (213.85, 105.1, 216.78, 146.11)]


def buddy(width, body="#fff", eye="#0046e2", blink=1.0, look=(0, 0), style=""):
    h = width * 506.36 / 464.69
    lx, ly = look[0] * 16, look[1] * 14
    eyes = ""
    for cx, cy, hx, hy in EYES:
        eyes += (f'<g transform="translate({lx} {ly}) translate({cx} {cy}) scale(1 {blink}) translate({-cx} {-cy})">'
                 f'<ellipse cx="{cx}" cy="{cy}" rx="38.08" ry="52.73" fill="{eye}"/>'
                 f'<circle cx="{hx}" cy="{hy}" r="17.58" fill="{body}"/></g>')
    return (f'<svg viewBox="0 0 464.69 506.36" width="{width}" height="{h:.0f}" style="display:block;overflow:visible;{style}">'
            f'<path d="{BUDDY_BODY}" fill="{body}"/>{eyes}</svg>')


def arrow(size, color=C["ink"], rot=0):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 40 40" style="display:block;transform:rotate({rot}deg)">'
            f'<path d="M6 20h27M22 9l11 11-11 11" fill="none" stroke="{color}" stroke-width="2.8" '
            f'stroke-linecap="round" stroke-linejoin="round"/></svg>')


def glyph(kind="doc", size=64):
    """Generiek icoon: grijze cirkel met een neutrale blauwe vorm (geen merklogo's)."""
    shapes = {
        "bolt": '<path d="M44 20 28 42h10l-4 18 18-24H42z" fill="#2459fd"/>',
        "phone": '<rect x="29" y="20" width="22" height="40" rx="6" fill="#2459fd"/><circle cx="40" cy="53" r="2.5" fill="#fff"/>',
        "heart": '<path d="M40 58C20 44 24 26 34 26c4 0 6 2 6 5 0-3 2-5 6-5 10 0 14 18-6 32z" fill="#2459fd"/>',
        "check": '<circle cx="40" cy="40" r="19" fill="#2459fd"/><path d="M31 41l7 7 12-14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
        "bb": f'<g transform="translate(23 22) scale(.074)"><path d="{BUDDY_BODY}" fill="#013bff"/>'
              '<ellipse cx="96.67" cy="105.1" rx="38.08" ry="52.73" fill="#fff"/><ellipse cx="213.85" cy="105.1" rx="38.08" ry="52.73" fill="#fff"/></g>',
    }
    return (f'<svg viewBox="0 0 80 80" width="{size}" height="{size}" style="display:block;flex-shrink:0">'
            f'<circle cx="40" cy="40" r="40" fill="{C["grey"]}"/>{shapes[kind]}</svg>')


def check(size=44, bg=C["blue"], fg="#fff"):
    return (f'<svg viewBox="0 0 44 44" width="{size}" height="{size}" style="display:block;flex-shrink:0">'
            f'<circle cx="22" cy="22" r="22" fill="{bg}"/><path d="M13 22.5l6 6 12-13" fill="none" stroke="{fg}" '
            f'stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def info(size=40, bg=C["blue"], fg="#fff"):
    return (f'<svg viewBox="0 0 40 40" width="{size}" height="{size}" style="display:block;flex-shrink:0">'
            f'<circle cx="20" cy="20" r="20" fill="{bg}"/><circle cx="20" cy="12.5" r="2.6" fill="{fg}"/>'
            f'<rect x="17.8" y="17.5" width="4.4" height="13" rx="2.2" fill="{fg}"/></svg>')


def gear(size, color):
    """Tandwiel voor de highlight-cover: een dikke cirkel met tanden via een stippellijn."""
    return (f'<svg viewBox="0 0 100 100" width="{size}" height="{size}" style="display:block">'
            f'<circle cx="50" cy="50" r="50" fill="{C["blue"]}"/>'
            f'<circle cx="50" cy="50" r="36" fill="none" stroke="{color}" stroke-width="17" stroke-dasharray="15.5 12.77"/>'
            f'<circle cx="50" cy="50" r="30" fill="{color}"/><circle cx="50" cy="50" r="11" fill="{C["blue"]}"/></svg>')


def btn(label, kind="solid", tapped=False, style=""):
    """Knop zoals op de telefoon. tapped=True zet er een vingertop op, zoals in de walkthrough-video."""
    dot = '<i class="tap"></i>' if tapped else ""
    return f'<span class="btn {kind}" style="{style}">{label}{dot}</span>'


# ---------- bouwstenen van een story ----------
def stepchip(n):
    return f'<div class="stepchip">Stap {n} van 5</div>'


def how(items):
    rows = "".join(f'<li><span class="n">{i}</span><span>{t}</span></li>' for i, t in enumerate(items, 1))
    return f'<ol class="how">{rows}</ol>'


def tip(label, text, dark):
    bg, fg = ("#fff", C["blue"]) if dark else (C["blue"], "#fff")
    return f'<div class="tip">{info(44, bg, fg)}<p><b>{label}</b> {text}</p></div>'


def mail_head(sender, subject, when="nu", icon="bb"):
    return (f'<div class="mhead">{glyph(icon, 72)}<div class="mt"><b>{sender}</b><span>{subject}</span></div>'
            f'<em>{when}</em></div>')


def row(k, v, cls=""):
    return f'<div class="mrow {cls}"><span class="k">{k}</span><span class="v">{v}</span></div>'


def footer(dark, hint="Tik voor de volgende stap"):
    buddy_c = "#fff" if dark else C["blue"]
    nxt = (f'<div class="next">{hint} {arrow(30, "#fff" if dark else C["blue"])}</div>' if hint else "")
    return (f'<div class="foot"><div class="wm"><span style="color:{C["blueSoft"]}">betaal</span>'
            f'<span style="color:{buddy_c}">buddy</span></div>{nxt}</div>')


CSS = f"""
@font-face {{ font-family:'Space Grotesk'; src:url('{(FONTS / "SpaceGrotesk-Variable.woff2").as_uri()}'); font-weight:300 700; }}
@font-face {{ font-family:'Geist'; src:url('{(FONTS / "Geist-Variable.woff2").as_uri()}'); font-weight:100 900; }}
* {{ box-sizing:border-box; margin:0; padding:0; }}
html,body {{ width:{W}px; height:{H}px; }}
.story {{ width:{W}px; height:{H}px; position:relative; overflow:hidden; font-family:'Space Grotesk',sans-serif; }}
.story.light {{ background:{C['light']}; color:{C['blue']}; }}
.story.dark {{ background:{C['blue']}; color:#fff; }}
/* Inhoud blijft tussen y 270 en 1590: daarboven en daaronder legt Instagram balken over de story. */
.col {{ position:absolute; left:90px; right:90px; top:262px; bottom:330px; display:flex; flex-direction:column;
        align-items:stretch; }}
.stepchip {{ align-self:center; font-family:'Geist',sans-serif; font-size:30px; font-weight:600; letter-spacing:.01em;
            border-radius:999px; padding:14px 30px; }}
.light .stepchip {{ background:{C['tint']}; color:{C['blue']}; }}
.dark .stepchip {{ border:2px solid rgba(255,255,255,.55); color:#fff; }}
h1 {{ text-align:center; font-weight:500; font-size:100px; line-height:1.0; letter-spacing:-0.06em; margin-top:26px; }}
.sub {{ text-align:center; font-weight:400; font-size:42px; line-height:1.2; letter-spacing:-0.02em; margin-top:30px; }}
.light .sub {{ color:#6b7fc9; }} .dark .sub {{ color:{C['blueText']}; }}
.visual {{ position:relative; margin-top:46px; }}
.how {{ list-style:none; display:flex; flex-direction:column; gap:16px; margin-top:42px; }}
.how li {{ display:flex; gap:24px; align-items:flex-start; font-size:38px; line-height:1.22; letter-spacing:-0.02em; }}
.light .how li {{ color:{C['ink']}; }} .dark .how li {{ color:#fff; }}
.how b {{ font-weight:600; }}
.light .how b {{ color:{C['blue']}; }}
.how .n {{ flex:none; width:54px; height:54px; border-radius:50%; display:flex; align-items:center; justify-content:center;
          font-family:'Geist',sans-serif; font-size:28px; font-weight:600; margin-top:-3px; }}
.light .how .n {{ background:{C['blue']}; color:#fff; }} .dark .how .n {{ background:#fff; color:{C['blue']}; }}
.tip {{ display:flex; gap:22px; align-items:flex-start; border-radius:30px; padding:24px 32px; margin-top:30px;
        font-size:32px; line-height:1.3; letter-spacing:-0.01em; }}
.tip p {{ margin-top:1px; }}
.light .tip {{ background:{C['tint']}; color:#26315e; }} .light .tip b {{ color:{C['blue']}; font-weight:600; }}
.dark .tip {{ background:rgba(255,255,255,.13); color:#e3e9ff; }} .dark .tip b {{ color:#fff; font-weight:600; }}
/* telefoon-UI in Geist, net als de meldingen in de ads */
.card {{ background:#fff; border-radius:40px; font-family:'Geist',sans-serif; color:{C['ink']}; position:relative; }}
.light .card {{ box-shadow:0 14px 40px rgba(1,59,255,.12); border:1px solid #e9eefb; }}
.dark .card {{ box-shadow:0 18px 50px rgba(0,20,120,.28); }}
.mail {{ padding:28px 34px; }}
.mhead {{ display:flex; align-items:center; gap:22px; padding-bottom:20px; border-bottom:1.5px solid #eef1f6; }}
.mhead .mt {{ flex:1; display:flex; flex-direction:column; gap:4px; }}
.mhead b {{ font-size:32px; font-weight:600; letter-spacing:-0.01em; }}
.mhead span {{ font-size:27px; color:#55586a; }}
.mhead em {{ font-style:normal; font-size:24px; color:{C['greyText']}; align-self:flex-start; margin-top:6px; }}
.mrow {{ display:flex; align-items:center; gap:18px; padding:17px 0; border-bottom:1.5px solid #eef1f6; font-size:29px; }}
.mrow:last-child {{ border-bottom:0; }}
.mrow .k {{ width:170px; flex:none; color:{C['greyText']}; }}
.mrow .v {{ flex:1; font-weight:500; min-width:0; }}
.mrow.mark {{ background:#fff6d6; box-shadow:0 0 0 3px {C['yellow']}; border-radius:16px; margin:6px -16px; padding:17px 16px;
             border-bottom:0; }}
.token {{ display:inline-block; background:{C['tint']}; color:{C['blue']}; border-radius:12px; padding:6px 14px; font-weight:500; }}
.btn {{ display:inline-flex; align-items:center; justify-content:center; gap:12px; height:76px; padding:0 38px; border-radius:38px;
        font-family:'Geist',sans-serif; font-size:30px; font-weight:600; white-space:nowrap; position:relative; }}
.btn.solid {{ background:{C['blue']}; color:#fff; }}
.btn.soft {{ background:{C['tint']}; color:{C['blue']}; }}
.btn.white {{ background:#fff; color:{C['blue']}; }}
.skel {{ height:16px; border-radius:8px; background:{C['grey']}; }}
.line {{ font-size:28px; color:#3c4052; line-height:1.35; }}
.sel {{ background:rgba(1,59,255,.16); border-radius:6px; padding:2px 4px; box-decoration-break:clone; -webkit-box-decoration-break:clone; }}
.bubble {{ position:absolute; background:{C['ink']}; color:#fff; font-family:'Geist',sans-serif; font-size:26px; font-weight:500;
          border-radius:14px; padding:12px 22px; }}
.bubble:after {{ content:''; position:absolute; left:50%; bottom:-10px; margin-left:-10px; border:10px solid transparent;
                border-bottom:0; border-top-color:{C['ink']}; }}
.field {{ border:2px solid #dfe5f3; border-radius:20px; padding:16px 22px; display:flex; align-items:center; gap:16px; }}
.field .fl {{ flex:1; min-width:0; }}
.field small {{ display:block; font-size:23px; color:{C['greyText']}; margin-bottom:4px; }}
.field span {{ font-size:28px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block; }}
.down {{ width:64px; height:64px; border-radius:50%; background:{C['blueMid']}; display:flex; align-items:center;
         justify-content:center; margin:12px auto; }}
.dark .down {{ background:#fff; }}
/* vingertop: halfdoorzichtige stip met een rimpeling, rechts op de knop */
.tap {{ position:absolute; right:11%; top:50%; width:92px; height:92px; margin:-46px -46px 0 0; border-radius:50%;
        background:rgba(255,255,255,.3); border:3px solid rgba(255,255,255,.85);
        box-shadow:0 0 0 14px rgba(1,59,255,.14), 0 6px 16px rgba(0,20,120,.25); }}
.btn.soft .tap {{ background:rgba(1,59,255,.22); border-color:{C['blue']}; }}
.abs {{ position:absolute; }}
.foot {{ position:absolute; left:70px; right:70px; top:1612px; display:flex; justify-content:space-between; align-items:center; }}
.wm {{ font-weight:700; font-size:54px; letter-spacing:-0.06em; line-height:1; }}
.next {{ display:flex; align-items:center; gap:10px; font-family:'Geist',sans-serif; font-size:26px; font-weight:500; }}
.light .next {{ color:{C['blue']}; }} .dark .next {{ color:#fff; }}
"""


def page(theme, body, hint="Tik voor de volgende stap", foot=True):
    f = footer(theme == "dark", hint) if foot else ""
    return (f'<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>story</title><style>{CSS}{SIMPLE_CSS}</style></head>'
            f'<body><div class="story {theme}">{body}{f}</div></body></html>')


# Laagste punt van de inhoud. Alles onder SAFE_BOTTOM botst met het woordmerk of de berichtbalk van Instagram.
SAFE_BOTTOM = 1590
MEASURE = """() => { const c = document.querySelector('.col'); if (!c) return 0; let m = 0;
  c.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (r.height > 0) m = Math.max(m, r.bottom); });
  return Math.round(m); }"""


# ---------- de stories ----------
def s00():
    """Highlight-cover: Instagram toont alleen het midden als rondje, dus alles staat gecentreerd."""
    return page("dark", f'''
<div class="abs" style="left:225px;top:665px">{buddy(470, blink=1, look=(0.2, -0.3))}</div>
<div class="abs" style="left:575px;top:930px">{gear(300, C["blueSoft"])}</div>''', foot=False)


def s01():
    steps = [("Vraag je adres aan", "Eén mailtje sturen"), ("Plak je gegevens", "Uit de mail die je terugkrijgt"),
             ("Stuur rekeningen door", "Met de hand of automatisch"), ("Zet de agenda aan", "Eén tik, mag ook later"),
             ("Doe één test", "Dan weet je zeker dat het werkt")]
    rows = ""
    for i, (lab, sub) in enumerate(steps, 1):
        sep = "border-bottom:1.5px solid #eef1f6;" if i < 5 else ""
        rows += (f'<div style="display:flex;align-items:center;gap:26px;padding:24px 0;{sep}">'
                 f'<span style="flex:none;width:62px;height:62px;border-radius:50%;background:{C["blue"]};color:#fff;'
                 f'display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:600">{i}</span>'
                 f'<span style="display:flex;flex-direction:column;gap:4px"><b style="font-size:34px;font-weight:600;'
                 f'letter-spacing:-0.01em">{lab}</b><span style="font-size:27px;color:#6a6d7e">{sub}</span></span></div>')
    return page("dark", f'''
<div class="col">
  <h1 style="margin-top:20px">Stel je<br>Buddy in.</h1>
  <div class="sub">5 korte stappen.<br>Samen ongeveer 5 minuten.</div>
  <div class="visual" style="margin-top:150px">
    <div class="abs" style="right:40px;top:-150px">{buddy(190, look=(-0.5, 0.7))}</div>
    <div class="card" style="padding:14px 40px">{rows}</div>
  </div>
</div>''', hint="Tik voor stap 1")


def s02():
    mail = (f'<div class="card mail">'
            f'<div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:18px;'
            f'border-bottom:1.5px solid #eef1f6"><b style="font-size:32px;font-weight:600">Nieuw bericht</b>'
            f'{btn("Verstuur " + arrow(26, "#fff"), style="height:64px;padding:0 30px;font-size:28px")}</div>'
            f'{row("Aan", "<span class=token>start@in.betaalbuddy.nl</span>")}'
            f'{row("Van", "jij@mijnmail.nl", "mark")}'
            f'{row("Onderwerp", "Start mijn Betaalbuddy")}</div>')
    return page("light", f'''
<div class="col">
  {stepchip(1)}
  <h1>Vraag je eigen<br>adres aan.</h1>
  <div class="visual">
    <div style="display:flex;justify-content:center">{btn("Open mijn mail", tapped=True, style="padding:0 128px")}</div>
    <div class="down">{arrow(34, "#fff", 90)}</div>
    {mail}
  </div>
  {how(["Tik op <b>Open mijn mail</b> op de instelpagina.", "Er staat al een mail klaar. Druk op <b>Verstuur</b>."])}
  {tip("Belangrijk:", "stuur hem vanaf het adres waar je je mails van Buddy wilt krijgen. Dat adres wordt je account.", False)}
</div>''')


def s03():
    mail = (f'<div class="card mail">{mail_head("Betaalbuddy", "Je Buddy staat klaar")}'
            f'<div class="line" style="padding-top:20px"><span class="sel">Hoi! Hier zijn je gegevens.<br>'
            f'Je doorstuuradres: <b style="color:{C["ink"]}">a8f3k@in.betaalbuddy.nl</b><br>'
            f'Je agendalink: <b style="color:{C["ink"]}">api.betaalbuddy.nl/ics/a8f3k.ics</b></span></div>'
            f'<div class="bubble" style="right:150px;top:96px">Kopieer</div></div>')
    fields = (f'<div class="card" style="padding:22px 26px;display:flex;flex-direction:column;gap:12px">'
              f'<div class="field"><div class="fl"><small>Je doorstuuradres</small><span>a8f3k@in.betaalbuddy.nl</span></div>{check(44)}</div>'
              f'<div class="field"><div class="fl"><small>Je agendalink</small><span>api.betaalbuddy.nl/ics/a8f3k.ics</span></div>{check(44)}</div>'
              f'</div>')
    return page("dark", f'''
<div class="col">
  {stepchip(2)}
  <h1>Plak wat je<br>terugkrijgt.</h1>
  <div class="visual">{mail}<div class="down">{arrow(34, C["blue"], 90)}</div>{fields}</div>
  {how(["Kopieer de hele mail die je terugkrijgt.", "Plak hem op de instelpagina."])}
  {tip("Geen mail?", "Wacht een paar minuten en kijk ook in je spam.", True)}
</div>''')


def s04():
    mail = (f'<div class="card mail">{mail_head("Energieleverancier", "Je factuur van oktober", "09:12", "bolt")}'
            f'<div style="display:flex;justify-content:space-between;align-items:baseline;padding:20px 0 2px">'
            f'<span style="font-size:28px;color:#55586a">Te betalen voor 28 november</span>'
            f'<b style="font-size:40px;font-weight:600;letter-spacing:-0.02em">€ 84,20</b></div>'
            f'<div style="display:flex;gap:16px;padding-top:18px">'
            f'{btn("Beantwoorden", "soft", style="flex:1")}{btn("Doorsturen", tapped=True, style="flex:1")}</div></div>')
    fwd = (f'<div class="card mail" style="padding:6px 34px">'
           f'{row("Aan", "<span class=token>a8f3k@in.betaalbuddy.nl</span>")}</div>')
    return page("light", f'''
<div class="col">
  {stepchip(3)}
  <h1>Stuur je<br>rekeningen door.</h1>
  <div class="visual">{mail}<div class="down">{arrow(34, "#fff", 90)}</div>{fwd}</div>
  {how(["Open de rekening in je mail.", "Kies <b>Doorsturen</b>.", "Plak je doorstuuradres en verstuur."])}
  {tip("Liever automatisch?", "Op de instelpagina staat hoe je een regel maakt die rekeningen vanzelf doorstuurt.", False)}
</div>''')


def s05():
    dialog = (f'<div class="card" style="padding:28px 34px">'
              f'<div style="display:flex;align-items:center;gap:22px">{glyph("bb", 76)}'
              f'<div style="display:flex;flex-direction:column;gap:4px"><b style="font-size:32px;font-weight:600;'
              f'letter-spacing:-0.01em">Agenda toevoegen?</b>'
              f'<span style="font-size:27px;color:#55586a">Betaalbuddy · vervaldatums</span></div></div>'
              f'<div style="display:flex;gap:16px;margin-top:24px">{btn("Annuleer", "soft", style="flex:1")}'
              f'{btn("Abonneer", tapped=True, style="flex:1")}</div></div>')
    ev = ""
    for day, num, title, sub in [("vr", "13", "Telefoonprovider betalen", "€ 37,85 · Betaalbuddy"),
                                 ("di", "24", "Zorgverzekeraar betalen", "€ 142,50 · Betaalbuddy")]:
        ev += (f'<div style="display:flex;align-items:center;gap:22px;padding:9px 0">'
               f'<div style="width:72px;flex:none;text-align:center"><div style="font-size:23px;color:{C["greyText"]}">{day}</div>'
               f'<div style="font-size:38px;font-weight:600;letter-spacing:-0.02em;line-height:1.1">{num}</div></div>'
               f'<div style="flex:1;border-left:8px solid {C["blue"]};background:{C["tint"]};border-radius:14px;padding:12px 22px">'
               f'<b style="display:block;font-size:28px;font-weight:600">{title}</b>'
               f'<span style="font-size:24px;color:#55586a">{sub}</span></div></div>')
    cal = f'<div class="card" style="padding:16px 34px">{ev}</div>'
    return page("dark", f'''
<div class="col">
  {stepchip(4)}
  <h1>Zet de<br>agenda aan.</h1>
  <div class="visual">{dialog}<div class="down">{arrow(34, C["blue"], 90)}</div>{cal}</div>
  {how(["Kies je agenda op de instelpagina.", "Tik op <b>Abonneer</b>.", "Je vervaldatums komen er vanzelf in."])}
  {tip("Mag ook later.", "Geen agenda? Sla deze stap over. De mails zijn genoeg.", True)}
</div>''')


def s06():
    sent = (f'<div class="card mail" style="padding:6px 34px">'
            f'{row("Aan", "<span class=token>a8f3k@in.betaalbuddy.nl</span>")}'
            f'{row("Onderwerp", "Factuur test Betaalbuddy")}</div>')
    pill = f'background:{C["tint"]};border-radius:16px;padding:14px 20px;flex:1;display:flex;flex-direction:column;gap:2px'
    back = (f'<div class="card mail">{mail_head("Betaalbuddy", "Genoteerd: Betaalbuddy test")}'
            f'<div class="line" style="padding:18px 0 16px">Gelukt! Deze rekening houden we voor je in de gaten.</div>'
            f'<div style="display:flex;gap:14px"><div style="{pill}"><small style="font-size:23px;color:#55586a">Bedrag</small>'
            f'<b style="font-size:32px;font-weight:600">€ 1,00</b></div><div style="{pill}">'
            f'<small style="font-size:23px;color:#55586a">Vervaldatum</small><b style="font-size:32px;font-weight:600">'
            f'13 november</b></div></div>'
            f'<div style="padding-top:18px">{btn("Al betaald", tapped=True, style="width:100%")}</div></div>')
    return page("light", f'''
<div class="col">
  {stepchip(5)}
  <h1>Doe één test.</h1>
  <div class="visual">{sent}<div class="down">{arrow(34, "#fff", 90)}</div>{back}</div>
  {how(["Tik op <b>Open proefmail</b> en druk op <b>Verstuur</b>.", "Je krijgt een mail terug met bedrag en vervaldatum."])}
  {tip("Proefmail?", "Tik dan op <b>Al betaald</b> en hij is weg.", False)}
</div>''')


def s07():
    done = ["Startmail verstuurd", "Doorstuuradres ingevuld", "Rekeningen doorsturen", "Agenda aangezet", "Test gelukt"]
    rows = "".join(
        f'<div style="display:flex;align-items:center;gap:24px;padding:20px 0;'
        f'{"border-bottom:1.5px solid #eef1f6;" if i < 4 else ""}">{check(50)}'
        f'<span style="font-size:33px;font-weight:500;letter-spacing:-0.01em">{t}</span></div>'
        for i, t in enumerate(done))
    return page("dark", f'''
<div class="col">
  <h1 style="margin-top:20px">Klaar.<br>Je Buddy let op.</h1>
  <div class="sub">Vanaf nu stuur je een rekening door.<br>Buddy houdt de datum bij.</div>
  <div class="visual" style="margin-top:210px">
    <div class="abs" style="left:50%;margin-left:-110px;top:-172px">{buddy(220, blink=0.18)}</div>
    <div class="card" style="padding:12px 40px">{rows}</div>
  </div>
  <div class="sub" style="margin-top:44px;font-size:32px">Vastgelopen? Alle stappen staan op<br>
    <b style="color:#fff;font-weight:500">betaalbuddy.nl/stel-je-buddy-in</b></div>
</div>''', hint="")


# ---------- serie "Simpel": compact, in de stijl van de highlight "Meet Buddy" ----------
# Blauw vlak, grote witte kop bovenaan, één beeld in het midden, één zin in zacht blauw eronder.
SIMPLE_CSS = f"""
.simple h1 {{ position:absolute; left:60px; right:60px; top:150px; height:270px; margin:0; display:flex; align-items:center;
              justify-content:center; font-size:120px; line-height:1.04; }}
.simple .stage {{ position:absolute; left:0; right:0; top:480px; height:840px; display:flex; align-items:center;
                  justify-content:center; }}
.simple .stage > * {{ transform:scale(1.07); }}
.simple .say {{ position:absolute; left:90px; right:90px; top:1370px; height:290px; display:flex; align-items:center;
                justify-content:center; text-align:center; font-size:64px; line-height:1.25; letter-spacing:0.005em;
                color:{C['blueText']}; }}
.scard {{ position:relative; background:#fcfcff; border:2.5px solid {C['ink']}; border-radius:44px;
          font-family:'Geist',sans-serif; color:{C['ink']}; }}
.scard .k {{ color:{C['greyText']}; }}
.scard .rule {{ height:2px; background:#eef1f6; margin:34px 0; }}
.scard .big {{ font-size:36px; padding:10px 20px; border-radius:14px; }}
.chip2 {{ background:{C['tint']}; color:{C['blue']}; border-radius:20px; padding:18px 26px; font-size:40px; font-weight:600;
          letter-spacing:-0.02em; }}
.flt {{ position:absolute; z-index:2; background:#fff; color:{C['blue']}; border-radius:999px; padding:16px 36px;
        font-family:'Space Grotesk',sans-serif; font-size:44px; letter-spacing:-0.03em; white-space:nowrap;
        box-shadow:0 12px 30px rgba(0,20,120,.28); }}
"""


def simple(head, visual, say):
    return page("dark", f'<div class="simple"><h1>{head}</h1><div class="stage">{visual}</div>'
                        f'<div class="say">{say}</div></div>', foot=False)


def k1():
    return simple("Zo stel je<br>Buddy in", buddy(400, look=(0, -0.5)),
                  "Vier korte stappen.<br>Samen zo'n vijf minuten.")


def k2():
    card = (f'<div class="scard" style="width:880px;padding:44px 48px">'
            f'<div style="display:flex;align-items:center;gap:26px;font-size:34px"><span class="k">Aan</span>'
            f'<span class="token big">start@in.betaalbuddy.nl</span></div><div class="rule"></div>'
            f'<div class="skel" style="width:72%;height:22px;border-radius:11px"></div>'
            f'<div class="skel" style="width:46%;height:22px;border-radius:11px;margin-top:22px"></div>'
            f'<div style="display:flex;justify-content:flex-end;margin-top:44px">'
            f'{btn("Verstuur " + arrow(30, "#fff"), style="height:84px;padding:0 44px;font-size:34px;border-radius:42px")}'
            f'</div></div>')
    return simple("Stuur één<br>mailtje", card, "Je krijgt je eigen<br>doorstuuradres terug.")


def k3():
    card = (f'<div class="scard" style="width:880px;padding:44px 48px">'
            f'<div class="flt" style="left:-30px;top:-52px;transform:rotate(-3deg)">vervaldatum</div>'
            f'<div class="flt" style="right:-30px;top:-46px;transform:rotate(3deg)">bedrag</div>'
            f'<div style="display:flex;align-items:center;gap:26px;padding-top:10px">{glyph("bolt", 100)}'
            f'<div style="flex:1;display:flex;flex-direction:column;gap:6px"><b style="font-size:38px;font-weight:600;'
            f'letter-spacing:-0.01em">Energieleverancier</b><span class="k" style="font-size:31px">Vervalt 28 nov</span></div>'
            f'<b style="font-size:44px;font-weight:600;letter-spacing:-0.02em">€ 84,20</b></div><div class="rule"></div>'
            f'<div class="k" style="font-size:30px;margin-bottom:14px">Doorsturen naar</div>'
            f'<span class="token big">jouwcode@in.betaalbuddy.nl</span></div>')
    return simple("Stuur je<br>rekening door", card, "Buddy haalt het bedrag en<br>de vervaldatum eruit.")


def k4():
    sq = "width:58px;height:58px;border-radius:10px"
    grid = "".join(f'<span style="{sq};background:{C["blueSoft"] if r == 0 else C["grey"]};'
                   f'{"height:22px;border-radius:11px;align-self:center;" if r == 0 else ""}"></span>'
                   for r in range(1) for _ in range(5))
    for r in range(1, 5):
        for c in range(5):
            on = (r, c) == (3, 3)
            dot = ('<i style="position:absolute;right:-6px;top:-6px;width:16px;height:16px;border-radius:50%;'
                   f'background:#fff;border:3px solid {C["blueMid"]}"></i>') if on else ""
            grid += f'<span style="{sq};position:relative;background:{C["blueMid"] if on else C["grey"]}">{dot}</span>'
    card = (f'<div class="scard" style="width:940px;padding:48px 52px;display:flex;align-items:center;gap:56px">'
            f'<div style="flex:1;display:flex;flex-direction:column;gap:10px">{glyph("heart", 104)}'
            f'<b style="font-size:36px;font-weight:600;letter-spacing:-0.01em;margin-top:18px">Zorgverzekeraar</b>'
            f'<span class="k" style="font-size:30px">Vervalt 24 nov</span>'
            f'<div class="skel" style="width:70%;height:30px;border-radius:8px;margin-top:30px"></div></div>'
            f'<div style="display:grid;grid-template-columns:repeat(5,58px);gap:16px">{grid}</div></div>')
    return simple("Zet de<br>agenda aan", card, "Met één tik staan je<br>vervaldatums in je agenda.")


def k5():
    badge = (f'<div style="position:absolute;right:-12px;top:-56px;border-radius:50%;background:#fff;padding:10px;'
             f'box-shadow:0 12px 30px rgba(0,20,120,.28)">{check(116, C["blueMid"])}</div>')
    card = (f'<div class="scard" style="width:880px;padding:44px 48px">{badge}'
            f'<div style="display:flex;align-items:center;gap:26px">{glyph("bb", 100)}'
            f'<div style="display:flex;flex-direction:column;gap:6px"><b style="font-size:38px;font-weight:600;'
            f'letter-spacing:-0.01em">Betaalbuddy</b><span class="k" style="font-size:31px">Genoteerd: proefmail</span>'
            f'</div></div><div class="rule"></div>'
            f'<div style="display:flex;gap:18px"><span class="chip2">€ 1,00</span><span class="chip2">Vervalt 13 nov</span></div>'
            f'</div>')
    return simple("Doe één test", card, "Krijg je een mail terug<br>met bedrag en datum?<br>Dan let Buddy op.")


# (serie, nummer, slug, functie). Bestandsnaam: renders/BB-Story-<serie>-<nummer>-<slug>.png
STORIES = [
    ("Instellen", "00", "highlight-cover", s00), ("Instellen", "01", "intro", s01),
    ("Instellen", "02", "stap-1-adres", s02), ("Instellen", "03", "stap-2-plakken", s03),
    ("Instellen", "04", "stap-3-doorsturen", s04), ("Instellen", "05", "stap-4-agenda", s05),
    ("Instellen", "06", "stap-5-test", s06), ("Instellen", "07", "klaar", s07),
    ("Simpel", "01", "zo-stel-je-buddy-in", k1), ("Simpel", "02", "stuur-een-mailtje", k2),
    ("Simpel", "03", "stuur-je-rekening-door", k3), ("Simpel", "04", "zet-de-agenda-aan", k4),
    ("Simpel", "05", "doe-een-test", k5),
]


def main():
    # Zonder argumenten: alles. "simpel" bouwt een hele serie, "simpel-03" één story, "03" dat nummer in elke serie.
    want = {a.lower() for a in sys.argv[1:]}
    SRC.mkdir(exist_ok=True)
    OUT.mkdir(exist_ok=True)
    launch = {"args": ["--allow-file-access-from-files"]}
    if os.environ.get("CHROME_PATH"):
        launch["executable_path"] = os.environ["CHROME_PATH"]
    with sync_playwright() as pw:
        br = pw.chromium.launch(**launch)
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for series, num, slug, fn in STORIES:
            s = series.lower()
            if want and not want & {s, num, f"{s}-{num}"}:
                continue
            f = SRC / f"{s}-{num}-{slug}.html"
            f.write_text(fn(), encoding="utf-8")
            pg.goto(f.as_uri())
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(250)
            png = OUT / f"BB-Story-{series}-{num}-{slug}.png"
            pg.screenshot(path=str(png), clip={"x": 0, "y": 0, "width": W, "height": H})
            bottom = pg.evaluate(MEASURE)
            warn = f"  LET OP: inhoud loopt tot y {bottom}, maximaal {SAFE_BOTTOM}" if bottom > SAFE_BOTTOM else ""
            print("ok", png.name, f"(onderkant {bottom})" if bottom else "", warn)
        br.close()


if __name__ == "__main__":
    main()
