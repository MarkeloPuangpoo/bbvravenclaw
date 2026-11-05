import importlib.util,json
spec=importlib.util.spec_from_file_location('beats','/Users/macmarc/.agents/skills/motion-designer/scripts/beats.py')
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
x=b.decode('docs/launch-film/audio/source/dreams-become-real.mp3')[:b.SR*64]
env=b.onset_envelope(x)
print('Narrow search around publisher tempo:',b.tempo(env,lo=58,hi=62),flush=True)
print('Fit publisher 60 BPM:',b.fit(env,60,0),flush=True)
