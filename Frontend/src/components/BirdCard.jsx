import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';

const BirdCard = ({ bird, showConfidence = false, timestamp = null, onDelete = null }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-xl duration-300 group">
      <div className="relative h-48 w-full">
        <img 
          src={bird.imageUrl || bird.image} 
          alt={bird.commonName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex justify-end">
            {onDelete && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(bird.id);
                  }}
                  className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-lg"
                  title="Delete record"
                >
                  <FaTrashAlt size={14} />
                </button>
            )}
          </div>
          {showConfidence && (
            <div className={`self-start text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-sm shadow-black/20 ${
              bird.confidence >= 0.85 ? 'bg-green-600/90' : 
              bird.confidence >= 0.75 ? 'bg-secondary/90' : 
              'bg-orange-500/90'
            }`}>
              {bird.confidence >= 0.85 ? 'Identified' : 
               bird.confidence >= 0.75 ? 'Possible Match' : 
               'Low Confidence Result'}
              {` (${Math.round(bird.confidence * 100)}%)`}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-xl font-bold text-dark">{bird.commonName}</h3>
                <p className="text-sm text-gray-500 italic">{bird.scientificName}</p>
            </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2" title={bird.description}>
          {bird.description}
        </p>

        {timestamp && (
            <div className="text-xs text-gray-400 mb-3 border-t pt-2 border-gray-100 italic">
                 discovered on {new Date(timestamp).toLocaleDateString()}
            </div>
        )}
        
        <button 
            className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold py-2.5 rounded-xl transition-all duration-300 text-sm border border-primary/20 hover:border-primary"
            onClick={() => navigate('/bird-details', { state: { bird } })}
        >
            Explore Species
        </button>
      </div>
    </div>
  );
};

BirdCard.propTypes = {
  bird: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    commonName: PropTypes.string.isRequired,
    scientificName: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    image: PropTypes.string,
    confidence: PropTypes.number,
  }).isRequired,
  showConfidence: PropTypes.bool,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onDelete: PropTypes.func,
};

export default BirdCard;
