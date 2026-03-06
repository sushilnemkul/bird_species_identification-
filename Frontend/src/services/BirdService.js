import axios from 'axios';

// Use environment variable with fallback to 127.0.0.1 for development
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export const identifyBird = async (imageFile, userId = null) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (userId) {
        formData.append('user_id', userId);
    }

    try {
        const response = await axios.post(`${API_URL}/predict`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Map backend response to frontend BirdCard/History format
        const { prediction, confidence, details, is_confident, message, warning } = response.data;

        // Normalize reference images from backend
        if (details.image && !details.image.startsWith('http')) {
            details.image = `${API_URL}${details.image}`;
        }
        if (details.images && Array.isArray(details.images)) {
            details.images = details.images.map(img => img.startsWith('http') ? img : `${API_URL}${img}`);
        } else if (details.image) {
            details.images = [details.image]; // Fallback if images array missing
        } else {
            details.images = [];
        }

        return {
            id: Date.now().toString(), // Helper ID, backend should provide real one
            commonName: prediction,
            scientificName: details.scientific_name,
            description: details.description,
            confidence: confidence, // Float (0-1)
            isConfident: is_confident,
            message: message,
            warning: warning,
            imageUrl: URL.createObjectURL(imageFile), // Use local preview
            image: URL.createObjectURL(imageFile),   // Compatibility
            identifiedAt: new Date().toISOString(),
            details: details,
            wingspan: response.data.wingspan,
            lifespan: response.data.lifespan,
            conservationStatus: response.data.conservationStatus,
            diet: response.data.diet,
            funFact: response.data.funFact,
            migrationStatus: response.data.migrationStatus,
            breedingSeason: response.data.breedingSeason,
            hotspots: response.data.hotspots
        };
    } catch (error) {
        console.error('Error identifying bird:', error);

        // Extract meaningful error message
        let errorMessage = 'Failed to identify bird. Please try again.';

        if (error.response) {
            // Server responded with error
            const serverError = error.response.data?.error || error.response.data?.message;
            if (serverError) {
                errorMessage = serverError;
            } else if (error.response.status === 400) {
                errorMessage = 'Invalid image file. Please upload a valid JPG, PNG, or GIF image.';
            } else if (error.response.status === 413) {
                errorMessage = 'Image file is too large. Please upload an image smaller than 5MB.';
            } else if (error.response.status === 503) {
                errorMessage = 'Model is not available. Please contact support.';
            }
        } else if (error.request) {
            // Request made but no response
            errorMessage = 'Unable to connect to server. Please check your internet connection.';
        }

        // Create a new error with the user-friendly message
        const customError = new Error(errorMessage);
        customError.originalError = error;
        throw customError;
    }
};

export const getHistory = async (userId, params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/api/history`, {
            params: { user_id: userId, ...params }
        });

        // Map backend history to frontend format
        return {
            items: response.data.items.map(item => ({
                id: item.id,
                commonName: item.bird_name,
                scientificName: item.scientific_name,
                confidence: item.confidence,
                image: item.image ? (item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`) : null,
                identifiedAt: item.timestamp,
                description: item.description,
                habitat: item.habitat,
                details: item.details,
                wingspan: item.wingspan,
                lifespan: item.lifespan,
                conservationStatus: item.conservationStatus,
                diet: item.diet,
                funFact: item.funFact,
                migrationStatus: item.migrationStatus,
                breedingSeason: item.breedingSeason,
                hotspots: item.hotspots
            })),
            total: response.data.total,
            pages: response.data.pages,
            currentPage: response.data.current_page,
            hasNext: response.data.has_next,
            hasPrev: response.data.has_prev
        };
    } catch (error) {
        console.error('Error fetching history:', error);
        return { items: [], total: 0, pages: 0, currentPage: 1 };
    }
};

export const deleteHistoryItem = async (userId, sightingId) => {
    try {
        await axios.delete(`${API_URL}/api/history/delete/${sightingId}`, {
            params: { user_id: userId }
        });
        return { success: true };
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete history item');
    }
};

export const getBirds = async () => {
    try {
        console.log("Fetching birds from:", `${API_URL}/api/birds`);
        const response = await axios.get(`${API_URL}/api/birds`);
        return response.data.map(bird => ({
            ...bird,
            // Ensure proper image URL mapping
            image: bird.image ? (bird.image.startsWith('http') ? bird.image : `${API_URL}${bird.image}`) : null,
            images: bird.images ? bird.images.map(img => img.startsWith('http') ? img : `${API_URL}${img}`) : []
        }));
    } catch (error) {
        console.error('Error fetching birds:', error);
        return [];
    }
};