import { openPage } from '/Users/macmarc/.agents/skills/motion-designer/scripts/cdp.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
const out = new URL('../assets/captures/', import.meta.url);
mkdirSync(out, {recursive:true});
const page = await openPage('http://localhost:3000', {width:1200,height:730,scale:2});
try {
  await page.evaluate('document.fonts.ready');
  await sleep(1800);
  await page.evaluate(`Promise.all([...document.images].filter(i=>i.loading!=='lazy').map(i=>i.decode().catch(()=>{})))`);
  const meta = await page.evaluate(`({title:document.title, sections:[...document.querySelectorAll('main section[id]')].map(e=>({id:e.id,y:e.getBoundingClientRect().top+scrollY,h:e.offsetHeight})), fonts:[...document.fonts].map(f=>({family:f.family,status:f.status}))})`);
  console.log(JSON.stringify(meta));
  const capture = async(name,id,extra=0)=>{
    await page.evaluate(`window.scrollTo({top:${meta.sections.find(e=>e.id===id).y+extra},behavior:'instant'})`);
    await sleep(1800);
    await page.evaluate(`Promise.all([...document.images].filter(i=>i.getBoundingClientRect().bottom>0 && i.getBoundingClientRect().top<innerHeight).map(i=>i.decode().catch(()=>{})))`);
    writeFileSync(new URL(name+'.png',out),await page.screenshot());
    console.log('captured',name);
  };
  await capture('hero','house');
  await capture('sorting','sorting');
  await capture('manifesto','manifesto');
  await capture('wisdom','values');
  await capture('creativity','values',550);
  await capture('ambition','values',1050);
  await capture('unity','values',1590);
  await capture('final','final');
  writeFileSync(new URL('capture-metadata.json',out),JSON.stringify(meta,null,2));
  console.log('Browser errors:',page.errors);
} finally {await page.close();}
