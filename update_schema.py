
import os
from dotenv import load_dotenv
from flask import Flask
from sqlalchemy import text
from Backend.models import db

# Load env
load_dotenv(dotenv_path='Backend/.env')

app = Flask(__name__)
# Config
postgres_uri = os.getenv('DATABASE_URL')
sqlite_uri = 'sqlite:///bird_app.db'
app.config['SQLALCHEMY_DATABASE_URI'] = postgres_uri if postgres_uri else sqlite_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    try:
        # Check if we are using SQLite or Postgres
        engine = db.engine
        
        # Add column command depends on DB type, but basic SQL is standard
        # For simplicity, we'll try to execute the ALTER TABLE command
        with engine.connect() as conn:
            # Check if column exists (naive check)
            try:
                conn.execute(text("SELECT role FROM users LIMIT 1"))
                print("Column 'role' already exists.")
            except Exception:
                print("Adding 'role' column...")
                conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
                conn.commit()
                print("Column added successfully.")
                
            # Set a default admin for testing
            print("Setting admin user...")
            # Update specific user to admin if needed, or create one
            conn.execute(text("UPDATE users SET role='admin' WHERE email='admin@example.com'"))
            conn.commit()
            
    except Exception as e:
        print(f"Error: {e}")
