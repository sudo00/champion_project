from diffusers import StableDiffusionPipeline#, DiffusionPipeline
from diffusers import DPMSolverMultistepScheduler
from create_prompt import run
# from compel import Compel
import torch
from PIL import Image
import json
import os
import uuid
import psycopg2
from os import environ
from minio import Minio
import pickle
import os.path


conn = psycopg2.connect(dsn=environ.get('DATABASE_URL'))
cursor = conn.cursor()

client = Minio(environ.get('S3_ENDPOINT'), environ.get('S3_ACCESS_KEY'), environ.get('S3_SECRET_KEY'), secure=False)
bucket = environ.get('S3_BUCKET_NAME')
if False == client.bucket_exists(bucket):
    client.make_bucket(bucket)


def txt2img(config, options, historyIds, user_id):
    sd_path = config["inference"]["stable_diffusion_path"]

    lora_rel_path = config["lora_path"]
    lora_abs_path = os.path.join(os.path.dirname(__file__), lora_rel_path)
    lora_dir, lora_path = os.path.split(lora_abs_path)

    device = config["device"]

    p_user = options['positive_prompt'] # xor offer
    n_user = options['negative_prompt']
    offer = options['offer']
    category = options['category']
    if p_user=="":
        p_user = run(offer, category)
        for history in historyIds:
            historyId = history["id"]
            insert_query = f"SELECT options FROM history WHERE user_id={user_id} AND id={historyId}"
            cursor.execute(insert_query) 
            options = cursor.fetchone()[0]#json.loads(cursor.fetchone()[0])
            options['positive_prompt'] = p_user
            options_string = json.dumps(options)
            options_string = options_string.replace("'", "\"")
            insert_query = f"UPDATE history set options='{options_string}' WHERE user_id={user_id} AND id={historyId}"
            cursor.execute(insert_query) 
        conn.commit()


    height = options['height']
    width = options['width']
    num_images_per_prompt = int(options['count'])

    p_start = config['inference']['p_start']
    p_end = config['inference']['p_end']
    n_end = config['inference']['n_end']
    
    guidance_scale = config['guidance_scale']
    strength = config['strength']
    lora_scale = config['lora_scale']
    num_inference_steps = config['num_inference_steps']
    # pipe = read_pipe()
    # if None == pipe:
    pipe = StableDiffusionPipeline.from_pretrained(sd_path,  custom_pipeline="lpw_stable_diffusion",torch_dtype=torch.float32)
    
    scheduler=DPMSolverMultistepScheduler.from_pretrained("runwayml/stable-diffusion-v1-5", subfolder="scheduler")
    pipe.scheduler = scheduler

    pipe.load_lora_weights(pretrained_model_name_or_path_or_dict=lora_dir, weight_name=lora_path, adapter_name="gpb")
    pipe.to(device)
    # save_pipe(pipe)
    

    # тип продукта
    positive_prompt = f"{p_start} {p_user}  in gpb style, {p_end} This image is ideal for {offer} promotion"
    negative_prompt = f"{n_user} {n_end}"

    return pipe.text2img(prompt=positive_prompt, negative_prompt=negative_prompt,\
                height = height, width = width,  num_inference_steps=num_inference_steps, num_images_per_prompt = num_images_per_prompt, \
                cross_attention_kwargs={"scale": lora_scale}, guidance_scale=guidance_scale
                ).images # тут массив картинок, нужно сохранять их


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

def inference(cfg_path, body):
    with open(cfg_path) as f:
        config = json.load(f)\
            
    
    user_id = body["user_id"]
    for history in body['history_ids']:
        historyId = history["id"]
        insert_query = f"UPDATE history set status='in_progress' WHERE user_id={user_id} AND id={historyId}"
        cursor.execute(insert_query)
    conn.commit()

    images = txt2img(config, body["options"], body['history_ids'], body["user_id"])
    

    save_path = config["save_path"]
    dirname = os.path.dirname(save_path)
    if not os.path.exists(dirname):
        os.mkdir(dirname)

    for image in images:
        uuidStr = str(uuid.uuid4())
        file_path = save_path + uuidStr + ".png"
        image.save(file_path)
        saveFileToS3(body, file_path)

def read_pipe():
    if False == os.path.isfile('pipe.pkl'):
        return None

    with open('pipe.pkl', 'rb') as inp:
        pipe = pickle.load(inp)

    return pipe

def save_pipe(pipe):
    with open('pipe.pkl', 'wb') as outp:
        pickle.dump(pipe, outp)
