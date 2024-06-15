import torch
from diffusers import AutoPipelineForInpainting

from PIL import Image
import json
import os

def inpaint_inference(config, options) -> Image: 
    sd_path = config['inpaint']["stable_diffusion_path"]

    lora_rel_path = config["lora_path"]
    lora_abs_path = os.path.join(os.path.dirname(__file__), lora_rel_path)
    lora_dir, lora_path = os.path.split(lora_abs_path)

    device = config["device"]

    p_user = options['positive_prompt']
    n_user = options['negative_prompt']
    height = options['height']
    width = options['width']

    p_start = config['inpaint']['p_start']
    p_end = config['inpaint']['p_end']
    n_end = config['inpaint']['n_end']

    guidance_scale = config['guidance_scale']
    strength = config['strength']
    lora_scale = config['lora_scale']
    num_inference_steps = config['num_inference_steps']

    img_path = config['inpaint']['img_path']
    mask_path = config['inpaint']['mask_path']
    pipe = AutoPipelineForInpainting.from_pretrained(sd_path, torch_dtype=torch.float16, variant="fp16").to("cuda")
    pipe.load_lora_weights(pretrained_model_name_or_path_or_dict=lora_dir, weight_name=lora_path, adapter_name="gpb")
    pipe.to(device)

    # load base and mask image
    init_image = Image(img_path)
    mask_image = Image(mask_path)

    positive_prompt = f"{p_start} {p_user} {p_end}"
    negative_prompt = f"{n_user} {n_end}"

    image = pipe(prompt=positive_prompt, negative_prompt=negative_prompt, 
                image=init_image, mask_image=mask_image,\
                height = height, width = width,  num_inference_steps=num_inference_steps,\
                cross_attention_kwargs={"scale": lora_scale}).images[0]
    return image


def save_image(image, config):
    save_path = config["save_path"]
    dirname = os.path.dirname(save_path)
    if not os.path.exists(dirname):
        os.mkdir(dirname)
    image.save(save_path)


def inpaint(cfg_path, options):
    with open(cfg_path) as f:
        config = json.load(f)
    img = inpaint_inference(config)
    save_image(img, config)
    