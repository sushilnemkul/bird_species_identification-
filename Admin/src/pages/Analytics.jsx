import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/AdminService';
import { FaUsers, FaDove, FaCamera, FaChartLine } from 'react-icons/fa';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-full ${color} bg-opacity-10 text-${color.replace('bg-', '')}`}>
            <Icon size={24} className={color.replace('bg-', 'text-').replace('/10', '')} />
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAnalytics();
                setStats(data);
            } catch (error) {
                console.error("Error loading analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!stats) return <div className="p-8 text-red-500">Failed to load analytics.</div>;

    return (
        <div className="p-8 animate-fade-in space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Users" 
                    value={stats.totalUsers} 
                    icon={FaUsers} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Bird Species" 
                    value={stats.totalBirds} 
                    icon={FaDove} 
                    color="bg-green-500" 
                />
                <StatCard 
                    title="Total Sightings" 
                    value={stats.totalSightings} 
                    icon={FaCamera} 
                    color="bg-purple-500" 
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaChartLine className="text-primary" />
                    Recent Activity
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-gray-500 text-sm">User</th>
                                <th className="p-3 text-gray-500 text-sm">Bird Identified</th>
                                <th className="p-3 text-gray-500 text-sm">Confidence</th>
                                <th className="p-3 text-gray-500 text-sm">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recentSightings.map((sighting) => (
                                <tr key={sighting.id} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-700">{sighting.username || 'Unknown'}</td>
                                    <td className="p-3 text-gray-600">{sighting.bird_name}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            sighting.confidence > 0.8 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {Math.round(sighting.confidence * 100)}%
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-500 text-xs">
                                        {new Date(sighting.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {stats.recentSightings.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-400 italic">No recent activity</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
