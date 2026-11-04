film({ W: 1920, H: 1080, FPS: 60, BPM: 120, BEATS: 64 });

const PAGES = ['house','sorting','manifesto','values','final'];
let UI;
let SITE_BODY;
const POINTER_KEYS = [
  {t:0,x:WIN.x+790,y:WIN.y+175},
  {t:B(47.4),x:WIN.x+1154,y:WIN.y+84,d:.6},
];

async function build(stage) {
  stage.innerHTML = `
    <div class="full" style="background:var(--bg)"></div>
    <div class="film-top"><span>RAVENCLAW / BLUE HOUSE</span><span>BBV · SPORTS DAY 2026</span></div>
    ${desktopMarkup(`<div class="website"><iframe data-k="site" title="Ravenclaw website" sandbox="allow-same-origin"></iframe></div>${browserBar('localhost:3000',{tabs:['Ravenclaw / Blue House']})}`,{name:'Browser',menu:['File','Edit','View','Window'],clock:'',dock:3,icon:`<img src="${ASSETS.img.mark}" style="width:100%;height:100%;object-fit:contain" alt="">`})}
    <div data-k="endCopy" class="end-copy"><div class="copy-mask"><span data-k="endLabel" class="end-label">RAVENCLAW / BLUE HOUSE</span></div><h1><span class="copy-mask"><span data-k="endTitle1">THE HOUSE</span></span><span class="copy-mask"><span data-k="endTitle2">OF <em>MINDS.</em></span></span></h1><div data-k="endRule" class="end-rule"></div><div class="copy-mask"><p data-k="endStatement">ONE HOUSE. ONE BLUE.</p></div><span data-k="endFollow" class="end-follow">FOLLOW THE HOUSE<br><strong>@bbv_ravenclaw_blue</strong></span></div>
    <div class="film-bottom"><span>WIT · LEARNING · WISDOM</span><span>BANGPAKONG “BOWONWITTAYAYON” SCHOOL</span></div>
    <div data-k="musicCredit" class="music-credit">Music: “Dreams Become Real” — Kevin MacLeod<br>incompetech.com · CC BY 4.0 · edited excerpt<br>creativecommons.org/licenses/by/4.0</div>`;
  collect(stage);
  $.desk.style.background='#102a6b'; $.deck.style.background='#9b9fa9';
  const loaded = new Promise(resolve=>$.site.onload=resolve);
  $.site.srcdoc=SITE_SNAPSHOT;
  await loaded;
  const d=$.site.contentDocument;
  await d.fonts.ready;
  await Promise.all([...d.images].map(i=>i.decode().catch(()=>{})));
  for (const image of d.images) image.decoding='sync';
  SITE_BODY=d.body.innerHTML;
  bindUI(d);
}

function bindUI(d){
  UI={d,pages:Object.fromEntries(PAGES.map(id=>[id,d.getElementById(id)])),
    first:d.querySelector('.hero__title span:first-child'),last:d.querySelector('.hero__title span:last-child'),
    eagle:d.querySelector('.hero__artifact'),states:[...d.querySelectorAll('.values__state')],
    art:d.querySelector('.values__art'),sortFirst:d.querySelector('.sorting__first'),sortTitle:d.querySelector('.sorting h2'),
    finalLines:[...d.querySelectorAll('.final-scene h2 span,.final-scene h2 strong')],
    nav:d.querySelector('.constellation-nav'),stars:[...d.querySelectorAll('.constellation-nav__chart g')]};
}

async function remount(){
  const d=$.site.contentDocument;
  d.body.innerHTML=SITE_BODY;
  bindUI(d);
  await Promise.all([...d.images].map(i=>i.decode().catch(()=>{})));
}

function scene(id,y,visible=true){
  const e=UI.pages[id];e.style.visibility=visible?'visible':'hidden';
  e.style.setProperty('top',y.toFixed(4)+'px','important');
}
function ink(a,b,p){return '#'+a.match(/\w\w/g).map((c,i)=>Math.round(lerp(parseInt(c,16),parseInt(b.match(/\w\w/g)[i],16),p)).toString(16).padStart(2,'0')).join('')}
function reveal(el,p){el.style.clipPath=`inset(${((1-p)*100).toFixed(3)}% 0 0 0)`;el.style.transform=`translateY(${((1-p)*18).toFixed(3)}px)`}

async function apply(t) {
  await remount();
  const back=prog(t,B(62),B(65)-B(62),E.smooth);
  const sorting=prog(t,B(9),1.3,E.smooth);
  const manifesto=prog(t,B(21),1,E.smooth);
  const values=prog(t,B(31),1,E.smooth);
  const ending=prog(t,B(49)+.12,.95,E.smooth);
  scene('house', t<B(62)?-730*sorting:-730*(1-back),t<B(12)||t>=B(62));
  scene('sorting',730*(1-sorting)-803*manifesto,t>=B(9)&&t<B(24));
  scene('manifesto',803*(1-manifesto)-730*values,t>=B(21)&&t<B(34));
  scene('values',730*(1-values)-730*ending,t>=B(31)&&t<B(52));
  scene('final',t<B(62)?730*(1-ending):730*back,t>=B(49)&&back<1);

  const separate=prog(t,B(7),1,E.smooth)*(1-back);
  UI.first.style.transform=`translate(${-14*separate}%,${-12*separate}%)`;
  UI.last.style.transform=`translate(${14*separate}%,${12*separate}%)`;
  UI.eagle.style.transform=`translateY(${-7*separate}%) scale(${1+.15*separate})`;
  const sortReveal=prog(t,B(12),.7,E.out);
  reveal(UI.sortFirst,prog(t,B(9),1,E.out));reveal(UI.sortTitle,sortReveal);
  UI.d.querySelector('.manifesto__outline').style.transform=`translateY(${lerp(-6,6,prog(t,B(21),6,E.linear))}%)`;

  const a=prog(t,B(37),.6,E.smooth), b=prog(t,B(41),.6,E.smooth), c=prog(t,B(45),.6,E.smooth);
  let bg=ink('050a18','eee9dc',a);if(b>0)bg=ink('eee9dc','102a6b',b);if(c>0)bg=ink('102a6b','050a18',c);
  UI.pages.values.style.backgroundColor=bg;
  UI.pages.values.style.color=ink('dde9ff','050a18',a-b);
  UI.art.style.opacity=(1-.7*(a-b)).toFixed(3);
  const x=28*a-48*b+20*c, scale=1+.16*b-.16*c,rot=3*a+3*b+4*c;
  UI.art.style.transform=`translate(${-50+x}%,-50%) rotate(${rot}deg) scale(${scale})`;
  UI.states.forEach((e,i)=>{
    const start=i?B(33+i*4):B(31);
    const enter=i?prog(t,start+.25,.35,E.out):1;
    const leave=i<3?prog(t,B(37+i*4),.2,E.in):0;
    e.style.clipPath=`inset(${((1-enter)*100).toFixed(3)}% 0 ${(leave*100).toFixed(3)}% 0)`;
    e.style.transform=`translateY(${((1-enter)*12-leave*12).toFixed(3)}%)`;
  });
  UI.finalLines.forEach((e,i)=>reveal(e,prog(t,B(51+i),.55,E.out)));

  const navProgress=t<B(49)?0:1-back;
  UI.nav.style.setProperty('--star-dash',String(navProgress*100));
  UI.stars.forEach((e,i)=>e.setAttribute('class',i===(navProgress>.5?5:0)?'constellation-nav__star--active':''));
  const pull=prog(t,B(49),3,E.smooth)*(1-back);
  const drift=.013*prog(t,B(2),2,E.smooth)*(1-prog(t,B(7),1,E.smooth));
  placeWorld(view(lerp(WIN.x+WIN.w/2,1184,pull),lerp(WIN.y+WIN.h/2,500,pull),lerp(1.16+drift,.7,pull)),{
    chrome:1,desk:pull,hw:prog(t,B(53),1.4,E.smooth)*(1-back),lid:1});
  placePointer(t,POINTER_KEYS,[B(49)],B(47),B(50.2));
  $.pointer.style.opacity=(prog(t,B(47),.2)*(1-prog(t,B(49.5),.3))).toFixed(3);
  show($.endCopy,t>=B(55));
  const out=prog(t,B(62),.3,E.in);
  [$.endLabel,$.endTitle1,$.endTitle2,$.endStatement,$.endFollow].forEach((el,i)=>reveal(el,prog(t,B(55+i*.45),.6,E.out)*(1-out)));
  $.endRule.style.transformOrigin='left';$.endRule.style.transform=`scaleX(${prog(t,B(57),.7,E.out)*(1-out)})`;
  $.musicCredit.style.opacity=(prog(t,B(55),.3)*(1-out)).toFixed(3);
}
