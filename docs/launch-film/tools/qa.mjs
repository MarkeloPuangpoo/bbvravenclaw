import { openFilm,openPage } from '/Users/macmarc/.agents/skills/motion-designer/scripts/cdp.mjs';
import { mkdirSync,writeFileSync } from 'node:fs';
import { resolve,join } from 'node:path';
import { pathToFileURL } from 'node:url';
const root=resolve('docs/launch-film/out/qa');mkdirSync(root,{recursive:true});
const {page}=await openFilm(resolve('docs/launch-film/src/index.html'));
const batches=[['overview-a',0,16,.5],['overview-b',16,32,.5],['hero-scroll',3.7,5.5,.05],['manifesto',9.7,11.3,.05],['eagle-entry',14.7,16.3,.05],['creativity',17.7,18.9,.05],['ambition',19.7,20.9,.05],['unity',21.7,22.9,.05],['laptop',23.5,28.2,.05],['return',30.2,32,.05]];
try{
 for(const [name,from,to,step] of batches.filter(b=>process.argv.length<3||process.argv.slice(2).includes(b[0]))){
  const dir=join(root,name);mkdirSync(dir,{recursive:true});
  const frames=[];
  for(let t=from;t<=to+.00001;t+=step){const time=+t.toFixed(3),file='t'+time.toFixed(3)+'.png';await page.evaluate(`seek(${time})`);writeFileSync(join(dir,file),await page.screenshot());frames.push({file,time});}
  const cols=6,w=320,h=204,rows=Math.ceil(frames.length/cols);
  const html=`<!doctype html><html><style>*{box-sizing:border-box}body{margin:0;background:#111827;color:#dde9ff;font:14px Arial}main{display:grid;grid-template-columns:repeat(${cols},${w}px)}figure{margin:0;height:${h}px}img{display:block;width:${w}px;height:180px}figcaption{padding:4px 8px}</style><main>${frames.map(f=>`<figure><img src="${name}/${f.file}"><figcaption>${name} / ${f.time.toFixed(2)}s</figcaption></figure>`).join('')}</main></html>`;
  const htmlPath=join(root,name+'.html');writeFileSync(htmlPath,html);
  const sheet=await openPage(pathToFileURL(htmlPath).href,{width:cols*w,height:rows*h});
  await sheet.evaluate('Promise.all([...document.images].map(i=>i.decode()))');writeFileSync(join(root,name+'.png'),await sheet.screenshot());await sheet.close();
  console.log(name+': '+frames.length+' frames reviewed in contact sheet');
 }
}finally{await page.close()}
