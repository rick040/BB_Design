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


POSTS = [
    ("01", "op-jezelf", p01), ("02", "hoofd-geen-agenda", p02), ("03", "vergeten-kost-geld", p03),
    ("04", "betaal-ik-morgen", p04), ("05", "privacy-doorsturen", p05), ("06", "zeven-twee", p06),
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
            f = SRC / f"{num}-{slug}.html"
            f.write_text(fn(), encoding="utf-8")
            pg.goto(f.as_uri())
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(250)
            png = OUT / f"BB-Post-{num}-{slug}.png"
            pg.screenshot(path=str(png), clip={"x": 0, "y": 0, "width": W, "height": H})
            print("ok", png.name)
        br.close()


if __name__ == "__main__":
    main()
