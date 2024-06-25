from utils import prepare_tmp_folder, set_vamp_path, get_youtube_id_argv, print_json
from analyze import load_from_youtube, recognize_bpm_and_beat_times, recognize_chords, map_chords_per_beats
from constants import RESPONSE_STATUS
import warnings
import traceback

def main():
    try:
        warnings.filterwarnings("ignore")
        
        prepare_tmp_folder()
        
        set_vamp_path()

        youtube_id = get_youtube_id_argv()

        audio_data, sample_rate = load_from_youtube(youtube_id)

        bpm, beat_times = recognize_bpm_and_beat_times(audio_data, sample_rate)

        chords = recognize_chords(audio_data, sample_rate)

        chords_per_beats = map_chords_per_beats(chords, beat_times)

        print_json({'status': RESPONSE_STATUS['SUCCESS'], 'data': {'bpm': bpm, 'chords_per_beats': chords_per_beats}})
    except Exception as e:
        print_json({'status': RESPONSE_STATUS['ERROR'], 'errorMessage': traceback.format_exc(), })

if __name__ == '__main__':
    main()



