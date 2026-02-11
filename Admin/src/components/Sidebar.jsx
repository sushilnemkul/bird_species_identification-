import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaLeaf, FaCrow, FaUsers, FaChartPie } from 'react-icons/fa';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-primary/20 text-secondary font-medium' : 'text-gray-400 hover:text-white';
    };

    return (
        <div className="w-64 bg-dark text-white fixed h-full shadow-lg flex flex-col">
            <div className="p-6 border-b border-gray-700 flex items-center gap-3">
                <FaLeaf className="text-secondary text-2xl" />
                <span className="font-bold text-xl">BirdID Admin</span>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-8">
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">Menu</p>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/')}`}>
                                <FaCrow /> Birds Database
                            </Link>
                        </li>
                        <li>
                            <Link to="/users" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/users')}`}>
                                <FaUsers /> Users
                            </Link>
                        </li>
                        <li>
                            <Link to="/analytics" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/analytics')}`}>
                                <FaChartPie /> Analytics
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="p-6 border-t border-gray-700 bg-dark">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-xs">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">{user?.username}</p>
                        <p className="text-xs text-green-400">Administrator</p>
                    </div>
                </div>
                <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm w-full transition-colors">
                    <FaSignOutAlt /> Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
