import sys
import os
import pika
from inference_txt2img import inference 
from inference_inpaint import inpaint
import json

mode_map = {
    'image': inference,
    'inpaint': inpaint,
    'banner': inference
}
config_map = {
    'image': "config.json",
    'inpaint': "config_inpaint.json",
    'banner': "config.json"
}

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
        
        mode = mode_map[typeGen]
        config_path = os.path.abspath(config_map[typeGen])
        
        if 'image' == typeGen:
            mode(config_path, body)
        
        

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