# Bird Species Identification System - Documentation

This document contains the final project documentation, including comprehensive test cases (Unit & System Testing) and a detailed description of the core algorithm used for bird classification.

---

## List of Abbreviations

*   **API:** Application Programming Interface
*   **CNN:** Convolutional Neural Network
*   **CORS:** Cross-Origin Resource Sharing
*   **DB:** Database
*   **DFD:** Data Flow Diagram
*   **HTML:** Hypertext Markup Language
*   **HTTP:** Hypertext Transfer Protocol
*   **JSON:** JavaScript Object Notation
*   **JWT:** JSON Web Token
*   **ML:** Machine Learning
*   **PIL:** Python Imaging Library (Pillow)
*   **REST:** Representational State Transfer
*   **UI / UX:** User Interface / User Experience
*   **URL:** Uniform Resource Locator
*   **YOLO:** You Only Look Once

---

## Chapter 1: Introduction

### 1.1 Background
The rich avian biodiversity of Nepal presents a unique opportunity and challenge for nature enthusiasts, students, and ornithologists. Identifying birds from field observations is a complex task that typically requires years of experience and reliance on extensive field guides. With the rapid advancement of artificial intelligence and computer vision techniques, an automated approach to species classification is now heavily viable.

### 1.2 Problem Statement
Existing bird identification applications often lack localized data specific to native Nepalese bird species or fail to provide accurate geographical hotspot contexts. Furthermore, many models act solely as static classifiers without offering a comprehensive platform for users to track their personal sightings or for administrators to manage a community dataset.

### 1.3 Objectives
*   To develop a highly accurate deep learning model (CNN) capable of classifying bird species from a single image.
*   To construct a responsive, full-stack web application linking a React frontend to a Flask REST API backend.
*   To provide localized, interactive geographic hotspot mapping (utilizing Leaflet) and rich encyclopedic databases for each identified bird.
*   To implement a secure, centralized administrative dashboard for monitoring system analytics and active user activity.

---

## Chapter 2: Unit Testing Cases

Unit testing focuses on testing individual components and functions in isolation.

### 1.1 Frontend (React) Test Cases

| Test ID | Component/Module | Description | Expected Result |
|---------|------------------|-------------|-----------------|
| `UT-F01` | `Login Component` | Submit empty credentials | Validation error messages appear |
| `UT-F02` | `Login Component` | Submit incorrectly formatted email | "Invalid email format" error |
| `UT-F03` | `Register Component` | Submit password length < 6 | "Password too short" error |
| `UT-F04` | `ImageUpload` | Upload a generic `.txt` file | File rejected, "Invalid file type" alert |
| `UT-F05` | `ImageUpload` | Upload a valid `.jpg` file > 5MB | File rejected, "File too large" alert |
| `UT-F06` | `ImageUpload` | Upload a valid `.jpg` under 5MB | Image preview is rendered |
| `UT-F07` | `MapComponent` | Pass in valid latitude/longitude | Map renders with marker at location |
| `UT-F08` | `PieChartComponent`| Pass mock probability data | Chart renders slices matching percentages |
| `UT-F09` | `AdminRoute` | Access admin page without token | Redirected to login page |

### 1.2 Backend (Flask) & Database Test Cases

| Test ID | Endpoint/Function | Description | Expected Result |
|---------|-------------------|-------------|-----------------|
| `UT-B01` | `User Model` | Hash a password string before save | Password stored in DB as salt/hash |
| `UT-B02` | `User Model` | Create user with duplicate email | SQLAlchemy `IntegrityError` raised |
| `UT-B03` | `POST /predict` | Send request with no file attached | `400 Bad Request` {"error": "No file"} |
| `UT-B04` | `POST /predict` | Send valid RGB `192x192` image | `200 OK` with JSON prediction & confidence |
| `UT-B05` | `POST /register` | Send valid complete user payload | `201 Created` with success message |
| `UT-B06` | `POST /login` | Send incorrect password | `401 Unauthorized` |
| `UT-B07` | `GET /admin/stats`| Request stats lacking admin privileges| `403 Forbidden` |
| `UT-B08` | `Bird Model` | Query `Bird` by `common_name` | Returns correct `Bird` object fields |

---

## Chapter 3: System Testing Cases

System testing evaluates the complete, integrated application to verify that it meets the specified requirements.

### 2.1 Core Functionality (End-to-End flows)

| Test ID | Scenario | Steps to Execute | Expected Outcome | Pass/Fail |
|---------|----------|------------------|------------------|-----------|
| `ST-01` | **Full User Journey** | 1. Register a new user.<br>2. Log in with credentials.<br>3. Navigate to Dashboard.<br>4. Upload an image of a 'Common Kingfisher'.<br>5. Click Predict. | System successfully registers, logs user in, uploads image, connects to ML model, and correctly displays the exact bird species, habitat details, geographic map hotspots, and probability pie chart. |  |
| `ST-02` | **History Tracking** | 1. Complete a successful prediction.<br>2. Navigate to "My History" tab. | The previously predicted bird, its confidence score, and the exact timestamp should be visible in the user's personal history log. |  |
| `ST-03` | **Admin Management Journey** | 1. Log into the `Admin Dashboard` explicitly.<br>2. View the unified statistics.<br>3. Navigate to "Users" tab.<br>4. Click "Suspend" on a specific user. | Admin dashboard loads correctly, aggregates total users and sightings. Suspending the user updates the database state immediately, and the suspended user can no longer log in. |  |

### 2.2 Integration & Edge Cases

| Test ID | Scenario | Steps to Execute | Expected Outcome | Pass/Fail |
|---------|----------|------------------|------------------|-----------|
| `ST-04` | **Frontend-Backend Desync** | 1. Stop the Flask backend server.<br>2. Attempt to upload an image via Frontend. | System elegantly catches the network error and displays a user-friendly "Server Unreachable" toast instead of crashing. |  |
| `ST-05` | **Poor Image Quality** | 1. Target the `/predict` endpoint.<br>2. Upload a very blurry, unidentifiable image (or an image of a car). | Model outputs a prediction, but with a visibly low confidence score. UI should perhaps warn "Low Confidence Match". |  |
| `ST-06` | **Cross-Origin Security**| 1. Use Postman or an external origin to hit `/predict`. | If CORS is configured securely, the request might be blocked depending on restrictions, or strictly allowed only if headers are appropriate. |  |

---

## Chapter 4: Algorithm Description

### 3.1 Overview
The core intelligence of the application is powered by a custom **Convolutional Neural Network (CNN)** built with the **TensorFlow/Keras** framework. CNNs are highly specialized for computer vision tasks as they can autonomously learn spatial hierarchies of features from images (like edges, textures, and ultimately shapes like beaks and wings).

### 3.2 Data Preprocessing and Augmentation
To make the model robust to various lighting conditions, angles, and distances, the dataset underwent rigid preprocessing:
*   **Resolution normalization:** Images are ingested and resized to a uniform `192x192` (or `224x224` during inference handling) pixels in standard RGB format.
*   **Pixel Normalization:** Pixel color values (0-255) are converted into floating-point numbers between `0.0` and `1.0` (forming a NumPy tensor array). This assists the optimizer in converging faster.
*   **Data Augmentation:** The training pipeline utilizes random horizontal flipping, rotation, zooming, and contrast adjustments. This artificially expands the dataset and prevents the model from relying on background noise, forcing it to focus on bird morphology.

### 3.3 Network Architecture
The network consists of **4 distinct Convolutional Blocks** designed to extract deep features:
1.  **Block 1:** 32 Filters (3x3 kernel size) -> Learns basic edges and color gradients.
2.  **Block 2:** 64 Filters (3x3 kernel size) -> Recognizes simple textures and patterns.
3.  **Block 3:** 128 Filters (3x3 kernel size) -> Pieces together partial shapes (e.g., feathers, eyes).
4.  **Block 4:** 128 Filters (3x3 kernel size) -> Detects high-level unique object concepts.

After the convolutional layers, the architecture utilizes **GlobalAveragePooling2D**, flattening the spatial dimensions into a continuous dense vector. 

### 3.4 Regularization & Hyperparameters
To heavily combat **overfitting** (memorizing the training data instead of generalizing), the architecture integrates:
*   **Batch Normalization:** Standardizes inputs to the next layer to stabilize the learning process.
*   **Dropout Layers:** Randomly drops `20%` to `50%` of neurons during training, forcing the network to maintain redundant, robust pathways for classification.

**Training Specifications:**
*   **Optimizer:** `Adam` (Adaptive Moment Estimation) optimizer with a learning rate of `0.0015`.
*   **Batch Size:** `64` images per weight update iteration.
*   **Epochs:** The model was trained iteratively over `70` complete passes of the dataset.

### 3.5 Inference Mechanics (Production Flow)
When a user uploads a picture, it triggers the `/predict` Flask endpoint. 
1. The backend loads the pre-trained `.keras` file from the `saved_model` directory into memory (patched to support legacy `np.object`).
2. The user's image is converted via Pillow (PIL) into the exact multidimensional tensor format expected.
3. The array is passed through `model.predict(img_array)`.
4. A Softmax output layer yields an array of probabilities. We compute `np.argmax()` to deduce the index of the highest statistical certainty.
5. This index is mapped to `CLASS_NAMES` to yield the final predicted string, triggering a database lookup to serve biological data to the React interface.

---

## Chapter 5: Conclusion and Future Recommendations

### 5.1 Conclusion
The Bird Species Identification System successfully integrates a deep-learning image classification model with a modern, responsive web application. By leveraging a Convolutional Neural Network (CNN) built on TensorFlow/Keras and deployed via a Flask backend, the system achieves highly accurate bird species detection. The React frontend provides an intuitive user experience, integrating features like geographic hotspot mapping, species encyclopedias, and historical sighting logs. Additionally, the standalone Admin Dashboard provides comprehensive oversight and user management, resulting in a cohesive, robust, and scalable full-stack application.

### 5.2 Lesson learnt/Outcome
Developing this project provided significant insights into full-stack AI integration:
*   **Model Deployment:** Bridging the gap between a Python ML environment and a REST API, handling tensor array conversions and memory management for neural networks.
*   **State & Routing Management:** Structuring a robust React architecture that strictly separates user interfaces from administrative routes.
*   **Data Visualization:** Effectively mapping raw database statistics and model confidence arrays into user-friendly UI components like maps and interactive Pie Charts.
*   **System Architecture:** Managing CORS and frontend-backend networking safely when running dual local frontend servers alongside a Python backend and PostgreSQL database.

### 5.3 Future Recommendations
While the current system is highly functional, several enhancements would further elevate its utility:
1.  **Mobile Application Version:** Translating the React web application into a React Native mobile app to allow field researchers and bird watchers to identify birds directly from their smartphones offline.
2.  **Real-Time Object Detection:** Upgrading the static image classifier to a live YOLO (You Only Look Once) architecture to identify and draw bounding boxes around multiple birds within a camera feed.
3.  **Expanded Dataset:** Continuously expanding the database of bird species and fine-tuning the model with more diverse images (different lighting, backgrounds) to increase accuracy.
4.  **Community Architecture:** Introducing a social feed where users can share their rare sightings, verify each other's field captures, and contribute to Citizen Science databases.
