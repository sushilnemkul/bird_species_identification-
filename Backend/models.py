from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    sightings = db.relationship('BirdSighting', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
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
    
    def to_dict(self):
        return {
            'id': self.id,
            'commonName': self.common_name,
            'scientificName': self.scientific_name,
            'description': self.description,
            'habitat': self.habitat,
            'rarity': self.rarity,
            'image': self.image_url
        }

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
