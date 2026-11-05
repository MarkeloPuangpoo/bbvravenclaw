# Music source and edit

- Title: Dreams Become Real
- Composer / performer: Kevin MacLeod
- Official track page: https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1500027
- Official audio: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dreams%20Become%20Real.mp3
- Licence on the official track page: Creative Commons Attribution 4.0 International
- Licence URL: https://creativecommons.org/licenses/by/4.0/
- Obtained: 1 October 2026 (Asia/Bangkok)
- The project owner explicitly approved downloading and using this track with credit.
- Source is preserved in `audio/source/dreams-become-real.mp3` and excluded from git.

## Credit

“Dreams Become Real” Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
https://creativecommons.org/licenses/by/4.0/

Adaptation: 32-second excerpt, loudness adjustment and a closing fade. Include this credit with published copies. It also appears in the film's closing shot and MP4 description metadata.

## Timing and analysis

Publisher tempo: 60 BPM. The general-purpose beat detector incorrectly returned 153.65 BPM for this sparse piano track; that estimate was rejected. A constrained analysis near the publisher tempo and fitting a 60 BPM grid across the first 64 seconds returned 60.0125 BPM, first beat at 0.0054006s. Use the publisher's 60 BPM grid: the sub-frame deviation across the selected excerpt is negligible.

Selected bars: 1–8 in 4/4, starting at 0.0054006s and ending at 32.0054006s. No time stretching, pitch changes, splicing or rearranging. The animation clock uses 120 BPM subdivisions (64 visual beats across 32 musical beats), retaining the approved 32-second duration. The eagle reveal at 16s lands on the fifth musical bar. This piano arrangement has a restrained phrase lift rather than an electronic drop.

`music_edit.py` produced exactly 1,920 video frames / 32s at 60fps. The mix targets -18 LUFS / -1.5 dBTP; final half-second fades out for the standalone film. Muted loop has no audio track. Audio waveform / spectral overview is in `out/audio-spectrum.png`.
