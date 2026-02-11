import { useState, useEffect } from 'react';
import { getBirds, deleteBird, createBird, updateBird, uploadAdminImage } from '../services/BirdService';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCamera, FaSave, FaSignOutAlt, FaLeaf } from 'react-icons/fa';

const Dashboard = () => {
    const { logout, user } = useAuth();
    const [birds, setBirds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        commonName: '',
        scientificName: '',
        description: '',
        habitat: '',
        rarity: 'Common',
        image: '',
        wingspan: '',
        lifespan: '',
        conservationStatus: '',
        diet: '',
        funFact: '',
        migrationStatus: '',
        breedingSeason: '',
        hotspots: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]); // Array of { url: string, file: File | null }
    const [galleryPreviews, setGalleryPreviews] = useState([]); // Array of strings (urls) for preview

    useEffect(() => {
        loadBirds();
    }, []);

    const loadBirds = async () => {
        setLoading(true);
        const data = await getBirds();
        setBirds(data);
        setLoading(false);
    };

    const handleEdit = (bird) => {
        setEditingId(bird.id);
        setFormData({
            commonName: bird.commonName || '',
            scientificName: bird.scientificName || '',
            description: bird.description || '',
            habitat: bird.habitat || '',
            rarity: bird.rarity || 'Common',
            image: bird.image || '',
            wingspan: bird.wingspan || '',
            lifespan: bird.lifespan || '',
            conservationStatus: bird.conservationStatus || '',
            diet: bird.diet || '',
            funFact: bird.funFact || '',
            migrationStatus: bird.migrationStatus || '',
            breedingSeason: bird.breedingSeason || '',
            hotspots: bird.hotspots || ''
        });

        setImagePreview(bird.image && bird.image.startsWith('http') ? bird.image : `http://localhost:5000${bird.image}`);
        
        // Prepare gallery images
        const initialGallery = bird.images ? bird.images.map(img => ({
            url: img.startsWith('http') ? img : `http://localhost:5000${img}`,
            file: null,
            originalUrl: img // Keep original relative path for sending back to server if unchanged
        })) : [];
        setGalleryImages(initialGallery);
        
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bird?')) {
            try {
                await deleteBird(id);
                loadBirds();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = files.map(file => ({
                url: URL.createObjectURL(file),
                file: file
            }));
            setGalleryImages([...galleryImages, ...newImages]);
        }
    };

    const removeGalleryImage = (index) => {
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = formData.image;
            if (imageFile) {
                imageUrl = await uploadAdminImage(imageFile);
            }

            // Process gallery images
            const processedGalleryImages = await Promise.all(galleryImages.map(async (img) => {
                if (img.file) {
                    return await uploadAdminImage(img.file);
                }
                return img.originalUrl || img.url; // Return original relative path or full URL if that's what we have
            }));

            const payload = { ...formData, image: imageUrl, images: processedGalleryImages };

            if (editingId) {
                await updateBird(editingId, payload);
            } else {
                await createBird(payload);
            }

            setShowForm(false);
            setEditingId(null);
            setImageFile(null);
            setImagePreview(null);
            setGalleryImages([]);
            setFormData({
                commonName: '', scientificName: '', description: '', habitat: '', rarity: 'Common',
                image: '', wingspan: '', lifespan: '', conservationStatus: '', diet: '',
                funFact: '', migrationStatus: '', breedingSeason: '', hotspots: ''
            });
            loadBirds();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Birds</h1>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({
                            commonName: '', scientificName: '', description: '', habitat: '', rarity: 'Common',
                            image: '', wingspan: '', lifespan: '', conservationStatus: '', diet: '',
                            funFact: '', migrationStatus: '', breedingSeason: '', hotspots: ''
                        });
                        setImagePreview(null);
                        setGalleryImages([]);
                        setShowForm(true);
                    }}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-colors shadow-lg"
                >
                    <FaPlus /> Add New Bird
                </button>
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
                                <th className="p-4 text-gray-500 font-medium text-sm">Image</th>
                                <th className="p-4 text-gray-500 font-medium text-sm">Name</th>
                                <th className="p-4 text-gray-500 font-medium text-sm">Habitat</th>
                                <th className="p-4 text-gray-500 font-medium text-sm">Status</th>
                                <th className="p-4 text-gray-500 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {birds.map(bird => (
                                <tr key={bird.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <img
                                                src={bird.image && bird.image.startsWith('http') ? bird.image : `http://localhost:5000${bird.image}`}
                                                alt={bird.commonName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{bird.commonName}</div>
                                        <div className="text-xs text-gray-500 italic">{bird.scientificName}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {bird.habitat || 'Unknown'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            bird.conservationStatus?.includes('Threatened') || bird.conservationStatus?.includes('Endangered')
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                        }`}>
                                            {bird.conservationStatus || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(bird)} title="Edit" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(bird.id)} title="Delete" className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-gray-800">{editingId ? 'Edit Bird Details' : 'Add New Bird'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 text-primary font-bold border-b border-gray-100 pb-2 mb-4">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">1</span>
                                    Basic Information
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Common Name</label>
                                    <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={formData.commonName} onChange={e => setFormData({...formData, commonName: e.target.value})} placeholder="e.g. Himalayan Monal" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Scientific Name</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={formData.scientificName} onChange={e => setFormData({...formData, scientificName: e.target.value})} placeholder="e.g. Lophophorus impejanus" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                                            value={formData.rarity} onChange={e => setFormData({...formData, rarity: e.target.value})}>
                                        <option>Common</option>
                                        <option>Uncommon</option>
                                        <option>Rare</option>
                                        <option>Very Common</option>
                                        <option>Endangered</option>
                                        <option>Endemic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-32 resize-none"
                                                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief physical description..."></textarea>
                                </div>
                            </div>

                            {/* Detailed Info */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 text-primary font-bold border-b border-gray-100 pb-2 mb-4">
                                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">2</span>
                                        Biological Details
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Habitat</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={formData.habitat} onChange={e => setFormData({...formData, habitat: e.target.value})} placeholder="e.g. High altitude forests" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Wingspan</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                value={formData.wingspan} onChange={e => setFormData({...formData, wingspan: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Lifespan</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                value={formData.lifespan} onChange={e => setFormData({...formData, lifespan: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Conservation Status</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={formData.conservationStatus} onChange={e => setFormData({...formData, conservationStatus: e.target.value})} placeholder="e.g. Least Concern" />
                                </div>
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fun Fact</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            value={formData.funFact} onChange={e => setFormData({...formData, funFact: e.target.value})} />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><FaCamera className="text-primary" /> Main Image</h3>
                                <div className="flex items-center gap-6">
                                    <div className="w-32 h-32 bg-white rounded-lg overflow-hidden border shadow-sm flex items-center justify-center shrink-0">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-300 text-xs text-center px-2">No Image</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block">
                                            <span className="sr-only">Choose profile photo</span>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2.5 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-primary file:text-white
                                                hover:file:bg-primary-dark
                                                cursor-pointer
                                            "/>
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">Recommended: Square JPG or PNG, max 5MB.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Gallery Upload */}
                            <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><FaCamera className="text-primary" /> Gallery Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {galleryImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square bg-white rounded-lg overflow-hidden border shadow-sm group">
                                            <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => removeGalleryImage(idx)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FaTimes size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="aspect-square bg-white rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition-colors">
                                        <FaPlus size={24} className="mb-2 text-gray-400" />
                                        <span className="text-xs font-semibold text-gray-500">Add Image</span>
                                        <input type="file" multiple accept="image/*" onChange={handleGalleryImageChange} className="hidden" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">Add multiple images to show in the detailed view.</p>
                            </div>

                            {/* Form Actions */}
                            <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-8 py-2.5 rounded-lg bg-primary text-white hover:bg-opacity-90 flex items-center gap-2 font-bold shadow-lg shadow-primary/30 transition-all hover:translate-y-[-1px]">
                                    <FaSave /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

