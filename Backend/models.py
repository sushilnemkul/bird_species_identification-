from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    sightings = db.relationship('BirdSighting', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'avatar': f"https://ui-avatars.com/api/?name={self.username}&background=random",
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Bird(db.Model):
    __tablename__ = 'birds'
    
    id = db.Column(db.Integer, primary_key=True)
    common_name = db.Column(db.String(100), unique=True, nullable=False)
    scientific_name = db.Column(db.String(100))
    description = db.Column(db.Text)
    habitat = db.Column(db.String(100))
    rarity = db.Column(db.String(50))
    image_url = db.Column(db.String(255))
    
    # New fields for detailed info
    wingspan = db.Column(db.String(100))
    lifespan = db.Column(db.String(100))
    conservation_status = db.Column(db.String(100))
    diet = db.Column(db.String(255))
    fun_fact = db.Column(db.Text)
    migration_status = db.Column(db.String(100))
    breeding_season = db.Column(db.String(100))
    hotspots = db.Column(db.String(255))
    
    images = db.relationship('BirdImage', backref='bird', lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'commonName': self.common_name,
            'scientificName': self.scientific_name,
            'description': self.description,
            'habitat': self.habitat,
            'rarity': self.rarity,
            'image': self.image_url,
            'images': [img.image_url for img in self.images] if self.images else [self.image_url] if self.image_url else [],
            'wingspan': self.wingspan,
            'lifespan': self.lifespan,
            'conservationStatus': self.conservation_status,
            'diet': self.diet,
            'funFact': self.fun_fact,
            'migrationStatus': self.migration_status,
            'breedingSeason': self.breeding_season,
            'hotspots': self.hotspots
        }

class BirdImage(db.Model):
    __tablename__ = 'bird_images'
    
    id = db.Column(db.Integer, primary_key=True)
    bird_id = db.Column(db.Integer, db.ForeignKey('birds.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.String(100))

class BirdSighting(db.Model):
    __tablename__ = 'bird_sightings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    bird_name = db.Column(db.String(100), nullable=False)
    scientific_name = db.Column(db.String(100))
    confidence = db.Column(db.Float, nullable=False)
    image_path = db.Column(db.String(255)) # Path to saved image if needed
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'bird_name': self.bird_name,
            'scientific_name': self.scientific_name,
            'confidence': self.confidence,
            'timestamp': self.timestamp.isoformat(),
            'image': self.image_path
        }
