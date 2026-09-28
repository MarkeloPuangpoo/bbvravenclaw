<!--
Ravenclaw / Blue House Sports Day
Visual implementation specification

This file is intentionally opinionated.
AGENTS.md remains the product / narrative source of truth.
This file controls visual execution, composition, motion, responsive behavior,
and how the KMITL Expo reference is translated without cloning it.
-->

# design.md — Ravenclaw / Blue House Sports Day

Read `AGENTS.md` first.

This document is the visual implementation specification for the project.

The target is **not** “a Harry Potter website.”
The target is:

> **RAVENCLAW — THE HOUSE OF MINDS**
> An ancient academic society × astronomical observatory × competitive sports culture × contemporary editorial design.

The site must feel designed as a sequence of art-directed scenes rather than assembled from reusable marketing sections.

The main public reference is:

https://expo.kmitl.ac.th/en

Use it for **quality, pacing, art direction, scene changes, typography scale, and the relationship between spectacle and useful event information**.

Do not clone its artwork, palette, typography, exact layouts, or copy.

---

# 1. Creative target

## 1.1 Desired impression

Within the first 5–10 seconds, the site should communicate:

- this is Ravenclaw / Blue House;
- this is a school Sports Day campaign;
- the team has intelligence and prestige, not only “magic”;
- the website itself is part of the event identity;
- someone intentionally art-directed this page.

The site should feel:

- cinematic;
- editorial;
- prestigious;
- intelligent;
- slightly mysterious;
- youthful;
- competitive;
- custom-made;
- visually disciplined.

It should **not** feel:

- like a SaaS landing page;
- like a component-library demo;
- like a generic “wizard school” game;
- like a Harry Potter fan wiki;
- like an AI-generated landing page with blue gradients;
- like a portfolio template recoloured blue.

## 1.2 Core contrast

The design lives between two worlds:

### The Archive

Quiet, academic, mysterious.

- midnight;
- parchment;
- serif typography;
- thin rules;
- astronomy;
- annotated diagrams;
- engraved lines;
- negative space;
- bronze;
- restrained motion.

### The Arena

Loud, competitive, physical.

- stronger Raven blue;
- occasional electric blue;
- huge condensed / grotesk type;
- full-bleed portraits;
- cutout athletes;
- numbers;
- rapid crops;
- directional motion;
- scoreboard energy.

The story should deliberately move from **Archive → Arena → Archive**.

That arc is important.

---

# 2. Design hierarchy

When making a visual decision, prioritize in this order:

1. **Composition**
2. **Typography**
3. **Photography / central artifact**
4. **Motion**
5. **Graphic annotation**
6. UI chrome

Do not reverse this hierarchy.

A section should still look intentional with animation disabled.

Motion is an amplifier of composition, not a replacement for composition.

---

# 3. Design tokens

All component colours must resolve through semantic tokens.

Exact values may be tuned after final photography arrives.

```css
:root {
  --color-midnight: #050a18;
  --color-midnight-soft: #0a1124;
  --color-raven: #102a6b;
  --color-raven-deep: #0c2052;
  --color-electric: #246bfd;

  --color-moonlight: #dde9ff;
  --color-parchment: #eee9dc;
  --color-parchment-deep: #ddd5c5;
  --color-bronze: #a97942;

  --color-ink: #050a18;
  --color-ink-soft: rgba(5, 10, 24, 0.66);
  --color-ink-inverse: #dde9ff;
  --color-ink-inverse-soft: rgba(221, 233, 255, 0.68);

  --color-rule-dark: rgba(221, 233, 255, 0.18);
  --color-rule-light: rgba(5, 10, 24, 0.16);

  --color-focus-dark: #dde9ff;
  --color-focus-light: #102a6b;

  --font-display: "Cormorant Garamond", "Noto Serif Thai", Georgia, serif;
  --font-body: Geist, "IBM Plex Sans Thai", sans-serif;
  --font-label: Geist, "IBM Plex Sans Thai", sans-serif;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;

  --rule-thin: 1px;
  --radius-control: 2px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-cinema: cubic-bezier(0.76, 0, 0.24, 1);

  --dur-ui: 180ms;
  --dur-control: 240ms;
  --dur-scene: 700ms;
}
```

## 3.1 Colour behavior

Do not use the palette evenly.

Approximate visual weighting:

- 45% midnight / near-black navy;
- 25% parchment / moonlight;
- 20% Raven blue;
- 5% bronze;
- 5% electric blue or less.

Electric blue is a punctuation mark.

Bronze should behave like an archival material, not like a shiny luxury gradient.

Avoid broad blue gradients.

If a tonal transition is needed, prefer:

- solid surface changes;
- lighting falloff;
- transparent overlays;
- image-led colour;
- subtle radial darkness.

---

# 4. Typography system

Typography is one of the main visual assets.

## 4.1 Display typography

Use the display serif primarily for:

- RAVENCLAW;
- chapter statements;
- manifesto phrases;
- large editorial words;
- final statement.

Prefer upright serif over overly calligraphic or fantasy letterforms.

The display type should feel literary and monumental, not medieval-costume-like.

Desktop display sizes may reach:

```css
clamp(5rem, 13vw, 13rem)
```

or larger when the word is intentionally cropped.

Do not automatically constrain every heading to a neat content column.

## 4.2 Sans / label typography

Use the sans for:

- metadata;
- navigation;
- captions;
- time;
- scores;
- roles;
- schedule;
- UI;
- Thai body copy.

Metadata should often use:

- uppercase;
- small size;
- wider tracking;
- tabular numerals where useful.

Example:

```text
FIG. 04
HOUSE / BLUE
BBV SPORTS DAY / 2026
DD MON / HH:MM
```

## 4.3 Thai typography

Thai content must be treated as primary content, not fallback content.

Use a Thai-capable sans with carefully tested:

- line height;
- word wrapping;
- punctuation;
- numeral alignment;
- mixed Thai/English lines.

Do not force the Latin display serif onto long Thai paragraphs.

Use Noto Serif Thai for large Thai statements, featured names, and the manifesto. Pair it with Cormorant Garamond for Latin display text. Use IBM Plex Sans Thai for Thai body copy and practical information; pair it with Geist for Latin UI text. Allow taller line height around Thai display text so marks above and below the letters remain clear.

## 4.4 Alignment rule

Do not center-align all chapters.

Across the full page, use a deliberate mix:

- left anchored;
- right anchored;
- edge aligned;
- centered only for key ceremonial moments;
- text partially cropped by viewport;
- text behind images;
- text intersecting objects.

Every chapter needs its own compositional logic.

---

# 5. Grid and composition

## 5.1 Desktop grid

Use a 12-column editorial grid as a silent structure.

Recommended outer gutter:

```css
clamp(20px, 3vw, 56px)
```

Most scenes should intentionally break the apparent grid.

The grid is for alignment, not for making everything look orderly.

## 5.2 Vertical rhythm

Avoid equal section padding repeated across the whole page.

Some scenes should:

- occupy exactly one viewport;
- extend to 180–300vh because the scene evolves;
- become very quiet with large empty margins;
- cut immediately into the next visual state.

The page should feel edited, not mechanically spaced.

## 5.3 Layering

Preferred layer order:

1. environmental texture / diagram;
2. oversized typography;
3. main image / artifact;
4. factual text;
5. annotations;
6. navigation.

Do not create layers only because parallax is available.

---

# 6. Image language

## 6.1 General treatment

Photography should feel like magazine imagery.

Use:

- deliberate crops;
- real scale differences;
- full bleed;
- cutout people;
- negative space around subjects;
- captions;
- image sequencing.

Avoid:

- repeated equal cards;
- equal aspect ratio grids;
- rounded image tiles;
- generic hover zoom on every image.

Most photography should have square corners.

## 6.2 Portrait direction

Preferred source photography:

- neutral or controlled background;
- enough space around body;
- full-body + waist-up variants;
- strong pose;
- non-destructive original files.

Cutouts can overlap typography.

Names may sit:

- behind the body;
- at the edge of the image;
- vertically;
- partially off canvas.

## 6.3 Image texture

Do not globally crush photos under strong filters.

Possible treatments:

- subtle cooler grading;
- monochrome navy treatment for background layers;
- one-colour duotone for transitional states;
- original colour for hero/action moments.

Use grain sparingly.

---

# 7. Core graphic motifs

Use only a small set repeatedly enough to form identity.

Primary motifs:

- eagle geometry;
- constellation / star chart;
- academic diagram lines;
- registration marks;
- thin rules;
- figure labels;
- archival coordinates;
- feather shapes;
- page / chapter numbering.

The house star chart is fictional-but-plausible. Draw it as an archival instrument and a designed constellation; it carries no real coordinates, observation date, or scientific claim. The original SVG set lives in `public/assets/diagrams/`, with a subtle grain in `public/assets/textures/`. Use these assets as quiet layers behind the main typography and eagle, never as a full-page pattern.

Do not add:

- magic sparkles;
- potion bottles;
- wizard hats;
- wand cursors;
- floating candles;
- random runes;
- fantasy parchment borders.

The magic should come from atmosphere, intelligence, and motion—not theme-park props.

---

# 8. Scene choreography

This section is implementation-critical.

Codex should treat each chapter as a **designed scene**, not as a generic `<Section>` with different content.

---

## 8.0 Invitation

### First frame

Surface:
`midnight`

Composition:

- empty frame;
- one fine eagle / constellation line mark centered or slightly off-center;
- small `BBV · SPORTS DAY 2026`;
- `AN INVITATION HAS ARRIVED`.

No large logo wall.

### Motion

Total perceived duration:
~1.0–1.5s on first visit.

Sequence:

1. line mark draws / resolves;
2. copy appears by clip, not bounce;
3. frame opens or dissolves directly into Hero.

On return visit:

- skip loader or compress to near-immediate transition.

Reduced motion:

- show static frame briefly;
- no line animation required.

---

## 8.1 Hero — RAVENCLAW

### Visual target

This is the first “poster.”

The page should be screenshot-worthy before any scrolling.

### Composition

`100svh`

- `RAVENCLAW` occupies a very large percentage of the viewport;
- the eagle artifact interrupts the word;
- school name is small and factual;
- `WIT · LEARNING · WISDOM` sits away from the main title;
- a tiny scroll cue is allowed;
- no primary CTA button cluster.

Possible desktop arrangement:

```text
[ school / event metadata ]

RAVEN
      [ EAGLE ]
            CLAW

                   WIT · LEARNING · WISDOM

[ scroll ↓ ]
```

Do not literally use the ASCII layout; preserve its hierarchy.

### Scroll behavior

Target scroll distance:
~140–190vh.

During the first scroll:

- the eagle moves slightly toward or away from camera;
- the two halves / layers of `RAVENCLAW` separate;
- background diagram shifts at a slower rate;
- small metadata remains stable briefly, then exits;
- the scene reveals parchment underneath.

The transition should feel like passing through the title.

Avoid excessive 3D rotation.

If no excellent 3D eagle exists, use a high-resolution 2D transparent artifact with depth created through:

- scale;
- shadow/light;
- blur layers;
- occlusion;
- transform origin.

Weak 3D is worse than excellent 2D.

---

## 8.2 Sorting

### Surface

Parchment.

### Purpose

A sharp quiet contrast after the hero.

### Composition

Very little decoration.

Phrase 1:

`NOT EVERYONE BELONGS HERE.`

Then spatial pause.

Phrase 2:

`YOU DO.`

Then:

`RAVENCLAW`

The final word may be huge enough to leave the viewport edges.

Metadata should behave like museum labeling:

```text
HOUSE / BLUE
ELEMENT / AIR
VALUES / WIT · WISDOM · CREATIVITY
```

### Motion

Use simple masks and text replacement.

Do not turn this into a quiz, sorting hat animation, or interactive Hogwarts gimmick.

---

## 8.3 Manifesto

### Surface

Return to midnight.

### Composition

A huge outline phrase sits in the environment.

Foreground Thai manifesto occupies only part of the viewport.

Suggested structure:

```text
03 / OUR HOUSE

WIT BEYOND
MEASURE

[ short Thai manifesto ]

BBV / BLUE HOUSE / 2026
```

The outline text may move slightly slower than the foreground.

Use space.

Do not add explanatory cards.

---

## 8.4 Eagle / Values

### Importance

This is the second major showcase scene.

### Scroll length

Desktop:
~240–320vh.

Mobile:
significantly shorter.

### Composition

A persistent eagle artifact occupies the center or one dominant side.

The scene changes around it.

Four values:

1. WISDOM
2. CREATIVITY
3. AMBITION
4. UNITY

Each value gets a distinct composition.

Do not merely swap one centered word for the next.

Example progression:

#### WISDOM

- dark;
- eagle close crop;
- constellation diagram;
- word aligned left.

#### CREATIVITY

- parchment flash / light surface;
- diagram expands;
- eagle shifts off-axis;
- word cuts across the frame.

#### AMBITION

- Raven blue;
- tighter crop;
- large vertical word / numeral;
- stronger directionality.

#### UNITY

- return to balanced midnight;
- object recenters;
- multiple line paths converge.

### Motion

One pinned scene.

Potential motion:

- eagle rotate 8–18 degrees total;
- subtle depth scale;
- lighting / overlay changes;
- text clip transitions;
- diagram paths progress;
- composition changes at distinct scroll thresholds.

Do not continuously spin the eagle.

Do not add a particle storm.

---

## 8.5 People / House leadership

### Goal

Make real students the subject of the site.

The current public composition has three fixed positions: president, vice president 1, and vice president 2. Each position receives its own editorial portrait scene. Additional admin records do not extend this sequence.

### President feature

The president gets a larger introduction than the rest.

Possible treatment:

- portrait remains an editorial focal point inside a restrained vertical frame, responsive to viewport height;
- name at architectural scale;
- role in tiny metadata;
- one quote;
- figure label;
- image overlaps name.

Do not place the president inside a profile card.

### Subsequent people

Allow variation.

One person may be:

- image left / name right;
- full-bleed background with text edge-aligned;
- cutout over giant surname;
- portrait cropped to half viewport.

Maintain shared typography and caption language without forcing identical templates.

### Transition

One portrait can cover / wipe / replace the prior portrait.

Limit expensive pinning.

The people section should feel like a fashion editorial spread turned into scroll.

On phones, place each person's role and name before the portrait. Keep the portrait smaller than the viewport width so names are visible immediately and never covered by imagery.

---

## 8.6 Cheerleaders

### Role in pacing

This is where the site becomes louder.

Feature one head of the Blue Stand in the public scene.

### Surface

Use Raven blue / electric accents.

Possible headline:

`MAKE SOME NOISE.`

### Composition

Use:

- full-body cutouts;
- huge names;
- directional type;
- off-canvas crops;
- repeated `RAVENCLAW` text as a typographic band;
- selective motion behind subjects.

Do not use:

- circular avatars;
- cards;
- bios for every person unless needed.

The first cheerleader composition should be immediately visually different from People.

---

## 8.7 Athletes

### Visual target

Sports editorial campaign.

Feature one head of sports in the public scene. The sport list remains independent of the person portrait.

For the current desktop composition, place a modest head portrait on the left and the sport list on the right within the same horizontal band. Keep the portrait around 220px wide at most. On phones, show the sport list first, then the small portrait and name.

Possible headline:

`FASTER / HIGHER / BLUE`

Use a stronger sans / grotesk visual voice here while preserving the site system.

### Sport transitions

A sport scene can include:

```text
07.01 / FOOTBALL
PLAYER / TEAM
MATCH / TIME
```

Use large numbers and sport labels.

Possible pinned sequence:

- sport title enters;
- image snaps / wipes into place;
- athlete name crosses image;
- next sport pushes the composition aside.

Do not create four same-size sport cards.

### Speed

Motion can become quicker here than in the archive scenes.

Still avoid frantic animation.

---

## 8.8 Games / Schedule

### Rule

Utility wins here.

The schedule must be readable quickly.

### Composition

Use giant date / day typography as visual anchor.

Example:

```text
DAY
01

08:00
OPENING CEREMONY

09:30
FOOTBALL

13:00
VOLLEYBALL
```

Use thin rules, strong numerals, and clear hierarchy.

No pinning required.

No decorative animation should delay reading.

If data is missing:

show a designed waiting state.

Never invent schedule data.

---

## 8.9 House Standing / Live Score

Only render this section when reliable data exists.

Development seed scores may be shown only in an explicitly marked demo preview. They must not be presented as live or official results on the public site.

### Visual language

Stadium scoreboard, not admin dashboard.

Use:

- very large rank numerals;
- team names;
- score;
- minimal separators;
- live indicator only if data is actually live.

Avoid:

- cards;
- mini charts;
- admin table styling.

Animation:

- score number can roll / interpolate;
- rank movement can animate;
- no confetti.

---

## 8.10 Moments

### Goal

Create a living photographic archive.

Use an editorial image sequence rather than a masonry-plugin look.

Possible rhythm:

1. one large landscape;
2. two smaller images with asymmetric gap;
3. one full viewport portrait;
4. one tiny archival detail;
5. another full bleed scene.

Captions:

```text
FIG. 014
BLUE STAND
DD MON YYYY / HH:MM
```

If real images do not exist yet:

show one strong waiting composition.

Do not fill with generic stock images.

---

## 8.11 Cheer Book

### Entry

Use one deliberate call to action:

`OPEN CHEER BOOK`

The button should not look like a SaaS pill.

Use:

- thin border;
- square geometry;
- typographic hover state;
- arrow movement.

### Open state

Prefer:

- full-screen editorial overlay;
- or dedicated route.

Organize content clearly:

- songs;
- chants;
- order;
- cue notes;
- dress code;
- meeting details.

Use larger type for chant lines.

Utility and readability are more important than cinematic effects here.

---

## 8.12 Venue Map

The map must be based on real school / event data.

Visual treatment:

- vector line drawing;
- minimal blocks;
- numbered labels;
- Raven blue / parchment;
- bronze highlight for active location.

Do not make up room / field positions.

The map should feel like an event programme illustration.

---

## 8.13 House Wall

Optional.

If implemented:

- treat messages as editorial fragments;
- vary placement modestly;
- avoid fake paper shadows and scrapbook clichés;
- maintain moderation and rate limiting.

Do not make this required for launch.

---

## 8.14 Final scene

### Emotional target

Calm confidence after the loud competition scenes.

Surface:
midnight.

Sequence:

`ONE HOUSE.`

then:

`ONE BLUE.`

then:

`RAVENCLAW.`

Use pauses created by scroll distance, not by forced time delays.

The eagle / emblem may return, smaller and calmer.

The last frame should feel like the back cover of the campaign.

---

## 8.15 Footer

Minimal.

Use:

- school name;
- event;
- Instagram;
- credits;
- photography;
- development.

Optional tiny Easter egg:

`MISCHIEF MANAGED.`

No corporate sitemap.

No rounded promotional banner.

---

# 9. Navigation

Desktop navigation is compact and edge-aligned.

Suggested:

```text
R / 26                           HOUSE  PEOPLE  GAMES  SCHEDULE  MOMENTS  MENU +
```

Rules:

- visually integrated into the scene;
- no thick blurred glass navbar;
- no giant pill container;
- hide on sustained downward scroll if useful;
- reappear on upward scroll;
- direct utility links must remain available;
- active chapter indication may use a thin line / index number.

Mobile:

- small mark + menu trigger;
- full-screen chapter menu is acceptable;
- menu composition must follow the site identity.

---

# 10. Motion system

Use GSAP + ScrollTrigger.

Use Lenis for smooth scrolling only if it remains stable across:

- anchor navigation;
- browser back/forward;
- reduced motion;
- mobile;
- route transitions.

## 10.1 Motion families

Approved:

- clip-path / mask reveals;
- controlled scale;
- slight rotation;
- parallax;
- pinned scene state changes;
- horizontal editorial movement;
- image wipes;
- object occlusion;
- typographic tracking changes;
- number transitions.

Avoid:

- bounce;
- springy app-like entrances;
- random floating motion;
- continuous rotation;
- repeated fade-up;
- hover animation on everything.

## 10.2 Motion intensity curve

The page should not be equally animated everywhere.

Use this pacing:

```text
Invitation      3/5
Hero            5/5
Sorting         2/5
Manifesto       2/5
Eagle/Values    5/5
People          3/5
Cheerleaders    4/5
Athletes        5/5
Schedule        1/5
Scores          2/5
Moments         3/5
Cheer Book      1/5
Map             1/5
Final           3/5
Footer          0/5
```

Quiet scenes are necessary to make spectacular scenes feel spectacular.

## 10.3 Reduced motion

At `prefers-reduced-motion: reduce`:

- disable Lenis smoothing;
- do not pin long narrative scenes;
- render scene states as normal document flow;
- disable large depth / scale travel;
- retain all content;
- allow a short opacity crossfade where helpful;
- target transitions ≤150ms.

---

# 11. Interaction details

## Links

Default editorial link:

- text;
- thin underline / rule;
- small directional arrow;
- no rounded container unless functionally needed.

## Buttons

Use buttons only for actual actions.

Geometry:

- square / nearly square;
- 0–4px radius;
- thin border;
- no soft shadow.

## Hover

Desktop hover may:

- invert surface;
- shift arrow;
- reveal caption;
- slightly change image crop;
- move underline.

Do not scale every card on hover.

## Cursor

Do not implement a custom cursor unless it provides a clear interaction benefit.

A decorative custom cursor is not required.

---

# 12. Anti-AI-slop visual gate

Reject an implementation if it contains several of the following:

- blue/purple radial gradient behind hero;
- glowing orb;
- frosted-glass navbar;
- 20–32px radius cards everywhere;
- “feature” cards;
- Lucide icon grids;
- centered headline/subtitle repeated every section;
- gradient text;
- floating magic particles;
- excessive star particles;
- rounded image cards;
- CTA pills;
- uniform section spacing;
- every element entering with opacity + y;
- fake 3D chrome text;
- generic serif + gradient + glass recipe;
- random texture overlays with no art direction;
- stock castle image;
- franchise screenshot used as a hero;
- decorative wand / wizard hat icons.

One accidental occurrence is not automatically wrong.
A repeated pattern is.

---

# 13. Responsive art direction

Mobile is a separate composition.

Do not simply scale desktop.

## 13.1 Mobile principles

Keep:

- oversized type;
- main image / artifact;
- chapter order;
- strong surface transitions;
- editorial labels;
- real photography.

Reduce:

- simultaneous parallax layers;
- long pinned scenes;
- 3D;
- oversized horizontal travel;
- text overlap that harms readability.

## 13.2 Mobile hero

Possible solution:

- split `RAVENCLAW` over 2–3 lines;
- eagle overlaps the center;
- school metadata sits at top edge;
- scroll cue stays small.

Do not shrink the desktop word until it fits neatly.

## 13.3 Breakpoint behavior

Test at minimum:

- 320px;
- 375px;
- 414px;
- 768px;
- 1024px;
- 1440px;
- 1728px.

Also test short-height laptop screens.

---

# 14. Performance budget

The premium feeling depends on responsiveness.

Prefer:

- AVIF/WebP;
- `next/image`;
- responsive `sizes`;
- lazy-loading below fold;
- transformed 2D image layers;
- SVG diagrams;
- one strong hero artifact.

Avoid:

- multiple simultaneous WebGL canvases;
- huge transparent PNGs;
- uncompressed video backgrounds;
- dozens of scroll listeners;
- layout-triggering animations.

If using Three.js:

- one scene;
- only where justified;
- cap DPR;
- pause when offscreen;
- dispose assets;
- mobile fallback available.

---

# 15. Accessibility

Required:

- semantic landmarks;
- keyboard navigation;
- skip link;
- visible focus;
- useful alt text;
- empty alt for decorative assets;
- correct heading order even if visual sizes vary;
- no hover-only essential content;
- no autoplay audio;
- reduced motion;
- readable schedule independent of animation.

Do not split screen-reader text into meaningless per-letter spans without preserving accessible text.

---

# 16. Content / asset dependencies

Final visual polish depends on real assets.

Use placeholders until approved assets exist.

## Critical assets

- original Blue House / Ravenclaw-inspired emblem;
- eagle hero artifact;
- president portrait;
- leadership portraits;
- cheerleader portraits / cutouts;
- athlete images;
- verified schedule;
- verified dates / times;
- sport list;
- school event map reference.

## Strongly recommended

- group photographs;
- cheer book content;
- Blue House manifesto;
- event-day photography;
- competition data;
- scoring workflow.

## Hero artifact recommendation

Before building Three.js, evaluate these in order:

1. excellent transparent 2D render;
2. layered 2D / pseudo-depth composition;
3. simple 3D model;
4. complex 3D only if the asset quality justifies it.

Do not make the whole project dependent on finding a perfect 3D eagle.

---

# 17. Placeholder behavior

Missing content must not cause the agent to invent production data.

Public People, Cheerleaders, and Athletes scenes should omit individual entries until published admin records exist. The shared person image may appear in development preview for seeded records, with a visible demo label. It must not imply that the pictured person is a BBV student. Approved eagle art remains a static, project-owned visual asset.

For imagery:

```tsx
{
  /* TODO(asset): approved president portrait
    preferred ratio: 4:5
    minimum: 2000px tall */
}
```

For schedule:

```text
SCHEDULE / AWAITING OFFICIAL PROGRAMME
```

For moments:

```text
MEMORIES LOADING…
```

For map:

```text
VENUE MAP / AWAITING VERIFIED SCHOOL PLAN
```

Do not use random final-looking data.

---

# 18. Component strategy

Reusable primitives are fine.

Reusable visual sameness is not.

Good reusable pieces:

- `EditorialLabel`
- `FigureCaption`
- `SectionIndex`
- `Rule`
- `SplitTextReveal`
- `MediaFigure`
- `ReducedMotion`
- `ScrollScene`
- `ChapterNav`

Avoid building the site around:

- `Card`;
- `FeatureCard`;
- `ProfileCard`;
- `SectionHeader`;
- `ThreeColumnGrid`.

Large sections should own their composition.

---

# 19. Prototype order

Before implementing every section, prototype the hardest visual moments.

## Prototype A — Hero

Prove:

- typography scale;
- eagle overlap;
- hero → sorting transition;
- desktop and mobile;
- reduced motion.

## Prototype B — Eagle / Values

Prove:

- pinning;
- four distinct states;
- artifact quality;
- scroll pacing;
- mobile fallback.

## Prototype C — People or Athlete transition

Prove:

- real-image handling;
- overlapping names;
- masking;
- image performance;
- responsive crop.

Only after these three feel intentional should the full page be expanded.

---

# 20. Visual QA checklist

Before calling the design complete, review the site without animation.

Ask:

- Does every chapter have a distinct composition?
- Is typography doing visual work?
- Is there enough negative space?
- Are photographs large enough?
- Does the site still feel Ravenclaw without Harry Potter artwork?
- Is bronze used deliberately?
- Is electric blue restrained?
- Are quiet sections actually quiet?
- Are utility sections fast to read?
- Is any section obviously a component template?
- Are there repeated centered blocks?
- Are cards being used as a reflex?
- Does mobile feel composed?
- Does the final scene feel like an ending?

Then review with motion.

Ask:

- Does every major motion have a reason?
- Is the hero memorable?
- Does the Eagle / Values scene progress meaningfully?
- Is the sports section more energetic than the manifesto?
- Is the schedule calmer than the athlete section?
- Are transitions connecting scenes instead of merely decorating them?
- Is scroll still comfortable?
- Is any animation competing with reading?
- Does reduced motion preserve the complete experience?

---

# 21. Definition of visual success

The site succeeds when a visitor could take screenshots of several different sections and they would look like pages from the same campaign, but **not like the same layout repeated**.

The final visual arc should feel like:

> **Invitation → Archive → Selection → Conviction → Artifact → People → Arena → Event → Memory → Unity**

The strongest identity should come from:

1. monumental editorial typography;
2. the original eagle / Blue House artifact;
3. real students;
4. controlled scene transitions;
5. Ravenclaw blue / parchment / bronze;
6. intelligent graphic annotation.

Not from:

- franchise imagery;
- generic magic effects;
- cards;
- gradients;
- UI decoration.

Final standard:

> **A Ravenclaw Sports Day campaign site that feels art-directed, cinematic and specific to BBV — not an AI template dressed in blue.**
