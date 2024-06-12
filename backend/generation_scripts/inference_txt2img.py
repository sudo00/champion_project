from diffusers import StableDiffusionPipeline, DiffusionPipeline
import torch
from PIL import Image
import json
import os

def txt2img(config) -> Image: 
    sd_path = config["inference"]["stable_diffusion_path"]

    lora_rel_path = config["lora_path"]
    lora_abs_path = os.path.join(os.path.dirname(__file__), lora_rel_path)
    lora_dir, lora_path = os.path.split(lora_abs_path)

    device = config["device"]

    p_user = config['user_parameters']['positive_prompt']
    n_user = config['user_parameters']['negative_prompt']
    height = config['user_parameters']['height']
    width = config['user_parameters']['width']
    num_images_per_prompt = config['user_parameters']['num_images_per_prompt']

    p_start = config['inference']['p_start']
    p_end = config['inference']['p_end']
    n_end = config['inference']['n_end']

    guidance_scale = config['guidance_scale']
    strength = config['strength']
    lora_scale = config['lora_scale']
    num_inference_steps = config['num_inference_steps']
    
    




    pipe = StableDiffusionPipeline.from_pretrained(sd_path, torch_dtype=torch.float16)
    

    # pipe = DiffusionPipeline.from_pretrained(sd_path, use_safetensors=True)
    pipe.load_lora_weights(pretrained_model_name_or_path_or_dict=lora_dir, weight_name=lora_path, adapter_name="gpb")
    pipe.to(device)

    positive_prompt = f"{p_start} {p_user} {p_end}"
    negative_prompt = f"{n_user} {n_end}"

    image = pipe(
        positive_prompt, negative_prompt = negative_prompt,\
        height = height, width = width,  num_inference_steps=num_inference_steps, num_images_per_prompt = num_images_per_prompt, 
        cross_attention_kwargs={"scale": lora_scale}).images[0]

    return image 

def save_image(image, config):
    save_path = config["save_path"]
    dirname = os.path.dirname(save_path)
    if not os.path.exists(dirname):
        os.mkdir(dirname)
    image.save(save_path)

def inference(cfg_path):
    with open(cfg_path) as f:
        config = json.load(f)
    img = txt2img(config)
    save_image(img, config)
    

