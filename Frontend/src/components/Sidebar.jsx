import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaHistory, FaUser, FaInfoCircle, FaSignOutAlt, FaCompass } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-secondary text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white';
    };

    const navItems = [
        { path: '/', name: 'Home', icon: <FaHome /> },
        { path: '/explore', name: 'Explore', icon: <FaCompass /> },
        { path: '/search', name: 'Search', icon: <FaSearch /> },
        { path: '/about', name: 'About Us', icon: <FaInfoCircle /> },
    ];

    if (isAuthenticated) {
        navItems.splice(2, 0, { path: '/history', name: 'History', icon: <FaHistory /> });
        navItems.push({ path: '/profile', name: 'Profile', icon: <FaUser /> });
    }

    return (
        <div className="h-screen w-64 bg-dark text-white fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-secondary">🐦</span> BirdID
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)}`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {isAuthenticated ? (
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            ) : (
                 <div className="p-4 border-t border-gray-700">
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 px-4 py-2 w-full bg-secondary hover:bg-opacity-90 text-white rounded-lg transition-colors font-semibold"
                    >
                        Login
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
