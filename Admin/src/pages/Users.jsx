import { useState, useEffect } from 'react';
import { getUsers, deleteUser, suspendUser, unsuspendUser, flagUser, unflagUser } from '../services/AdminService';
import { FaTrash, FaUser, FaSearch, FaBan, FaCheckCircle, FaFlag } from 'react-icons/fa';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, username) => {
        if (window.confirm(`Are you sure you want to delete user "${username}"? This will also delete all their bird sightings.`)) {
            try {
                await deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleSuspend = async (id) => {
        if (window.confirm('Are you sure you want to suspend this user?')) {
            try {
                await suspendUser(id);
                setUsers(users.map(user => user.id === id ? { ...user, is_suspended: true } : user));
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleUnsuspend = async (id) => {
        try {
            await unsuspendUser(id);
            setUsers(users.map(user => user.id === id ? { ...user, is_suspended: false } : user));
        } catch (error) {
            alert(error.message);
        }
    };

    const handleFlag = async (id) => {
        try {
            await flagUser(id);
            setUsers(users.map(user => user.id === id ? { ...user, is_flagged: true } : user));
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUnflag = async (id) => {
        try {
            await unflagUser(id);
            setUsers(users.map(user => user.id === id ? { ...user, is_flagged: false } : user));
        } catch (error) {
            alert(error.message);
        }
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-gray-500 font-medium text-sm">User</th>
                                <th className="p-4 text-gray-500 font-medium text-sm">Email</th>
                                <th className="p-4 text-gray-500 font-medium text-sm">Role</th>
                                <th className="p-4 text-gray-500 font-medium text-sm">Status</th>
                                <th className="p-4 text-gray-500 font-medium text-sm">Joined Date</th>
                                <th className="p-4 text-gray-500 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-gray-800">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {/* Status Badges */}
                                        <div className="flex gap-2">
                                            {user.is_suspended && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    Suspended
                                                </span>
                                            )}
                                            {user.is_flagged && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    Flagged
                                                </span>
                                            )}
                                            {!user.is_suspended && !user.is_flagged && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {/* Suspend/Unsuspend Button */}
                                            {user.is_suspended ? (
                                                <button 
                                                    onClick={() => handleUnsuspend(user.id)} 
                                                    title="Unsuspend User" 
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    disabled={user.role === 'admin'}
                                                >
                                                    <FaCheckCircle />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleSuspend(user.id)} 
                                                    title="Suspend User" 
                                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                                    disabled={user.role === 'admin'}
                                                >
                                                    <FaBan />
                                                </button>
                                            )}

                                            {/* Flag/Unflag Button */}
                                            {user.is_flagged ? (
                                                <button 
                                                    onClick={() => handleUnflag(user.id)} 
                                                    title="Unflag User" 
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                                    disabled={user.role === 'admin'}
                                                >
                                                    <FaFlag />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleFlag(user.id)} 
                                                    title="Flag User" 
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                    disabled={user.role === 'admin'}
                                                >
                                                    <FaFlag />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No users found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Users;
