import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BirdDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bird = location.state?.bird;

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

  const details = bird.details || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <FaArrowLeft /> Back
        </button>
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{bird.commonName}</h1>
          <p className="text-gray-500 italic">{bird.scientificName || details.scientific_name || ''}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative w-full h-72 bg-gray-50">
          {(bird.imageUrl || bird.image) ? (
            <img
              src={bird.imageUrl || bird.image}
              alt={bird.commonName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {bird.description && (
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Description</h3>
              <p className="text-slate-700 leading-relaxed">{bird.description}</p>
            </div>
          )}

          {typeof bird.confidence === 'number' && (
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">Confidence</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, bird.confidence * 100))}%` }}
                  />
                </div>
                <div className="text-sm font-bold text-slate-700">
                  {Math.round(bird.confidence * 100)}%
                </div>
              </div>
            </div>
          )}

          {(details.habitat || details.diet || details.region || details.conservation_status) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.habitat && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">Habitat</div>
                  <div className="text-slate-700">{details.habitat}</div>
                </div>
              )}
              {details.diet && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">Diet</div>
                  <div className="text-slate-700">{details.diet}</div>
                </div>
              )}
              {details.region && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">Region</div>
                  <div className="text-slate-700">{details.region}</div>
                </div>
              )}
              {details.conservation_status && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">Conservation</div>
                  <div className="text-slate-700">{details.conservation_status}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BirdDetails;

