film({ W: 1920, H: 1080, FPS: 60, BPM: 120, BEATS: 64 });

// Concept composition study. The approved motion pass will replace the state cuts.
const SHOTS = [
  { t: B(1), image: 'hero' },
  { t: B(9), image: 'sorting' },
  { t: B(21), image: 'manifesto' },
  { t: B(33), image: 'wisdom' },
  { t: B(37), image: 'creativity' },
  { t: B(41), image: 'ambition' },
  { t: B(45), image: 'unity' },
  { t: B(57), image: 'final' },
];

function build(stage) {
  const captures = SHOTS.map(s=>`<img data-k="shot_${s.image}" class="capture" src="${ASSETS.img[s.image]}" alt="Ravenclaw website: ${s.image}">`).join('');
  const browser = `<div class="website">${captures}</div>${browserBar('localhost:3000', {tabs:['Ravenclaw / Blue House']})}`;
  stage.innerHTML = `
    <div class="full" style="background:var(--bg)"></div>
    <div class="film-top"><span>RAVENCLAW / BLUE HOUSE</span><span>BBV · SPORTS DAY 2026</span></div>
    ${desktopMarkup(browser,{name:'Browser',menu:['File','Edit','View','Window'],clock:'',dock:3,icon:`<img src="${ASSETS.img.mark}" style="width:100%;height:100%;object-fit:contain" alt="">`})}
    <div data-k="endCopy" class="end-copy"><span class="end-label">RAVENCLAW / BLUE HOUSE</span><h1>THE HOUSE<br>OF <em>MINDS.</em></h1><div class="end-rule"></div><p>ONE HOUSE. ONE BLUE.</p><span class="end-follow">FOLLOW THE HOUSE<br><strong>@bbv_ravenclaw_blue</strong></span></div>
    <div class="film-bottom"><span>WIT · LEARNING · WISDOM</span><span>BANGPAKONG “BOWONWITTAYAYON” SCHOOL</span></div>`;
  collect(stage);
  $.desk.style.background = '#102a6b';
  $.deck.style.background = '#9b9fa9';
}

function apply(t) {
  const current = t >= FILM.DURATION ? 0 : t;
  let shot = SHOTS[0];
  for (const candidate of SHOTS) if (current >= candidate.t) shot = candidate;
  for (const candidate of SHOTS) show($['shot_'+candidate.image],candidate===shot);
  const end = current >= B(57);
  const pull = prog(current,B(49),B(57)-B(49),E.smooth);
  const z = lerp(1.16,.7,pull);
  const cx = lerp(WIN.x+WIN.w/2,1184,pull);
  const cy = lerp(WIN.y+WIN.h/2,500,pull);
  placeWorld(view(cx,cy,z),{chrome:1,desk:pull,hw:prog(current,B(53),1.5,E.smooth),lid:1});
  show($.pointer,false);
  show($.endCopy,end);
}
