import sys
import os

# Add Backend to python path
sys.path.append(os.path.join(os.getcwd(), 'Backend'))

from Backend.app import app, db
from sqlalchemy import text

with app.app_context():
    with db.engine.connect() as conn:
        try:
            print("Attempting to add 'role' column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
            conn.commit()
            print("✅ Column 'role' added successfully.")
        except Exception as e:
            if "duplicate column" in str(e).lower():
                print("ℹ️ Column 'role' already exists.")
            else:
                print(f"❌ Error adding column: {e}")

        # Create an admin user for testing
        try:
            conn.execute(text("UPDATE users SET role = 'admin' WHERE email = 'admin@example.com'"))
            conn.commit()
            print("✅ User 'admin@example.com' promoted to admin.")
        except Exception as e:
             print(f"❌ Error promoting admin: {e}")
