import io
import os
import librosa
import vamp
import yt_dlp
import tempfile

file_dir = os.path.dirname(os.path.realpath(__file__))

def map_chords_per_beats(chords, beat_times):
  chords_per_beats = []
  for beat_index, beat_timestamp in enumerate(beat_times):
    next_beat_index = beat_index + 1
    next_beat_timestamp = beat_times[next_beat_index] if next_beat_index < len(beat_times) else float('inf')
    current_chord = next(
      (chord["label"] for chord in chords if beat_timestamp <= float(chord["timestamp"]) < next_beat_timestamp), 
      None
      )
    chords_per_beats.append({"chord": current_chord, "timestamp": beat_timestamp})
    
  return chords_per_beats

def load_from_youtube(youtube_id):

  url = "https://www.youtube.com/watch?v=%s" % (youtube_id)
  file_name = None 
  file_ext='m4a'
  temps_dir = os.path.join(file_dir, '..', 'tmp')
  audio_data = None
  sample_rate = None
  with tempfile.TemporaryDirectory(dir=temps_dir) as temp_dirname:

    ydl_opts = {
      "format": "m4a/bestaudio",
      "format_sort": ['+size'],
      "outtmpl": f"{temp_dirname}/%(id)s.{file_ext}",
      "noplaylist": True,
      'quiet': True,
      'noprogress': True,
      'logtostderr': True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
      meta = ydl.extract_info(url, download=True)
      file_name = meta['id']
    
    file_path = os.path.join(temp_dirname, f"{file_name}.{file_ext}")

    audio_data, sample_rate = librosa.load(file_path)
    
  return audio_data, sample_rate

def recognize_chords(audio_data, sample_rate):
  CHORDINO_PARAMETERS = {
    'useNNLS': 1, # 0 or 1, default 1
    'rollon': 0, # 0 - 5, default 0
    'tuningmode': 0, # Global = 0 Local = 1, default 0
    'whitening': 1, # 0 - 1 default 1
    's': .7, # 0.5 - 0.9, default 0.7
    'boostn': 0.1, # 0 - 1, default .1
  }

  chroma = vamp.collect(
      audio_data, 
      sample_rate, 
      "nnls-chroma:chordino", 
      parameters=CHORDINO_PARAMETERS
    ) 
  chords = chroma['list']

  return chords

def recognize_bpm_and_beat_times(audio_data, sample_rate):
  onset_envelope = librosa.onset.onset_strength(y=audio_data, sr=sample_rate)

  bpm, beat_times = librosa.beat.beat_track(y=audio_data, onset_envelope=onset_envelope, trim=False, sr=sample_rate, units='time')

  return bpm[0], beat_times