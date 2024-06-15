from PIL import Image, ImageDraw
import psycopg2
import uuid
import io
from minio import Minio
from os import environ


conn = psycopg2.connect(dsn=environ.get('DATABASE_URL'))
cursor = conn.cursor()

def generate_mask(
    original_image,
    body
): 
    mask = Image.new(mode="RGB", size=(original_image.width, original_image.height), color=(0, 0, 0))
    draw = ImageDraw.Draw(mask)
    
    result = string_to_tuples(body['options']['mask'])
    draw.polygon(result, fill="white")
    
    return mask

def string_to_tuples(string):
    """Преобразует строку в список кортежей из координат.

    Args:
        string: Строка вида "x,y x1,y1 x2,y2 ...".

    Returns:
        Список кортежей координат: [(x, y), (x1, y1), (x2, y2), ...].
    """
    tuples = []
    parts = string.split()
    for part in parts:
        x, y = map(int, part.split(','))
        tuples.append((x, y))
    return tuples

# generate_mask(
#     points=((88, 91), (209, 59), (247, 96), (264, 219), (216, 226), (160, 219), (185, 144)),
#     input_path="./photo_2024-06-11_12-17-48.jpg",
#     output_path="./mask.png"
# )