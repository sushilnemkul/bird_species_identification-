import { useState } from 'react';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import BirdCard from '../components/BirdCard';
import { identifyBird } from '../services/BirdService';
import { useAuth } from '../context/AuthContext';
import { useBird } from '../context/BirdContext';
import { FaSearch, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SearchSkeleton } from '../components/LoadingSkeleton';

const Search = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const { user } = useAuth();
    const { addRecord } = useBird();

    const handleImageSelect = (file) => {
        setSelectedImage(file);
        setResult(null); // Reset previous result
    };

    const handleIdentify = async () => {
        if (!selectedImage) return;

        setIsLoading(true);
        try {
            const userId = user ? user.id : null;
            const data = await identifyBird(selectedImage, userId);
            setResult(data);
            
            if (data.isConfident) {
                toast.success(`Bird identified: ${data.commonName}`);
            } else {
                toast.warning(`${data.warning || 'Possible match'}: ${data.commonName}`, {
                    icon: "🔍",
                    autoClose: 7000
                });
            }
            
            if (user) {
                addRecord(data);
            } else {
                toast.info("Log in to save this to your history!");
            }
        } catch (error) {
            console.error('Identification error:', error);
            // Show the actual error message from the backend
            const errorMessage = error.message || "Failed to identify bird. Please try again.";
            toast.error(errorMessage, {
                autoClose: 5000, // Show for 5 seconds
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-dark">Identify a <span className="text-secondary">Bird</span></h1>
                <p className="text-xl text-gray-600">
                    Upload a photo to find out what species it is.
                </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <ImageUpload onImageSelect={handleImageSelect} />
                
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleIdentify}
                        disabled={!selectedImage || isLoading}
                        className={`
                            px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-md
                            ${!selectedImage || isLoading 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-primary text-white hover:bg-opacity-90 transform hover:-translate-y-1'
                            }
                        `}
                    >
                        {isLoading ? (
                            <><FaSpinner className="animate-spin" /> Analyzing...</>
                        ) : (
                            <><FaSearch /> Identify Bird</>
                        )}
                    </button>
                </div>
            </div>

            {result && (
                <div className="animate-fade-in-up">
                    <h2 className="text-2xl font-bold mb-6 text-center text-dark">Result</h2>
                    <div className="max-w-md mx-auto">
                        <BirdCard bird={result} showConfidence={true} />
                    </div>
                     {!user && (
                        <div className="mt-8 text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-blue-800 mb-4">Want to save your discoveries?</p>
                            <Link to="/login" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                                Log in to save to history <FaArrowRight />
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
