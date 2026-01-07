import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const LibraryContext = createContext();

export function useLibrary() {
    return useContext(LibraryContext);
}

export function LibraryProvider({ children }) {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load library when user changes
    useEffect(() => {
        if (user) {
            loadLibrary();
        } else {
            setWatchlist([]);
            setRentals([]);
        }
    }, [user]);

    const loadLibrary = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // Load watchlist (token automatically added by api interceptor)
            const { data: watchData } = await api.get(`/library/${user.uid}/watchlist`);
            setWatchlist(watchData.map(item => item.movieId));

            // Load rentals
            const { data: rentData } = await api.get(`/library/${user.uid}/rented`);
            setRentals(rentData.map(item => item.movieId));
        } catch (error) {
            console.error('Failed to load library:', error);
            // Fallback to localStorage if API fails
            const stored = localStorage.getItem(`library_${user.uid}`);
            if (stored) {
                const data = JSON.parse(stored);
                setWatchlist(data.watchlist || []);
                setRentals(data.rentals || []);
            }
        }

        setLoading(false);
    };

    // Toggle watchlist (add/remove)
    const toggleWatchlist = async (movieId) => {
        if (!user) return;

        const isInList = watchlist.includes(movieId);

        try {
            if (isInList) {
                // Remove from watchlist
                await api.delete(`/library/${user.uid}/${movieId}`);
                setWatchlist(watchlist.filter(id => id !== movieId));
            } else {
                // Add to watchlist
                await api.post('/library', {
                    userId: user.uid,
                    movieId: movieId,
                    type: 'WATCHLIST'
                });
                setWatchlist([...watchlist, movieId]);
            }
        } catch (error) {
            console.error('Failed to update watchlist:', error);
            // Fallback: update locally anyway
            if (isInList) {
                setWatchlist(watchlist.filter(id => id !== movieId));
            } else {
                setWatchlist([...watchlist, movieId]);
            }
        }
    };

    // Add to rentals (called after payment)
    const addToRentals = async (movieId) => {
        if (!user) return;

        if (rentals.includes(movieId)) return; // Already rented

        try {
            await api.post('/library', {
                userId: user.uid,
                movieId: movieId,
                type: 'RENTED'
            });
            setRentals([...rentals, movieId]);
        } catch (error) {
            console.error('Failed to add rental:', error);
            setRentals([...rentals, movieId]);
        }
    };

    // Remove from rentals (after watching)
    const removeRental = async (movieId) => {
        if (!user) return;

        try {
            await api.delete(`/library/${user.uid}/${movieId}`);
            setRentals(rentals.filter(id => id !== movieId));
        } catch (error) {
            console.error('Failed to remove rental:', error);
            // Still remove locally
            setRentals(rentals.filter(id => id !== movieId));
        }
    };

    // Check if movie is in watchlist
    const isInWatchlist = (movieId) => {
        return watchlist.includes(movieId);
    };

    // Check if movie is rented
    const isRented = (movieId) => {
        return rentals.includes(movieId);
    };

    const value = {
        watchlist,
        rentals,
        loading,
        toggleWatchlist,
        addToRentals,
        removeRental,
        isInWatchlist,
        isRented,
        loadLibrary
    };

    return (
        <LibraryContext.Provider value={value}>
            {children}
        </LibraryContext.Provider>
    );
}
