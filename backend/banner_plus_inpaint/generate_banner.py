from PIL import Image
from PIL import ImageDraw

from remove_background import remove_background

def generate_banner(
        input_path: str,
        output_path: str,
        banner_type: str = "",
        color: str = "",
):
    buffer_path = "./buffer.png"
    remove_background(input_path, buffer_path)
    png_image = Image.open(buffer_path)

    result_width = int(png_image.width * 5.48148)
    result_height = png_image.width
    transparent_bg = Image.new(mode="RGBA", size=(int(png_image.width * 5.48148), png_image.width), color=(255,255,255, 0))
    draw = ImageDraw.Draw(transparent_bg)
    draw.rounded_rectangle(
        ((0, 0), (transparent_bg.width, transparent_bg.height)),
        100, fill="#5eb5fe"
    )

    transparent_bg.paste(png_image, (result_width - png_image.width - 50, 0), mask=png_image)
    transparent_bg.save(output_path)


generate_banner(input_path="photo_2024-06-11_12-17-45.jpg", output_path="res_banner.png")