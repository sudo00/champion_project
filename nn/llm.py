import argparse
from transformers import LlavaNextProcessor, LlavaNextForConditionalGeneration
import torch
from PIL import Image
from config import Config

# img_dir = Config.project_dir + '/' + '13-2/images/Mega-blue-car.png'
processor = LlavaNextProcessor.from_pretrained("llava-hf/llava-v1.6-mistral-7b-hf")

model = LlavaNextForConditionalGeneration.from_pretrained("llava-hf/llava-v1.6-mistral-7b-hf",
                                                          torch_dtype=torch.float16,
                                                          low_cpu_mem_usage=True,
                                                          load_in_4bit=True)

def main(gender: str, age: int, loan:str):
    # image = Image.open(img_dir)
    # gender = 'Female'
    # age = 18
    # loan = 'car loan'

    prompt = (f"I want to make an offer to my client and I would like to ask you to come up with a prompt for "
              f"an image that will be used as a commercial offer. "
              f"I have the following features: {{'gender': {gender}, 'age': {age}, 'loan type': {loan} }}."
              f" Come up with a prompt to generate an image based on these featurees."
              f" I want this image to attract my client's attention.")

    inputs = processor(text=prompt, return_tensors="pt").to("cuda:0")

    # autoregressively complete prompt
    output = model.generate(**inputs, max_new_tokens=100)

    ans = processor.decode(output[0], skip_special_tokens=True)
    ans = ans.split(prompt)[-1].strip()
    return ans

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--gender", type=str, required=True)
    parser.add_argument("--age", type=int, required=True)
    parser.add_argument("--loan", type=str, required=True)
    args = parser.parse_args()

    main(args.gender, args.age, args.loan)