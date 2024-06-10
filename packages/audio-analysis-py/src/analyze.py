import io
import os
import librosa
import vamp
import yt_dlp
import tempfile
from errors import AudioFileDoesNotExistsError
import numpy as np

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

def download_from_youtube(youtube_id):

  url = "https://www.youtube.com/watch?v=%s" % (youtube_id)
  file_dir = os.path.dirname(os.path.realpath(__file__))
  file_content_bytes = None
  file_name = None 
  file_final_ext='wav'
  temps_dir = os.path.join(file_dir, '..', 'tmp')

  with tempfile.TemporaryDirectory(dir=temps_dir) as temp_dirname:
    ydl_opts = {
      "format": "m4a/bestaudio/best",
      "outtmpl": f"{temp_dirname}/%(id)s.%(ext)s",
      "noplaylist": True,
      'quiet': True,
      'noprogress': True,
      'logtostderr': True,
      'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': file_final_ext
      }],
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
      meta = ydl.extract_info(url, download=True)
      file_name = meta['id']
    
    file_path = os.path.join(temp_dirname, f"{file_name}.{file_final_ext}")

    if os.path.exists(file_path):
      with open(file_path, "rb") as file:
        file_content_bytes = file.read()
    else:
      raise AudioFileDoesNotExistsError(file_path)
    
  return io.BytesIO(file_content_bytes)

def get_audio_data(buffer):
  audio_data, sample_rate = librosa.load(buffer)
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

def get_instrumental(audio_data, sr):
  # And compute the spectrogram magnitude and phase
  S_full, phase = librosa.magphase(librosa.stft(audio_data))
  S_filter = librosa.decompose.nn_filter(S_full,
                                       aggregate=np.median,
                                       metric='cosine',
                                       width=int(librosa.time_to_frames(2, sr=sr)))

  # The output of the filter shouldn't be greater than the input
  # if we assume signals are additive.  Taking the pointwise minimum
  # with the input spectrum forces this.
  S_filter = np.minimum(S_full, S_filter)

  # We can also use a margin to reduce bleed between the vocals and instrumentation masks.
  # Note: the margins need not be equal for foreground and background separation
  margin_i, margin_v = 2, 10
  power = 2

  mask_i = librosa.util.softmask(S_filter,
                                margin_i * (S_full - S_filter),
                                power=power)

  mask_v = librosa.util.softmask(S_full - S_filter,
                                margin_v * S_filter,
                                power=power)

  # Once we have the masks, simply multiply them with the input spectrum
  # to separate the components

  S_foreground = mask_v * S_full
  S_background = mask_i * S_full
  # y_foreground = librosa.istft(S_foreground * phase)
  y_background = librosa.istft(S_background * phase)
  return y_background
