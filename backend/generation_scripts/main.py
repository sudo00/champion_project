from inference_txt2img import inference 
from inference_inpaint import inpaint
import json
import os

CFG_PATH = os.path.abspath("src/config.json")

def main(mode):
    mode_map = {
        'inference': inference,
        'inpaint': inpaint,
    }
    mode_map[mode](CFG_PATH)

if __name__ == "__main__":
    with open(CFG_PATH) as f:
        config = json.load(f)
    mode = config['user_parameters']['user_mode'] #inference or inpaint
    main(mode)   
