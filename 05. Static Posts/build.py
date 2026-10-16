#!/usr/bin/env python3
"""Bouwt de statische Instagram-posts (1080x1350) van BetaalBuddy.

Elke post = één HTML-bestand in src/ (open het in je browser en pas tekst aan)
en één PNG in renders/. Alles staat in POSTS onderaan dit bestand.

Gebruik:
    python3 build.py              # alle posts
    python3 build.py 03 05        # alleen post 03 en 05
"""
import pathlib
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent
REPO = ROOT.parent
FONTS = REPO / "04. Animation" / "public" / "fonts"
SRC = ROOT / "src"
OUT = ROOT / "renders"
W, H = 1080, 1350

C = dict(
    blue="#013bff", blueMid="#2459fd", blueMascot="#0046e2", blueSoft="#b6c7ff",
    blueText="#99b1ff", light="#fafbff", grey="#e8edf2", greyText="#b1afb2",
    ink="#111114", yellow="#ffce31",
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


ICON_MID = "M104.96,76.78c-.49-2.19-1.16-4.31-2.54-6.12-3.27-4.3-7.62-6.11-12.98-5.58-11.82,1.16-23.63,2.31-35.45,3.46-4.86.48-9.72.95-14.58,1.44-5.95.6-10.92,5.27-11.97,11.21-.04.24-.1.47-.16.71-.01-1.06-.04-2.13-.04-3.19.01-8.22.03-16.45.04-24.67.63-3.31,2.05-6.17,4.62-8.42,2.77-2.43,6.02-3.6,9.67-3.41,2.86.15,5.7.55,8.55.83,3.58.35,7.16.7,10.74,1.05,3.31.32,6.61.64,9.92.96,3.55.34,7.1.69,10.65,1.03,3.4.33,6.79.7,10.19.98,6,.49,10.26,3.38,12.51,9.02.39.98.55,2.05.82,3.08.02,5.72.03,11.44.05,17.16,0,.15-.03.3-.05.45Z"
ICON_TOP = "M104.97,59.17c-.27-1.03-.43-2.1-.82-3.08-2.25-5.65-6.51-8.53-12.51-9.02-3.4-.28-6.8-.65-10.19-.98-3.55-.34-7.1-.69-10.65-1.03-3.31-.32-6.61-.64-9.92-.96-3.58-.35-7.16-.7-10.74-1.05-2.85-.28-5.7-.68-8.55-.83-3.65-.19-6.9.99-9.67,3.41-2.57,2.25-3.99,5.11-4.62,8.42.03-3.17-.24-6.34.42-9.49,1.04-4.92,3.48-9.02,7.22-12.34,4.15-3.68,9.01-5.66,14.58-5.67,11.17-.02,22.35-.04,33.52.01,5.41.03,10.1,2.03,14.17,5.54,2.98,2.56,5.19,5.69,6.46,9.38.71,2.08,1.14,4.33,1.26,6.53.2,3.71.05,7.45.04,11.17Z"
ICON_FRONT = "M104.96,76.78c-.49-2.19-1.16-4.31-2.54-6.12-3.27-4.3-7.62-6.11-12.98-5.58-11.82,1.16-23.63,2.31-35.45,3.46-4.86.48-9.72.95-14.58,1.44-5.95.6-10.92,5.27-11.97,11.21-.04.24-.1.47-.16.71.01.58,0,1.16.04,1.74,1,11.47,10.65,20.52,22.16,20.61,11.09.09,22.18.08,33.26,0,10.34-.08,19.36-7.46,21.68-17.54.76-3.29.56-6.62.52-9.94Z"
ICON_MARK = "M46.15,88.96c2.52-.46,3.84-2.09,4.46-4.41,2.76-.5,5.48,1.92,5.66,4.98.25,4.35-2.68,7.55-7.04,7.63-1.13.02-2.25.03-3.38.03-3.92,0-7.11-3.16-7.13-7.07-.01-2.71,0-5.42.02-8.13.02-1.84,1.04-3.01,2.84-3.5,2.08-.56,4.15-.68,6.16.27,2.15,1.02,2.53,2.95,2.44,5.03-.08,1.73-1.42,2.41-2.81,2.95-1.48.57-1.49.56-1.22,2.22Z"


def app_icon(size, circle=True):
    vb = "0 0 135 135" if circle else "27 27 81 81"
    c = f'<circle cx="67.5" cy="67.5" r="67.5" fill="{C["grey"]}"/>' if circle else ""
    return (f'<svg viewBox="{vb}" width="{size}" height="{size}" style="display:block;flex-shrink:0">{c}'
            f'<path d="{ICON_MID}" fill="{C["blueMid"]}"/><path d="{ICON_TOP}" fill="{C["blueSoft"]}"/>'
            f'<path d="{ICON_FRONT}" fill="{C["blue"]}"/><path d="{ICON_MARK}" fill="#fff"/></svg>')


def arrow(size, color="#111114"):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 40 40" style="display:block"><path d="M6 20h27M22 9l11 11-11 11" '
            f'fill="none" stroke="{color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def glyph(kind="doc", size=64):
    """Generieke afzender-icoon: grijze cirkel met een neutrale blauwe vorm (geen merklogo's)."""
    shapes = {
        "doc": '<rect x="27" y="22" width="26" height="34" rx="5" fill="#2459fd"/><rect x="32" y="30" width="16" height="3" rx="1.5" fill="#fff"/><rect x="32" y="37" width="16" height="3" rx="1.5" fill="#fff"/>',
        "home": '<path d="M40 22 22 38h6v18h24V38h6z" fill="#2459fd"/>',
        "bolt": '<path d="M44 20 28 42h10l-4 18 18-24H42z" fill="#2459fd"/>',
        "heart": '<path d="M40 58C20 44 24 26 34 26c4 0 6 2 6 5 0-3 2-5 6-5 10 0 14 18-6 32z" fill="#2459fd"/>',
        "phone": '<rect x="29" y="20" width="22" height="40" rx="6" fill="#2459fd"/><circle cx="40" cy="53" r="2.5" fill="#fff"/>',
        "warn": '<path d="M40 20 62 58H18z" fill="#ffce31"/><rect x="38" y="32" width="4" height="14" rx="2" fill="#111114"/><circle cx="40" cy="51" r="2.4" fill="#111114"/>',
        "mail": '<rect x="22" y="28" width="36" height="26" rx="5" fill="#2459fd"/><path d="M24 31l16 12 16-12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
        "check": '<circle cx="40" cy="40" r="19" fill="#2459fd"/><path d="M31 41l7 7 12-14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    }
    return (f'<svg viewBox="0 0 80 80" width="{size}" height="{size}" style="display:block;flex-shrink:0">'
            f'<circle cx="40" cy="40" r="40" fill="{C["grey"]}"/>{shapes[kind]}</svg>')


def bill(icon, title, sub, amount="", rot=0, dx=0, extra="", z=1):
    amt = f'<div class="amt">{amount}</div>' if amount else ""
    return (f'<div class="card bill" style="transform:translateX({dx}px) rotate({rot}deg);z-index:{z};{extra}">'
            f'{glyph(icon, 76)}<div class="bt"><b>{title}</b><span>{sub}</span></div>{amt}</div>')


def footer(dark):
    betaal = C["blueSoft"] if dark else C["blueSoft"]
    buddy_c = "#fff" if dark else C["blue"]
    return (f'<div class="foot"><div class="wm"><span style="color:{betaal}">betaal</span>'
            f'<span style="color:{buddy_c}">buddy</span></div>'
            f'<div class="chip">{app_icon(58, circle=False)}<span>Ontmoet je<br>buddy {arrow(26)}</span></div></div>')


CSS = f"""
@font-face {{ font-family:'Space Grotesk'; src:url('file://{FONTS}/SpaceGrotesk-Variable.woff2'); font-weight:300 700; }}
@font-face {{ font-family:'Geist'; src:url('file://{FONTS}/Geist-Variable.woff2'); font-weight:100 900; }}
* {{ box-sizing:border-box; margin:0; padding:0; }}
html,body {{ width:{W}px; height:{H}px; }}
.post {{ width:{W}px; height:{H}px; position:relative; overflow:hidden; font-family:'Space Grotesk',sans-serif; }}
.post.light {{ background:{C['light']}; color:{C['blue']}; }}
.post.dark {{ background:{C['blue']}; color:#fff; }}
h1 {{ position:absolute; left:70px; right:70px; top:96px; text-align:center; font-weight:500; font-size:112px;
      line-height:1.0; letter-spacing:-0.06em; }}
h1.s {{ font-size:98px; }}
.sub {{ position:absolute; left:90px; right:90px; text-align:center; font-weight:400; font-size:42px; line-height:1.2;
       letter-spacing:-0.02em; }}
.light .sub {{ color:#6b7fc9; }} .dark .sub {{ color:{C['blueText']}; }}
.card {{ background:#fffdff; border-radius:44px; box-shadow:0 18px 50px rgba(0,30,140,.16); font-family:'Geist',sans-serif; }}
.light .card {{ box-shadow:0 14px 40px rgba(1,59,255,.12); border:1px solid #e9eefb; }}
.bill {{ display:flex; align-items:center; gap:26px; height:124px; padding:0 40px 0 24px; position:relative; }}
.bill .bt {{ display:flex; flex-direction:column; gap:6px; flex:1; }}
.bill b {{ font-weight:600; font-size:36px; color:{C['ink']}; letter-spacing:-0.01em; }}
.bill span {{ font-weight:400; font-size:27px; color:{C['greyText']}; }}
.bill .amt {{ font-weight:600; font-size:38px; color:{C['ink']}; letter-spacing:-0.02em; }}
.abs {{ position:absolute; }}
.foot {{ position:absolute; left:60px; right:60px; bottom:58px; display:flex; justify-content:space-between; align-items:flex-end; }}
.wm {{ font-weight:700; font-size:64px; letter-spacing:-0.06em; line-height:1; }}
.chip {{ display:flex; align-items:center; gap:14px; background:#fff; border:1.5px solid {C['ink']}; border-radius:16px;
        padding:11px 22px 11px 14px; font-family:'Geist',sans-serif; font-size:23px; font-weight:500; color:{C['ink']}; line-height:1.2; }}
.chip span {{ display:flex; align-items:flex-end; gap:8px; }}
.pill {{ display:inline-flex; align-items:center; padding:0 34px; height:78px; border-radius:39px; font-family:'Geist',sans-serif;
        font-size:32px; font-weight:500; }}
.pill.out {{ border:2px solid rgba(255,255,255,.55); color:#fff; }}
.pill.solid {{ background:#fff; color:{C['blue']}; }}
.tag {{ font-family:'Geist',sans-serif; font-size:24px; font-weight:600; border-radius:999px; padding:8px 18px; }}
"""


def page(theme, body):
    return (f'<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>post</title><style>{CSS}</style></head>'
            f'<body><div class="post {theme}">{body}{footer(theme == "dark")}</div></body></html>')


# ---------- de posts ----------
def p01():
    rows = (bill("home", "Verhuurder", "vervalt 1 nov", "€875,00", -1.2, -10, z=4)
            + bill("bolt", "Energieleverancier", "vervalt 3 nov", "€128,95", 0.9, 12, z=3)
            + bill("heart", "Zorgverzekeraar", "vervalt 5 nov", "€138,00", -0.7, -6, z=2)
            + bill("phone", "Telefoonprovider", "vervalt 9 nov", "€24,99", 1.1, 8, z=1))
    return page("light", f'''
<h1>Net op jezelf. Ineens komt alles tegelijk.</h1>
<div class="abs" style="left:96px;right:96px;top:490px;display:flex;flex-direction:column;gap:18px">{rows}</div>
<div class="sub" style="top:1112px">Stuur ze door. Buddy houdt de data bij.</div>''')


def p02():
    chips = ""
    for txt, x, y, r in [("1 nov", 130, 560, -8), ("3 nov", 800, 520, 7), ("9 nov", 790, 800, -5)]:
        chips += (f'<div class="abs tag" style="left:{x}px;top:{y}px;transform:rotate({r}deg);background:{C["blueSoft"]};'
                  f'color:{C["blue"]};font-size:34px;padding:14px 28px">{txt}</div>')
    return page("dark", f'''
<h1>Je hoofd is geen agenda.</h1>
{chips}
<div class="abs" style="left:320px;top:470px">{buddy(440, blink=0.28)}</div>
<div class="sub" style="top:1060px">Stuur door. Buddy onthoudt de datum.</div>''')


def p03():
    a = bill("phone", "Telefoonprovider", "rekening van deze maand", "€24,99", -1, 0, extra="height:150px;", z=2)
    b = (f'<div class="card bill" style="height:170px;transform:rotate(1deg);border:2px solid {C["yellow"]}">'
         f'{glyph("warn", 82)}<div class="bt"><b>Aanmaning</b><span>kan oplopen met €40 incassokosten</span></div></div>')
    down = (f'<div style="width:84px;height:84px;border-radius:50%;background:{C["blueMid"]};display:flex;align-items:center;'
            f'justify-content:center;margin:0 auto;transform:rotate(90deg)">{arrow(40, "#fff")}</div>')
    return page("light", f'''
<h1 class="s">Een vergeten rekening kan uitlopen op €40.</h1>
<div class="abs" style="left:96px;right:96px;top:430px;display:flex;flex-direction:column;gap:36px">{a}{down}{b}</div>
<div class="sub" style="top:1000px;font-size:32px;color:#8a98d4">Incassokosten mogen pas na een veertiendagenbrief.</div>''')


def p04():
    return page("light", f'''
<h1>Ik: dat betaal ik morgen.</h1>
<div class="abs" style="left:340px;top:440px">{buddy(400, body=C["blue"], eye="#fff", look=(0.9, 0.2))}</div>
<div class="abs card" style="left:130px;top:930px;right:130px;height:120px;border-radius:60px;display:flex;align-items:center;justify-content:center;
     font-size:38px;font-weight:600;color:{C['ink']};letter-spacing:-0.01em">Buddy: ik zet 'm in je agenda.</div>
<div class="sub" style="top:1100px;font-size:38px">Stuur dit naar je huisgenoot.</div>''')


def p05():
    ghost = ""
    for i, (nm, y) in enumerate([("Nieuwsbrief", 480), ("Bestelling onderweg", 560), ("Uitnodiging", 640)]):
        ghost += (f'<div class="abs card bill" style="left:96px;right:96px;top:{y}px;height:88px;opacity:.22;filter:blur(3px);'
                  f'transform:scale({0.9 + i * 0.03})">{glyph("mail", 56)}<div class="bt"><b style="font-size:28px">{nm}</b></div></div>')
    return page("dark", f'''
<h1 class="s">Buddy leest alleen wat jij doorstuurt.</h1>
{ghost}
<div class="abs card bill" style="left:70px;right:70px;top:760px;height:150px;border-radius:75px;padding-left:30px">
  {glyph("check", 96)}<div class="bt"><b style="font-size:40px">Doorgestuurd</b><span style="font-size:30px">Energieleverancier · €128,95</span></div></div>
<div class="abs" style="left:0;right:0;top:985px;display:flex;justify-content:center;gap:22px">
  <div class="pill out">Geen app</div><div class="pill out">Geen bankkoppeling</div></div>''')


def p06():
    c1 = (f'<div class="card bill" style="height:150px;border-radius:75px;padding-left:30px;transform:rotate(-1deg)">{app_icon(96)}'
          f'<div class="bt"><b style="font-size:36px">Herinnering</b><span style="font-size:30px;color:#555">Energieleverancier · €128,95 vervalt over 7 dagen</span></div></div>')
    c2 = (f'<div class="card bill" style="height:150px;border-radius:75px;padding-left:30px;transform:rotate(1deg)">{app_icon(96)}'
          f'<div class="bt"><b style="font-size:36px">Herinnering</b><span style="font-size:30px;color:#555">Energieleverancier · €128,95 vervalt over 2 dagen</span></div></div>')
    return page("dark", f'''
<h1>7 dagen ervoor.<br>2 dagen ervoor.</h1>
<div class="abs" style="left:60px;right:60px;top:500px;display:flex;flex-direction:column;gap:34px">{c1}{c2}</div>
<div class="sub" style="top:1000px">Jij betaalt. Buddy herinnert.</div>''')


def pR01():
    """Illustratieve vertaling van fotoidee R01: lege kamer, matras op de vloer, dozen, telefoon aan de lader."""
    room = f'''<svg class="abs" style="left:90px;top:400px" width="900" height="620" viewBox="0 0 900 620">
  <rect width="900" height="620" rx="48" fill="#e8eeff"/>
  <path d="M0 470H900V572a48 48 0 0 1-48 48H48A48 48 0 0 1 0 572Z" fill="#cdd8ff"/>
  <rect x="70" y="70" width="210" height="250" rx="22" fill="#0026a8"/>
  <rect x="70" y="70" width="210" height="250" rx="22" fill="none" stroke="#fff" stroke-width="12"/>
  <path d="M175 70V320M70 195H280" stroke="#fff" stroke-width="8"/>
  <circle cx="225" cy="130" r="26" fill="#ffce31"/>
  <rect x="150" y="390" width="470" height="96" rx="22" fill="#013bff"/>
  <rect x="150" y="372" width="470" height="44" rx="20" fill="#b6c7ff"/>
  <rect x="168" y="352" width="120" height="48" rx="22" fill="#fff"/>
  <rect x="640" y="330" width="200" height="150" rx="14" fill="#b6c7ff"/>
  <rect x="640" y="330" width="200" height="30" rx="14" fill="#99b1ff"/>
  <rect x="725" y="330" width="30" height="150" fill="#fff" opacity=".75"/>
  <rect x="670" y="205" width="150" height="125" rx="12" fill="#99b1ff"/>
  <rect x="670" y="205" width="150" height="26" rx="12" fill="#7d9bff"/>
  <rect x="733" y="205" width="24" height="125" fill="#fff" opacity=".75"/>
  <rect x="690" y="500" width="150" height="14" rx="7" fill="#ffce31" opacity="0"/>
  <rect x="520" y="500" width="150" height="100" rx="12" fill="#ffce31"/>
  <rect x="520" y="500" width="150" height="24" rx="12" fill="#f0bb10"/>
  <circle cx="595" cy="560" r="28" fill="#fff" opacity=".85"/>
  <rect x="40" y="436" width="34" height="46" rx="8" fill="#fff"/><rect x="50" y="446" width="5" height="12" rx="2" fill="#111114"/><rect x="60" y="446" width="5" height="12" rx="2" fill="#111114"/>
  <path d="M57 482V520Q57 548 90 548H110" fill="none" stroke="#111114" stroke-width="5" stroke-linecap="round"/>
  <rect x="108" y="522" width="104" height="58" rx="12" fill="#111114"/>
  <rect x="116" y="530" width="88" height="42" rx="7" fill="#b6c7ff"/>
  <rect x="124" y="544" width="40" height="5" rx="2.5" fill="#fff"/><rect x="124" y="555" width="26" height="5" rx="2.5" fill="#fff"/>
</svg>'''
    return page("light", f'''
<h1 style="font-size:82px">Eerste nacht<br>in je eigen huis.<br>Morgen begint de post.</h1>
{room}
<div class="abs" style="left:455px;top:553px">{buddy(210, body=C["blue"], eye="#fff", blink=0.45, look=(0.6, 0.3))}</div>
<div class="sub" style="top:1070px">Stuur je eerste factuur door.<br>Buddy zet de datum in je agenda.</div>''')


def _key(color, rot):
    return (f'<g transform="rotate({rot} 450 150)"><circle cx="450" cy="210" r="56" fill="{color}"/>'
            f'<circle cx="450" cy="210" r="20" fill="{{bg}}"/><rect x="434" y="262" width="32" height="190" rx="12" fill="{color}"/>'
            f'<rect x="462" y="380" width="44" height="26" rx="8" fill="{color}"/><rect x="462" y="418" width="30" height="24" rx="8" fill="{color}"/></g>')


def pR02():
    keys = _key(C["blueSoft"], -30) + _key(C["yellow"], 30) + _key(C["blue"], 0)
    keys = keys.replace("{bg}", C["light"])
    svg = (f'<svg viewBox="0 0 900 500" width="900" height="500" style="display:block"><circle cx="450" cy="96" r="74" fill="none" '
           f'stroke="{C["ink"]}" stroke-width="16"/>{keys}</svg>')
    return page("light", f"""
<h1>Sleutels: binnen.</h1>
<div class="abs" style="left:90px;top:330px">{svg}</div>
<div class="sub" style="top:880px;font-size:46px;color:{C['blue']}">Verhuurder, energieleverancier,<br>gemeente, zorgverzekeraar:<br><b style="font-weight:600">komen nog.</b></div>""")


def pR04():
    def note(x, y, w, rot, color, lines=2, text=""):
        bars = "".join(f'<rect x="{x + 18}" y="{y + 22 + i * 22}" width="{w - 50 - i * 14}" height="8" rx="4" fill="#111114" opacity=".18"/>' for i in range(lines))
        return (f'<g transform="rotate({rot} {x + w / 2} {y + w / 2})"><rect x="{x}" y="{y}" width="{w}" height="{w}" rx="6" fill="{color}"/>{bars}{text}</g>')
    big = (f'<g transform="rotate(-4 450 300)"><rect x="300" y="220" width="300" height="260" rx="8" fill="{C["yellow"]}"/>'
           f'<text x="450" y="378" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="50" fill="{C["ink"]}" letter-spacing="-2">BETALEN!!!</text></g>')
    svg = (f'<svg viewBox="0 0 900 640" width="900" height="640" style="display:block">'
           f'<rect x="90" y="30" width="720" height="460" rx="30" fill="#0128c4"/><rect x="118" y="58" width="664" height="404" rx="14" fill="{C["blue"]}"/>'
           f'<path d="M20 490h860l-50 76c-6 10-14 14-26 14H96c-12 0-20-4-26-14z" fill="{C["blueSoft"]}"/><rect x="380" y="494" width="140" height="14" rx="7" fill="#fff"/>'
           + note(50, 70, 110, -9, "#fff") + note(740, 60, 110, 8, C["blueSoft"]) + note(30, 230, 120, 6, C["yellow"], 3)
           + note(750, 250, 120, -7, "#fff", 3) + note(60, 390, 110, -5, C["blueSoft"]) + note(730, 380, 110, 9, C["yellow"])
           + big + '</svg>')
    return page("light", f"""
<h1>Betalen. Wat?<br>Wanneer?</h1>
<div class="abs" style="left:90px;top:440px">{svg}</div>
<div class="sub" style="top:1100px">Geen idee meer.</div>""")


def pR18():
    dk = "#0128c4"
    svg = f"""
<svg viewBox="0 0 900 640" width="900" height="640" style="display:block">
  <circle cx="180" cy="110" r="70" fill="{C['yellow']}"/><circle cx="210" cy="90" r="64" fill="{C['blue']}"/>
  <rect x="0" y="470" width="900" height="30" fill="{dk}"/><rect x="0" y="500" width="900" height="140" fill="{dk}"/>
  <rect x="60" y="414" width="470" height="30" rx="10" fill="#fff"/><rect x="60" y="444" width="470" height="14" rx="7" fill="{C['blueSoft']}"/>
  <rect x="80" y="456" width="20" height="14" fill="#fff"/><rect x="490" y="456" width="20" height="14" fill="#fff"/>
  <rect x="640" y="30" width="14" height="40" fill="{C['blueSoft']}"/><circle cx="647" cy="30" r="12" fill="{C['blueSoft']}"/>
  <path d="M600 90 h94 l50 40 -34 40 -18 -14 v300 h-104 v-300 l-18 14 -34 -40z" fill="{C['yellow']}"/>
  <rect x="632" y="90" width="30" height="40" fill="{C['blue']}" opacity=".0"/>
  <path d="M647 94 v380" stroke="#e5b414" stroke-width="5"/>
  <circle cx="640" cy="260" r="7" fill="#e5b414"/><circle cx="640" cy="310" r="7" fill="#e5b414"/>
</svg>"""
    return page("dark", f"""
<h1 class="s">Werkdag klaar.<br>Hoofd ook.</h1>
<div class="abs" style="left:90px;top:410px">{svg}</div>
<div class="abs" style="left:250px;top:642px">{buddy(170, look=(-0.4, 0.2), blink=0.55)}</div>
<div class="sub" style="top:1060px;font-size:40px">Buddy onthoudt je betaaldata.<br>Jij hoeft het niet.</div>""")


def pR26():
    items = ["tandarts betalen&nbsp;<i>(later)</i>", "gemeente&nbsp;<i>(later)</i>", "energie&nbsp;<i>(later later)</i>", "die webshop&nbsp;<i>(wanneer was dat??)</i>"]
    lines = "".join(f'<div style="height:104px;border-bottom:3px solid {C["blueSoft"]};display:flex;align-items:flex-end;padding-bottom:14px;'
                    f'font-size:42px;font-weight:500;letter-spacing:-0.03em;white-space:nowrap;color:{C["ink"]}"><span style="color:{C["blue"]};margin-right:20px">&#9744;</span>{t}</div>'
                    for t in items)
    holes = "".join(f'<div class="abs" style="left:-18px;top:{50 + i * 100}px;width:36px;height:36px;border-radius:50%;background:{C["light"]};border:3px solid {C["blueSoft"]}"></div>' for i in range(5))
    check = (f'<div class="abs" style="left:700px;top:900px;width:120px;height:120px;border-radius:50%;background:{C["blue"]};display:flex;align-items:center;justify-content:center;'
             f'border:8px solid {C["light"]}"><svg width="64" height="64" viewBox="0 0 64 64"><path d="M14 34l13 13 24-28" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg></div>')
    return page("light", f"""
<h1 class="s">Mijn lijstje<br>'doe ik later'.</h1>
<div class="abs card" style="left:120px;right:140px;top:470px;height:520px;border-radius:30px;padding:36px 60px 0 70px;transform:rotate(-1.6deg)">{holes}{lines}</div>
<div class="abs" style="left:770px;top:945px">{buddy(190, body=C["blue"], eye="#fff", look=(-0.6, 0.1))}</div>
{check.replace('left:700px;top:900px', 'left:700px;top:935px')}""")


def pR32():
    def opt(letter, txt):
        return (f'<div class="card" style="width:420px;height:200px;border-radius:40px;display:flex;align-items:center;gap:26px;padding:0 30px;background:#fff">'
                f'<div style="width:100px;height:100px;border-radius:50%;background:{C["blue"]};color:#fff;font-size:58px;font-weight:600;display:flex;align-items:center;'
                f'justify-content:center;flex-shrink:0">{letter}</div><div style="font-size:40px;font-weight:600;color:{C["ink"]};letter-spacing:-0.02em;line-height:1.1">{txt}</div></div>')
    grid = (f'<div class="abs" style="left:90px;right:90px;top:440px;display:grid;grid-template-columns:420px 420px;gap:30px;justify-content:center">'
            + opt("A", "Zorgnota") + opt("B", "Gemeente") + opt("C", "Achteraf<br>betalen") + opt("D", "Die jaar&shy;factuur") + '</div>')
    return page("dark", f"""
<h1 class="s">Welke vergeet jij altijd?</h1>
{grid}
<div class="abs" style="left:120px;top:930px">{buddy(200, look=(0.7, -0.5))}</div>
<div class="abs" style="left:380px;top:980px;right:90px;font-size:46px;font-weight:500;letter-spacing:-0.04em;line-height:1.1;color:#fff">Zet je letter<br>in de reacties.</div>""")


def pR12():
    dk = "#0128c4"
    svg = f"""
<svg viewBox="0 0 900 640" width="900" height="640" style="display:block">
  <rect x="0" y="500" width="900" height="140" fill="{dk}"/>
  <rect x="470" y="130" width="400" height="270" rx="20" fill="{C['blueSoft']}"/><rect x="490" y="150" width="360" height="230" rx="10" fill="#0a1f8f"/>
  <path d="M440 400h460l-30 80c-3 8-9 12-18 12H488c-9 0-15-4-18-12z" fill="{C['blueText']}"/><rect x="620" y="404" width="100" height="10" rx="5" fill="#fff"/>
  <path d="M110 395 C 60 300 90 170 190 150 C 270 135 330 215 290 330" fill="none" stroke="{C['yellow']}" stroke-width="22" stroke-linecap="round"/>
  <rect x="150" y="330" width="40" height="34" rx="8" fill="#e5b414"/>
  <g transform="rotate(-6 200 420)"><rect x="70" y="360" width="260" height="160" rx="22" fill="#fff"/><rect x="70" y="360" width="260" height="38" rx="22" fill="{C['blueSoft']}"/>
  <circle cx="140" cy="450" r="30" fill="{C['grey']}"/><rect x="190" y="436" width="110" height="12" rx="6" fill="{C['grey']}"/><rect x="190" y="460" width="76" height="12" rx="6" fill="{C['grey']}"/></g>
</svg>"""
    return page("dark", f"""
<h1>Eerste vaste baan.</h1>
<div class="abs" style="left:90px;top:400px">{svg}</div>
<div class="abs" style="left:420px;top:790px">{buddy(150, look=(0.5, 0.3), blink=0.7)}</div>
<div class="sub" style="top:1060px;font-size:42px">Eerste eigen rekeningen.<br>Gefeliciteerd, echt.</div>"""
    )


# ---------- batch 3: minimaal, zonder geel ----------
def pR37():
    return page("dark", f"""
<h1 style="top:150px">Jij betaalt.<br>Buddy onthoudt.</h1>
<div class="abs" style="left:380px;top:600px">{buddy(320)}</div>
<div class="sub" style="top:1030px;font-size:36px">Geen toegang tot je bank.<br>Buddy betaalt nooit voor je.</div>""")


def pR41():
    plane = (f'<svg width="150" height="150" viewBox="0 0 150 150" style="display:block"><path d="M10 70 140 14 100 136 70 92z" fill="{C["blue"]}"/>'
             f'<path d="M70 92 140 14 52 80z" fill="{C["blueMid"]}"/><path d="M70 92 74 128 90 108z" fill="{C["blueSoft"]}"/></svg>')
    return page("light", f"""
<h1 style="font-size:60px;top:130px;letter-spacing:-0.04em">Stuur dit naar je huisgenoot<br>die altijd zegt:</h1>
<div class="abs" style="left:70px;right:70px;top:420px;text-align:center;font-size:128px;font-weight:500;letter-spacing:-0.06em;line-height:1.0;color:{C['blue']}">&lsquo;Ik betaal het vanavond.&rsquo;</div>
<div class="abs" style="left:300px;top:880px">{buddy(190, body=C["blue"], eye="#fff", look=(0.6, -0.3))}</div>
<div class="abs" style="left:520px;top:850px;transform:rotate(-8deg)">{plane}</div>""")


def pR35():
    names = ["Huur", "Zorg&hellip;", "Gemeente", "Webshop", "Energie"]
    tabs = "".join(f'<div style="flex:1;height:84px;background:{"#fff" if i == 2 else "#e6ecff"};border-radius:18px 18px 0 0;display:flex;align-items:center;'
                   f'justify-content:space-between;padding:0 12px;font-family:Geist,sans-serif;font-size:23px;font-weight:500;color:{C["ink"]}"><span>{n}</span>'
                   f'<span style="color:{C["greyText"]};font-size:20px">&#10005;</span></div>' for i, n in enumerate(names))
    return page("dark", f"""
<h1 class="s">Je hoofd heeft te veel tabbladen open.</h1>
<div class="abs" style="left:70px;right:70px;top:560px">
  <div style="display:flex;gap:6px;padding:0 10px">{tabs}</div>
  <div style="height:150px;background:#fff;border-radius:0 0 28px 28px;box-shadow:0 18px 50px rgba(0,30,140,.2)"></div></div>
<div class="abs" style="left:440px;top:835px">{buddy(190, look=(0, -0.6))}</div>
<div class="sub" style="top:1060px">Sluit er een paar.</div>""")


def pR28():
    apps = "".join(f'<div style="width:58px;height:58px;border-radius:16px;background:{C["blueSoft"]};opacity:{0.55 + (i % 3) * 0.15}"></div>' for i in range(16))
    phone = (f'<div class="abs" style="left:350px;top:420px;width:380px;height:640px;border-radius:64px;background:{C["blue"]};padding:20px">'
             f'<div style="width:100%;height:100%;border-radius:46px;background:#fff;padding:34px 26px;display:flex;flex-direction:column;gap:26px">'
             f'<div style="height:62px;border-radius:18px;background:{C["grey"]};display:flex;align-items:center;padding:0 18px;font-family:Geist,sans-serif;font-size:22px;font-weight:500;color:{C["ink"]}">Opslag bijna vol</div>'
             f'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;justify-items:center">{apps}</div></div></div>')
    return page("light", f"""
<h1>Geen app erbij.</h1>
{phone}
<div class="sub" style="top:1100px">Je mail is genoeg.</div>""")


def pR06():
    def bub(txt, side):
        mine = side == "r"
        bg = C["blue"] if mine else C["grey"]
        col = "#fff" if mine else C["ink"]
        al = "flex-end" if mine else "flex-start"
        br = "40px 40px 12px 40px" if mine else "40px 40px 40px 12px"
        return (f'<div style="display:flex;justify-content:{al}"><div style="max-width:720px;background:{bg};color:{col};border-radius:{br};padding:34px 44px;'
                f'font-family:Geist,sans-serif;font-size:46px;font-weight:500;letter-spacing:-0.02em;line-height:1.2">{txt}</div></div>')
    return page("dark", f"""
<h1 class="s" style="font-size:84px">Bij elk bezoek,<br>dezelfde vraag.</h1>
<div class="abs" style="left:90px;right:90px;top:470px;display:flex;flex-direction:column;gap:40px">
  <div style="display:flex;justify-content:flex-start"><div style="max-width:720px;background:#fff;color:{C['ink']};border-radius:40px 40px 40px 12px;padding:34px 44px;font-family:Geist,sans-serif;font-size:46px;font-weight:500;letter-spacing:-0.02em;line-height:1.2">Heb je dat al betaald?</div></div>
  <div style="display:flex;justify-content:flex-end"><div style="max-width:720px;background:{C['blueSoft']};color:{C['blue']};border-radius:40px 40px 12px 40px;padding:34px 44px;font-family:Geist,sans-serif;font-size:46px;font-weight:500;letter-spacing:-0.02em;line-height:1.2">Ja. Staat in mijn agenda.</div></div></div>
<div class="abs" style="left:140px;top:850px">{buddy(150, look=(0.5, 0), blink=0.8)}</div>""")


def pR14():
    return page("light", f"""
<h1>Factuur binnen?<br>Doorsturen.</h1>
<div class="abs card" style="left:90px;right:90px;top:480px;height:360px;border-radius:36px;padding:44px 50px;font-family:Geist,sans-serif">
  <div style="font-size:26px;color:{C['greyText']};font-weight:500">Aan</div>
  <div style="font-size:42px;font-weight:600;color:{C['ink']};letter-spacing:-0.02em;margin:6px 0 30px">jouwcode@in.betaalbuddy.nl</div>
  <div style="height:3px;background:{C['grey']};margin-bottom:30px"></div>
  <div style="font-size:26px;color:{C['greyText']};font-weight:500">Onderwerp</div>
  <div style="font-size:38px;font-weight:500;color:{C['ink']};margin-top:6px">Fwd: Factuur Energieleverancier</div></div>
<div class="abs" style="right:90px;top:880px"><div class="pill solid" style="background:{C['blue']};color:#fff;height:86px;padding:0 54px;font-size:34px">Verstuur</div></div>
<div class="sub" style="top:890px;left:90px;right:auto;text-align:left;font-size:50px;color:{C['blue']}">Dat is het.</div>""")


# ---------- batch 4: minimaal, zonder geel ----------
def _bubble(txt, bg, col, side, w=640):
    br = "40px 40px 40px 12px" if side == "l" else "40px 40px 12px 40px"
    al = "flex-start" if side == "l" else "flex-end"
    return (f'<div style="display:flex;justify-content:{al}"><div style="max-width:{w}px;background:{bg};color:{col};border-radius:{br};padding:32px 44px;'
            f'font-family:Geist,sans-serif;font-size:46px;font-weight:500;letter-spacing:-0.02em;line-height:1.2">{txt}</div></div>')


def pR05():
    phone = (f'<svg width="70" height="110" viewBox="0 0 70 110" style="display:block"><rect x="4" y="4" width="62" height="102" rx="14" fill="{C["blue"]}"/>'
             f'<rect x="12" y="14" width="46" height="70" rx="6" fill="{C["blueSoft"]}"/></svg>')
    return page("dark", f"""
<h1 style="font-size:76px">In elk huis is er<br>een rekening van niemand.</h1>
<div class="abs" style="left:90px;right:90px;top:430px;display:flex;flex-direction:column;gap:34px">
  {_bubble("Heb jij de energie betaald?", "#fff", C["ink"], "l")}
  {_bubble("Ik dacht jij.", C["blueSoft"], C["blue"], "r", 420)}</div>
<div class="abs" style="left:150px;top:830px">{buddy(190, look=(0.4, 0))}</div>
<div class="abs" style="left:330px;top:850px;transform:rotate(-10deg)">{phone}</div>
<div class="abs" style="left:740px;top:850px">{buddy(190, body=C["blueSoft"], blink=0.4, look=(-0.8, 0.6))}</div>""")


def pR20():
    panel = (f'<div class="abs" style="left:350px;top:400px;width:380px;height:520px;border-radius:44px;background:{C["blueSoft"]}"></div>'
             f'<div class="abs" style="left:450px;top:470px;width:180px;height:180px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center">'
             f'<div style="width:110px;height:110px;border-radius:50%;background:{C["blue"]}"></div></div>'
             f'<div class="abs" style="left:410px;top:730px;width:260px;height:110px;border-radius:14px;background:#fff;padding:26px 24px;transform:rotate(-1.5deg)">'
             f'<div style="height:14px;width:150px;border-radius:7px;background:{C["blue"]};margin-bottom:16px"></div>'
             f'<div style="height:12px;width:90px;border-radius:6px;background:{C["grey"]}"></div></div>')
    return page("light", f"""
<h1>Nieuw adres.</h1>
{panel}
<div class="abs" style="left:740px;top:790px">{buddy(150, body=C["blue"], eye="#fff", look=(-0.8, 0))}</div>
<div class="sub" style="top:980px;font-size:42px;color:{C['blue']}">Straks ook: je eerste aanslag<br>van de gemeente.</div>""")


def pR31():
    def field(label):
        return (f'<div style="height:96px;border-radius:20px;background:{C["grey"]};display:flex;align-items:center;justify-content:space-between;padding:0 30px;'
                f'font-family:Geist,sans-serif;font-size:36px;font-weight:500;color:{C["ink"]}"><span>{label}</span>'
                f'<span style="font-size:52px;color:{C["blue"]};font-weight:600">?</span></div>')
    return page("dark", f"""
<h1>Buddy gokt niet.</h1>
<div class="abs card" style="left:90px;right:350px;top:430px;border-radius:36px;padding:44px 40px;display:flex;flex-direction:column;gap:26px;width:640px">
  {field("Bedrag")}{field("Vervaldatum")}</div>
<div class="abs" style="left:780px;top:560px">{buddy(200, look=(-0.9, 0.2), style="transform:rotate(6deg)")}</div>
<div class="sub" style="top:870px;font-size:42px">Kan hij je factuur niet goed lezen?<br>Dan vraagt hij het jou.</div>""")


def pR36():
    names = [("bolt", "Energieleverancier"), ("heart", "Zorgverzekeraar"), ("home", "Verhuurder"), ("doc", "Gemeente")]
    cards = "".join(f'<div class="card bill" style="height:104px;border-radius:52px;padding-left:20px">{glyph(g, 66)}<div class="bt"><b style="font-size:32px">{n}</b>'
                    f'<span style="font-size:24px">Gelezen &middot; straks</span></div></div>' for g, n in names)
    return page("light", f"""
<h1 class="s">Allemaal gelezen.<br>Allemaal &lsquo;straks&rsquo;.</h1>
<div class="abs" style="left:90px;right:90px;top:430px;display:flex;flex-direction:column;gap:18px">{cards}</div>
<div class="abs" style="left:465px;top:960px">{buddy(150, body=C["blue"], eye="#fff")}</div>""")


def pR25():
    def panel(x, bg, label, inner):
        return (f'<div class="abs" style="left:{x}px;top:190px;width:460px;height:700px;border-radius:44px;background:{bg}">'
                f'<div style="padding:40px 36px 0;font-family:Geist,sans-serif;font-size:32px;font-weight:500;color:{C["ink"]};letter-spacing:-0.01em">{label}</div>{inner}</div>')
    left = (f'<div style="padding:30px 36px 0;font-size:56px;font-weight:500;letter-spacing:-0.05em;line-height:1.05;color:{C["blue"]}">&lsquo;Betaal ik later wel.&rsquo;</div>'
            f'<div class="abs" style="left:110px;top:380px">{buddy(240, body=C["blue"], eye="#fff", look=(0, -0.3))}</div>')
    stack = "".join(f'<div style="height:58px;border-radius:14px;background:#fff;margin:0 {10 + i * 8}px 10px;font-family:Geist,sans-serif;font-size:24px;font-weight:500;color:{C["ink"]};'
                    f'display:flex;align-items:center;padding:0 18px">Webshop &middot; betaalverzoek</div>' for i in range(3))
    right = (f'<div style="padding:26px 24px 0">{stack}</div>'
             f'<div class="abs" style="left:110px;top:400px">{buddy(240, body=C["blue"], eye="#fff", look=(-0.9, -0.6), style="transform:rotate(10deg)")}</div>')
    return page("dark", f"""
{panel(70, "#fff", "Ik bij het afrekenen:", left)}
{panel(550, C["blueSoft"], "Ik, later:", right)}
<div class="sub" style="top:960px;font-size:42px">Later is een prima moment.<br>Als je weet wanneer later is.</div>""")


def pR39():
    cells = ["Zelf zorgverzekering afgesloten", "Eerste aanslag van de gemeente", "Huisgenoot betaalt het betaalverzoek niet",
             "Mail van de verhuurder gemist", None, "&lsquo;Ik betaal het vanavond&rsquo; (niet gedaan)",
             "Jaarfactuur vergeten", "Ouders: &lsquo;Heb je dat al betaald?&rsquo;", "Nieuw adres, nieuwe rekeningen"]
    out = ""
    for c in cells:
        if c is None:
            out += f'<div style="background:{C["blue"]};border-radius:30px;display:flex;align-items:center;justify-content:center">{buddy(130)}</div>'
        else:
            out += (f'<div style="background:#fff;border:2px solid {C["blueSoft"]};border-radius:30px;display:flex;align-items:center;justify-content:center;text-align:center;'
                    f'padding:18px 22px;font-family:Geist,sans-serif;font-size:29px;font-weight:500;line-height:1.2;color:{C["ink"]};letter-spacing:-0.01em">{c}</div>')
    return page("light", f"""
<h1 style="font-size:74px;top:100px">Volwassen-worden-bingo.</h1>
<div class="sub" style="top:215px;font-size:42px;color:{C['blue']}">Hoeveel heb jij?</div>
<div class="abs" style="left:100px;right:100px;top:330px;height:760px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:20px">{out}</div>""")


# ---------- carrousels (meerdere slides per post) ----------
# Een postfunctie mag een lijst met HTML-strings teruggeven; dan wordt elke slide een eigen PNG (-s1, -s2, ...).
def pageC(theme, body, i, n, last=False, bg=None):
    dark = theme == "dark"
    on, off = ("#fff", "rgba(255,255,255,.35)") if dark else (C["blue"], C["blueSoft"])
    dots = "".join(f'<div style="width:{40 if k == i else 14}px;height:14px;border-radius:7px;background:{on if k == i else off}"></div>' for k in range(1, n + 1))
    bgs = f'background:{bg};' if bg else ""
    betaal = C["blueSoft"]
    buddy_c = "#fff" if dark else C["blue"]
    chip = (f'<div class="chip">{app_icon(58, circle=False)}<span>Ontmoet je<br>buddy {arrow(26)}</span></div>' if last else
            f'<div style="font-family:Geist,sans-serif;font-size:28px;font-weight:500;color:{on if dark else C["blue"]};opacity:.8;display:flex;align-items:center;gap:10px">Swipe {arrow(30, "#fff" if dark else C["blue"])}</div>')
    foot = (f'<div class="foot"><div class="wm"><span style="color:{betaal}">betaal</span><span style="color:{buddy_c}">buddy</span></div>{chip}</div>')
    return (f'<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>post</title><style>{CSS}</style></head>'
            f'<body><div class="post {theme}" style="{bgs}"><div class="abs" style="left:0;right:0;top:52px;display:flex;justify-content:center;gap:12px">{dots}</div>'
            f'{body}{foot}</div></body></html>')


def _t(txt, size=96, top=150, color=None, extra=""):
    col = f"color:{color};" if color else ""
    return (f'<div class="abs" style="left:70px;right:70px;top:{top}px;text-align:center;font-weight:500;font-size:{size}px;line-height:1.02;'
            f'letter-spacing:-0.06em;{col}{extra}">{txt}</div>')


def _s(txt, top, size=42, color=None):
    col = f"color:{color};" if color else ""
    return f'<div class="abs" style="left:90px;right:90px;top:{top}px;text-align:center;font-size:{size}px;line-height:1.2;letter-spacing:-0.02em;{col}">{txt}</div>'


def pR22():
    bg = "#e8eeff"
    n = 7
    def card(num, title, top, h=330):
        return (f'<div class="abs" style="left:90px;right:90px;top:{top}px;height:{h}px;border-radius:48px;background:{C["blue"]};color:#fff;display:flex;align-items:center;gap:44px;padding:0 56px">'
                f'<div style="font-size:150px;font-weight:500;letter-spacing:-0.06em;line-height:1">{num}</div>'
                f'<div style="font-size:60px;font-weight:500;letter-spacing:-0.04em;line-height:1.08">{title}</div></div>')
    sl = []
    sl.append(pageC("light", _t("Net op jezelf?<br>Deze 9 rekeningen<br>komen eraan.", 96, 150, C["blue"]) + f'<div class="abs" style="left:380px;top:640px">{buddy(320, body=C["blue"], eye="#fff")}</div>'
                    + _s("Bewaar deze.", 1070, 44, C["blue"]), 1, n, bg=bg))
    pairs = [[(1, "Huur"), (2, "Energie")], [(3, "Water"), (4, "Internet en tv")], [(5, "Zorgverzekering<br><span style='font-size:38px;font-weight:400;opacity:.8'>vanaf 18 jaar zelf</span>"), (6, "Telefoon")],
             [(7, "Gemeentelijke belastingen"), (8, "Waterschaps&shy;belasting")]]
    for k, pr in enumerate(pairs, start=2):
        sl.append(pageC("light", card(pr[0][0], pr[0][1], 305) + card(pr[1][0], pr[1][1], 685), k, n, bg=bg))
    sl.append(pageC("light", card(9, "Inboedel- en aansprakelijkheids&shy;verzekering", 330, 460) + f'<div class="abs" style="left:700px;top:880px">{buddy(180, body=C["blue"], eye="#fff", look=(-0.5, 0))}</div>', 6, n, bg=bg))
    sl.append(pageC("light", _t("Elke factuur die per mail komt: doorsturen.", 92, 160, C["blue"]) + f'<div class="abs" style="left:380px;top:640px">{buddy(320, body=C["blue"], eye="#fff")}</div>'
                    + _s("Buddy zet de datum in je agenda.", 1060, 44, C["blue"]), 7, n, last=True, bg=bg))
    return sl


def pR29():
    n = 5
    def step(num, lines, i, size=68, last=False, bx=100):
        return pageC("light", f'<div class="abs" style="left:0;right:0;top:170px;text-align:center;font-size:440px;font-weight:500;letter-spacing:-0.08em;line-height:1;color:{C["blue"]}">{num}</div>'
                     + _t(lines, size, 700, C["blue"], "font-weight:500;") + f'<div class="abs" style="left:{bx}px;top:1010px">{buddy(120, body=C["blue"], eye="#fff", look=(0.8, 0))}</div>', i, n, last=last)
    return [
        pageC("light", _t("Betaalbuddy<br>in 4 stappen.", 120, 200, C["blue"]) + f'<div class="abs" style="left:370px;top:620px">{buddy(340, body=C["blue"], eye="#fff")}</div>'
              + _s("Geen app. Geen account om in te loggen.<br>Geen bankkoppeling.", 1050, 36, "#6b7fc9"), 1, n),
        step(1, "Factuur in je mail.", 2, 84, bx=100),
        step(2, "Doorsturen naar<br><span style='font-size:50px'>jouwcode@in.betaalbuddy.nl</span>", 3, 76, bx=300),
        step(3, "Buddy leest bedrag en vervaldatum en zet het in je agenda.", 4, 56, bx=500),
        step(4, "Mail 7 dagen en 2 dagen vooraf. Betalen doe je zelf.", 5, 56, last=True, bx=700),
    ]


def pR15():
    n = 3
    cal = (f'<div class="abs card" style="left:90px;right:90px;top:430px;height:300px;border-radius:44px;display:flex;align-items:center;gap:40px;padding:0 50px;font-family:Geist,sans-serif">'
           f'<div style="width:150px;height:170px;border-radius:26px;background:{C["blue"]};color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center">'
           f'<div style="font-size:32px;font-weight:500;opacity:.8">nov</div><div style="font-size:80px;font-weight:600;line-height:1">20</div></div>'
           f'<div><div style="font-size:48px;font-weight:600;color:{C["ink"]};letter-spacing:-0.02em">Zorgverzekeraar &middot; betalen</div><div style="font-size:30px;color:{C["greyText"]};margin-top:10px">Agenda</div></div></div>')
    def mail(days):
        return (f'<div class="abs card" style="left:90px;right:90px;top:430px;height:300px;border-radius:44px;display:flex;align-items:center;gap:36px;padding:0 50px;font-family:Geist,sans-serif">'
                f'{app_icon(120)}<div><div style="font-size:46px;font-weight:600;color:{C["ink"]};letter-spacing:-0.02em">Herinnering: over {days} dagen</div>'
                f'<div style="font-size:30px;color:{C["greyText"]};margin-top:10px">Zorgverzekeraar &middot; vervalt {"20 nov" }</div></div></div>')
    return [
        pageC("dark", _t("Zo ziet het eruit.", 100, 170) + cal + _s("Zorgverzekeraar &middot; betalen", 800, 1, "transparent") + _t("In je agenda.", 70, 820, C["blueText"]) + f'<div class="abs" style="left:440px;top:960px">{buddy(150)}</div>', 1, n),
        pageC("dark", _t("7 dagen vooraf:<br>een mail.", 100, 150) + mail(7) + f'<div class="abs" style="left:440px;top:900px">{buddy(150, look=(0, 0.3))}</div>', 2, n),
        pageC("dark", _t("2 dagen vooraf:<br>nog één.", 100, 150) + mail(2) + _t("Betalen doe je zelf.", 56, 820, C["blueText"]) + f'<div class="abs" style="left:440px;top:930px">{buddy(150)}</div>', 3, n, last=True),
    ]


def pR30():
    n = 6
    def mock(inner, h=380):
        return f'<div class="abs card" style="left:90px;right:90px;top:600px;height:{h}px;border-radius:40px;padding:44px 50px;font-family:Geist,sans-serif">{inner}</div>' + f'<div class="abs" style="left:465px;top:1000px">{buddy(140)}</div>'
    def tag(k):
        return f'<div class="abs" style="left:0;right:0;top:130px;display:flex;justify-content:center"><div class="pill out" style="height:62px;font-size:28px">Stap {k}</div></div>'
    row = lambda t, on=False: (f'<div style="height:76px;border-radius:18px;display:flex;align-items:center;padding:0 24px;font-size:34px;font-weight:{600 if on else 500};'
                               f'background:{C["blueSoft"] if on else "transparent"};color:{C["blue"] if on else C["ink"]}">{t}</div>')
    chip = lambda t: f'<div style="padding:14px 26px;border-radius:30px;background:{C["grey"]};font-size:30px;font-weight:500;color:{C["ink"]}">{t}</div>'
    return [
        pageC("dark", _t("Nooit meer handmatig doorsturen.", 104, 170) + _s("Zo stel je het één keer in.", 640, 46, C["blueText"]) + f'<div class="abs" style="left:380px;top:780px">{buddy(320)}</div>', 1, n),
        pageC("dark", tag(1) + _t("Open de instellingen van je mail en zoek &lsquo;filters&rsquo; of &lsquo;regels&rsquo;.", 64, 230) + mock(row("Algemeen") + row("Filters en regels", True) + row("Account"), 330), 2, n),
        pageC("dark", tag(2) + _t("Maak een regel: afzender is je energie&shy;leverancier, zorg&shy;verzekeraar of verhuurder.", 60, 230)
              + mock('<div style="font-size:28px;color:' + C["greyText"] + ';margin-bottom:18px">Afzender is</div><div style="display:flex;flex-wrap:wrap;gap:16px">'
                     + chip("Energieleverancier") + chip("Zorgverzekeraar") + chip("Verhuurder") + '</div>', 300), 3, n),
        pageC("dark", tag(3) + _t("Actie: doorsturen naar jouwcode@in.betaalbuddy.nl.", 64, 230)
              + mock('<div style="font-size:28px;color:' + C["greyText"] + ';margin-bottom:14px">Doorsturen naar</div><div style="font-size:42px;font-weight:600;color:' + C["ink"] + ';letter-spacing:-0.02em">jouwcode@in.betaalbuddy.nl</div>', 240), 4, n),
        pageC("dark", tag(4) + _t("Opslaan. Klaar.", 110, 250) + f'<div class="abs" style="left:0;right:0;top:620px;display:flex;justify-content:center"><div class="pill solid" style="height:110px;padding:0 90px;font-size:44px">Opslaan</div></div>'
              + f'<div class="abs" style="left:440px;top:820px">{buddy(200)}</div>', 5, n),
        pageC("dark", _t("Lukt het niet bij jouw mailprovider?", 88, 190) + _s("Doorsturen met de hand werkt ook.", 540, 52, "#fff") + f'<div class="abs" style="left:380px;top:780px">{buddy(320)}</div>', 6, n, last=True),
    ]


def pR24():
    n = 6
    xs = [150, 400, 650, 900]
    def route(cur, y=466):
        out = f'<div class="abs" style="left:150px;width:750px;top:{y}px;height:10px;border-radius:5px;background:rgba(255,255,255,.35)"></div>'
        if cur:
            out += f'<div class="abs" style="left:150px;width:{xs[cur - 1] - 150}px;top:{y}px;height:10px;border-radius:5px;background:#fff"></div>'
        for k, x in enumerate(xs, start=1):
            done = cur and k <= cur
            rr = 34 if k == cur else 24
            out += (f'<div class="abs" style="left:{x - rr}px;top:{y + 5 - rr}px;width:{2 * rr}px;height:{2 * rr}px;border-radius:50%;background:{"#fff" if done else C["blue"]};'
                    f'border:8px solid {"#fff" if done else "rgba(255,255,255,.55)"}"></div>')
        bx = xs[max(cur, 1) - 1] - 60
        out += f'<div class="abs" style="left:{bx}px;top:{y - 196}px">{buddy(120)}</div>'
        return out
    def stop(k, label, txt, size=64):
        return pageC("dark", route(k, 560) + f'<div class="abs" style="left:90px;right:90px;top:720px;text-align:center"><div style="font-family:Geist,sans-serif;font-size:36px;font-weight:600;color:{C["blueText"]};margin-bottom:22px">{label}</div>'
                     f'<div style="font-size:{size}px;font-weight:500;letter-spacing:-0.045em;line-height:1.08">{txt}</div></div>', k + 1, n)
    return [
        pageC("dark", _t("Wat gebeurt er als een factuur blijft liggen?", 100, 150) + route(0, 800) + _s("De route.", 960, 46, C["blueText"]), 1, n),
        stop(1, "Halte 1", "De vervaldatum gaat voorbij."),
        stop(2, "Halte 2", "Herinnering of aanmaning."),
        stop(3, "Halte 3", "De veertiendagenbrief. Je krijgt nog 14 dagen zonder extra kosten.", 58),
        stop(4, "Halte 4", "Incassokosten. Bij kleine bedragen kan dat uitlopen op minimaal &euro;40.", 58),
        pageC("dark", route(1, 520) + _t("Uitstappen kan<br>bij halte 1.", 96, 690) + _s("Buddy mailt je 7 en 2 dagen vooraf.", 960, 46, C["blueText"]), 6, n, last=True),
    ]


def pR03():
    hand = C["blueSoft"]
    fingers = ""
    for x, top in [(250, 120), (345, 60), (440, 90), (535, 170)]:
        fingers += f'<rect x="{x}" y="{top}" width="88" height="{330 - top + 40}" rx="44" fill="{hand}"/>'
    def line(y, txt, rot, x=262):
        return (f'<g transform="rotate({rot} 440 {y})"><text x="{x}" y="{y}" font-family="Space Grotesk" font-weight="500" font-size="40" '
                f'letter-spacing="-1.5" fill="#0128c4">{txt}</text></g>')
    svg = (f'<svg viewBox="0 0 900 640" width="900" height="640" style="display:block">'
           f'<rect x="150" y="360" width="190" height="90" rx="45" fill="{hand}" transform="rotate(-32 245 405)"/>'
           f'{fingers}<rect x="250" y="300" width="373" height="120" fill="{hand}"/><rect x="230" y="250" width="420" height="340" rx="130" fill="{hand}"/>'
           + line(380, "tandarts betalen", -3) + line(450, "huur 28e?", 2, 300) + line(520, "gemeente??", -2, 285)
           + '</svg>')
    return page("light", f"""
<h1>Dit is geen<br>systeem.</h1>
<div class="abs" style="left:90px;top:380px">{svg}</div>
<div class="abs" style="left:800px;top:850px">{buddy(170, body=C["blue"], eye="#fff", look=(-0.8, -0.2))}</div>
<div class="sub" style="top:1060px">Stuur je factuur door.<br>Buddy zet de datum in je agenda.</div>""")


def pR07():
    kaart = (f'<div class="abs" style="left:200px;top:500px;width:420px;height:270px;background:#fff;border-radius:26px;transform:rotate(-4deg);'
             f'box-shadow:0 18px 50px rgba(0,30,140,.25);font-family:Geist,sans-serif;color:{C["ink"]};padding:34px 38px;opacity:.78">'
             f'<div style="font-size:24px;font-weight:600;color:{C["greyText"]};letter-spacing:.04em">AFSPRAAKKAARTJE</div>'
             f'<div style="font-size:46px;font-weight:600;margin-top:18px;letter-spacing:-0.02em">Tandarts</div>'
             f'<div style="font-size:34px;font-weight:400;margin-top:10px;color:#6b7280">dinsdag in juni, 14:30</div></div>'
             f'<div class="abs" style="left:376px;top:462px;width:68px;height:68px;border-radius:50%;background:{C["blueSoft"]};box-shadow:0 8px 20px rgba(0,30,140,.3)"></div>')
    nota = (f'<div class="abs card bill" style="left:430px;right:70px;top:770px;height:150px;border-radius:75px;padding-left:30px;transform:rotate(1.5deg)">'
            f'{glyph("heart", 96)}<div class="bt"><b style="font-size:38px">Tandarts</b><span style="font-size:28px">nota, weken later</span></div></div>')
    return page("dark", f"""
<h1 class="s" style="font-size:88px;top:90px">De afspraak was in juni.<br>De nota komt<br>wanneer hij komt.</h1>
{kaart}{nota}
<div class="abs" style="left:150px;top:790px">{buddy(170, look=(0.9, 0.1))}</div>
<div class="sub" style="top:1030px;font-size:36px">Stuur de nota door. Buddy onthoudt de datum.</div>""")


POSTS = [
    ("01", "op-jezelf", p01), ("02", "hoofd-geen-agenda", p02), ("03", "vergeten-kost-geld", p03),
    ("04", "betaal-ik-morgen", p04), ("05", "privacy-doorsturen", p05), ("06", "zeven-twee", p06),
    ("R01", "eerste-nacht", pR01),
    ("R02", "sleutels-binnen", pR02), ("R04", "post-it-laptop", pR04), ("R12", "badge-eerste-baan", pR12),
    ("R18", "laptop-dicht", pR18), ("R26", "lijstje-later", pR26), ("R32", "welke-vergeet-jij", pR32),
    ("R37", "jij-betaalt", pR37), ("R41", "huisgenoot-vanavond", pR41), ("R35", "te-veel-tabbladen", pR35),
    ("R28", "geen-app-erbij", pR28), ("R06", "zondag-ouders", pR06), ("R14", "doorsturen", pR14),
    ("R05", "keukentafel", pR05), ("R20", "naambordje", pR20), ("R31", "buddy-gokt-niet", pR31),
    ("R36", "lockscreen-straks", pR36), ("R25", "later-meme", pR25), ("R39", "bingo", pR39),
    ("R22", "negen-rekeningen", pR22), ("R29", "vier-stappen", pR29), ("R15", "staat-in-agenda", pR15),
    ("R30", "een-keer-instellen", pR30), ("R24", "metrolijn-incasso", pR24),
    ("R03", "geen-systeem", pR03),
    ("R07", "tandarts-nota", pR07),
]


def main():
    want = set(sys.argv[1:])
    SRC.mkdir(exist_ok=True)
    OUT.mkdir(exist_ok=True)
    with sync_playwright() as pw:
        br = pw.chromium.launch(args=["--allow-file-access-from-files"])
        pg = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for num, slug, fn in POSTS:
            if want and num not in want:
                continue
            res = fn()
            slides = res if isinstance(res, list) else [res]
            for k, html in enumerate(slides, start=1):
                sfx = f"-s{k}" if isinstance(res, list) else ""
                f = SRC / f"{num}-{slug}{sfx}.html"
                f.write_text(html, encoding="utf-8")
                pg.goto(f.as_uri())
                pg.evaluate("document.fonts.ready")
                pg.wait_for_timeout(250)
                png = OUT / f"BB-Post-{num}-{slug}{sfx}.png"
                pg.screenshot(path=str(png), clip={"x": 0, "y": 0, "width": W, "height": H})
                print("ok", png.name)
        br.close()


if __name__ == "__main__":
    main()
