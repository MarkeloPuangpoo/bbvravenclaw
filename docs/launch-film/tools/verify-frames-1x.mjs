import {openFilm} from '/Users/macmarc/.agents/skills/motion-designer/scripts/cdp.mjs';
import {resolve} from 'node:path';
import {writeFileSync,mkdirSync} from 'node:fs';
const dir=resolve('docs/launch-film/out/qa/comparison');mkdirSync(dir,{recursive:true});
const a=await openFilm(resolve('docs/launch-film/src/index.html'),{scale:1});
const b=await openFilm(resolve('docs/launch-film/dist/ravenclaw.html'),{scale:1});
try{
 const times=[0,7.3561666667,16.3115,24.6271666667,31.9833333333];
 for(const t of times){
  await a.page.evaluate(`seek(${t})`);await b.page.evaluate(`seek(${t})`);
  const x=await a.page.screenshot(),y=await b.page.screenshot();
  if(!x.equals(y)){writeFileSync(dir+'/source-'+t+'.png',x);writeFileSync(dir+'/dist-'+t+'.png',y)}
  console.log('source/dist at 2x',t,x.equals(y)?'PASS':'FAIL');
 }
 await a.page.evaluate('seek(0)');const first=await a.page.screenshot();
 await a.page.evaluate('seek(32)');console.log('loop at 2x',(await a.page.screenshot()).equals(first)?'PASS':'FAIL');
}finally{await a.page.close();await b.page.close()}
