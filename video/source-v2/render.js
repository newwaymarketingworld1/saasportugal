const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const mode=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--allow-file-access-from-files','--disable-web-security']});
 const p=await b.newPage({viewport:{width:1080,height:1920}});
 p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
 await p.goto('file://'+process.cwd()+'/index.html');await p.evaluate(()=>window.ready);await p.waitForTimeout(300);
 if(mode==='stills'){
  const ts=process.argv.slice(3).map(Number);fs.mkdirSync('stills',{recursive:true});
  for(const t of ts){await p.evaluate(([t])=>window.seek(t,Math.round(t*30)),[t]);await p.screenshot({path:`stills/t${t.toFixed(2)}.jpg`,type:'jpeg',quality:80})}
 } else {
  const fps=30;const dur=await p.evaluate(()=>window.DUR);const N=Math.round(dur*fps);fs.mkdirSync('frames',{recursive:true});
  fs.writeFileSync('sfx.json',JSON.stringify(await p.evaluate(()=>window.SFX)));
  const from=+(process.argv[3]||0), to=+(process.argv[4]||N);
  for(let f=from;f<to;f++){await p.evaluate(([t,f])=>window.seek(t,f),[f/fps,f]);await p.screenshot({path:`frames/f${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:94});if(f%150===0)console.log('frame',f,'/',N)}
 }
 await b.close()})();
