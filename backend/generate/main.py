import sys
import os
import pika
from inference_txt2img import inference 
from inference_inpaint import inpaint
from generate_banner import gen_banner
from generate_mask import generate_mask
import json
import psycopg2
import uuid
import io
from minio import Minio
from os import environ
from PIL import Image, ImageDraw

conn = psycopg2.connect(dsn=environ.get('DATABASE_URL'))
cursor = conn.cursor()

def main():
    credentials = pika.PlainCredentials('user', 'password')
    parameters = pika.ConnectionParameters('rabbitmq', 5672, '/', credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    channel.queue_declare(queue='generate')

    def callback(ch, method, properties, body):
        body = json.loads(body)
        typeGen = body["type"]
        print(body, file=sys.stderr)
        
        if 'image' == typeGen:
            inference('config.json', body)
        
        if 'banner' == typeGen:
            gen_banner(body)
        
        if 'inpaint' == typeGen:
            image_id = body['options']['image_id']
            select = f"SELECT object_name FROM history WHERE id={image_id}"
            cursor.execute(select)
            object_name = cursor.fetchone()[0]
            client = Minio(environ.get('S3_ENDPOINT'), environ.get('S3_ACCESS_KEY'), environ.get('S3_SECRET_KEY'), secure=False)
            bucket = environ.get('S3_BUCKET_NAME')
            if False == client.bucket_exists(bucket):
                client.make_bucket(bucket)
            response = client.get_object(bucket_name=bucket, object_name=object_name)

            # Создаем BytesIO объект для хранения изображения
            original_image = Image.open(io.BytesIO(response.data)) 
            mask = generate_mask(original_image, body)
            inpaint('config_inpaint.json', body, original_image, mask)
        
        

    channel.basic_consume(queue='generate', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C', file=sys.stderr)
    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)