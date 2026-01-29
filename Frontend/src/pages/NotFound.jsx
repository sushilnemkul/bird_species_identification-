import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center">
            <div className="space-y-4">
                <h1 className="text-9xl font-extrabold text-primary">404</h1>
                <h2 className="text-3xl font-bold text-dark">Page Not Found</h2>
                <p className="text-lg text-gray-600 max-w-md">
                    Oops! The page you're looking for seems to have flown away. 
                    It might have been moved, deleted, or never existed.
                </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 shadow-md"
                >
                    <FaHome /> Go Home
                </Link>
                <Link
                    to="/search"
                    className="inline-flex items-center gap-2 bg-secondary hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 shadow-md"
                >
                    <FaSearch /> Search Birds
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-6 py-3 rounded-lg font-semibold transition-all"
                >
                    <FaArrowLeft /> Go Back
                </button>
            </div>

            <div className="mt-8 text-gray-400 text-sm">
                <p>If you believe this is an error, please contact support.</p>
            </div>
        </div>
    );
};

export default NotFound;
