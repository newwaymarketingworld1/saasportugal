# Word timings: phrase windows come from silence detection, words inside a phrase
# are placed by character weight and snapped to nearby energy dips.
import json, numpy as np, soundfile as sf
P=[(0.00,1.50,"شلون تدفع حق موقع"),(1.74,2.94,"وانت للحين ما شفته؟"),(3.27,4.82,"عندنا العكس تماماً!"),
(5.10,7.09,"احنا نسوي موقعك كامل أول"),(7.27,8.69,"بصورك وخدماتك"),(8.89,10.03,"ونرسله لك جاهز"),
(10.41,11.09,"إذا عجبك"),(11.25,11.60,"تدفع"),(11.99,12.93,"وإذا ما عجبك"),(13.50,14.58,"ما تدفع ولا فلس"),
(15.02,15.54,"والسعر؟"),(15.86,17.88,"149 دينار بس"),(18.22,18.99,"والسنة الأولى"),(19.18,20.70,"استضافة ودومين علينا"),
(21.09,22.74,"نيو وي ماركتنج وورلد"),(23.04,25.91,"سوينا مئات المواقع لشركات في خمس دول"),
(26.39,27.65,"ارسل لنا رسالة الحين"),(28.09,30.24,"وخل موقعك يكون جاهز خلال أيام")]
a,sr=sf.read('voice16.wav'); h=sr//100
e=np.array([np.sqrt(np.mean(a[i:i+h]**2)) for i in range(0,len(a)-h,h)])
e=np.convolve(e,np.ones(3)/3,'same')
W=[]
for pi,(s,t,txt) in enumerate(P):
    ws=txt.split(); wt=np.array([len(w)+(4 if w.isdigit() else 0)+1.5 for w in ws],float)
    b=s+np.cumsum(wt)[:-1]/wt.sum()*(t-s); st=[s]
    for x in b:
        i0,i1=int((x-.12)*100),int((x+.12)*100); i=i0+int(np.argmin(e[i0:i1])); st.append(max(st[-1]+.12,i/100))
    for w,x in zip(ws,st): W.append({'w':w,'t':round(float(x),2),'p':pi})
json.dump({'phrases':[[s,t,x] for s,t,x in P],'words':W},open('words.json','w'),ensure_ascii=False,indent=0)
for w in W: print(w['p'],w['t'],w['w'])

# Hand corrections after re-transcribing from each word onward (see chk.py)
FIX={(0,2):.72,(0,3):.95,(1,3):2.52,(2,1):3.68,(3,2):5.85,(4,1):7.86,(5,1):9.36,(5,2):9.52,(8,2):12.5,(9,1):13.74,(9,2):13.93,
(11,1):17.0,(12,1):18.6,(13,1):19.8,(13,2):20.22,(14,3):22.3,(15,1):23.5,(15,2):23.95,(15,3):24.5,(16,3):27.25,(17,4):29.5,(17,5):29.82}
k={};
for w in W:
    i=k.get(w['p'],0); k[w['p']]=i+1
    if (w['p'],i) in FIX: w['t']=FIX[(w['p'],i)]
json.dump({'phrases':[[s,t,x] for s,t,x in P],'words':W},open('words.json','w'),ensure_ascii=False,indent=0)
open('words.js','w').write('window.WD='+json.dumps({'phrases':[[s,t,x] for s,t,x in P],'words':W},ensure_ascii=False)+';')
