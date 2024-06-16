import torch
from diffusers import AutoPipelineForInpainting

from PIL import Image
import json
import os
import uuid
import psycopg2
from os import environ
from minio import Minio
import io

conn = psycopg2.connect(dsn=environ.get('DATABASE_URL'))
cursor = conn.cursor()
client = Minio(environ.get('S3_ENDPOINT'), environ.get('S3_ACCESS_KEY'), environ.get('S3_SECRET_KEY'), secure=False)
bucket = environ.get('S3_BUCKET_NAME')
if False == client.bucket_exists(bucket):
    client.make_bucket(bucket)

def inpaint_inference(config, options, original_image, mask) -> Image: 
    sd_path = config['inpaint']["stable_diffusion_path"]

    lora_rel_path = config["lora_path"]
    lora_abs_path = os.path.join(os.path.dirname(__file__), lora_rel_path)
    lora_dir, lora_path = os.path.split(lora_abs_path)

    device = config["device"]

    p_user = options['positive_prompt']
    n_user = options['negative_prompt']
    # height = options['height']
    # width = options['width']

    p_start = config['inpaint']['p_start']
    p_end = config['inpaint']['p_end']
    n_end = config['inpaint']['n_end']

    guidance_scale = config['guidance_scale']
    strength = config['strength']

    lora_scale = config['lora_scale']
    num_inference_steps = config['num_inference_steps']

    pipe = AutoPipelineForInpainting.from_pretrained(sd_path, torch_dtype=torch.float16, variant="fp16").to("cuda")
    pipe.load_lora_weights(pretrained_model_name_or_path_or_dict=lora_dir, weight_name=lora_path, adapter_name="gpb")
    pipe.to(device)

    # load base and mask image
    init_image = original_image
    mask_image = mask

    positive_prompt = f"{p_start} {p_user} {p_end}"
    negative_prompt = f"{n_user} {n_end}"

    image = pipe(prompt=positive_prompt, \
                 negative_prompt=negative_prompt, 
                image=init_image, mask_image=mask_image, 
                num_inference_steps=num_inference_steps,\
                cross_attention_kwargs={"scale": lora_scale}).images
    return image


def save_image(image, config):
    save_path = config["save_path"]
    dirname = os.path.dirname(save_path)
    if not os.path.exists(dirname):
        os.mkdir(dirname)
    image.save(save_path)


def inpaint(cfg_path, body, original_image, mask):
    with open(cfg_path) as f:
        config = json.load(f)
    images = inpaint_inference(config, body['options'], original_image, mask)
    
    save_path = config["save_path"]
    dirname = os.path.dirname(save_path)
    if not os.path.exists(dirname):
        os.mkdir(dirname)

    for image in images:
        uuidStr = str(uuid.uuid4())
        file_path = save_path + uuidStr + ".png"
        image.save(file_path)
        saveFileToS3(body, file_path)
    
def saveFileToS3(body, file_path):
    uuidStr = str(uuid.uuid4())
    file_stat = os.stat(file_path)
    with open(file_path, 'rb') as file_data:
        result = client.put_object(
            bucket,
            f"{uuidStr}.png",
            file_data,
            content_type="image/png",
            length=file_stat.st_size
        )
        
    os.remove(file_path)
    user_id = body["user_id"]
    for history in body['history_ids']:
        historyId = history["id"]
        insert_query = f"UPDATE history set status='done', object_name='{result.object_name}' WHERE user_id={user_id} AND id={historyId}"
        cursor.execute(insert_query)
    conn.commit()