from PIL import Image

def generate_mask(
        top_left: tuple[int, int],
        bottom_right: tuple[int, int],
        input_path: str,
        output_path: str,
):
    original_image = Image.open(input_path)
    mask = Image.new(mode="RGB",size=(original_image.width, original_image.height),color=(0,0,0))
