from enum import Enum

from PIL import Image
from PIL import ImageDraw

from remove_background import remove_background


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
    NBO_BANNER_TOP_START = "nbobct_top_start"
    NBO_BANNER_TOP_END = "nbobcp_top_end"
    NBO_BANNER_BOTTOM_START = "nbob_bottom_start"
    NBO_BANNER_BOTTOM_END = "nbob_bottom_end"
    PART_TRANSPARENT_BANNER_BOTTOM = "ptb_bottom"
    PART_TRANSPARENT_BANNER_TOP = "ptb_top"

def generate_banner(
        input_path: str,
        output_path: str,
        banner_color: str,
        banner_type: BannerType = BannerType.GHOST_BANNER_SMALL,
        content_position: str = ContentPosition.GHOST_BANNER_END.value,
):
    buffer_path = "./buffer.png"
    remove_background(input_path, buffer_path)
    png_image = Image.open(buffer_path)
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
    result.save(output_path)


# generate_banner(
    # input_path="photo_2024-06-11_12-17-39.jpg",
    # output_path="res_banner.png",
    # banner_color=BannerColor.VIOLET.value,
    # banner_type=BannerType.RECTANGLE_MB,
    # content_position=ContentPosition.PART_TRANSPARENT_BANNER_BOTTOM.value,
# )
