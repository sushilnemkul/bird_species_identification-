import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getHistory } from '../services/BirdService';

const BirdContext = createContext(null);

export const BirdProvider = ({ children }) => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (user) {
            loadHistory(user.id);
        } else {
            setHistory([]);
        }
    }, [user]);

    const loadHistory = async (userId) => {
        setLoadingHistory(true);
        try {
            const data = await getHistory(userId);
            setHistory(data.items || []);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const addRecord = (result) => {
        // Since backend saves prediction automatically if user_id is present,
        // we just update local state optimistically.
        if (user) {
            // Ensure result has the fields expected by History page (like identifiedAt/timestamp)
            const newRecord = {
                ...result,
                image: result.image || result.imageUrl, // Handle both formats
                identifiedAt: result.identifiedAt || new Date().toISOString()
            };
            setHistory(prev => [newRecord, ...prev]);
        }
    };

    const deleteRecord = (id) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    const value = {
        history,
        loadingHistory,
        addRecord,
        deleteRecord,
        refreshHistory: () => user && loadHistory(user.id)
    };

    return (
        <BirdContext.Provider value={value}>
            {children}
        </BirdContext.Provider>
    );
};

export const useBird = () => {
  const context = useContext(BirdContext);
  if (!context) {
    throw new Error('useBird must be used within a BirdProvider');
  }
  return context;
};
