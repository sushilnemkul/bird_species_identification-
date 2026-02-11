import os
import uuid
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import tensorflow as tf
import numpy as np
from PIL import Image
from dotenv import load_dotenv

from bird_info import get_bird_info
from models import db, User, BirdSighting, Bird, BirdImage

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure Uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    from flask import send_from_directory
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Configure CORS with environment variable support
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175').split(',')
CORS(app, origins=allowed_origins, supports_credentials=True)



# Database Config
postgres_uri = os.getenv('DATABASE_URL')
sqlite_uri = 'sqlite:///bird_app.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')

# Try to connect to the configured database
db_uri = postgres_uri if postgres_uri and 'YOUR_POSTGRES_PASSWORD_HERE' not in postgres_uri else sqlite_uri

if db_uri.startswith('postgresql'):
    try:
        from sqlalchemy import create_engine
        engine = create_engine(db_uri)
        connection = engine.connect()
        connection.close()
        app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
        logger.info("✅ Successfully connected to PostgreSQL (BirdSpecies)")
    except Exception as e:
        logger.error(f"❌ PostgreSQL connection failed: {e}")
        logger.info("⚠️ Falling back to SQLite as a safety measure.")
        app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_uri
else:
    logger.info("ℹ️ Using SQLite database (no PostgreSQL URL configured or defaults still present)")
    app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_uri

db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# Configuration
MODEL_PATH = "saved_model/bird_cnn_model_final.keras"
CLASS_NAMES = [
    'Asian Green Bee-Eater',
    'Common Kingfisher',
    'Common Myna',
    'Common Tailorbird',
    'Coppersmith Barbet',
    'Hoopoe',
    'House Crow',
    'Jungle Babbler',
    'Rufous Treepie',
    'White-Breasted Kingfisher'
]
IMG_HEIGHT = 192
IMG_WIDTH = 192

# Global model variable
model = None

def load_inference_model():
    """Load the trained bird identification model."""
    global model
    if os.path.exists(MODEL_PATH):
        try:
            logger.info(f"Loading model from {MODEL_PATH}...")
            model = tf.keras.models.load_model(MODEL_PATH)
            logger.info("✅ Model loaded successfully!")
        except Exception as e:
            logger.error(f"❌ Error loading model: {e}")
    else:
        logger.warning(f"⚠️  Model file not found at {MODEL_PATH}. Make sure training is complete.")

# Load model on startup
load_inference_model()

@app.route('/health', methods=['GET'])
def health_check():
    status = "ready" if model else "model_not_loaded"
    return jsonify({"status": status}), 200

# Auth Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user account."""
    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            logger.warning("Registration attempt with missing fields")
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            logger.warning(f"Registration attempt with existing email: {data['email']}")
            return jsonify({'error': 'An account with this email already exists'}), 400
        
        # Validate email format (basic check)
        if '@' not in data['email']:
            return jsonify({'error': 'Please provide a valid email address'}), 400
        
        # Validate password length
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
            
        user = User(
            username=data.get('name', data['email'].split('@')[0]),
            email=data['email'],
            password_hash=generate_password_hash(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
        logger.info(f"New user registered: {user.email}")
        return jsonify({'message': 'Account created successfully'}), 201
    except Exception as e:
        logger.error(f"Registration error: {e}", exc_info=True)
        db.session.rollback()
        return jsonify({'error': f'Registration error: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Authenticate user and return user data."""
    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data.get('email')).first()
        
        if user and check_password_hash(user.password_hash, data.get('password')):
            logger.info(f"User logged in: {user.email}")
            
            # Generate JWT Token (payload must be simple JSON serializable objects)
            user_data = user.to_dict()
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7) # 7 days expiration
            }, app.config['SECRET_KEY'], algorithm='HS256')

            return jsonify({
                'user': user_data,
                'role': user.role,
                'token': token
            }), 200
        
        logger.warning(f"Failed login attempt for email: {data.get('email')}")
        return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        return jsonify({'error': f'Login error: {str(e)}'}), 500

@app.route('/api/auth/verify', methods=['GET'])
def verify_token():
    """Verify JWT token and return user data."""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401
    
    try:
        token = auth_header.split(' ')[1]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user = db.session.get(User, data['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'user': user.to_dict(),
            'role': user.role
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        return jsonify({'error': 'Token verification failed'}), 500
 
@app.route('/api/history', methods=['GET'])
def get_history():
    """Get bird sighting history for a user with pagination, search, and filtering."""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        user_id = int(user_id)
        # Pagination params
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        min_confidence = request.args.get('min_confidence', 0, type=float)
        
        # Base query
        query = db.session.query(BirdSighting).filter(BirdSighting.user_id == user_id)
        
        # Apply search if provided
        if search:
            query = query.filter(BirdSighting.bird_name.ilike(f'%{search}%'))
        
        # Apply filtering
        if min_confidence > 0:
            query = query.filter(BirdSighting.confidence >= min_confidence / 100.0)
            
        # Execute query with pagination
        pagination = query.order_by(BirdSighting.timestamp.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Enrich results with bird details
        enriched_items = []
        for s in pagination.items:
            item_dict = s.to_dict()
            # Get detailed info for this bird
            bird_info = get_bird_info(s.bird_name)
            item_dict['details'] = bird_info
            # For backward compatibility and convenience
            item_dict['description'] = bird_info.get('description')
            item_dict['habitat'] = bird_info.get('habitat')
            item_dict['wingspan'] = bird_info.get('wingspan')
            item_dict['lifespan'] = bird_info.get('lifespan')
            item_dict['conservationStatus'] = bird_info.get('conservation_status')
            item_dict['diet'] = bird_info.get('diet')
            item_dict['funFact'] = bird_info.get('fun_fact')
            item_dict['migrationStatus'] = bird_info.get('migration_status')
            item_dict['breedingSeason'] = bird_info.get('breeding_season')
            item_dict['hotspots'] = bird_info.get('nepal_hotspots')
            enriched_items.append(item_dict)
        
        return jsonify({
            'items': enriched_items,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': pagination.page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }), 200
    except Exception as e:
        logger.error(f"Error fetching history: {e}", exc_info=True)
        return jsonify({'error': f'History error: {str(e)}'}), 500

@app.route('/api/history/delete/<int:sighting_id>', methods=['DELETE'])
def delete_history_item(sighting_id):
    """Delete a specific bird sighting record."""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
            
        user_id = int(user_id)
        sighting = BirdSighting.query.filter_by(id=sighting_id, user_id=user_id).first()
        if not sighting:
            return jsonify({'error': 'Sighting not found or access denied'}), 404
            
        db.session.delete(sighting)
        db.session.commit()
        
        logger.info(f"Sighting {sighting_id} deleted for user {user_id}")
        return jsonify({'message': 'Sighting deleted successfully'}), 200
    except Exception as e:
        logger.error(f"Error deleting sighting: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete sighting'}), 500

@app.route('/api/user/update', methods=['POST'])
def update_profile():
    """Update user profile information."""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
            
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        # Update username if provided
        new_username = data.get('username')
        if new_username:
            # Check if username is already taken by another user
            existing_user = db.session.query(User).filter(User.username == new_username).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'error': 'Username is already taken'}), 400
            user.username = new_username
            
        # Update email if provided
        new_email = data.get('email')
        if new_email:
            # Check if email is already taken
            existing_email = db.session.query(User).filter(User.email == new_email).first()
            if existing_email and existing_email.id != user.id:
                return jsonify({'error': 'Email is already in use'}), 400
            user.email = new_email
            
        db.session.commit()
        logger.info(f"User {user_id} updated profile")
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
    except Exception as e:
        logger.error(f"Error updating profile: {e}", exc_info=True)
        db.session.rollback()
        return jsonify({'error': f'Profile update error: {str(e)}'}), 500

@app.route('/api/user/change-password', methods=['POST'])
def change_password():
    """Change user password."""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        
        if not all([user_id, old_password, new_password]):
            return jsonify({'error': 'Missing required fields'}), 400
            
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        # Verify old password
        if not check_password_hash(user.password_hash, old_password):
            return jsonify({'error': 'Invalid old password'}), 401
            
        # Validate new password length
        if len(new_password) < 6:
            return jsonify({'error': 'New password must be at least 6 characters long'}), 400
            
        # Update password
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        
        logger.info(f"User {user_id} changed password")
        return jsonify({'message': 'Password changed successfully'}), 200
    except Exception as e:
        logger.error(f"Error changing password: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to change password'}), 500

@app.route('/api/birds', methods=['GET'])
def get_birds():
    """Get all birds for the Explore page."""
    try:
        birds = Bird.query.all()
        return jsonify([b.to_dict() for b in birds]), 200
    except Exception as e:
        logger.error(f"Error fetching birds: {e}")
        return jsonify({'error': 'Failed to retrieve birds'}), 500

@app.route('/api/birds/seed', methods=['POST'])
def seed_birds():
    """Seed the database with initial bird data."""
    try:
        data = request.get_json()
        if not data or 'birds' not in data:
            return jsonify({'error': 'No bird data provided'}), 400
        
        for bird_data in data['birds']:
            bird = Bird.query.filter_by(common_name=bird_data['common_name'] if 'common_name' in bird_data else bird_data['commonName']).first()
            if not bird:
                bird = Bird(
                    common_name=bird_data['commonName'],
                    scientific_name=bird_data['scientificName'],
                    description=bird_data['description'],
                    habitat=bird_data['habitat'],
                    rarity=bird_data['rarity'],
                    image_url=bird_data['image'],
                    # New fields
                    wingspan=bird_data.get('wingspan'),
                    lifespan=bird_data.get('lifespan'),
                    conservation_status=bird_data.get('conservationStatus'),
                    diet=bird_data.get('diet'),
                    fun_fact=bird_data.get('funFact'),
                    migration_status=bird_data.get('migrationStatus'),
                    breeding_season=bird_data.get('breedingSeason'),
                    hotspots=bird_data.get('hotspots')
                )
                db.session.add(bird)
                db.session.flush() # Flush to get bird.id

            # Add additional images if provided (even if bird exists)
            if 'images' in bird_data and isinstance(bird_data['images'], list):
                # Clear existing gallery images for this bird to avoid duplicates
                BirdImage.query.filter_by(bird_id=bird.id).delete()
                for img_url in bird_data['images']:
                    bird_image = BirdImage(bird_id=bird.id, image_url=img_url)
                    db.session.add(bird_image)
        
        db.session.commit()
        return jsonify({'message': 'Birds seeded successfully'}), 201
    except Exception as e:
        logger.error(f"Error seeding birds: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    global model
    
    # Reload model if not loaded
    if not model:
        load_inference_model()
        if not model:
            return jsonify({"error": "Model not available. Please train the model first."}), 503

    if 'image' not in request.files:
        return jsonify({"error": "Please upload an image file"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected. Please choose an image to identify."}), 400

    # Validate file type
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        return jsonify({"error": f"Invalid file type. Please upload a JPG, PNG, or GIF image."}), 400

    # Validate file size (5MB limit)
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    max_size = 5 * 1024 * 1024  # 5MB
    if file_size > max_size:
        return jsonify({"error": "File too large. Please upload an image smaller than 5MB."}), 400

    try:
        # Process image - match training pipeline
        img = Image.open(file.stream).convert('RGB')
        original_size = img.size
        logger.info(f"Original image size: {original_size}, format: {img.format}")
        
        # Resize to match model input size (160x160)
        img = img.resize((IMG_WIDTH, IMG_HEIGHT), Image.Resampling.LANCZOS)
        img_array = tf.keras.utils.img_to_array(img)
        
        # Note: The model was trained with Rescaling(1./255) layer
        # This means the model expects input in [0-255] range and normalizes internally
        # So we keep the image in [0-255] range (which is default from img_to_array)
        
        # Add batch dimension
        img_array = tf.expand_dims(img_array, 0)
        
        logger.info(f"Processed image shape: {img_array.shape}, dtype: {img_array.dtype}")
        logger.info(f"Image pixel range: [{tf.reduce_min(img_array):.3f}, {tf.reduce_max(img_array):.3f}]")
        
        # Predict
        logger.info("Processing bird identification request")
        predictions = model.predict(img_array, verbose=0)
        
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = CLASS_NAMES[predicted_class_index]
        confidence = float(np.max(predictions[0]))
        
        # Log all predictions for debugging
        logger.info(f"All predictions: {dict(zip(CLASS_NAMES, [f'{p:.4f}' for p in predictions[0]]))}")
        logger.info(f"Prediction: {predicted_class} (confidence: {confidence:.2%})")
        
        # Warn if confidence is very low
        if confidence < 0.3:
            logger.warning(f"Low confidence prediction: {confidence:.2%} - Model may be uncertain")

        # Get bird info from DB first, fall back to file
        bird_details = {}
        db_bird = Bird.query.filter_by(common_name=predicted_class).first()
        if db_bird:
            bird_details = db_bird.to_dict()
            # Normalize keys to match what frontend expects from get_bird_info
            bird_details['scientific_name'] = db_bird.scientific_name
            bird_details['conservation_status'] = db_bird.conservation_status
            bird_details['migraton_status'] = db_bird.migration_status
            bird_details['breeding_season'] = db_bird.breeding_season
            bird_details['nepal_hotspots'] = db_bird.hotspots
            bird_details['fun_fact'] = db_bird.fun_fact
        else:
            # Fallback to static file if not in DB
            bird_details = get_bird_info(predicted_class)

        # Save to DB if user_id is provided
        user_id_raw = request.form.get('user_id')
        if user_id_raw:
            try:
                user_id = int(user_id_raw)
                
                # Generate unique filename for the image
                filename = f"{uuid.uuid4()}{file_ext}"
                save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                
                # Reset file stream position and save the original file
                file.seek(0)
                file.save(save_path)
                
                # Store the relative URL path in the DB
                image_url_path = f"/uploads/{filename}"
                
                sighting = BirdSighting(
                    user_id=user_id,
                    bird_name=predicted_class,
                    scientific_name=bird_details.get('scientific_name'),
                    confidence=confidence,
                    image_path=image_url_path
                )
                db.session.add(sighting)
                db.session.commit()
                logger.info(f"Sighting saved for user {user_id} with image {filename}")
            except Exception as db_error:
                logger.error(f"Error saving sighting: {db_error}")
                db.session.rollback()
                # Don't fail the request if saving fails

        result = {
            "prediction": predicted_class,
            "confidence": confidence,
            "details": bird_details,
            "is_confident": confidence >= 0.75,
            "message": "Possible match" if confidence < 0.75 else "Bird identified"
        }
        
        if confidence < 0.75:
            result["warning"] = "Not confident — try a clearer image"
        
        # Enrich result with full info for the identified bird
        result.update({
            "wingspan": bird_details.get('wingspan'),
            "lifespan": bird_details.get('lifespan'),
            "conservationStatus": bird_details.get('conservation_status'),
            "diet": bird_details.get('diet'),
            "funFact": bird_details.get('fun_fact'),
            "migrationStatus": bird_details.get('migration_status'),
            "breedingSeason": bird_details.get('breeding_season'),
            "hotspots": bird_details.get('nepal_hotspots')
        })
        
        return jsonify(result), 200

    except Image.UnidentifiedImageError as e:
        logger.warning(f"Invalid image file uploaded: {e}")
        return jsonify({
            "error": "Unable to process image. Please ensure the file is a valid image format (JPG, PNG, GIF).",
            "details": str(e) if os.getenv('FLASK_DEBUG', 'False').lower() == 'true' else None
        }), 400
    except ValueError as e:
        logger.error(f"Value error during prediction: {e}", exc_info=True)
        return jsonify({
            "error": "Image processing error. The image may be corrupted or in an unsupported format.",
            "details": str(e) if os.getenv('FLASK_DEBUG', 'False').lower() == 'true' else None
        }), 400
    except tf.errors.InvalidArgumentError as e:
        logger.error(f"TensorFlow error: {e}", exc_info=True)
        return jsonify({
            "error": "Model input error. Please try a different image.",
            "details": str(e) if os.getenv('FLASK_DEBUG', 'False').lower() == 'true' else None
        }), 500
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        error_msg = "An error occurred while processing the image. Please try again."
        if os.getenv('FLASK_DEBUG', 'False').lower() == 'true':
            error_msg += f" Error: {str(e)}"
        return jsonify({
            "error": error_msg,
            "details": str(e) if os.getenv('FLASK_DEBUG', 'False').lower() == 'true' else None
        }), 500


# --- Admin API Routes ---

@app.route('/api/admin/birds', methods=['POST'])
def create_bird():
    """Create a new bird."""
    try:
        data = request.get_json()
        if not data.get('commonName'):
            return jsonify({'error': 'Common name is required'}), 400
            
        if Bird.query.filter_by(common_name=data['commonName']).first():
            return jsonify({'error': 'Bird with this name already exists'}), 400

        bird = Bird(
            common_name=data['commonName'],
            scientific_name=data.get('scientificName'),
            description=data.get('description'),
            habitat=data.get('habitat'),
            rarity=data.get('rarity'),
            image_url=data.get('image'),
            wingspan=data.get('wingspan'),
            lifespan=data.get('lifespan'),
            conservation_status=data.get('conservationStatus'),
            diet=data.get('diet'),
            fun_fact=data.get('funFact'),
            migration_status=data.get('migrationStatus'),
            breeding_season=data.get('breedingSeason'),
            hotspots=data.get('hotspots')
        )
        db.session.add(bird)
        db.session.flush() # Flush to assign ID
        
        # Handle multiple images
        if 'images' in data and isinstance(data['images'], list):
            for img_url in data['images']:
                if img_url: # Only add if not empty
                    bird_image = BirdImage(bird_id=bird.id, image_url=img_url)
                    db.session.add(bird_image)
                    
        db.session.commit()
        return jsonify({'message': 'Bird created successfully', 'bird': bird.to_dict()}), 201
    except Exception as e:
        logger.error(f"Error creating bird: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/birds/<int:id>', methods=['PUT'])
def update_bird(id):
    """Update an existing bird."""
    try:
        bird = db.session.get(Bird, id)
        if not bird:
            return jsonify({'error': 'Bird not found'}), 404
            
        data = request.get_json()
        
        # Update fields
        if 'commonName' in data: bird.common_name = data['commonName']
        if 'scientificName' in data: bird.scientific_name = data['scientificName']
        if 'description' in data: bird.description = data['description']
        if 'habitat' in data: bird.habitat = data['habitat']
        if 'rarity' in data: bird.rarity = data['rarity']
        if 'image' in data: bird.image_url = data['image']
        if 'wingspan' in data: bird.wingspan = data['wingspan']
        if 'lifespan' in data: bird.lifespan = data['lifespan']
        if 'conservationStatus' in data: bird.conservation_status = data['conservationStatus']
        if 'diet' in data: bird.diet = data['diet']
        if 'funFact' in data: bird.fun_fact = data['funFact']
        if 'migrationStatus' in data: bird.migration_status = data['migrationStatus']
        if 'breedingSeason' in data: bird.breeding_season = data['breedingSeason']
        if 'hotspots' in data: bird.hotspots = data['hotspots']
        
        # Update Images
        if 'images' in data and isinstance(data['images'], list):
            # Remove existing images
            BirdImage.query.filter_by(bird_id=bird.id).delete()
            
            # Add new images
            for img_url in data['images']:
                if img_url:
                    bird_image = BirdImage(bird_id=bird.id, image_url=img_url)
                    db.session.add(bird_image)
        
        db.session.commit()
        return jsonify({'message': 'Bird updated successfully', 'bird': bird.to_dict()}), 200
    except Exception as e:
        logger.error(f"Error updating bird: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/birds/<int:id>', methods=['DELETE'])
def delete_bird(id):
    """Delete a bird."""
    try:
        bird = db.session.get(Bird, id)
        if not bird:
            return jsonify({'error': 'Bird not found'}), 404
            
        db.session.delete(bird)
        db.session.commit()
        return jsonify({'message': 'Bird deleted successfully'}), 200
    except Exception as e:
        logger.error(f"Error deleting bird: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/upload', methods=['POST'])
def admin_upload_image():
    """Upload an image for a bird (admin function)."""
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
        return jsonify({'error': 'Invalid file type'}), 400
        
    try:
        filename = f"bird_{uuid.uuid4()}{ext}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        url = f"/uploads/{filename}"
        return jsonify({'url': url}), 201
    except Exception as e:
        logger.error(f"Error uploading admin image: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    """Get all registered users (admin only)."""
    try:
        users = User.query.order_by(User.created_at.desc()).all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        return jsonify({'error': 'Failed to fetch users'}), 500

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user account."""
    try:
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        # Optional: Prevent deleting self if needed, assuming auth context is available
        # if current_user.id == user_id:
        #     return jsonify({'error': 'Cannot delete your own account'}), 400

        # Delete related sightings first (cascade should handle this if configured, but explicit is safer without cascade)
        BirdSighting.query.filter_by(user_id=user_id).delete()
        
        db.session.delete(user)
        db.session.commit()
        logger.info(f"User {user_id} deleted by admin")
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete user'}), 500

@app.route('/api/admin/analytics', methods=['GET'])
def get_analytics():
    """Get dashboard analytics data."""
    try:
        total_users = User.query.count()
        total_birds = Bird.query.count()
        total_sightings = BirdSighting.query.count()
        
        # Get recent sightings
        recent_sightings = BirdSighting.query.order_by(BirdSighting.timestamp.desc()).limit(5).all()
        recent_sightings_data = []
        for s in recent_sightings:
            s_dict = s.to_dict()
            user = db.session.get(User, s.user_id)
            if user:
                s_dict['username'] = user.username
            recent_sightings_data.append(s_dict)

        return jsonify({
            'totalUsers': total_users,
            'totalBirds': total_birds,
            'totalSightings': total_sightings,
            'recentSightings': recent_sightings_data
        }), 200
    except Exception as e:
        logger.error(f"Error fetching analytics: {e}")
        return jsonify({'error': 'Failed to fetch analytics'}), 500


if __name__ == '__main__':
    # Use environment variable for debug mode (defaults to False in production)
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    logger.info(f"Starting Flask server in {'DEBUG' if debug_mode else 'PRODUCTION'} mode")
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
