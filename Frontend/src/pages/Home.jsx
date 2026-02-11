import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCamera, FaSearch, FaLeaf, FaArrowRight } from 'react-icons/fa';
import BirdCard from '../components/BirdCard';
import { getBirds } from '../services/BirdService';

const Home = () => {
    const [featuredBirds, setFeaturedBirds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBirds = async () => {
            try {
                const data = await getBirds();
                // Select 3 iconic birds if available: Spiny Babbler, Himalayan Monal, Great Hornbill
                // Otherwise just first 3
                let featured = [];
                if (data && data.length > 0) {
                    const iconicNames = ['Spiny Babbler', 'Himalayan Monal', 'Great Hornbill'];
                    featured = data.filter(b => iconicNames.includes(b.commonName));
                    if (featured.length < 3) {
                        const others = data.filter(b => !iconicNames.includes(b.commonName)).slice(0, 3 - featured.length);
                        featured = [...featured, ...others];
                    }
                }
                setFeaturedBirds(featured);
            } catch (error) {
                console.error("Error fetching featured birds", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBirds();
    }, []);

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-green-800 to-green-600 rounded-3xl overflow-hidden shadow-2xl text-white">
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                <div className="relative z-10 px-8 py-16 md:py-28 md:px-16 max-w-4xl">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-secondary/30 backdrop-blur-md border border-secondary/50 text-secondary font-bold text-sm tracking-wider uppercase">
                        AI-Powered Conservation
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Explore the Biodiversity of <span className="text-secondary italic">Nepal's Birds</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl leading-relaxed">
                        From the soaring Griffons of the Himalayas to the endemic Spiny Babbler, identify and learn about 20 of Nepal's most iconic species using our advanced AI.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/search" className="bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center gap-2 shadow-lg hover:shadow-secondary/20">
                            <FaCamera /> Identify Now
                        </Link>
                        <Link to="/explore" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 border border-white/30">
                            Explore Species <FaArrowRight className="text-sm" />
                        </Link>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 p-12 opacity-10 hidden lg:block">
                    <FaLeaf className="text-[200px] rotate-12" />
                </div>
            </div>

            {/* Features Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 transform -rotate-3 group-hover:rotate-0 transition-transform">
                        <FaCamera />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-dark">Instant AI Identification</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Our specialized CNN model identifies birds native to Nepal with high precision and confidence.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 transform rotate-3">
                        <FaSearch />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-dark">Nepal-Specific Intelligence</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Access detailed data on Nepal-specific hotspots, breeding seasons, and local conservation efforts.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-6 transform -rotate-6">
                        <FaLeaf />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-dark">Personal Field Journal</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Build your own history of sightings and track the incredible biodiversity you encounter across the country.
                    </p>
                </div>
            </div>

            {/* Featured Birds */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-dark mb-2">Featured Nepal Species</h2>
                        <p className="text-gray-500 max-w-xl">Meet some of the most iconic birds that define Nepal's rich natural heritage</p>
                    </div>
                    <Link to="/explore" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        View all 20 species <FaArrowRight className="text-sm" />
                    </Link>
                </div>
                
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-gray-100 h-64 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredBirds.map(bird => (
                            <BirdCard key={bird.id} bird={bird} />
                        ))}
                    </div>
                )}
            </div>

            {/* Call to Action */}
            <div className="bg-primary text-white p-12 rounded-3xl text-center space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                <h2 className="text-3xl font-bold relative z-10">Start Your Avian Adventure</h2>
                <p className="text-white/80 max-w-xl mx-auto relative z-10">
                    Join thousands of bird watchers in Nepal using BigID to identify and protect our feathered friends.
                </p>
                <div className="relative z-10">
                    <Link to="/search" className="inline-block bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-black/20 transform hover:scale-105">
                        Identify a Bird Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
