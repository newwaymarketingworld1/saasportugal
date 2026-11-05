// node render.js sfx | stills t.. | frames <from> <to> (1 sample) | heavy <w> <nw> (10 samples on heavy.txt frames)
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const mode=process.argv[2];
 const b=await chromium.launch({args:['--allow-file-access-from-files','--disable-web-security']});
 const p=await b.newPage({viewport:{width:1080,height:1920}});
 p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
 await p.goto('file://'+__dirname+'/index.html');await p.evaluate(()=>window.ready);await p.waitForTimeout(300);
 const shot=async(t,f,path)=>{await p.evaluate(([t,f])=>{window.seek(Math.max(0,t),f);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>{window.seek(Math.max(0,t),f);requestAnimationFrame(r)})))},[t,f]);await p.screenshot({path,type:'jpeg',quality:93})};
 if(mode==='sfx'){fs.writeFileSync(__dirname+'/sfx.json',JSON.stringify(await p.evaluate(()=>window.SFX)))}
 else if(mode==='check'){const r=await p.evaluate(()=>window.checkMockups());console.log(JSON.stringify(r));console.log(r.every(x=>x.ok)?'ALL MOCKUPS OK':'MOCKUP PROBLEM')}
 else if(mode==='stills'){fs.mkdirSync(__dirname+'/stills',{recursive:true});for(const t of process.argv.slice(3).map(Number))await shot(t,Math.round(t*30),`${__dirname}/stills/t${t.toFixed(2)}.jpg`)}
 else if(mode==='frames'){fs.mkdirSync(__dirname+'/sub',{recursive:true});for(let f=+process.argv[3];f<+process.argv[4];f++){await shot(f/30,f,`${__dirname}/sub/f${String(f).padStart(5,'0')}.jpg`);if(f%300===0)console.log('frame',f)}}
 else if(mode==='heavy'){const K=10,SH=.5;fs.mkdirSync(__dirname+'/sub10',{recursive:true});const all=fs.readFileSync(__dirname+'/heavy.txt','utf8').trim().split(/\s+/).map(Number);const w=+process.argv[3],nw=+process.argv[4];
  for(const f of all.filter((_,i)=>i%nw===w))for(let k=0;k<K;k++)await shot((f+(k/K-.5*(K-1)/K)*SH)/30,f,`${__dirname}/sub10/f${String(f).padStart(5,'0')}_${k}.jpg`)}
 await b.close()})();
