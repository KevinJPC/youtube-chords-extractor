from utils import prepare_tmp_folder, set_vamp_path, get_youtube_id_argv, print_json
from analyze import get_audio_data, recognize_bpm_and_beat_times, recognize_chords, map_chords_per_beats, download_from_youtube
from constants import RESPONSE_STATUS

def main():
    prepare_tmp_folder()
    
    set_vamp_path()

    youtube_id = get_youtube_id_argv()

    audio_buffer = download_from_youtube(youtube_id)

    audio_data, sample_rate = get_audio_data(audio_buffer)

    bpm, beat_times = recognize_bpm_and_beat_times(audio_data, sample_rate)

    chords = recognize_chords(audio_data, sample_rate)

    chords_per_beats = map_chords_per_beats(chords, beat_times)

    print_json({'status': RESPONSE_STATUS['SUCCESS'], 'data': {'bpm': bpm, 'chords_per_beats': chords_per_beats}})

if __name__ == '__main__':
    main()



