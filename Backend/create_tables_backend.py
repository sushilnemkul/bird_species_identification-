import sys
import os

# Add parent directory to path to allow importing models if needed, 
# but effectively we just need to run app context.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db

with app.app_context():
    print("Creating all tables...")
    try:
        db.create_all()
        print("Tables created successfully.")
    except Exception as e:
        print(f"Error creating tables: {e}")
