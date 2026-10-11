import json,soundfile as sf,sherpa_onnx as so
M="../models/sherpa-onnx-zipformer-small-en-2023-06-26/"
rec=so.OfflineRecognizer.from_transducer(encoder=M+"encoder-epoch-99-avg-1.onnx",decoder=M+"decoder-epoch-99-avg-1.onnx",joiner=M+"joiner-epoch-99-avg-1.onnx",tokens=M+"tokens.txt",decoding_method="modified_beam_search")
a,sr=sf.read("voice16.wav",dtype="float32")
P=json.load(open("phrases.json"));W=[]
for s,e,txt in P:
    s0=max(0,s-0.15); st=rec.create_stream(); st.accept_waveform(sr,a[int(s0*sr):int(min(len(a)/sr,e+0.15)*sr)]); rec.decode_stream(st)
    r=st.result; cur=None
    for tok,ts in zip(r.tokens,r.timestamps):
        if tok.startswith(' ') or tok.startswith('▁') or cur is None:
            if cur: W.append(cur)
            cur={'w':tok.replace('▁','').strip(),'t':round(s0+ts,3),'ph':len([1 for x in P if x[0]<=s])-1}
        else: cur['w']+=tok
    if cur: W.append(cur)
    print(f"{s:6.2f} {r.text}")
json.dump(W,open("words_raw.json","w"),indent=0)
print(len(W))
