import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBird } from '../context/BirdContext';
import { FaUser, FaEnvelope, FaImage, FaSignOutAlt, FaEdit, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { updateProfile, changePassword } from '../services/AuthService';
import { ProfileSkeleton } from '../components/LoadingSkeleton';

const Profile = () => {
    const { user, logout, loading, updateUser } = useAuth();
    const { history } = useBird();

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ 
        username: user?.username || user?.name || '', 
        email: user?.email || '' 
    });
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (loading) {
        return <ProfileSkeleton />;
    }

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
            setIsEditing(false);
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

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <h1 className="text-3xl font-bold text-dark text-center">Your Profile</h1>

            {status.message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-slide-in ${
                    status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {status.message}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="h-40 bg-gradient-to-r from-primary via-secondary to-accent opacity-90"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-16 mb-8">
                        <div className="relative group">
                            <img 
                                src={user.avatar} 
                                alt={user.username || user.name} 
                                className="w-32 h-32 rounded-3xl border-8 border-white shadow-2xl bg-white object-cover transform group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <FaEdit className="text-white text-xl" />
                            </div>
                        </div>
                        <button 
                            onClick={logout}
                            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 mb-2 shadow-sm"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        <div className="lg:col-span-3 space-y-8">
                            {/* Profile Info Section */}
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-dark flex items-center gap-2">
                                        <FaUser className="text-primary" /> Profile Information
                                    </h3>
                                    {!isEditing && (
                                        <button 
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditData({ 
                                                    username: user.username || user.name || '', 
                                                    email: user.email 
                                                });
                                            }}
                                            className="text-primary hover:text-secondary font-semibold flex items-center gap-1 transition-colors"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                            <input 
                                                type="text"
                                                value={editData.username}
                                                onChange={(e) => setEditData({...editData, username: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                            <input 
                                                type="email"
                                                value={editData.email}
                                                onChange={(e) => setEditData({...editData, email: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button 
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                <FaUser />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Username</p>
                                                <p className="font-bold text-dark">{user.username || user.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100">
                                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                                                <FaEnvelope />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Email Address</p>
                                                <p className="font-bold text-dark">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Security / Password Section */}
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                <h3 className="text-xl font-bold text-dark flex items-center gap-2 mb-6">
                                    <FaLock className="text-accent" /> Security Settings
                                </h3>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                                        <input 
                                            type="password"
                                            value={passwords.old}
                                            onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                                            <input 
                                                type="password"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                                                placeholder="Min. 6 chars"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                                            <input 
                                                type="password"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                                                placeholder="Repeat password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 mt-2"
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Stats Sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-gradient-to-br from-dark to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <FaImage className="text-secondary" /> Activity Summary
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                                        <div className="text-4xl font-extrabold text-primary mb-1">{history.length}</div>
                                        <div className="text-xs text-blue-200 uppercase tracking-widest font-bold">Total Sightings</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                                        <div className="text-4xl font-extrabold text-accent mb-1">{new Set(history.map(h => h.commonName)).size}</div>
                                        <div className="text-xs text-orange-200 uppercase tracking-widest font-bold">Unique Species</div>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Recent Discoveries</h4>
                                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md">Latest 3</span>
                                    </div>
                                    <div className="space-y-4">
                                        {history.slice(0, 3).map((record) => (
                                            <div key={record.id} className="flex items-center gap-4 group/item">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border-2 border-white/10">
                                                    <img src={record.imageUrl || record.image} alt="" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate">{record.commonName}</p>
                                                    <p className="text-xs text-gray-400">{new Date(record.identifiedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {history.length === 0 && (
                                            <div className="text-center py-6 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                                <p className="text-sm text-gray-400 italic">No discoveries yet. Time to explore!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 className="text-sm font-bold text-dark mb-4 uppercase tracking-widest border-l-4 border-primary pl-3">Account Status</h4>
                                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                                    <span className="text-gray-500 font-medium">Joined Birdly</span>
                                    <span className="font-bold text-dark">
                                        {user.created_at 
                                            ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm py-2">
                                    <span className="text-gray-500 font-medium">Identity Status</span>
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase">Verified Enthusiast</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
