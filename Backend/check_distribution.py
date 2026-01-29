import tensorflow as tf
from collections import Counter
import os

# Set working directory to Backend to find dataset
os.chdir(os.path.dirname(os.path.abspath(__file__)))

TRAIN_DIR = os.path.join("dataset", "training_data", "train")
OUTPUT_FILE = "distribution_result.txt"

if not os.path.exists(TRAIN_DIR):
    with open(OUTPUT_FILE, "w") as f:
        f.write(f"❌ Directory not found: {TRAIN_DIR}")
    exit(1)

# Load with minimal settings just to get labels
train_ds = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=(32, 32),
    batch_size=32,
    shuffle=False,
    verbose=False
)

class_names = train_ds.class_names
all_labels = []
for _, labels in train_ds:
    all_labels.extend(labels.numpy())

counts = Counter(all_labels)

with open(OUTPUT_FILE, "w", encoding='utf-8') as f:
    f.write("📊 Class Distribution:\n")
    for i, name in enumerate(class_names):
        f.write(f"  - {name}: {counts.get(i, 0)} images\n")
    f.write(f"\nTotal training images: {len(all_labels)}\n")

print(f"Results written to {OUTPUT_FILE}")
