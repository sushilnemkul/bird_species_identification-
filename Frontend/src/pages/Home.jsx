import { Link } from 'react-router-dom';
import { FaCamera, FaSearch, FaLeaf } from 'react-icons/fa';
import BirdCard from '../components/BirdCard';
import mockBirds from '../services/mockBirdsData';

const Home = () => {
    // Show top 3 birds
    const featuredBirds = mockBirds.slice(0, 3);

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary to-green-700 rounded-3xl overflow-hidden shadow-2xl text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 px-8 py-16 md:py-24 md:px-16 max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Discover the World of <span className="text-secondary">Birds</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl leading-relaxed">
                        Instant bird identification powered by advanced AI. Upload a photo and let our system reveal the beauty of nature's avian wonders.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/search" className="bg-secondary hover:bg-opacity-90 text-white px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center gap-2 shadow-lg">
                            <FaCamera /> Start Identifying
                        </Link>
                        <Link to="/about" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold text-lg transition-all flex items-center gap-2 border border-white/30">
                            Learn More
                        </Link>
                    </div>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
            </div>

            {/* Features Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-6">
                        <FaCamera />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-dark">Instant ID</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Upload any clear photo of a bird and get immediate results with high accuracy confidence scores.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-6">
                        <FaSearch />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-dark">Detailed Info</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Access comprehensive database information including scientific names, habits, and habitats.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl mb-6">
                        <FaLeaf />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-dark">Track History</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Keep a personal log of all your bird sightings and build your own digital bird watching journal.
                    </p>
                </div>
            </div>

            {/* Featured Birds */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-dark mb-2">Popular Species</h2>
                        <p className="text-gray-500">Explore some of the most commonly identified birds</p>
                    </div>
                    {/* View all button could go here */}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredBirds.map(bird => (
                        <BirdCard key={bird.id} bird={bird} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
