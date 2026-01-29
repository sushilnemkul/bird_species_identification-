import tensorflow as tf
from PIL import Image
import numpy as np

MODEL_PATH = "saved_model/bird_cnn_model_final.keras"
IMG_PATH = "Backend/dataset/training_data/test/Common Kingfisher/ML125795771.jpg"
IMG_HEIGHT = 160
IMG_WIDTH = 160

try:
    print("Loading model...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded.")
    # model.summary() # Prints to stdout, might get lost
    
    config = model.get_config()
    print(f"Model config input: {config.get('layers', [])[0]['config'].get('batch_input_shape')}")

    try:
        print(f"Model Input Shape: {model.input_shape}")
    except:
        print("Could not access model.input_shape")

    for i, layer in enumerate(model.layers):
        print(f"Layer {i}: {layer.name}")
        # print config to see input shape if available
        # print(layer.get_config())

    # Skip prediction to ensure we get the logs


    # Skip prediction to ensure we get the logs
    # print("Loading image...")
    # ...


except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
