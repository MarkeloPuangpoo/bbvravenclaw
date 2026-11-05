import { openPage } from '/Users/macmarc/.agents/skills/motion-designer/scripts/cdp.mjs';
import { readFileSync,writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
const page = await openPage('http://localhost:3000',{width:1200,height:730,scale:1});
try {
  await page.evaluate('document.fonts.ready');
  await sleep(1800);
  const data = await page.evaluate(`(async()=>{
    const ids=['house','sorting','manifesto','values','final'];
    for(const id of ids){document.getElementById(id).querySelectorAll('img').forEach(i=>i.loading='eager')}
    await Promise.all(ids.flatMap(id=>[...document.getElementById(id).querySelectorAll('img')]).map(i=>i.decode().catch(()=>{})));
    const css=await Promise.all([...document.querySelectorAll('link[rel=stylesheet]')].map(async l=>({url:l.href,text:await(await fetch(l.href)).text()})));
    const sections=ids.map(id=>{
      const node=document.getElementById(id).cloneNode(true);
      node.removeAttribute('style');
      node.querySelectorAll('.hero__title span,.hero__artifact,.hero__school,.hero__index,.hero__values,.hero__scroll,.sorting__first,.sorting h2,.values__art,.values__state,.manifesto__outline,.final-scene h2 span,.final-scene h2 strong').forEach(e=>e.removeAttribute('style'));
      const original=[...document.getElementById(id).querySelectorAll('img')];
      node.querySelectorAll('img').forEach((i,n)=>{i.src=original[n].currentSrc||original[n].src;i.removeAttribute('srcset');i.removeAttribute('sizes');i.loading='eager'});
      return node.outerHTML;
    });
    return {htmlClass:document.documentElement.className,css,body:document.querySelector('.site-header').outerHTML+'<main>'+sections.join('')+'</main>'};
  })()`);
  const inline = async(url)=>{
    const r=await fetch(url);if(!r.ok)throw new Error('Asset '+r.status+' '+url);
    return 'data:'+r.headers.get('content-type').split(';')[0]+';base64,'+Buffer.from(await r.arrayBuffer()).toString('base64');
  };
  const cache=new Map();
  const asset=async(url)=>{if(!cache.has(url))cache.set(url,inline(url));return cache.get(url)};
  let css='';
  for(const item of data.css){
    let value=item.text.replace(/(?:transition|animation)(?:-[\w-]+)?\s*:[^;}]+;?/g,'');
    for(const match of [...value.matchAll(/url\(([^)]+)\)/g)]){
      const ref=match[1].replace(/^['"]|['"]$/g,'');
      if(ref.startsWith('data:'))continue;
      value=value.replaceAll(match[0],`url("${await asset(new URL(ref,item.url).href)}")`);
    }
    css+=value;
  }
  let html=data.body;
  for(const m of [...html.matchAll(/src="([^"]+)"/g)])html=html.replaceAll(m[0],`src="${await asset(new URL(m[1].replaceAll('&amp;','&'),'http://localhost:3000').href)}"`);
  const overrides=`html,body{width:1200px;height:730px;overflow:hidden;scroll-behavior:auto}main{position:absolute;inset:0}main>section{position:absolute!important;left:0!important;top:0!important;width:1200px!important;min-width:1200px!important;height:730px!important;min-height:730px!important;max-height:730px!important;margin:0!important;box-sizing:border-box!important;overflow:hidden!important;transform:none}#sorting{height:803px!important;min-height:803px!important;max-height:803px!important}.site-header{position:absolute!important}*{caret-color:transparent!important}a{pointer-events:none}.values__state{visibility:visible!important;opacity:1!important}.values__art{transform:translate(-50%,-50%)}.values__states{height:730px}.constellation-nav__label{display:none!important}`;
  const doc='<!doctype html><html lang="th" class="'+data.htmlClass+'"><head><meta charset="utf-8"><style>'+css+overrides+'</style></head><body>'+html+'</body></html>';
  writeFileSync('docs/launch-film/assets/site-snapshot.html',doc);
  const assetsPath='docs/launch-film/src/assets.js';
  let source=readFileSync(assetsPath,'utf8');
  source=source.split('\nwindow.SITE_SNAPSHOT =')[0].trimEnd();
  writeFileSync(assetsPath,source+'\nwindow.SITE_SNAPSHOT = '+JSON.stringify(doc)+';\n');
  console.log('Captured five real scene DOM trees, CSS and '+cache.size+' local assets. Snapshot '+(Buffer.byteLength(doc)/1e6).toFixed(1)+' MB. Browser errors: '+page.errors.length);
}finally{await page.close()}
