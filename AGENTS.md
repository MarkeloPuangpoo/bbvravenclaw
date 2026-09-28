<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Ravenclaw / Blue House Sports Day Website

## 0. Purpose of this file

This file is the primary product and creative handoff for the Ravenclaw / Blue House Sports Day website.

Any coding agent working in this repository should read this file before making architectural, UI, animation, content, or asset decisions.

The website is not intended to be a generic school landing page or a generic Harry Potter fan site. It should feel like a carefully art-directed event microsite with cinematic scroll storytelling.

A separate `design.md` will be created later using the Hallmark skill after studying:

https://expo.kmitl.ac.th/en

`design.md` should become the detailed visual implementation specification.

Priority when instructions conflict:

1. `AGENTS.md` — product concept, narrative, content structure, brand personality, anti-patterns, technical constraints.
2. `design.md` — detailed visual system, composition, layout, typography, spacing, animation treatment, component appearance.
3. Existing implementation.
4. Agent assumptions.

If `design.md` proposes something that breaks the core concept or anti-AI-slop rules in this file, preserve the intent of `AGENTS.md` and adapt the design rather than blindly following it.

Do not invent a conventional SaaS interface merely because a visual detail is unspecified.

---

# 1. Project identity

## RAVENCLAW — THE HOUSE OF MINDS

This website represents the Blue House for โรงเรียนบางปะกง "บวรวิทยายน" / Bangpakong "Bowonwittayayon" School Sports Day.

The overall school event theme is Harry Potter.

Blue House represents Ravenclaw.

The experience should reinterpret Ravenclaw through a modern, high-end event identity rather than reproduce the visual language of a movie fan page.

Core creative sentence:

> An ancient academic society × astronomical observatory × competitive sports culture × modern editorial design.

Desired emotional qualities:

- intelligent
- mysterious
- prestigious
- competitive
- youthful
- editorial
- cinematic
- slightly experimental
- confident
- crafted rather than templated

The website should feel like Ravenclaw hired a strong independent creative studio to design its Sports Day campaign.

---

# 2. Design reference and Hallmark workflow

The main interaction / quality reference is:

https://expo.kmitl.ac.th/en

The reason this site is a reference is not to clone its graphics.

Study its:

- scroll pacing
- cinematic section transitions
- art-directed compositions
- oversized typography
- use of visual objects as storytelling anchors
- section-to-section rhythm
- pinned scenes
- horizontal sequences
- image treatment
- typography choreography
- transition between dense and quiet scenes
- event-site information architecture
- relationship between spectacle and useful event information

Do not create a pixel clone of KMITL Expo.

Hallmark will be used separately to study the reference and generate `design.md`.

When `design.md` exists:

- read it before building visual components;
- retain the Ravenclaw narrative in this document;
- use the design system from `design.md` for implementation details;
- flag obvious contradictions rather than silently replacing the product direction.

---

# 3. Creative direction

Use these concepts when reasoning about the visual language:

- immersive editorial website
- cinematic scrollytelling
- kinetic typography
- scroll-driven animation
- pinned storytelling
- experimental event microsite
- art-directed web design
- oversized typography
- editorial composition
- subtle 3D
- parallax
- layered visual storytelling

Do not interpret "Harry Potter theme" as permission to fill the interface with generic fantasy decoration.

Do not rely on direct movie stills, film artwork, or official franchise graphics as the primary identity.

The site's identity should still work even if the viewer does not recognize every Harry Potter reference.

---

# 4. Visual world

## 4.1 Color direction

Base palette:

- Midnight — `#050A18`
- Raven Blue — `#102A6B`
- Electric Blue — `#246BFD`
- Moonlight — `#DDE9FF`
- Parchment — `#EEE9DC`
- Bronze — `#A97942`

These are starting values, not immutable tokens. `design.md` may refine exact values.

Bronze and parchment matter because they stop the website from looking like a generic modern blue technology website.

Electric blue should be used with restraint.

Large areas should often use near-black navy, parchment, or controlled monochromatic blue instead of gradients.

## 4.2 Typography direction

Use a strong editorial display serif together with a modern neutral sans-serif.

Possible display direction:

- Cormorant Garamond
- EB Garamond
- Instrument Serif
- another comparable editorial serif chosen in `design.md`

Possible sans direction:

- Geist
- Inter
- Archivo
- Manrope
- another comparable grotesk chosen in `design.md`

Typography is a major visual object, not merely text placed inside components.

Use:

- oversized cropped words
- outline display text
- vertical labels
- chapter numbering
- large numerals
- small technical captions
- controlled text overlap
- mixed scale

Possible editorial metadata:

`RAVENCLAW HOUSE / BBV SPORTS DAY / MMXXVI / BLUE HOUSE`

Never use a fantasy display font for all body copy.

## 4.3 Secondary graphic language

Possible motifs:

- astronomical charts
- constellations
- academic diagrams
- book annotations
- registration marks
- thin rules
- coordinate marks
- feathers
- abstract eagle geometry
- engraved line work
- subtle film grain / paper grain
- blueprints / schematic marks

These elements should support composition, not become wallpaper.

The star charts and astronomical diagrams are original, fictional-but-plausible graphic language for Ravenclaw. They are not simulations or representations of a real sky, date, or location; do not attach real coordinates or imply scientific accuracy. Keep them visually credible through instrument circles, measured lines, and restrained annotations.

Restraint is important.

---

# 5. Narrative model

The page should feel like a continuous journey:

**Enter Hogwarts → be selected into Ravenclaw → understand the House → meet the people → enter the competition → experience Sports Day → end united as one House.**

Scrolling is the primary storytelling mechanism.

The page should have strong scene changes instead of one repeated section template.

---

# 6. Site architecture / storyboard

The numbering below is intentionally cinematic.

## 00 — Invitation / Loading

Purpose:
Create a brief sense of entering a special event.

Direction:

- full-screen midnight background;
- minimal composition;
- abstract Ravenclaw / eagle line mark;
- text such as `AN INVITATION HAS ARRIVED`;
- small metadata: `BBV · SPORTS DAY 2026`;
- line drawing / restrained reveal;
- transition directly into the hero.

Keep this short.

Target duration should feel around 1–1.5 seconds on a normal first load.

Do not force a theatrical loader on returning navigation.

Respect reduced-motion preferences.

---

## 01 — Hero / Ravenclaw

Full viewport: `100svh`.

Core composition:

- massive `RAVENCLAW` typography;
- school identification;
- `WIT · LEARNING · WISDOM`;
- one dominant Ravenclaw artifact, preferably an original eagle-inspired visual;
- minimal scroll invitation.

The artifact may be:

- a custom 3D eagle sculpture;
- an abstract metallic eagle;
- a high-resolution transparent render;
- a custom emblem;
- another original visual defined in `design.md`.

Do not simply paste the official Ravenclaw crest into the center.

Scroll behavior:

- object shifts in apparent depth;
- typography separates or moves at different speeds;
- hero opens into the next chapter;
- transition should feel camera-like rather than like a normal page scroll.

Avoid CTA button clusters in the hero.

---

## 02 — The Sorting

Mood transition from dark Ravenclaw blue into parchment / pale editorial space.

Suggested copy sequence:

`NOT EVERYONE BELONGS HERE.`

then:

`YOU DO.`

then:

`RAVENCLAW`

Secondary metadata:

- `HOUSE / BLUE`
- `ELEMENT / AIR`
- `VALUES / WIT · WISDOM · CREATIVITY`

This should feel like an editorial reveal, not a quiz interface.

---

## 03 — House Manifesto

Dark scene.

Possible oversized background typography:

`WIT BEYOND MEASURE`

or another Ravenclaw statement selected later.

The foreground should contain a short original manifesto for the Blue House.

Example direction for Thai copy:

> เราไม่ได้ลงสนามเพียงเพื่อแข่งขัน
> แต่เพื่อพิสูจน์ว่าความคิด ความสามัคคี
> และความกล้าสามารถเปลี่ยนเกมได้

Final copy may change.

Do not write a long lore article.

---

## 04 — The Eagle / House Values

This is one of the site's major showcase moments.

Use a tall scroll scene, possibly around 200–300vh on desktop, with a pinned central artifact.

As the user scrolls, reveal the House values one by one.

Suggested sequence:

- WISDOM
- CREATIVITY
- AMBITION
- UNITY

Possible visual support:

- slow rotation;
- changing lighting;
- changing crop;
- astronomy diagrams;
- constellation paths;
- faint annotation lines;
- changing background typography.

Do not add particles merely to fill empty space.

---

## 05 — Meet the House

This introduces leadership and important team members.

Current homepage scope: show exactly three leadership positions when their verified records are published — Blue House president, vice president 1, and vice president 2. Other people may remain in admin but do not appear in this scene.

Possible categories:

- PRESIDENT
- LEADERSHIP
- STAFF
- CHEERLEADERS
- ATHLETES

Do not build a conventional responsive card grid.

Treat portraits as editorial photography.

Possible composition:

- one portrait occupying 40–70% of the viewport;
- large name;
- small role;
- one short quote;
- metadata / figure number;
- next portrait overlays, wipes, or replaces the previous one on scroll.

The Blue House president should receive a strong feature moment.

---

## 06 — Cheerleaders

This section may deliberately shift from dark navy into a stronger electric-blue sports-energy scene.

Current homepage scope: feature one published head of the Blue Stand. Other cheerleader records may be managed in admin without appearing in this scene.

Possible headline:

`MAKE SOME NOISE.`

Use:

- large person cutouts;
- layered typography;
- names moving behind subjects;
- mask reveals;
- cropped imagery;
- controlled horizontal motion.

Avoid standard profile cards.

---

## 07 — Athletes

Mood: sports editorial rather than fantasy.

Current homepage scope: feature one published head of sports. Sports categories and verified event information may still appear separately; individual athlete records do not create more portraits in this scene.

Possible headline:

`FASTER / HIGHER / BLUE`

Sport categories may include:

- football
- basketball
- volleyball
- athletics
- additional Sports Day categories

Each sport may have:

- large athlete photography;
- oversized sport name;
- team / athlete names;
- competition metadata;
- large numerals;
- match information where useful.

Transitions may swap one sport scene for the next while the viewport remains pinned.

Do not turn this into a dashboard.

---

## 08 — The Games / Schedule

This is useful event information and must remain easy to read.

Present schedules as an editorial event timeline.

Possible pattern:

`DAY 01`

`08:00 — OPENING CEREMONY`

`09:30 — FOOTBALL`

`13:00 — VOLLEYBALL`

Exact content is not yet available and must be treated as data, not hard-coded assumptions.

Avoid a plain admin-style table unless a compact table is needed for accessibility or mobile fallback.

---

## 09 — House Standing / Live Score

Optional dynamic section.

If reliable score data is available, connect to Supabase.

Treat this like a stadium scoreboard.

Possible layout:

`01 RAVENCLAW — 420`

`02 ...`

Scores shown above are placeholders only.

Never ship fabricated scores as real data.

Requirements:

- animated number transitions are acceptable;
- real-time subscription may be used;
- graceful fallback when data is unavailable;
- do not expose privileged write capabilities to the public client.

Avoid dashboard cards.

---

## 10 — Moments / Photography

Purpose:
Turn real Sports Day photography into an evolving campaign archive.

Possible headline:

`FROM THE FIELD`

Use an editorial gallery:

- large images;
- intentionally irregular rhythm;
- full-bleed images mixed with smaller crops;
- captions;
- photo metadata;
- optional hover details.

Example caption style:

`FIG. 014`

`BLUE STAND`

`DATE TBD / TIME TBD` (caption format example; event date is not confirmed)

Before real event photos exist, the section may show a deliberately designed waiting state such as:

`MEMORIES LOADING…`

Do not populate production with generic AI stock images unless explicitly approved.

---

## 11 — Blue Stand / Cheering Guide

Useful information for Blue House members.

Possible content:

- cheer songs
- chants
- song order
- meeting points
- dress code
- preparation list
- announcements
- stand rules
- practice information

Possible interaction:

`OPEN CHEER BOOK`

This may open a full-screen editorial panel or dedicated subpage.

The cheer book should feel like part of the art direction, not a modal copied from a component library.

---

## 12 — Venue / School Event Map

Create a stylized school event map if the Sports Day layout requires it.

Possible labels:

- FOOTBALL FIELD
- BLUE STAND
- VOLLEYBALL
- HQ
- FIRST AID
- ENTRY
- additional event locations

Prefer a custom designed event map over embedding Google Maps for an on-campus venue.

The actual map cannot be invented.

Wait for a floor plan, campus map, annotated screenshot, or verified location data from the project owner.

---

## 13 — House Wall

Optional interactive community element.

Members can leave short messages for Blue House.

Example:

`เจอกันบนสแตนด์ 💙`

Possible presentation:

- note fragments;
- paper scraps;
- editorial marginalia;
- layered pinned messages.

If implemented with Supabase:

- validate input;
- rate-limit submissions;
- provide moderation capability;
- sanitize displayed content;
- do not expose service-role credentials.

This feature is optional and must not block launch.

---

## 14 — Final Scene

Return to midnight navy.

The ending should feel deliberate and cinematic.

Possible copy sequence:

`ONE HOUSE.`

then:

`ONE BLUE.`

then:

`RAVENCLAW.`

Bring back the central eagle / emblem in a calmer final composition.

Footer metadata may follow.

This is the emotional close of the story.

---

## 15 — Minimal Footer

Keep it restrained.

Possible content:

- `RAVENCLAW / BLUE HOUSE`
- `BANGPAKONG "BOWONWITTAYAYON" SCHOOL`
- `SPORTS DAY 2026`
- Instagram
- credits
- photography credit
- development credit

Possible Easter egg:

`MISCHIEF MANAGED.`

Do not create a giant corporate footer.

---

# 7. Navigation

Navigation should be compact and secondary to the story.

Possible desktop system:

Left:
`R / 26`

Right:

- HOUSE
- PEOPLE
- GAMES
- SCHEDULE
- MOMENTS
- MENU +

Behavior:

- transparent / integrated into initial scene;
- may hide on downward scroll;
- reveal on upward scroll;
- remain keyboard accessible;
- navigation should still allow direct access to useful event information.

Mobile navigation may use a full-screen menu, but it should follow the same art direction.

---

# 8. Motion language

Motion is a design system, not decoration.

The main permitted motion families are:

## 8.1 Typography reveal

Prefer:

- clipping;
- masking;
- line reveals;
- character / word choreography;
- scale and tracking shifts;
- text moving relative to imagery.

Avoid using the same `fadeIn + translateY(20px)` for every block.

## 8.2 Pinned storytelling

Use where a scene genuinely evolves while the viewport remains fixed.

Good candidates:

- hero transition;
- eagle / values section;
- athlete sequence;
- photography sequence.

Do not pin every section.

## 8.3 Scale transitions

A visual object or image can expand toward or beyond the viewport to transition into another scene.

Use carefully.

## 8.4 Parallax

Background, typography, artifact, and foreground may move at different speeds.

Parallax should be subtle enough to remain readable.

## 8.5 Horizontal sequences

Useful for:

- athletes;
- photography;
- editorial portraits.

Do not trap the user in excessively long horizontal scroll sections.

---

# 9. Anti-AI-slop rules

These rules are mandatory.

Do not use:

- generic purple-to-blue gradients;
- glassmorphism dashboards;
- giant collections of rounded cards;
- repeated 24px border-radius containers;
- feature grids with Lucide icon + heading + paragraph;
- glowing floating orbs;
- arbitrary neon blobs;
- excessive shadows;
- random sparkles;
- emoji as UI decoration;
- every section centered;
- every section following `badge → title → subtitle → 3 cards`;
- repetitive fade-up entrance animation;
- stock fantasy parchment UI;
- generic wizard-school game UI;
- unnecessary gradients;
- excessive particle fields;
- giant pill buttons everywhere;
- meaningless decoration to fill whitespace;
- generic "magic" copywriting.

Avoid generic AI copy such as:

- "Unleash your potential"
- "Step into the magic"
- "Discover the extraordinary"
- "Where passion meets excellence"
- "Experience the future"

Whitespace is allowed.

Asymmetry is allowed.

Some sections may be quiet.

Do not solve every layout with a card.

---

# 10. Copyright / franchise asset direction

The project is inspired by the school's Harry Potter Sports Day theme, but agents should avoid making official Harry Potter / Warner Bros. artwork the foundation of the site.

Prefer:

- original Blue House emblem;
- original eagle illustrations;
- original astronomy graphics;
- original decorative symbols;
- project-owned photography;
- project-created renders;
- open-license or properly licensed supporting assets.

Do not scrape or hotlink movie stills, copyrighted promotional art, or franchise textures.

Any official logo or franchise asset supplied by the project owner should be isolated so it can easily be replaced.

---

# 11. Responsive strategy

Desktop should receive the fullest cinematic experience.

Mobile must not simply be a scaled-down desktop page.

For mobile:

- simplify multi-layer parallax;
- shorten pinned scenes;
- reduce expensive 3D;
- preserve major typography moments;
- preserve narrative sequence;
- maintain readable event information;
- adapt portrait framing;
- avoid excessive scroll-jacking.

Touch scrolling must remain natural.

Test common viewport heights, not only widths.

Use `svh` / modern viewport units where appropriate.

---

# 12. Accessibility

Do not trade usability for spectacle.

Required considerations:

- semantic HTML;
- keyboard-accessible navigation and controls;
- visible focus states;
- meaningful alt text;
- adequate text contrast;
- `prefers-reduced-motion`;
- avoid motion that makes content impossible to consume;
- avoid required hover-only interactions;
- prevent animation from blocking important schedule information;
- no autoplay audio;
- decorative visual objects should not create noisy accessibility output.

Reduced-motion mode should retain the visual hierarchy with simplified transitions.

---

# 13. Performance

Target a smooth experience on modern phones and school laptops.

Priorities:

- 60fps where reasonably possible;
- lazy-load below-the-fold media;
- compress photographs;
- prefer AVIF/WebP where supported;
- avoid rendering Three.js scenes when not needed;
- dispose 3D resources correctly;
- avoid huge video backgrounds unless they are essential;
- preload only truly critical assets;
- use responsive images;
- defer nonessential interactive features;
- pause expensive animations when offscreen;
- minimize layout thrashing;
- animate transform and opacity where possible.

Do not add Three.js solely because the project wants to feel premium.

A high-quality 2D art-directed scene is preferable to weak 3D.

---

# 14. Technical stack

Use:

- Next.js 16
- TypeScript
- Tailwind CSS
- GSAP
- GSAP ScrollTrigger
- Lenis

Optional:

- React Three Fiber / Three.js only where a scene genuinely benefits from 3D

Supabase is part of the content architecture for editable event data, uploaded people / athlete / cheerleader photography, moments, and scores. House Wall remains optional.

General requirements:

- App Router;
- server components by default where appropriate;
- client components only when interaction requires them;
- keep animation orchestration isolated;
- keep content/data separate from presentation;
- avoid installing a large UI kit that imposes generic component styling;
- small headless utilities are acceptable where useful.

---

## 14.1 Admin, storage, and editable content

The project owner has chosen an admin-managed content workflow. The admin must be able to create, edit, publish, unpublish, reorder, and remove changing content as appropriate: people and roles, cheerleaders, athletes and sports, schedule, cheer content, gallery / moments, scores, and announcements. Keep static campaign artwork separate from this workflow.

- Keep the approved eagle files, emblem / logo, constellation drawings, textures, decorative graphics, and composition-locked images in the project under `public/`.
- Keep changing portraits and event photography in Supabase Storage. Store their metadata, role, order, publication state, captions, and related content in Supabase tables.
- Use one shared admin credential as requested by the project owner. Implement it with Supabase Auth and a server-managed session; the login UI may ask for the shared password while the account identifier stays server-side. Never put that password or a service-role key in client code, public environment variables, source control, or documentation.
- Protect admin routes, mutations, and storage writes on the server and with appropriate database / storage policies. A hidden route or client-only password comparison is not access control.
- Public pages show only published, verified records. When no record exists, hide person / athlete / cheerleader entries instead of rendering twelve fabricated profiles.
- Development seed records may be used to test the planned compositions: 1 president, 2 vice presidents, 3 staff, 3 cheerleaders, and 3 athletes. Clearly mark demo records and images, keep them out of production publication, and remove or replace them before launch. Seeded scores, schedules, and event facts must never appear as official information.
- If Supabase is temporarily unavailable, show an honest empty / waiting state for useful sections; do not turn missing records into fictional event data.

The approved hero image set currently lives in `public/hero/`: `eagle-master.png`, `eagle-master-rmbg.png`, `eagle-close.png`, and `eagle-close-rmbg.png`. The person image pair in `people/` is a temporary development asset, not a real student portrait. The earlier idea of copying this pair into separate files named after every role has been superseded by admin-managed records and shared demo fallbacks.

The owner-supplied Blue House marks live in `public/assets/brand/`: `ravenclaw-mark-mini.png`, `ravenclaw-mark-mini.svg`, `ravenclaw-mark-primarycrest.png`, `ravenclaw-mark-primarycrest-rmbg.png`, `ravenclaw-mark-primarycrest-rmbg.svg`, and `ravenclaw-mark-social.png`. The `primarycrest-rmbg.png` file now has a transparent background. Use its textured bronze detail in the light Sorting scene. The SVGs can serve as single-color silhouettes in bronze, moonlight, raven blue, or midnight according to scene contrast. Use the social mark for browser/share identity.

---

# 15. Suggested project architecture

This is a suggested direction, not a mandatory exact tree.

```text
src/
  app/
    page.tsx
    layout.tsx
    globals.css
    admin/
      page.tsx

  components/
    layout/
      SiteHeader.tsx
      SiteFooter.tsx

    sections/
      Invitation.tsx
      Hero.tsx
      Sorting.tsx
      Manifesto.tsx
      EagleValues.tsx
      People.tsx
      Cheerleaders.tsx
      Athletes.tsx
      GamesSchedule.tsx
      HouseStanding.tsx
      Moments.tsx
      CheerBook.tsx
      VenueMap.tsx
      HouseWall.tsx
      FinalScene.tsx

    motion/
      SmoothScroll.tsx
      ScrollScene.tsx
      SplitTextReveal.tsx
      ReducedMotion.tsx

    ui/
      EditorialLabel.tsx
      FigureCaption.tsx
      SectionIndex.tsx

  data/
    navigation.ts

  lib/
    animation/
    supabase/
    content/
    utils/

public/
  assets/
    brand/
    hero/
    textures/
    diagrams/
    map/

supabase/
  migrations/
  seed/
```

The dynamic image categories above belong in Cloud Storage. This tree is illustrative; use the actual locations of approved artwork already present in the repository.

Avoid creating a generic `/components/cards` architecture as the core visual system.

Most large sections should be art-directed individually.

---

# 16. Asset preparation — project owner checklist

The website can be scaffolded before all assets exist, but final art direction depends heavily on real visual material.

Agents should use clearly labeled temporary placeholders rather than inventing final assets.

Current known assets and data decisions are recorded in `knowledge.md`; implementation progress is tracked in `phase.md`.

## 16.1 Priority A — required before final visual polish

### Blue House identity

Prepare or create:

- original Ravenclaw-inspired Blue House emblem;
- eagle mark / eagle artwork;
- monochrome version;
- blue version;
- light version;
- optional bronze version.

Preferred formats:

- SVG for marks and line art;
- transparent PNG/WebP for rendered artwork;
- GLB/GLTF only if a proper 3D object is intentionally used.

Do not depend on a low-resolution screenshot of the official franchise crest.

### Hero artifact

One strong visual centerpiece is required.

Options:

- original metallic eagle render;
- custom 3D eagle model;
- sculptural eagle image with transparent background;
- custom emblem rendered as a physical object.

Recommended deliverables if using a 2D render:

- transparent background;
- at least 2000px on the longest side;
- preferably 3000px+ for desktop cropping;
- no baked text around it.

### Team photography

Prepare high-resolution photos for:

- Blue House president;
- leadership;
- cheerleaders;
- athletes;
- optional behind-the-scenes team.

Ideal:

- consistent shoot if possible;
- simple background;
- enough negative space around subjects;
- full-body and waist-up variations;
- several poses;
- RAW/original high-resolution exports preserved.

For cutout compositions, photograph subjects without cropping limbs at the frame edge when possible.

### Actual event information

Provide verified:

- event dates;
- start/end times;
- competition schedule;
- sports;
- team names;
- locations;
- important rules;
- cheer practice information;
- Blue House meeting details.

Agents must not invent production event data.

---

## 16.2 Priority B — strongly recommended

### Cheerleader cutouts

Prepare:

- full-body portraits;
- individual images if possible;
- one group photograph;
- transparent cutout versions may be generated during production.

### Athlete photography

For each major sport:

- hero athlete shot;
- team photograph;
- action photograph if available;
- names / numbers;
- sport category.

### House manifesto copy

Provide final Thai copy or approve a draft.

Keep it short enough to function as display typography.

### Cheer book content

Collect:

- cheer lyrics / chants created for the event;
- order of songs;
- cue notes;
- stand instructions;
- dress code;
- required items;
- rehearsal schedule.

### School venue reference

Provide one of:

- school map;
- floor plan;
- screenshot with annotations;
- hand sketch;
- photograph of a printed map.

A polished vector event map can be produced from this reference.

---

## 16.3 Priority C — useful after the event begins

### Sports Day photography

Collect throughout the event:

- stand;
- parade;
- cheerleaders;
- athletes;
- crowd;
- candid moments;
- awards;
- preparation;
- group photographs.

Preserve original timestamps where possible.

This supports the editorial caption system.

### Score data

If live standings are desired, define:

- each House;
- scoring rules;
- who is permitted to edit;
- whether scores are official;
- data source;
- update workflow.

Do not build real-time infrastructure before this workflow is defined.

---

## 16.4 Optional visual assets

Potential additions:

- subtle film-grain texture;
- scanned paper;
- custom constellation drawing;
- eagle feather macro photography;
- ink strokes;
- engraved astronomy illustrations;
- Blue House banner texture;
- original hand-written annotations;
- short ambient video loops.

All assets should have a clear visual purpose.

Do not download random decorative PNGs merely because empty space exists.

---

# 17. Asset naming convention

Use predictable names for project-owned static artwork. Dynamic portraits and event photography are uploaded through admin to Cloud Storage, with their labels and relationships stored in the database.

Examples:

```text
public/assets/brand/ravenclaw-mark.svg
public/assets/brand/ravenclaw-mark-light.svg
public/assets/hero/eagle-hero.webp

public/assets/textures/grain-01.webp
public/assets/diagrams/constellation-01.svg
public/assets/map/sports-day-map.svg
```

Avoid filenames like:

`IMG_3847-final-final2.png`

Keep original photographs outside optimized public assets if editing workflow requires them.

---

# 18. Placeholder policy

When an asset is missing:

DO:

- use an obvious placeholder;
- annotate TODO requirements;
- preserve the intended aspect ratio;
- keep asset interfaces ready for replacement;
- document what dimensions are needed.
- hide uncreated person / athlete / cheerleader records on the public site; use placeholders only for existing draft records or explicit development preview.

DO NOT:

- silently use generic Unsplash imagery as final content;
- generate random fantasy imagery and treat it as approved branding;
- scrape Harry Potter artwork;
- reshape the layout around a temporary low-quality asset.
- publish seeded demo people, scores, schedules, or event dates as if they were real.

Example:

```tsx
{
  /* TODO(asset): Replace with approved Blue House president portrait.
    Preferred: 4:5 portrait, minimum 2000px tall. */
}
```

---

# 19. Content policy

The website is Thai-first unless later requirements change.

English may be used prominently for editorial headlines and chapter labels.

Use Thai for practical school information.

Good split:

- English = identity, section names, major display copy;
- Thai = schedules, instructions, names, practical details, announcements.

Do not write long English fantasy lore that students must read to understand useful information.

---

# 20. Interaction rule

Every animation must answer:

> Why is this moving?

Valid reasons:

- reveal hierarchy;
- create spatial transition;
- connect two scenes;
- emphasize a person;
- demonstrate progression;
- communicate changing data;
- preserve a cinematic narrative.

Invalid reason:

> The page felt empty.

---

# 21. Implementation workflow for agents

## Phase 1 — read

Before implementation:

1. Read `AGENTS.md`.
2. Read `design.md` if it exists.
3. Inspect the current repository.
4. Identify available assets.
5. Identify missing required content.
6. Preserve working implementation unless replacement is justified.

## Phase 2 — foundation

Set up:

- fonts;
- design tokens;
- global layout;
- smooth scroll;
- reduced-motion support;
- image strategy;
- core navigation.

Do not begin by building reusable marketing cards.

## Phase 3 — scene prototypes

Prototype the hardest three visual scenes first:

1. Hero transition.
2. Eagle / values pinned scene.
3. People or athletes editorial transition.

Confirm that the motion language works before building the entire page.

## Phase 4 — full narrative

Implement the sections in the intended story order.

Useful-information sections such as schedule must remain accessible even if motion fails.

Build the admin-managed content and Supabase integration as a distinct workstream before calling the site complete. Seed demo records only for development preview, with a visible demo state and no production publication.

## Phase 5 — real assets

Upload and publish verified dynamic content through admin; replace static placeholders with approved:

- portraits;
- athlete photos;
- graphics;
- map;
- event data.

Recompose sections around the real images instead of assuming the placeholders are final.

## Phase 6 — polish

Check:

- section rhythm;
- repeated animation patterns;
- mobile compositions;
- reduced-motion;
- performance;
- typography crop;
- image crop;
- transition timing;
- loading behavior.

Remove decoration that has no purpose.

---

# 22. Definition of done

The website is not done merely because every section exists.

A launch-ready result should satisfy all of the following:

- the site feels like one coherent Ravenclaw campaign;
- the opening has a memorable art-directed hero;
- at least several sections have genuinely different compositions;
- scrolling creates a deliberate narrative;
- the site does not resemble a SaaS template;
- practical Sports Day information is easy to access;
- real school / team imagery is integrated intentionally;
- mobile is composed separately enough to remain elegant;
- reduced-motion mode works;
- performance remains acceptable;
- no fake event data is presented as real;
- no obviously unlicensed movie artwork is used as the site's foundation;
- there are no repeated generic feature-card sections;
- typography and imagery carry more identity than UI chrome;
- animation enhances rather than blocks content.

The target impression is:

> This feels like an event campaign and digital exhibition made specifically for Ravenclaw / Blue House — not a template that had its colors changed to blue.
