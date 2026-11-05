# Reels "A conta" (motion, PT-BR voiceover 2): source

Final video: `../newway-reels-a-conta.mp4` (1080×1920, 30 fps, 36.6 s, −14 LUFS). It is built on the same engine as `../source-trabalha`; the shared helpers and caption engine are in `lib.js`.

**Script:** "Faz essa conta comigo. Um site profissional, você paga. Alguém para cuidar do seu Google, você paga. Um atendente aqui na Europa, você paga salário todo mês. São três contas para resolver um problema só: vender mais. A New Way junta tudo numa entrega: site profissional, Google Meu Negócio configurado e um atendente inteligente integrado no site, que atende, responde perguntas e filtra o cliente antes de levar ele para o seu WhatsApp. Quer ver quanto você economiza? Clica no botão aí embaixo. Três soluções, um pacote. Uma empresa cuidando. Clica no botão e fala com a gente."

**Storyboard:**
| Time | Visual |
|---|---|
| 0–10.4 | A receipt printer prints "SUA CONTA". Each item gets a hero card (a real client site, the Google manager with ticking tasks, an employee ID badge on a lanyard plus a calendar flipping JAN→DEZ). On each "você paga" a VOCÊ PAGA stamp lands, and the card drops into the bill. |
| 10.4–13.3 | The camera pulls back to show the whole bill: rows 01/02/03 highlight, and "TOTAL 3 CONTAS". A bracket joins them into "1 problema". |
| 13.3–14.4 | Kinetic "VENDER MAIS." over the blurred bill, with a growth line. |
| 14.4–16.9 | Yellow iris. A real CSS-3D NewWay box rises, the 3 solution tokens fly in, the flaps close, yellow tape goes on and a "1 ENTREGA" sticker is added. The camera zooms through. |
| 16.9–22.2 | "O pacote New Way": 3 cards (real site, Google Meu Negócio configuring 0→100 %, AI assistant). A dot travels from the assistant into the site ("integrado no site"). |
| 22.2–27.3 | One continuous downward camera move: site chat (atende/responde), then a funnel that filters clients (3 qualify), then WhatsApp with a "cliente qualificado" card and a notification. |
| 27.3–30.5 | The bill returns: the 3 costs are struck through, a "New Way · 1 pacote" row is added, and "você economiza" sits under a "?" scratch card. Chevrons point down to the button. |
| 30.5–32.4 | Yellow: a big "3 SOLUÇÕES" slot-rolls to "1 PACOTE", and the icons merge into a box. |
| 32.4–33.7 | Polaroids of Pedro & Gustavo ("Uma empresa cuidando"). |
| 33.7–36.6 | CTA: logo, a "Fala com a gente" button clicked by a cursor, Site/Google/IA chips and "1 pacote · 1 empresa". |

**Audio (`mix.py`):** original music at 112 bpm. Part A (the bills) is tense and minor, with clock-like 16th ticks and a staccato bass. A riser and a hit land on "vender mais", then Part B opens into a bright major groove on "A New Way junta tudo". Part C is a suspense breakdown on "quanto você economiza?", and the groove returns for the CTA. The SFX are a receipt printer, stamps, page flips, box flaps, tape and a thud, chat pops and a notification. The music is ducked under the voice, and the mix is −14 LUFS with a −1 dB true peak.

**Build:** the steps are the same as in `../source-trabalha/README.md`, with 1098 frames. Run `node render.js sfx`, then `python3 mix.py`, then `node render.js frames 0 1098` (split it into parallel ranges), then `python3 blend.py diff`, then `node render.js heavy i 4`, then `python3 blend.py merge`, and finally ffmpeg.
