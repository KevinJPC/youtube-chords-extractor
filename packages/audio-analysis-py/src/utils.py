import os
import sys
import json
from errors import NotYouTubeIdArgvError, VampPathDoesNotExistsError

FILE_DIR = os.path.dirname(os.path.realpath(__file__))
VAMP_PATH_NAME = 'VAMP_PATH'
VAMP_PATH = os.path.join(FILE_DIR, '..', 'lib', 'vamp-plugins')

def prepare_tmp_folder():
  tmp_path = os.path.join(FILE_DIR, '..', 'tmp')
  if not os.path.exists(tmp_path):
    os.makedirs(tmp_path)

def set_vamp_path():
  if(not os.path.exists(VAMP_PATH)):
    raise VampPathDoesNotExistsError(VAMP_PATH)
  os.environ[VAMP_PATH_NAME] = VAMP_PATH

def to_json(data):
  json_data = json.dumps(data)
  return json_data

def get_youtube_id_argv():
  try:
    youtube_id = sys.argv[1]
    return youtube_id
  except IndexError:
    raise NotYouTubeIdArgvError()

def print_json(data):
  print(to_json(data), flush = True)
