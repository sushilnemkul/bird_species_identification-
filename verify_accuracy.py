import tensorflow as tf
import os
import numpy as np
from PIL import Image

IMG_HEIGHT = 160
IMG_WIDTH = 160
BATCH_SIZE = 32

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "Backend", "dataset", "training_data")
TEST_DIR = os.path.join(DATASET_DIR, "test")
MODEL_PATH = os.path.join(BASE_DIR, "Backend", "saved_model", "best_bird_model.keras")

print(f"Checking model at: {MODEL_PATH}")
print(f"Checking test data at: {TEST_DIR}")

if not os.path.exists(MODEL_PATH):
    print("❌ Model file not found!")
    exit()

if not os.path.exists(TEST_DIR):
    print("❌ Test directory not found!")
    exit()

# Load Model
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully.")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    exit()

# Load Test Dataset using the same method as training
print("Loading test dataset...")
test_ds = tf.keras.utils.image_dataset_from_directory(
    TEST_DIR,
    image_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE,
    shuffle=False
)

class_names = test_ds.class_names
print(f"Classes found: {class_names}")

# Evaluate
print("\nEvaluating model on test set...")
loss, accuracy = model.evaluate(test_ds)
print(f"\n📊 Test Accuracy: {accuracy * 100:.2f}%")
print(f"📊 Test Loss: {loss:.4f}")

# Manual Test on Single Image (The one used in end-to-end test)
sample_img_path = os.path.join(TEST_DIR, "Common Kingfisher", "ML125795771.jpg")
if os.path.exists(sample_img_path):
    print(f"\nTesting specific image: {sample_img_path}")
    img = Image.open(sample_img_path).convert('RGB')
    img = img.resize((IMG_WIDTH, IMG_HEIGHT))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) # Create batch axis

    preds = model.predict(img_array)
    score = tf.nn.softmax(preds[0])
    
    # Check if model has Softmax layer output already
    # If the last layer is Softmax, preds[0] sums to 1.
    # If Dense, it might be logits (though training script output said 'softmax')
    
    print(f"Raw outputs: {preds[0]}")
    print(f"Sum of outputs: {np.sum(preds[0])}")
    
    predicted_class = class_names[np.argmax(preds[0])]
    print(f"Predicted: {predicted_class}")
    print(f"Actual: Common Kingfisher")
else:
    print(f"\nSample image not found: {sample_img_path}")
