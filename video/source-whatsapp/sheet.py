import sys,glob
from PIL import Image
fs=sys.argv[2:];out=sys.argv[1]
ims=[Image.open(f).resize((360,640)) for f in fs]
n=len(ims);cols=min(4,n);rows=(n+cols-1)//cols
g=Image.new('RGB',(cols*360+(cols-1)*8,rows*640+(rows-1)*8),'#f0f')
for i,im in enumerate(ims):g.paste(im,((i%cols)*368,(i//cols)*648))
g.save(out,quality=85)
