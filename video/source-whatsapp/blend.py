# blend.py diff -> heavy.txt (frames that differ a lot from neighbours); blend.py merge -> frames/
import sys,os,numpy as np
from PIL import Image
NF=int(sys.argv[2]) if len(sys.argv)>2 else 3816
ld=lambda p,s=False:np.asarray(Image.open(p).resize((270,480)) if s else Image.open(p),dtype=np.float32)
if sys.argv[1]=='diff':
    prev=ld('sub/f00000.jpg',1);H=set()
    for f in range(1,NF):
        cur=ld(f'sub/f{f:05d}.jpg',1)
        if np.abs(cur-prev).mean()>2.2: H.update([f-1,f])
        prev=cur
    open('heavy.txt','w').write(' '.join(map(str,sorted(H))));print(len(H),'heavy')
else:
    os.makedirs('frames',exist_ok=True);H=set(map(int,open('heavy.txt').read().split()))
    for f in range(NF):
        if f in H:
            acc=sum(ld(f'sub10/f{f:05d}_{k}.jpg') for k in range(10))/10
            Image.fromarray(np.clip(acc+.5,0,255).astype(np.uint8)).save(f'frames/f{f:05d}.jpg',quality=95)
        else: os.link(f'sub/f{f:05d}.jpg',f'frames/f{f:05d}.jpg') if not os.path.exists(f'frames/f{f:05d}.jpg') else None
