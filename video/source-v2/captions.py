import json,re
ph=json.load(open('phrases.json'))
fix={"At Newway Marketing World?":"At NewWay Marketing World,","Unique?":"unique,","Real Results":"real results.","And the best part":"And the best part?","and made by people.":"and made by people.","And today,":"And today,"}
HL=set("dollar finished. money first. newway differently. four 100 better. professional apart. real, real unique, people. ai copy-paste first. review changes. love remote websites, ads, social zero risk. results. message yours.".split())
words=[]
for s,e,t in ph:
    t=fix.get(t,t); t=t.replace("more than 100","more than 100+") if False else t
    ws=t.split(); w8=[len(w)+2 for w in ws]; tot=sum(w8); c=s
    for w,k in zip(ws,w8):
        d=(e-s)*k/tot; words.append([round(c,3),round(c+d,3),w]); c+=d
    words[-1].append('END')
chunks=[];cur=[]
for w in words:
    cur.append(w); txt=' '.join(x[2] for x in cur)
    if len(w)>3 or len(txt)>=16 or len(cur)>=4:
        chunks.append(cur);cur=[]
if cur: chunks.append(cur)
out=[]
for i,c in enumerate(chunks):
    t0=c[0][0]-0.06; t1=(chunks[i+1][0][0]-0.06) if i+1<len(chunks) else c[-1][1]+1.2
    if len(c[-1])>3: t1=min(t1,c[-1][1]+0.45)
    toks=[x[2] for x in c]
    out.append({'t0':round(t0,3),'t1':round(t1,3),'w':toks,'hl':[j for j,x in enumerate(toks) if x.lower().strip('?.,') in {h.strip('?.,') for h in HL} or x=='you.']})
json.dump(out,open('captions.json','w'))
for o in out: print(o['t0'],o['t1'],' '.join(o['w']),o['hl'])
