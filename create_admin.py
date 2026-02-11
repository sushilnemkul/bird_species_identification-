import sys
import os
from werkzeug.security import generate_password_hash

# Add Backend to python path
sys.path.append(os.path.join(os.getcwd(), 'Backend'))

from Backend.app import app, db, User

with app.app_context():
    email = 'admin@example.com'
    password = 'admin123'
    
    user = User.query.filter_by(email=email).first()
    
    if user:
        print(f"User {email} exists. Updating password and role...")
        user.password_hash = generate_password_hash(password)
        user.role = 'admin'
    else:
        print(f"Creating new admin user {email}...")
        user = User(
            username='Admin',
            email=email,
            password_hash=generate_password_hash(password),
            role='admin'
        )
        db.session.add(user)
        
    db.session.commit()
    print("✅ Admin user set successfully!")
    print(f"Email: {email}")
    print(f"Password: {password}")
