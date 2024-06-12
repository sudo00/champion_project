from PIL import Image, ImageDraw


def generate_mask(
        top_left: tuple[int, int],
        bottom_right: tuple[int, int],
        input_path: str,
        output_path: str,
):
    original_image = Image.open(input_path)
    mask = Image.new(mode="RGB", size=(original_image.width, original_image.height), color=(0, 0, 0))
    draw = ImageDraw.Draw(mask)
    draw.rectangle((top_left, bottom_right), fill="white")
    mask.save(output_path)

generate_mask(
    top_left=(50, 50),
    bottom_right=(150, 150),
    input_path="./photo_2024-06-11_12-17-48.jpg",
    output_path="./mask.png"
)