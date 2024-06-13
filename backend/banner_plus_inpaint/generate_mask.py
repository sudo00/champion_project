from PIL import Image, ImageDraw


def generate_mask(
        points: tuple,
        input_path: str,
        output_path: str,
):
    original_image = Image.open(input_path)
    mask = Image.new(mode="RGB", size=(original_image.width, original_image.height), color=(0, 0, 0))
    draw = ImageDraw.Draw(mask)
    draw.polygon(points, fill="white")
    mask.save(output_path)

# generate_mask(
#     points=((88, 91), (209, 59), (247, 96), (264, 219), (216, 226), (160, 219), (185, 144)),
#     input_path="./photo_2024-06-11_12-17-48.jpg",
#     output_path="./mask.png"
# )