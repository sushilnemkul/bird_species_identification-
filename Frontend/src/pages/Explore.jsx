import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import BirdCard from '../components/BirdCard';
import { getBirds } from '../services/BirdService';

const Explore = () => {
    const [birds, setBirds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRarity, setSelectedRarity] = useState('All');

    useEffect(() => {
        const fetchBirds = async () => {
            try {
                const data = await getBirds();
                setBirds(data);
            } catch (error) {
                console.error("Error fetching explore data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBirds();
    }, []);

    const filteredBirds = birds.filter(bird => {
        const matchesSearch = bird.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             bird.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             bird.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesRarity = selectedRarity === 'All' || bird.rarity === selectedRarity;
        
        return matchesSearch && matchesRarity;
    });

    const rarities = ['All', 'Very Common', 'Common', 'Uncommon', 'Rare', 'Endemic'];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-dark">Explore <span className="text-primary">Birds of Nepal</span></h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Discover 20 diverse bird species found across Nepal, from the lowlands of the Terai to the high Himalayas.
                </p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <FaSearch />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, scientific name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <FaFilter className="text-gray-400 hidden md:block" />
                    <div className="flex flex-wrap gap-2">
                        {rarities.map(rarity => (
                            <button
                                key={rarity}
                                onClick={() => setSelectedRarity(rarity)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                    selectedRarity === rarity 
                                    ? 'bg-secondary text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {rarity}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="flex justify-between items-center px-2">
                <p className="text-gray-500 font-medium">
                    Showing {filteredBirds.length} species
                    {selectedRarity !== 'All' && <span> in <b>{selectedRarity}</b> category</span>}
                </p>
            </div>

            {filteredBirds.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Birds Found</h3>
                    <p className="text-gray-500">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <button 
                        onClick={() => {setSearchQuery(''); setSelectedRarity('All');}}
                        className="mt-6 text-primary font-bold hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBirds.map(bird => (
                        <div key={bird.id} className="relative group">
                            <BirdCard bird={bird} />
                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md z-10 ${
                                bird.rarity === 'Rare' || bird.rarity === 'Endemic' ? 'bg-red-500' : 
                                bird.rarity === 'Uncommon' ? 'bg-amber-500' : 'bg-primary'
                            }`}>
                                {bird.rarity}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Explore;
