import random
from transformers import pipeline, GPT2LMHeadModel, GPT2Tokenizer, pipeline
import pickle
import os.path

def read_generator():
    if False == os.path.isfile('generator.pkl'):
        return None

    with open('generator.pkl', 'rb') as inp:
        generator = pickle.load(inp)

    return generator

def save_generator(generator):
    with open('generator.pkl', 'wb') as outp:
        pickle.dump(generator, outp)

#constants 
# Load a text generation model and tokenizer
# generator = read_generator()
# if None == generator:
model_name = 'gpt2'
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)
# Define the text generation pipeline
generator = pipeline('text-generation', model=model, tokenizer=tokenizer)
    # save_generator(generator)



# Define possible objects for each category and offer
offer_objects = {
    "car loan": ["car", "car wheels", "car keys", "car steering wheel", "car at gas station", "electric car charging"],
    "home mortgage": ["house", "high-rise building", "stack of coins under the roof"],
    "credit card": {
        "travel": ["suitcase", "passport", "airplane ticket"],
        "health and beauty": ["lipstick", "makeup set", "perfume"],
        "mobile communications and internet": ["smartphone", "SIM card", "mobile tower"],
        "gas stations": ["fuel pump", "gas station", "fuel nozzle"]
    },
    "premium account": {
        "travel": ["luxury suitcase", "passport with cover", "first class airplane ticket"],
        "health and beauty": ["luxury lipstick", "makeup palette", "designer perfume"],
        "mobile communications and internet": ["luxury smartphone", "premium SIM card", "mobile tower"],
        "gas stations": ["fuel pump", "luxury gas station", "golden fuel nozzle"]
    }
}

# Define color restrictions
dir_color_restrictions = {
    "premium account": {
        "primary": ["maroon", "dark blue"],
        "secondary": ["white", "black"]#, "grey", "pale pink", "pink", "pale violet", "violet", "green"]
    },
    "credit card": {
        "primary": ["blue", "orange"],
        "secondary": ["white", "black"]#, "grey", "pale pink", "pink", "pale violet", "violet", "green"]
    },
    "car loan": {
        "primary": ["blue", "orange"],
        "secondary": ["white", "black"]#, "grey"]
    },
    "home mortgage": {
        "primary": ["blue", "orange"],
        "secondary": ["white", "black"]#, "grey"]
    }
}

def generate_objects(category, color_restrictions, num_objects=3):
    objects = {
        "travel": ["suitcase", "passport", "airplane ticket"],
        "health and beauty": ["lipstick", "makeup set", "perfume"],
        "mobile communications and internet": ["smartphone", "SIM card", "mobile tower"],
        "gas stations": ["fuel pump", "gas station", "fuel nozzle"],
    }
    objects_str = "objects:\n1. "  #f"objects':\n1.  globe\n2.  passport\n3"
    for i, obj in enumerate(objects[category]):
      objects_str += f"{obj}\n{i+2}. "
    # Prompt template with more context
    prompt = (
        f"List some colored objects related to the category {category} using only the specified colors,"
        f"Primary colors: {', '.join(color_restrictions['primary'])}\n"
        f"Secondary colors: {', '.join(color_restrictions['secondary'])}\n"
        f"Do not use any other colors. Use only the specified colors.\n"
        )
    prompt+=objects_str
    # Generate text
    input_ids = tokenizer(prompt, return_tensors='pt').input_ids
    outputs = model.generate(input_ids, max_length=80, num_return_sequences=1, pad_token_id=tokenizer.eos_token_id)
    # Decode the generated text
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    # Extract the list of objects from the generated text
    generated_objects = generated_text.replace(prompt, "").strip().split("\n")
    objects_list = [obj.split('.')[1].strip() for obj in generated_objects if '.' in obj]
    # Return a limited number of objects
    return objects_list[:num_objects]


def generate_composition(objects):
    
    examples = [
        {"objects": ["stack of blue banknotes","dark tie"], "composition":"A stack of blue banknotes wrapped with a dark tie."},
        {"objects": ["A blue globe","orange orbit", "coin"], "composition":"A blue globe with an orange orbit line and a coin inserted at the top"},
        {"objects": ["dark globe","maroon paper plane"], "composition":"A dark globe with a maroon paper plane pointing towards it"},
        {"objects": ["pair of car keys","maroon key fob and dark blue remote"], "composition":"A pair of car keys with a maroon key fob and a dark blue remote."},
        {"objects": ["blue credit card","diamond", "daisy flower"], "composition":"A blue credit card with an orange design next to a diamond and a daisy flower."},
        {"objects": ["blue credit card","gift box","blue bow tie"], "composition":"A blue credit card with an orange design in front of a gift box containing a blue bow tie."},
        {"objects": ["blue credit card","Christmas decoration", "orange slice"], "composition":"A blue credit card with an orange design alongside a Christmas decoration and an orange slice."},
        {"objects": ["car steering wheel","blue shield keychain"], "composition": "A car steering wheel with a blue shield keychain."},
        {"objects": ["blue car","smoke"], "composition":"A blue car emitting smoke."},
        {"objects": ["black car key","red bow"], "composition":"A black car key with a red bow."},
        {"objects": ["blue electric car","orange charging station"], "composition":"A blue electric car at an orange charging station."}#,

        # {"objects": ["dark blue academic cap","gold tassel"], "composition":"A dark blue academic cap with a gold tassel in a premium style."},
        # {"objects": ["smartwatch", "blue checkmark"], "composition":"A smartwatch with a blue checkmark on the screen."},
        # {"objects": ["blue and orange credit card","black ATM machine"], "composition":"A blue and orange credit card being inserted into a black ATM machine."},
        # {"objects": ["blue shield", "silver and gold coins"], "composition":"A blue shield with silver and gold coins."},
        # {"objects": ["orange car","patches of snow"], "composition":"An orange car covered in patches of snow."},
        # {"objects": ["blue car", "orange bow"], "composition":"A blue car with an orange bow on top."},
        # {"objects": ["silver car key fob","orange lock symbols","blue snowflake keychain"], "composition":"A silver car key fob with orange lock symbols and a blue snowflake keychain."},
        # {"objects": ["blue and gold speedometer"], "composition":"A blue and gold speedometer."},
        # {"objects": ["classical bank building","blue accents", "gold coin"], "composition":"A classical bank building with blue accents and a gold coin."},
        # {"objects": ["small house", "palm tree", "pool"], "composition":"A small house with a palm tree and a rooftop pool."},
        # {"objects": ["stack of car tires","gold coin","currency symbol"], "composition":"A stack of car tires next to a gold coin with a currency symbol. "},
        # {"objects": ["blue vase","pink tulips","stack of gold coins"], "composition":"A blue vase with pink tulips next to a stack of gold coins."},
        # {"objects": ["stack of blue banknotes", "orange and grey coins", "airplane and car symbols"], "composition":"A stack of blue banknotes with orange and grey coins displaying airplane and car symbols."},
        # {"objects": ["blue credit card", "orange arrow", "blue shopping bag"], "composition":"A blue credit card with an orange arrow wrapped around a blue shopping bag."},
        # {"objects": ["blue credit card", "glowing checkmark"], "composition":"A blue credit card with an orange design and a glowing checkmark. "},
        # {"objects": ["blue credit card with an orange design", "gift box","orange ribbon", "silver streamers" ], "composition":"A blue credit card with an orange design accompanied by a gift box with an orange ribbon and silver streamers."}


      ]
    # Prepare the prompt
    prompt = "Here are some example compositions with given objects:\n\n"

    # Add examples for each offer
    for example in examples:
        prompt += f"Objects: {example['objects']}, Composition: {example['composition']}" + "\n"
        prompt += "\n"
    # Add the new category, offer, and color restrictions to the prompt
    prompt += (
        f"Now, generate a new composition for the following objects:\n"
        f"Objects:{objects}\n"
        f"Composition: A"
     )
    # Generate text
    generated_text = generator(prompt, max_new_tokens=50, num_return_sequences=1, pad_token_id=50256)[0]['generated_text']
    # Extract the composition
    generated_composition = generated_text.replace(prompt, "").strip().split("\n")[0]

    return generated_composition
    

def get_objects(offer, category, dir_color_restrictions):
    if offer in ["car loan", "home mortgage"]:
        objects = offer_objects[offer]
    else:
        color_restrictions = dir_color_restrictions[offer]
        objects = generate_objects(category, color_restrictions)
    if offer== "credit card":
        objects.append('blue credit card with orange ornament')
    return objects

def get_composition(objects):
    # Choose random objects for the composition
    selected_objects = random.sample(objects, min(2, len(objects)))
    # Optionally add coins, bows, or bills
    optional_objects = ["coins", "bows", "bills"]
    if random.random() < 0.8:  # 80% chance to add one of the optional objects
        selected_objects.append(random.choice(optional_objects))
    composition =  generate_composition(selected_objects)
    return composition


# def generate_promp_by_user_info(offer, category):
#     objects = get_objects(offer, category, dir_color_restrictions)
    # print("Generated Objects:", objects)


def run(product_type, category):
    objects = get_objects(product_type, category, dir_color_restrictions)
    composition = str(get_composition(objects))
    if product_type == 'premium account':
        composition+=', in premium style.'
    return composition


##usage examples
# # Example usage for step 1
# offer = "credit card"
# category = "health and beauty"
# objects = get_objects(offer, category, dir_color_restrictions)
# print("Generated Objects:", objects)

# # Example usage for step 2
# color_restrictions_offer = color_restrictions[offer]
# composition = get_composition(objects)
# print("Generated Composition:", composition)

# # Another example usage for step 1 and step 2
# offer = "premium account"
# category = "travel"
# objects = get_objects(offer, category, dir_color_restrictions)
# print("Generated Objects:", objects)

# color_restrictions_offer = color_restrictions[offer]
# composition = get_composition(objects)
# print("Generated Composition:", composition)

# # Example usage for step 1
# offer = "car loan"
# category = "health and beauty"
# objects = get_objects(offer, category, dir_color_restrictions)
# print("Generated Objects:", objects)

# color_restrictions_offer = color_restrictions[offer]
# composition = get_composition(objects)
# print("Generated Composition:", composition)

