import PropTypes from 'prop-types';

/**
 * Loading Skeleton Component
 * Displays animated placeholder content while data is loading
 */

export const BirdCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 w-full bg-gray-200"></div>
            <div className="p-5 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-10 bg-gray-200 rounded mt-4"></div>
            </div>
        </div>
    );
};

export const HistorySkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <BirdCardSkeleton key={i} />
            ))}
        </div>
    );
};

export const ProfileSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-32 bg-gray-200"></div>
                <div className="px-8 pb-8">
                    <div className="flex justify-between items-end -mt-12 mb-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                            <div className="space-y-3 pt-6">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg h-20"></div>
                                <div className="bg-white p-4 rounded-lg h-20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SearchSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-pulse">
            <div className="text-center space-y-4">
                <div className="h-10 bg-gray-200 rounded w-64 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="mt-8 h-12 bg-gray-200 rounded-full w-48 mx-auto"></div>
            </div>
        </div>
    );
};

// Generic skeleton for any content
export const Skeleton = ({ width, height, className = '' }) => {
    return (
        <div
            className={`bg-gray-200 rounded animate-pulse ${className}`}
            style={{ width: width || '100%', height: height || '1rem' }}
        />
    );
};

Skeleton.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
};

export default {
    BirdCardSkeleton,
    HistorySkeleton,
    ProfileSkeleton,
    SearchSkeleton,
    Skeleton,
};
