# Environment Variables Setup Guide

## Backend Environment Variables

Create a `.env` file in the `Backend/` directory with the following variables:

```env
# Database Configuration
# For PostgreSQL (production)
DATABASE_URL=postgresql://postgres:password@localhost/bird_app

# For SQLite (development) - leave DATABASE_URL empty or unset to use SQLite
# SQLite will be used automatically if PostgreSQL connection fails

# Secret Key for Flask sessions and JWT (generate a strong random key)
# In production, use: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-secret-key-here-change-in-production

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# Model Configuration
MODEL_PATH=saved_model/best_bird_model.keras

# CORS Configuration (comma-separated list of allowed origins)
# For development: http://localhost:5173,http://localhost:3000
# For production: https://yourdomain.com
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload Configuration
MAX_UPLOAD_SIZE=5242880  # 5MB in bytes
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif
```

## Frontend Environment Variables

Create a `.env` file in the `Frontend/` directory with the following variables:

```env
# API Configuration
# Backend API base URL
# Development: http://localhost:5000
# Production: https://api.yourdomain.com
VITE_API_URL=http://localhost:5000

# Application Configuration
VITE_APP_NAME=BirdID
VITE_APP_VERSION=1.0.0
```

## Quick Setup

1. **Backend**: Copy the variables above into `Backend/.env`
2. **Frontend**: Copy the variables above into `Frontend/.env`
3. **Generate Secret Key**: Run `python -c "import secrets; print(secrets.token_hex(32))"` and update `SECRET_KEY` in backend `.env`

## Notes

- Never commit `.env` files to version control
- Use different values for development and production
- The frontend uses `VITE_` prefix for environment variables (Vite requirement)
- Restart the development server after changing environment variables
