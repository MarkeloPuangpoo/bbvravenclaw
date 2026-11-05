# Ravenclaw — One House. One Blue.

32-second website film, 1920 × 1080, 60 fps. Brief and concept approved by the project owner. Features the real public site's eagle hero, Sorting, Thai manifesto, four House values and closing scene in a browser, followed by a laptop reveal. All work is isolated here; the application and original artwork are unchanged.

## Deliverables

- `out/ravenclaw.mp4` — H.264 / AAC with approved music and embedded credit.
- `out/ravenclaw-loop.mp4` — same picture, no audio track, for muted autoplay.
- `out/ravenclaw-poster.png` — eagle / WISDOM frame at 17s.
- `dist/ravenclaw.html` — self-contained film and player; all images, fonts and music embedded. Click Play for sound.
- `out/ravenclaw-post.txt` — Thai-first post copy and required music attribution.
- `src/` — editable animation source, device, clock and local assets.
- `out/qa/` — overview sheets, transition sheets, frame comparisons and checks.
- `audio/SOURCE.md` — source, permission, licence, credit and exact cut details.

## Timeline

The visual clock uses 120 BPM subdivisions of the music's 60 BPM. There are 64 visual beats / 32 musical beats / eight bars.

| Time | Visual beat | Scene |
| --- | --- | --- |
| 0–4s | 1–8 | Browser hero; gentle camera approach, eagle depth and separating RAVEN / CLAW typography. |
| 4–10s | 9–20 | Scroll into parchment Sorting; YOU DO. reveals and holds. |
| 10–15s | 21–30 | Thai manifesto; reading hold with subtle outline parallax. |
| 15–18s | 31–36 | Eagle scroll reveal, fully settled at the musical bar boundary at 16s; WISDOM. |
| 18–20s | 37–40 | CREATIVITY, parchment; film-only artwork opacity adjustment preserves headline contrast. |
| 20–22s | 41–44 | AMBITION, Raven blue and vertical type. |
| 22–24s | 45–48 | UNITY, balanced midnight composition. |
| 24–28s | 49–56 | Pointer selects final chapter; scroll to closing statement, camera reveals desktop then laptop. |
| 28–30.5s | 57–61 | THE HOUSE OF MINDS, Instagram and music credit hold. |
| 30.5–32s | 62–64 | Browser scrolls back to hero while the camera returns to the opening composition. |

## Source fidelity and implementation

`tools/capture-dom.mjs` captures the real production frontend's DOM, CSS and local artwork for just the five identity scenes. It excludes admin and dynamic people, schedule and score records. The film derives motion from the site's existing choreography. It does not run Next.js, GSAP, Lenis or network requests during playback. A sandboxed iframe retains the site's own fonts and layout at 1200 × 730 browser points; its body is remounted for every frame and all motion is set by `seek(t)`. This avoids accumulated animation state. Image decoding is synchronous and each seek waits for the iframe compositor to paint before capture; the wait does not change the time-based visual state. UI frame, camera, pointer and laptop come from the motion-designer desktop template.

The slate and background use Ravenclaw's midnight, parchment, moonlight and bronze. Font data comes from the local Next.js build. Approved eagle artwork and marks are documented in the project's `knowledge.md`. Original assets are untouched.

No public website domain was confirmed; browser chrome intentionally retains localhost:3000 as approved in the concept. The call to action uses the existing public Instagram handle. No event date, person, result or schedule has been fabricated. No voiceover.

## Music

“Dreams Become Real” by Kevin MacLeod, https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1500027.
Licensed under Creative Commons Attribution 4.0: https://creativecommons.org/licenses/by/4.0/.
The owner approved its use with credit. Bars 1–8, 32-second excerpt, loudness adjusted, final 0.5s faded. Measured mix: -17.9 LUFS, -6.0 dBFS true peak. Retain the credit in `out/ravenclaw-post.txt` when publishing. The original download stays in ignored `audio/source/`.

## Preview and rebuild

Open `dist/ravenclaw.html` in Chrome or open `src/index.html` to edit. Paths below refer to the installed skill on this machine; run from the repository root.

```sh
node /Users/macmarc/.agents/skills/motion-designer/scripts/check.mjs docs/launch-film/src/index.html
node docs/launch-film/tools/qa.mjs
node /Users/macmarc/.agents/skills/motion-designer/scripts/render.mjs video docs/launch-film/src/index.html docs/launch-film/out/ravenclaw.mp4 --audio docs/launch-film/audio/edit.m4a --scale 2
python3 /Users/macmarc/.agents/skills/motion-designer/scripts/build_single.py docs/launch-film/src/index.html docs/launch-film/dist/ravenclaw.html
node /Users/macmarc/.agents/skills/motion-designer/scripts/check.mjs docs/launch-film/src/index.html --dist docs/launch-film/dist/ravenclaw.html
```

The video is rendered at 2× density and downsampled to 1080p. The music source, contact sheets and renders are excluded from git by this folder's `.gitignore`. `brief.md` and `concept.md` preserve the approved direction; this README describes the final implementation.

## Quality checks

The source passes the skill's automated checks at 0.05-second intervals: no page errors, identical frames regardless of seek order, and exact equality between 32s and 0s. The packaged HTML matches the source pixel for pixel; separate 2× resolution probes also pass. Overview sheets were reviewed every 0.5s, all transition sheets every 0.05s, and text compositions at full resolution.

`tools/finalize.py` adds the music credit to MP4 metadata, creates the muted copy and poster, and verifies dimensions, frame rate, frame count, duration, audio streams, reference-frame similarity and identical encoded video streams. Results are recorded in `out/qa/media-verification.json`.

Final media verification passed: both MP4s contain exactly 1,920 frames at 1920 × 1080 / 60 fps and run for 32.000 seconds. Main film: 14.75 MB with AAC music. Muted loop: 13.76 MB with no audio stream. Their encoded picture streams are identical. The 17s frame matches the source poster with SSIM 0.9961; first/last frame SSIM is 0.9951 (compression and the final fraction of motion account for the difference). The uncompressed 32s and 0s source frames match exactly.
