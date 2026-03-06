import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaArrowLeft, FaExpand } from 'react-icons/fa';
import ImageModal from '../components/ImageModal';
import NepalHotspotMap from '../components/NepalHotspotMap';

const BirdDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bird = location.state?.bird;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!bird) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-8 rounded-2xl text-center">
        <h2 className="text-xl font-bold mb-2">No bird selected</h2>
        <p className="mb-6">Open a bird card and click “View Details”.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-2 rounded-xl hover:bg-yellow-700 transition-colors"
        >
          <FaArrowLeft /> Go Home
        </Link>
      </div>
    );
  }

  // Use the images array if available, otherwise fallback to single image
  const images = bird.images && bird.images.length > 0 ? bird.images : [bird.imageUrl || bird.image];
  const displayImage = images[selectedImageIndex] || images[0];

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  // Robustly get fields from either top level or details object
  const details = bird.details || {};
  const description = bird.description || details.description || bird.description;
  const habitat = bird.habitat || details.habitat || bird.habitat;
  const diet = bird.diet || details.diet || bird.diet;
  const region = bird.region || details.region || bird.region;
  
  const migrationStatus = bird.migrationStatus || bird.migration_status || details.migration_status || details.migrationStatus;
  const breedingSeason = bird.breedingSeason || bird.breeding_season || details.breeding_season || details.breedingSeason;
  const hotspots = bird.hotspots || details.hotspots || details.nepal_hotspots;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <FaArrowLeft /> Back
        </button>
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{bird.commonName}</h1>
          <p className="text-gray-500 italic">{bird.scientificName || details.scientific_name || details.scientificName || ''}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div 
          className="relative w-full h-80 md:h-96 bg-gray-50 cursor-pointer group/image"
          onClick={handleImageClick}
        >
          {displayImage ? (
            <>
              <img
                src={displayImage}
                alt={bird.commonName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                  <FaExpand size={20} />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
          {bird.rarity && (
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md z-10 ${
                  bird.rarity === 'Rare' || bird.rarity === 'Endemic' ? 'bg-red-500' : 
                  bird.rarity === 'Uncommon' ? 'bg-amber-500' : 'bg-primary'
              }`}>
                  {bird.rarity}
              </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50/50 border-b border-gray-100 custom-scrollbar">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(idx);
                        }}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                    >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        )}

        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">About this species</h3>
            <p className="text-slate-700 leading-relaxed text-lg">{description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Dietary Info</h3>
               <div className="grid grid-cols-1 gap-3">
                  <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50">
                    <div className="text-[10px] font-bold text-purple-400 uppercase mb-1">Main Diet</div>
                    <div className="text-purple-900 font-semibold text-sm">{diet || 'N/A'}</div>
                  </div>
               </div>
            </div>

            {/* Nepal Specifics */}
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">In Nepal</h3>
               <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Migration</span>
                        <span className="text-xs font-bold text-slate-600 px-2 py-0.5 bg-white rounded-full border border-slate-200">{migrationStatus || 'Resident'}</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 mt-2">Breeding Season</div>
                    <div className="text-slate-800 text-sm font-medium">{breedingSeason || 'Varies'}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 mt-2">Nepal Hotspots</div>
                    <div className="text-primary text-sm font-bold">{hotspots || 'Wide distribution'}</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Interactive Hotspot Map */}
          {hotspots && hotspots !== 'Unknown' && hotspots !== 'Wide distribution' && (
              <div className="mt-8">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Location Map</h3>
                  <div className="w-full bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
                      <NepalHotspotMap 
                          hotspotsString={hotspots} 
                          apiKey="AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao" 
                      />
                  </div>
              </div>
          )}

          {typeof bird.confidence === 'number' && (
            <div className="pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Identification Confidence</h3>
                  <span className="text-lg font-bold text-secondary">{Math.round(bird.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, bird.confidence * 100))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ImageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        imageUrl={displayImage} 
        images={images}
        altText={bird.commonName} 
      />
    </div>
  );
};

export default BirdDetails;
