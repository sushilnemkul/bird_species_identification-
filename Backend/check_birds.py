import os
from flask import Flask
from models import db, Bird

# Setup minimal app to query DB
app = Flask(__name__)
# Try to get DB URL from .env or use the one I saw
app.config['SQLALCHEMY_DATABASE_URL'] = 'postgresql://postgres:admin@localhost:5433/BirdSpecies'
# Wait, SQLALCHEMY_DATABASE_URI is the correct key
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@localhost:5433/BirdSpecies'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    try:
        count = Bird.query.count()
        print(f"Total birds in database: {count}")
        if count > 0:
            birds = Bird.query.all()
            for b in birds[:5]:
                print(f"- {b.common_name}")
    except Exception as e:
        print(f"Error querying database: {e}")
