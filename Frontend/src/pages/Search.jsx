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
import RegionPieChart from '../components/RegionPieChart';

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
                <div className="mb-6 bg-blue-50 border border-blue-100 p-5 rounded-xl">
                    <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <FaSearch className="text-blue-500 text-sm" /> Tips for Best Results
                    </h3>
                    <ul className="list-disc list-inside text-sm text-blue-700/80 space-y-1.5 ml-1">
                        <li><strong>Format & Size:</strong> JPG or PNG, maximum 5MB.</li>
                        <li><strong>Clarity:</strong> Ensure the bird is in clear focus with good lighting.</li>
                        <li><strong>Subject:</strong> The bird should be clearly visible, ideally occupying a large portion of the photo.</li>
                    </ul>
                </div>

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
                <div className="animate-fade-in-up space-y-8">
                    <h2 className="text-2xl font-bold mb-2 text-center text-dark">Result</h2>
                    <div className="max-w-md mx-auto">
                        <BirdCard bird={result} showConfidence={true} />
                    </div>

                    {/* Identification Basis Section */}
                    {result.details && result.details.image && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mt-8">
                            <h3 className="text-xl font-bold mb-4 text-dark flex items-center gap-2">
                                <FaSearch className="text-primary" /> Basis of Identification & Ecology
                            </h3>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                                <div>
                                    <p className="text-gray-600 mb-6 text-sm">
                                        The AI matched your photo against our database of Nepal bird species based on key visual markers such as coloration, beak shape, and body structure.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                        {/* Uploaded Crop */}
                                        <div className="space-y-2 text-center">
                                            <div className="h-40 rounded-xl overflow-hidden border border-gray-200">
                                                <img src={result.imageUrl} alt="Your upload" className="w-full h-full object-contain bg-gray-50" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Your Image</span>
                                        </div>
                                        
                                        {/* Reference Default Image */}
                                        <div className="space-y-2 text-center">
                                            <div className="h-40 rounded-xl overflow-hidden border border-gray-200">
                                                <img src={result.details.image} alt="Reference species" className="w-full h-full object-cover bg-gray-50" />
                                            </div>
                                            <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">Reference ({result.commonName})</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                        <h4 className="font-bold text-sm text-dark mb-1">Key Features Identified:</h4>
                                        <p className="text-sm text-gray-700 italic">
                                            "{result.description}"
                                        </p>
                                    </div>
                                </div>

                                {/* Geographic Distribution Chart */}
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col">
                                    <h4 className="font-bold text-sm text-dark mb-2 text-center">Distribution Across Nepal Regions</h4>
                                    <div className="flex-1 min-h-[250px] flex items-center justify-center">
                                        <RegionPieChart hotspotsString={result.details.hotspots} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Multiple Reference Images Gallery */}
                    {result.details && result.details.images && result.details.images.length > 1 && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-xl font-bold mb-4 text-dark">Other References of {result.commonName}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {result.details.images
                                    // Optionally filter out the main image if we want to avoid duplicate rendering,
                                    // or just display all of them in the gallery block. Let's filter out the primary image.
                                    .filter(img => img !== result.details.image)
                                    .map((img, idx) => (
                                    <div key={idx} className="h-32 md:h-40 rounded-xl overflow-hidden shadow border border-gray-200 cursor-pointer transition-transform hover:scale-105">
                                        <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
