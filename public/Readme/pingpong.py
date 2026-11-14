from PIL import Image

src = "C:/Users/tuknw/Downloads/Tuknwm/assets/CatRest.gif"
dst = "C:/Users/tuknw/Downloads/Tuknwm/assets/CatRest_pingpong.gif"

import os, tempfile
tmp = tempfile.mktemp(suffix=".gif")

img = Image.open(src)
frames = []
durations = []

try:
    while True:
        frames.append(img.copy().convert("RGBA"))
        durations.append(img.info.get("duration", 50))
        img.seek(img.tell() + 1)
except EOFError:
    pass

pingpong_frames = frames + frames[-2:0:-1]
pingpong_durations = durations + durations[-2:0:-1]

pingpong_frames[0].save(
    dst,
    save_all=True,
    append_images=pingpong_frames[1:],
    loop=0,
    duration=pingpong_durations,
    optimize=False
)

print(f"Done! Total frames: {len(pingpong_frames)} (was {len(frames)})")
