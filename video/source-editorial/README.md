# Reels "Editorial" — source

Estilo editorial claro (papel off-white, preto, marca-texto #FFC400).

As filmagens dos sites são HDR (HLG/BT.2020) do iPhone e precisam de tonemapping para cores normais:

    ffmpeg -i site1.mov -an -vf "zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,crop=1080:610:0:720" -r 30 -q:v 2 v1/f%04d.jpg

Depois: `node render.js full` → `python3 mix.py` → ffmpeg. Duração 66 s.
