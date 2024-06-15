# pip install Pillow
# pip install rembg

from rembg import new_session, remove
from PIL import Image


# input_path = './photo_2024-06-11_12-17-48.jpg'
#
# # Store path of the output image in the variable output_path
# output_path = './res.png'

def remove_background(
        input_path: str,
        output_path: str,
):
    input_img = Image.open(input_path)
    session = new_session("u2netp")
    output = remove(input_img, session=session)
    output.save(output_path)
