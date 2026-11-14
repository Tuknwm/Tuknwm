import base64

img_path = "C:/Users/tuknw/Downloads/Tuknwm/assets/bgm.jpeg"
out_path = "C:/Users/tuknw/Downloads/Tuknwm/assets/about_bg.svg"

with open(img_path, "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

svg = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="900" height="400" viewBox="0 0 900 400">
  <image href="data:image/jpeg;base64,{b64}" x="0" y="0" width="900" height="400" preserveAspectRatio="xMidYMid slice"/>

  <rect x="0" y="0" width="900" height="400" fill="rgba(0,0,0,0.55)" rx="12"/>

  <text x="450" y="160" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="30" font-weight="bold" fill="#ffffff">Hello there stranger human! 👋</text>
  <text x="450" y="210" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="16" fill="#a78bfa">Informatics Engineering Student · Frontend Dev · Vibecoder</text>
  <text x="450" y="250" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="14" fill="#cccccc">Indonesia 🇮🇩 · Full Vibecoder Mode ON 🟣</text>
</svg>"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(svg)

print("Done! SVG created at:", out_path)
