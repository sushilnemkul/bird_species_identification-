import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import tensorflow as tf
import numpy as np
from PIL import Image
from dotenv import load_dotenv

from bird_info import get_bird_info
from models import db, User, BirdSighting, Bird

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

# Configure CORS with environment variable support
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000').split(',')
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
            return jsonify({
                'user': user.to_dict(),
                'token': 'dummy-jwt-token-for-now' # In prod, use real JWT
            }), 200
        
        logger.warning(f"Failed login attempt for email: {data.get('email')}")
        return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        return jsonify({'error': f'Login error: {str(e)}'}), 500
 
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
        
        return jsonify({
            'items': [s.to_dict() for s in pagination.items],
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
            # Check if bird already exists
            if not Bird.query.filter_by(common_name=bird_data['commonName']).first():
                bird = Bird(
                    common_name=bird_data['commonName'],
                    scientific_name=bird_data['scientificName'],
                    description=bird_data['description'],
                    habitat=bird_data['habitat'],
                    rarity=bird_data['rarity'],
                    image_url=bird_data['image']
                )
                db.session.add(bird)
        
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

        # Get bird info
        bird_details = get_bird_info(predicted_class)

        # Save to DB if user_id is provided
        user_id_raw = request.form.get('user_id')
        if user_id_raw:
            try:
                user_id = int(user_id_raw)
                sighting = BirdSighting(
                    user_id=user_id,
                    bird_name=predicted_class,
                    scientific_name=bird_details.get('scientific_name'),
                    confidence=confidence,
                    image_path=file.filename # Simplified for now
                )
                db.session.add(sighting)
                db.session.commit()
                logger.info(f"Sighting saved for user {user_id}")
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


if __name__ == '__main__':
    # Use environment variable for debug mode (defaults to False in production)
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    logger.info(f"Starting Flask server in {'DEBUG' if debug_mode else 'PRODUCTION'} mode")
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
