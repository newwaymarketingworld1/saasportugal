# Reels "Real sites" — source

As filmagens dos sites (IMG_8029/8030.MOV) não estão no repositório. Para recriar os quadros:

    ffmpeg -i site1.mov -an -vf "crop=1080:610:0:720,eq=contrast=1.12:saturation=1.08:brightness=-0.02,unsharp=5:5:0.6" -r 30 -q:v 3 v1/f%04d.jpg

(o mesmo para site2 em v2/). Depois: `node render.js full` → `python3 mix.py` → ffmpeg. Duração 50,4 s.
