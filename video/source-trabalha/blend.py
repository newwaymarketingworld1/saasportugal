# blend.py diff  -> heavy.txt (frames whose 4 sub-samples differ a lot)
# blend.py merge -> frames/f#####.jpg (average 16 samples for heavy frames, 4 otherwise)
import sys,os,numpy as np
from PIL import Image
NF=936
def ld(p,small=False):
    im=Image.open(p)
    if small: im=im.resize((270,480))
    return np.asarray(im,dtype=np.float32)
if sys.argv[1]=='diff':
    H=[]
    for f in range(NF):
        a=ld(f'sub/s{f*4:06d}.jpg',1); b=ld(f'sub/s{f*4+3:06d}.jpg',1)
        d=np.abs(a-b).mean()
        if d>1.2: H.append(f)
    # include neighbours
    S=sorted(set(x for f in H for x in (f-1,f,f+1) if 0<=x<NF))
    open('heavy.txt','w').write(' '.join(map(str,S))); print(len(S),'heavy frames')
else:
    os.makedirs('frames',exist_ok=True)
    H=set(map(int,open('heavy.txt').read().split()))
    for f in range(NF):
        if f in H: ps=[f'sub16/f{f:05d}_{k:02d}.jpg' for k in range(16)]
        else: ps=[f'sub/s{f*4+k:06d}.jpg' for k in range(4)]
        acc=sum(ld(p) for p in ps)/len(ps)
        Image.fromarray(np.clip(acc+.5,0,255).astype(np.uint8)).save(f'frames/f{f:05d}.jpg',quality=95)
