"""Package the completed render and verify its media streams and reference frames."""
import json, pathlib, re, subprocess
root = pathlib.Path(__file__).resolve().parents[1]
out = root / 'out'
qa = out / 'qa'
video = out / 'ravenclaw.mp4'

def run(*args):
    return subprocess.run([str(x) for x in args], check=True, capture_output=True, text=True)

def probe(path):
    return json.loads(run('ffprobe', '-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', path).stdout)

credit = 'Dreams Become Real by Kevin MacLeod (incompetech.com), CC BY 4.0 https://creativecommons.org/licenses/by/4.0/; edited 32-second excerpt.'
metadata = out / 'ravenclaw-tagged.mp4'
run('ffmpeg', '-y', '-v', 'error', '-i', video, '-map', '0', '-c', 'copy', '-metadata', 'title=Ravenclaw — The House of Minds', '-metadata', 'comment='+credit, '-movflags', '+faststart', metadata)
metadata.replace(video)
loop = out / 'ravenclaw-loop.mp4'
run('ffmpeg', '-y', '-v', 'error', '-i', video, '-an', '-c:v', 'copy', '-movflags', '+faststart', loop)
report = {}
for name, path in [('music', video), ('muted', loop)]:
    data = probe(path)
    (qa / (name+'-ffprobe.json')).write_text(json.dumps(data, indent=2))
    v = next(s for s in data['streams'] if s['codec_type']=='video')
    assert (v['width'],v['height'],v['r_frame_rate'],int(v['nb_read_frames'])) == (1920,1080,'60/1',1920), v
    assert abs(float(data['format']['duration'])-32)<.025
    audio = [s for s in data['streams'] if s['codec_type']=='audio']
    assert len(audio) == (1 if name=='music' else 0)
    if audio: assert audio[0]['codec_name']=='aac'
    report[name] = {'frames':1920,'size':'1920x1080','fps':60,'duration':data['format']['duration'],'bytes':path.stat().st_size,'audio':bool(audio)}
for label, frame in [('first',0),('middle',1020),('last',1919)]:
    run('ffmpeg','-y','-v','error','-i',video,'-vf',f'select=eq(n\\,{frame})','-frames:v','1',qa/(label+'.png'))
run('ffmpeg','-y','-v','error','-i',out/'final-stills/t17.000.png','-vf','scale=1920:1080:flags=lanczos','-frames:v','1',out/'ravenclaw-poster.png')
for label, a, b in [('reference',qa/'middle.png',out/'ravenclaw-poster.png'),('loop',qa/'first.png',qa/'last.png')]:
    result=run('ffmpeg','-i',a,'-i',b,'-lavfi','ssim','-f','null','-')
    value=float(re.search(r'All:([\d.]+)',result.stderr).group(1))
    assert value>.98, (label,value)
    report[label+'_ssim']=value
# The muted version must contain exactly the same encoded picture stream.
hashes=[]
for path in [video,loop]:
    hashes.append(run('ffmpeg','-v','error','-i',path,'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-').stdout.strip())
assert hashes[0]==hashes[1]
report['picture_streams_identical']=True
(qa/'media-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
