import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBird } from '../context/BirdContext';
import { 
    FaUser, 
    FaEnvelope, 
    FaSignOutAlt, 
    FaEdit, 
    FaLock, 
    FaCheckCircle, 
    FaExclamationCircle, 
    FaCamera, 
    FaMapMarkerAlt, 
    FaCalendarAlt,
    FaLeaf,
    FaShieldAlt
} from 'react-icons/fa';
import { updateProfile, changePassword } from '../services/AuthService';
import { ProfileSkeleton } from '../components/LoadingSkeleton';

const Profile = () => {
    const { user, logout, loading, updateUser } = useAuth();
    const { history } = useBird();
    const [activeTab, setActiveTab] = useState('overview');

    const [editData, setEditData] = useState({ 
        username: user?.username || user?.name || '', 
        email: user?.email || '' 
    });
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (loading) return <ProfileSkeleton />;
    if (!user) return null;

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });
        try {
            const updatedUser = await updateProfile(user.id, {
                username: editData.username,
                email: editData.email
            });
            updateUser(updatedUser);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });
        try {
            await changePassword(user.id, passwords.old, passwords.new);
            setPasswords({ old: '', new: '', confirm: '' });
            setStatus({ type: 'success', message: 'Password changed successfully!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all duration-300 font-medium ${
                activeTab === id 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
            }`}
        >
            <Icon className="text-xl" />
            <span>{label}</span>
            {activeTab === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
        </button>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Banner */}
            <div className="relative h-48 rounded-3xl bg-gradient-to-r from-primary to-emerald-800 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-8 text-white z-10">
                    <h1 className="text-3xl font-bold mb-1">My Dashboard</h1>
                    <p className="opacity-90 flex items-center gap-2 text-sm">
                        <FaLeaf className="text-secondary" /> 
                        Manage your profile and track your discoveries
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* User Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="relative mb-4 group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
                                    <img 
                                        src={user.avatar} 
                                        alt={user.username || user.name} 
                                        className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                    />
                                    <button className="absolute bottom-0 right-0 p-2 bg-dark text-white rounded-full shadow-lg hover:bg-primary transition-colors">
                                        <FaCamera className="text-sm" />
                                    </button>
                                </div>
                                <h2 className="text-2xl font-bold text-dark mb-1">{user.username || user.name}</h2>
                                <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                                <div className="flex gap-2 mb-6">
                                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 uppercase tracking-wide">
                                        Explorer
                                    </span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wide">
                                        Verified
                                    </span>
                                </div>
                                
                                <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{history.length}</div>
                                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Sightings</div>
                                    </div>
                                    <div className="text-center border-l border-gray-100">
                                        <div className="text-2xl font-bold text-secondary">
                                            {user.created_at ? new Date(user.created_at).getFullYear() : '2024'}
                                        </div>
                                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Joined</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100">
                            <div className="space-y-2">
                                <TabButton id="overview" label="Overview" icon={FaCheckCircle} />
                                <TabButton id="edit" label="Edit Profile" icon={FaEdit} />
                                <TabButton id="security" label="Security" icon={FaShieldAlt} />
                            </div>
                            <div className="my-4 border-t border-gray-100"></div>
                            <button 
                                onClick={logout}
                                className="flex items-center gap-3 w-full p-4 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                            >
                                <FaSignOutAlt className="text-xl" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 min-h-[600px]">
                            {/* Status Message */}
                            {status.message && (
                                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
                                    status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                    <p className="font-medium">{status.message}</p>
                                </div>
                            )}

                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold text-dark">Recent Activity</h3>
                                        <button className="text-primary hover:text-primary/80 text-sm font-semibold">View All History</button>
                                    </div>

                                    {history.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {history.slice(0, 4).map((record) => (
                                                <div key={record.id} className="group bg-gray-50 hover:bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex gap-4">
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                        <img src={record.imageUrl || record.image} alt={record.commonName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        <h4 className="font-bold text-dark truncate group-hover:text-primary transition-colors">{record.commonName}</h4>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <FaCalendarAlt className="text-gray-300" />
                                                            {new Date(record.identifiedAt).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                            <FaMapMarkerAlt className="text-gray-300" />
                                                            {record.location || 'Unknown Location'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                                <FaCamera className="text-2xl" />
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-600">No discoveries yet</h4>
                                            <p className="text-gray-500 text-sm mt-1">Start exploring to build your collection!</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-100">
                                            <div className="text-blue-600 mb-2"><FaUser className="text-2xl" /></div>
                                            <div className="text-2xl font-bold text-dark">{history.length}</div>
                                            <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Scans</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-2xl border border-purple-100">
                                            <div className="text-purple-600 mb-2"><FaLeaf className="text-2xl" /></div>
                                            <div className="text-2xl font-bold text-dark">{new Set(history.map(h => h.commonName)).size}</div>
                                            <div className="text-xs text-purple-600 font-bold uppercase tracking-wider">Unique Species</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-100">
                                            <div className="text-amber-600 mb-2"><FaCheckCircle className="text-2xl" /></div>
                                            <div className="text-2xl font-bold text-dark">100%</div>
                                            <div className="text-xs text-amber-600 font-bold uppercase tracking-wider">Profile Strength</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Edit Profile Tab */}
                            {activeTab === 'edit' && (
                                <div className="max-w-xl mx-auto py-4 animate-fade-in">
                                    <h3 className="text-2xl font-bold text-dark mb-6">Edit Profile</h3>
                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <FaUser />
                                                </div>
                                                <input 
                                                    type="text"
                                                    value={editData.username}
                                                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                    placeholder="Enter your username"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <FaEnvelope />
                                                </div>
                                                <input 
                                                    type="email"
                                                    value={editData.email}
                                                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                    placeholder="name@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button 
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <FaCheckCircle /> Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="max-w-xl mx-auto py-4 animate-fade-in">
                                    <h3 className="text-2xl font-bold text-dark mb-6">Security Settings</h3>
                                    <form onSubmit={handlePasswordChange} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <FaLock />
                                                </div>
                                                <input 
                                                    type="password"
                                                    value={passwords.old}
                                                    onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                                                <input 
                                                    type="password"
                                                    value={passwords.new}
                                                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                    placeholder="Min. 6 characters"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Confirm Password</label>
                                                <input 
                                                    type="password"
                                                    value={passwords.confirm}
                                                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                    placeholder="Repeat password"
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button 
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-dark hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <FaShieldAlt /> Update Password
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Profile;
