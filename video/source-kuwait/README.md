# Reels "Kuwait — العكس" (Haytham voiceover, Kuwaiti Arabic): source

**Script (voice):** "How can you pay for a website you haven't seen yet? With us it's the exact opposite. We build your whole site first, with your photos and services, and send it to you ready. If you like it, you pay; if not, you don't pay a single fils. The price? Only 149 KD, and the first year of hosting and domain is on us. NewWay Marketing World — hundreds of sites for companies in five countries. Message us now and have your site ready within days."

**Concept:** "العكس" (the opposite). One yellow dot carries the story across scenes: it becomes the pay button, the "شوف" card, the like button, the yellow price wipe, the logo, and the send button.

**Scenes:**
- **Hook:** a pay button gets tapped ("تم الدفع ✓") for a site that's still blurred, then an eye-slash and a big "؟".
- **The flip:** the step cards "١ ادفع → ٢ شوف" swap places along arcs. The screen inverts from dark to light, with a tape-rewind sound.
- **We build it first:** an Arabic site assembles itself from wireframes: a Kuwait Towers hero, gallery photos (dallah, mashrabiya, dhow) and service cards, plus a "نسويه أول" sticker.
- **Sent to you:** the site shrinks into a chat bubble ("موقعك جاهز"), then the camera dives into the preview.
- **Like it / don't:** swipe cards ("عجبني ✓" → "تدفع", "ما عجبني" → "0.000 د.ك").
- **Price:** a hanging tag on yellow with slot reels landing on 149, then a "بس!" sticker. Then "السنة الأولى", hosting (blinking LEDs), a domain being typed (yourbrand.com.kw), and a "علينا" ribbon.
- **NewWay sting**, then the portfolio wall (real client sites), then a dotted globe with 5 pins.
- **CTA:** typing "ابي موقع لمشروعي" and sending it, then a day 1→3 progress ring, then "جاهز".
- **End card:** "شوف موقعك أول / وادفع بعدين" with a "ارسل لنا رسالة" button.

**Captions:** one minimal line, revealed word by word (rise + blur-in). Keywords get a yellow highlight on light scenes, a black marker on yellow scenes, and yellow text on dark scenes. Word timings come from Whisper (sherpa-onnx, medium) phrase windows plus energy-dip snapping, then were corrected by hand (`words.py`).

**Audio (`mix.py`, all synthesized):**
- Music: a Hijaz-scale oud-like pluck (Karplus-Strong), 808 bass, a maqsum-style darbuka doum/tak, claps and hats. The grid is locked to the drop on "تماماً".
- Tape-stops before "العكس" and before the logo. The music ducks under the voice.
- About 120 sound effects keyed from the timeline (`window.SFX`).

**Build:**
```
npm i && python3 words.py
node render.js frames 0 1002          # 30 fps, 1080×1920
python3 mix.py                        # uses sfx.json written by render.js
ffmpeg -framerate 30 -i frames/f%05d.jpg -i final.wav -c:v libx264 -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -af loudnorm=I=-14:TP=-1 out.mp4
```
