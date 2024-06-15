from enum import Enum

from PIL import Image
from PIL import ImageDraw
import io
import psycopg2
from PIL import Image
import uuid
import os
from minio import Minio
from os import environ

from remove_background import remove_background

conn = psycopg2.connect(dsn=environ.get('DATABASE_URL'))
cursor = conn.cursor()

def saveFileToS3(body, file_path):
    uuidStr = str(uuid.uuid4())
    file_stat = os.stat(file_path)
    with open(file_path, 'rb') as file_data:
        client = Minio(environ.get('S3_ENDPOINT'), environ.get('S3_ACCESS_KEY'), environ.get('S3_SECRET_KEY'), secure=False)
        bucket = environ.get('S3_BUCKET_NAME')
        if False == client.bucket_exists(bucket):
            client.make_bucket(bucket)
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

# Отношение ширины к высоте для выбранных типов баннеров
class BannerType(Enum):
    SQUARE = {"name": "square", "ratio": 1}
    GHOST_BANNER_SMALL = {"name": "ghost_banner_small", "ratio": 5}
    GHOST_BANNER_MEDIUM = {"name": "ghost_banner_medium", "ratio": 3}
    NBO_BANNER = {"name": "nbo_banner", "ratio": 1.8}
    RECTANGLE_MB = {"name": "rectangle_mb", "ratio": 0.9}
    PART_TRANSPARENT_MB = {"name": "part_transparent", "ratio": 0.89}


class BannerColor(Enum):
    BLUE = "#BDD7FE"
    WHITE = "#FFFFFF"
    VIOLET = "#7164DA"


# Варианты расположения контента в зависимости от типа баннера
class ContentPosition(Enum):
    SQUARE_BANNER_TOP = "sqb_top"
    SQUARE_BANNER_BOTTOM = "sqb_bottom"
    GHOST_BANNER_START = "gb_start"
    GHOST_BANNER_END = "gb_end"
    NBO_BANNER_TOP_START = "nbob_top_start"
    NBO_BANNER_TOP_END = "nbob_top_end"
    NBO_BANNER_BOTTOM_START = "nbob_bottom_start"
    NBO_BANNER_BOTTOM_END = "nbob_bottom_end"
    PART_TRANSPARENT_BANNER_BOTTOM = "ptb_bottom"
    PART_TRANSPARENT_BANNER_TOP = "ptb_top"

def generate_banner(
        input_img: str,
        banner_color: str,
        banner_type: BannerType = BannerType.GHOST_BANNER_SMALL, #тип баннера, расположение изображения
        content_position: str = ContentPosition.GHOST_BANNER_END.value, #цвет фона
):
    png_image = remove_background(input_img)
    result = None
    result_width = 0
    result_height = 0

    match banner_type:
        case BannerType.SQUARE:
            result_width = png_image.width * 2
            result_height = png_image.width * 2
            result = Image.new(mode="RGBA", size=(result_width, result_height),
                               color=(255, 255, 255, 0))
            draw = ImageDraw.Draw(result)
            draw.rounded_rectangle(
                ((0, 0), (result.width, result.height)),
                100, fill=banner_color
            )

        case BannerType.NBO_BANNER:
            result_height = png_image.height * 2
            result_width = int(result_height * BannerType.NBO_BANNER.value["ratio"])
            result = Image.new(mode="RGBA", size=(result_width, result_height),
                               color=(255, 255, 255, 0))
            draw = ImageDraw.Draw(result)
            draw.rounded_rectangle(
                ((0, 0), (result.width, result.height)),
                100, fill=banner_color
            )
        case BannerType.GHOST_BANNER_SMALL:
            result_width = png_image.height * BannerType.GHOST_BANNER_SMALL.value["ratio"]
            result_height = png_image.height
            result = Image.new(mode="RGBA", size=(result_width, result_height),
                               color=(255, 255, 255, 0))
            draw = ImageDraw.Draw(result)
            draw.rounded_rectangle(
                ((0, 0), (result.width, result.height)),
                100, fill=banner_color
            )

        case BannerType.GHOST_BANNER_MEDIUM:
            result_width = png_image.height * BannerType.GHOST_BANNER_MEDIUM.value["ratio"]
            result_height = png_image.height
            result = Image.new(mode="RGBA", size=(result_width, result_height),
                               color=(255, 255, 255, 0))
            draw = ImageDraw.Draw(result)
            draw.rounded_rectangle(
                ((0, 0), (result.width, result.height)),
                100, fill=banner_color
            )

        case BannerType.PART_TRANSPARENT_MB:
            result_width = int(png_image.width * 1.2)
            result_height = int(result_width * (1 / BannerType.PART_TRANSPARENT_MB.value["ratio"]))
            result = Image.new(mode="RGBA", size=(result_width, result_height),
                               color=(255, 255, 255, 0))
            draw = ImageDraw.Draw(result)
            draw.rounded_rectangle(
                ((0, 0), (result_width, result_height * 0.7)),
                radius=100, fill=banner_color
            )
        case BannerType.RECTANGLE_MB:
            result_width = png_image.width
            result_height = int(result_width * (1 / BannerType.RECTANGLE_MB.value["ratio"]))
            result = Image.new(mode="RGBA", size=(result_width, result_height),
                               color=(255, 255, 255, 0))
            draw = ImageDraw.Draw(result)
            draw.rounded_rectangle(
                ((0, 0), (result.width, result.height)),
                100, fill=banner_color
            )

    match content_position:
        case ContentPosition.SQUARE_BANNER_TOP.value:
            result.paste(png_image, (int(result_width / 2), 0), mask=png_image)
        case ContentPosition.SQUARE_BANNER_BOTTOM.value:
            result.paste(png_image, (int(result_width / 2), int(result_width / 2)), mask=png_image)
        case ContentPosition.GHOST_BANNER_START.value:
            result.paste(png_image, (0, 0), mask=png_image)
        case ContentPosition.GHOST_BANNER_END.value:
            result.paste(png_image, (result_width - png_image.width, 0), mask=png_image)
        case ContentPosition.NBO_BANNER_BOTTOM_START.value:
            result.paste(png_image, (0, result_height - png_image.height), mask=png_image)
        case ContentPosition.NBO_BANNER_BOTTOM_END.value:
            result.paste(png_image, (result_width - png_image.width, result_height - png_image.height), mask=png_image)
        case ContentPosition.NBO_BANNER_TOP_END.value:
            result.paste(png_image, (result_width - png_image.width, 0), mask=png_image)
        case ContentPosition.NBO_BANNER_TOP_START.value:
            result.paste(png_image, (0, 0), mask=png_image)
        case ContentPosition.PART_TRANSPARENT_BANNER_BOTTOM.value:
            result.paste(png_image, (0, result_height - png_image.height), mask=png_image)
        case ContentPosition.PART_TRANSPARENT_BANNER_TOP.value:
            result.paste(png_image, (0, 0), mask=png_image)

    return result

def gen_banner(body):
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
    image = Image.open(io.BytesIO(response.data))
    match body['options']['type']:
        case 'SQUARE':
            baner_type = BannerType.SQUARE
            pass
        case 'GHOST_BANNER_SMALL':
            baner_type = BannerType.GHOST_BANNER_SMALL
            pass
        case 'GHOST_BANNER_MEDIUM':
            baner_type = BannerType.GHOST_BANNER_MEDIUM
            pass
        case 'NBO_BANNER':
            baner_type = BannerType.NBO_BANNER
            pass
        case 'RECTANGLE_MB':
            baner_type = BannerType.RECTANGLE_MB
            pass
        case 'PART_TRANSPARENT_MB':
            baner_type = BannerType.PART_TRANSPARENT_MB
            pass
    result_img = generate_banner(
        input_img=image,
        banner_color=BannerColor(body['options']['color']).value,
        banner_type=baner_type,
        content_position=ContentPosition(body['options']['position']).value,
    )
    uuidStr = str(uuid.uuid4())
    file_path = "./images/" + uuidStr + ".png"
    result_img.save(file_path)
    saveFileToS3(body, file_path)
    
    
    
    
# generate_banner(
    # input_path="photo_2024-06-11_12-17-39.jpg",
    # output_path="res_banner.png",
    # banner_color=BannerColor.VIOLET.value,
    # banner_type=BannerType.RECTANGLE_MB,
    # content_position=ContentPosition.PART_TRANSPARENT_BANNER_BOTTOM.value,
# )
