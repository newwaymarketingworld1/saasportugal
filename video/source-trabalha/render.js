// node render.js stills t1 t2 ...        -> stills/tX.jpg
// node render.js frames <from> <to> [sub] -> sub/s#####.jpg (sub-frames for motion blur, 4 per frame, 180° shutter)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const mode=process.argv[2];
 const b=await chromium.launch({args:['--allow-file-access-from-files','--disable-web-security']});
 const p=await b.newPage({viewport:{width:1080,height:1920}});
 p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
 await p.goto('file://'+__dirname+'/index.html');await p.evaluate(()=>window.ready);await p.waitForTimeout(300);
 if(mode==='sfx'){fs.writeFileSync(__dirname+'/sfx.json',JSON.stringify(await p.evaluate(()=>window.SFX)))}
 else if(mode==='stills'){
  fs.mkdirSync(__dirname+'/stills',{recursive:true});
  for(const t of process.argv.slice(3).map(Number)){await p.evaluate(([t])=>window.seek(t,Math.round(t*30)),[t]);await p.screenshot({path:`${__dirname}/stills/t${t.toFixed(2)}.jpg`,type:'jpeg',quality:80})}
 } else if(mode==='heavy'){
  const fps=30,K=16,SH=0.5; fs.mkdirSync(__dirname+'/sub16',{recursive:true});
  const all=fs.readFileSync(__dirname+'/heavy.txt','utf8').trim().split(/\s+/).map(Number);const w=+process.argv[3],nw=+process.argv[4];
  for(const f of all.filter((_,i)=>i%nw===w))for(let k=0;k<K;k++){
   const t=(f+(k/K-0.5*(K-1)/K)*SH)/fps;
   await p.evaluate(([t,f])=>window.seek(Math.max(0,t),f),[t,f]);
   await p.screenshot({path:`${__dirname}/sub16/f${String(f).padStart(5,'0')}_${String(k).padStart(2,'0')}.jpg`,type:'jpeg',quality:93});
  }
 } else {
  const fps=30,K=4,SH=0.5; fs.mkdirSync(__dirname+'/sub',{recursive:true});
  const from=+process.argv[3],to=+process.argv[4];
  for(let f=from;f<to;f++)for(let k=0;k<K;k++){
   const t=(f+(k/K-0.5*(K-1)/K)*SH)/fps;
   await p.evaluate(([t,f])=>window.seek(Math.max(0,t),f),[t,f]);
   await p.screenshot({path:`${__dirname}/sub/s${String(f*K+k).padStart(6,'0')}.jpg`,type:'jpeg',quality:93});
   if(k===0&&f%60===0)console.log('frame',f);
  }
 }
 await b.close()})();
