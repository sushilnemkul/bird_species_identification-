import sys
import os

# Add Backend to path
sys.path.append(os.path.join(os.getcwd(), 'Backend'))

from Backend.app import app, db
from Backend.models import Bird, BirdSighting

def migrate():
    with app.app_context():
        print("Starting database migration...")
        
        # In a real app we'd use Flask-Migrate, but for dev we can drop and recreate 
        # OR just add the columns. Since we want to re-seed anyway, let's just clear Bird table.
        
        # Drop and recreate all tables to ensure schema is fully updated with new columns
        print("Dropping existing tables to refresh schema (dev mode)...")
        db.drop_all()
        db.create_all()
        
        print("Database schema updated.")
        
        # Clear existing birds to avoid duplicates during re-seeding
        num_deleted = db.session.query(Bird).delete()
        db.session.commit()
        print(f"Cleared {num_deleted} existing birds from the database.")
        print("Migration complete! You can now run 'python seed_birds.py' to populate the new data.")

if __name__ == "__main__":
    migrate()
