# 🐦 Bird Identification System

A full-stack web application for identifying bird species using AI/ML image recognition. Built with React, Flask, and TensorFlow/Keras.

![Bird ID](https://img.shields.io/badge/Bird-ID-green) ![React](https://img.shields.io/badge/React-19.2.0-blue) ![Flask](https://img.shields.io/badge/Flask-2.0+-red) ![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange)

## ✨ Features

- **AI-Powered Identification**: Upload bird photos and get instant species identification with confidence scores
- **User Authentication**: Secure registration and login system
- **History Tracking**: Save and view your bird identification history
- **Explore Species**: Browse all supported bird species with detailed information
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Export Options**: Download your history as JSON or PDF

## 🏗️ Tech Stack

### Frontend
- **React 19.2.0** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **jsPDF** - PDF generation

### Backend
- **Flask** - Python web framework
- **TensorFlow/Keras** - Deep learning model
- **SQLAlchemy** - ORM (supports PostgreSQL and SQLite)
- **Pillow** - Image processing
- **Flask-CORS** - Cross-origin resource sharing

### Machine Learning
- **CNN Model** - Custom trained convolutional neural network
- **6 Bird Species** - Currently supports:
  - Common Kingfisher
  - Common Myna
  - Common Tailorbird
  - Coppersmith Barbet
  - House Crow
  - White-Breasted Kingfisher

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **PostgreSQL** (optional, SQLite used by default)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Project6
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Create .env file (see ENV_SETUP.md)
   # Copy environment variables from ENV_SETUP.md
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   
   # Install dependencies
   npm install
   
   # Create .env file (see ENV_SETUP.md)
   # Add: VITE_API_URL=http://localhost:5000
   ```

4. **Train the Model** (if not already trained)
   ```bash
   cd Backend
   python train_cnn.py
   ```
   This will create the model file at `Backend/saved_model/best_bird_model.keras`

### Running the Application

1. **Start Backend Server**
   ```bash
   cd Backend
   python app.py
   ```
   Server runs on `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   App runs on `http://localhost:5173`

3. **Open Browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
Project6/
├── Backend/
│   ├── app.py                 # Flask application
│   ├── models.py              # Database models
│   ├── bird_info.py           # Bird information database
│   ├── train_cnn.py           # Model training script
│   ├── split_dataset.py       # Dataset splitting utility
│   ├── requirements.txt       # Python dependencies
│   ├── saved_model/          # Trained ML models
│   └── dataset/              # Training dataset
│
├── Frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React Context providers
│   │   ├── services/          # API services
│   │   ├── layouts/           # Layout components
│   │   └── utils/             # Utility functions
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
│
├── ENV_SETUP.md               # Environment variables guide
├── PROJECT_IMPROVEMENTS.md    # Improvement suggestions
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables

See `ENV_SETUP.md` for detailed environment variable setup.

**Backend (.env)**
- `DATABASE_URL` - PostgreSQL connection string (optional)
- `SECRET_KEY` - Flask secret key
- `FLASK_DEBUG` - Debug mode (True/False)
- `ALLOWED_ORIGINS` - CORS allowed origins

**Frontend (.env)**
- `VITE_API_URL` - Backend API URL

## 📖 Usage

1. **Register/Login**: Create an account or log in
2. **Explore**: Browse available bird species
3. **Identify**: Upload a bird photo on the Search page
4. **View History**: See all your past identifications
5. **Export**: Download your history as JSON or PDF

## 🧪 Testing

### Backend Testing
```bash
cd Backend
python test_api.py          # Test API endpoints
python test_full_flow.py    # End-to-end test
python verify_accuracy.py   # Verify model accuracy
```

## 🎯 API Endpoints

- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/history?user_id=<id>` - Get user history
- `POST /predict` - Identify bird from image

## 🔒 Security Features

- Password hashing with Werkzeug
- CORS configuration
- Input validation
- File type and size validation
- Error logging

## 🚧 Known Limitations

- Currently supports 6 bird species
- Image storage not fully implemented (filenames only)
- JWT authentication not yet implemented (using dummy tokens)
- No password reset functionality
- No email verification

## 📝 Future Improvements

See `PROJECT_IMPROVEMENTS.md` for a comprehensive list of improvements and enhancements.

### Planned Features
- [ ] JWT authentication
- [ ] Image storage and serving
- [ ] Password reset
- [ ] Email verification
- [ ] More bird species
- [ ] Advanced search and filters
- [ ] Statistics dashboard
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Bird images from Wikimedia Commons
- TensorFlow/Keras community
- React and Flask communities

---

**Note**: This is a learning project. For production use, implement proper security measures, error handling, and testing as outlined in `PROJECT_IMPROVEMENTS.md`.
