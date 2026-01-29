import { useState, useEffect, useCallback } from 'react';
import { useBird } from '../context/BirdContext';
import { useAuth } from '../context/AuthContext';
import BirdCard from '../components/BirdCard';
import { FaDownload, FaHistory, FaFilePdf, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HistorySkeleton } from '../components/LoadingSkeleton';
import { getHistory, deleteHistoryItem } from '../services/BirdService';

const History = () => {
    const { deleteRecord, refreshHistory } = useBird();
    const { user } = useAuth();
    
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 9,
        total: 0,
        pages: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        minConfidence: 0
    });
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const fetchHistory = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getHistory(user.id, {
                page: pagination.page,
                per_page: pagination.perPage,
                search: debouncedSearch,
                min_confidence: filters.minConfidence
            });
            setHistoryItems(data.items);
            setPagination(prev => ({
                ...prev,
                total: data.total,
                pages: data.pages,
                currentPage: data.currentPage
            }));
        } catch (error) {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    }, [user, pagination.page, pagination.perPage, debouncedSearch, filters.minConfidence]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await deleteHistoryItem(user.id, id);
            deleteRecord(id);
            toast.success('Record deleted');
            fetchHistory(); // Refresh current page
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDownload = (format) => {
        if (historyItems.length === 0) return;
        
        if (format === 'json') {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyItems, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", `bird_history_page_${pagination.page}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            toast.success('Current page exported as JSON');
        } else if (format === 'pdf') {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text("My Bird Sighting History", 14, 22);
            doc.setFontSize(11);
            doc.text(`Page: ${pagination.page} | Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
            
            const tableData = historyItems.map(item => [
                new Date(item.identifiedAt).toLocaleDateString(),
                item.commonName,
                item.scientificName || 'N/A',
                `${(item.confidence * 100).toFixed(1)}%`
            ]);

            doc.autoTable({
                startY: 40,
                head: [['Date', 'Common Name', 'Scientific Name', 'Confidence']],
                body: tableData,
            });

            doc.save(`bird_history_p${pagination.page}.pdf`);
            toast.success('Current page exported as PDF');
        }
    };

    if (!user) return null;

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-dark flex items-center gap-3">
                        <FaHistory className="text-secondary" /> Discovery History
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage and explore your {pagination.total} bird identifications.
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 min-w-[200px]">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search by bird name..."
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            value={filters.minConfidence}
                            onChange={(e) => setFilters({...filters, minConfidence: parseInt(e.target.value)})}
                            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="0">All Confidence</option>
                            <option value="50">50% + Match</option>
                            <option value="70">70% + Match</option>
                            <option value="90">90% + Match</option>
                        </select>
                    </div>
                    {historyItems.length > 0 && (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleDownload('json')}
                                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-primary hover:border-primary transition-all shadow-sm"
                                title="Export JSON"
                            >
                                <FaDownload />
                            </button>
                            <button 
                                onClick={() => handleDownload('pdf')}
                                className="px-4 py-2.5 bg-secondary text-white rounded-xl hover:bg-green-600 transition-all shadow-md flex items-center gap-2 font-bold"
                            >
                                <FaFilePdf /> PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <HistorySkeleton />
            ) : historyItems.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl shadow-xl border border-gray-100 animate-fade-in">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                        🔍
                    </div>
                    <h3 className="text-2xl font-bold text-dark mb-2">No Records Found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        {filters.search || filters.minConfidence > 0 
                            ? "We couldn't find any sightings matching your filters." 
                            : "Your history is empty. Start a new identification to see it here!"}
                    </p>
                    {(filters.search || filters.minConfidence > 0) && (
                        <button 
                            onClick={() => {
                                setFilters({ search: '', minConfidence: 0 });
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className="mt-6 text-primary font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {historyItems.map((record) => (
                            <BirdCard 
                                key={record.id} 
                                bird={record} 
                                showConfidence={true} 
                                timestamp={record.identifiedAt} 
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12 bg-white p-4 rounded-3xl shadow-lg border border-gray-100 max-w-sm mx-auto">
                            <button 
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                disabled={pagination.page === 1}
                                className="p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-dark"
                            >
                                <FaChevronLeft />
                            </button>
                            
                            <div className="flex items-center gap-2 font-bold">
                                <span className="text-primary">{pagination.page}</span>
                                <span className="text-gray-300">/</span>
                                <span className="text-dark">{pagination.pages}</span>
                            </div>

                            <button 
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                                disabled={pagination.page === pagination.pages}
                                className="p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-dark"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default History;
