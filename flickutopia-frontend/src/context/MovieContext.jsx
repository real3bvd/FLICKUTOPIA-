import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { movieData as initialMovies } from '../data/movies';

const MovieContext = createContext();

export function useMovies() {
    return useContext(MovieContext);
}



export function MovieProvider({ children }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load movies from Spring Boot API (public endpoint - no auth required)
            const { data: apiMovies } = await api.get('/movies');

            if (apiMovies.length > 0) {
                setMovies(apiMovies);
            } else {
                // If no movies in database, seed with initial data
                setMovies(initialMovies);
            }
        } catch (error) {
            console.error('Failed to load movies from API, using local data:', error);
            setMovies(initialMovies);
        }



        setLoading(false);
    };

    // ==================== MOVIE CRUD (Spring Boot API) ====================

    const getMovies = async () => {
        const { data } = await api.get('/movies');
        return data;
    };

    const addMovie = async (movie) => {
        const { data: newMovie } = await api.post('/movies', movie);
        setMovies([...movies, newMovie]);
        return newMovie;
    };

    const updateMovie = async (id, updatedData) => {
        // Process actors to ensure consistent format
        const processedActors = typeof updatedData.actors === 'string'
            ? updatedData.actors.split(',').map(a => a.trim()).filter(a => a)
            : updatedData.actors;

        const localUpdate = {
            ...updatedData,
            actors: processedActors
        };

        try {
            // Try API update
            await api.put(`/movies/${id}`, updatedData);
        } catch (error) {
            // API unavailable, will use local update
        }

        // Always update local state with our processed data (don't rely on API response)
        setMovies(prevMovies => {
            const movie = prevMovies.find(m => m.id === id);
            const updatedMovie = {
                ...movie,
                ...localUpdate
            };
            return prevMovies.map(m => m.id === id ? updatedMovie : m);
        });

        return localUpdate;
    };

    const deleteMovie = async (id) => {
        await api.delete(`/movies/${id}`);
        setMovies(movies.filter(movie => movie.id !== id));


    };



    // ==================== BANNER SETTINGS (saves to database) ====================

    const getBannerMovies = () => {
        // Get movies where inBanner is true
        return movies.filter(movie => movie.inBanner === true);
    };

    const toggleBannerMovie = async (movieId) => {
        // Find the movie and toggle its inBanner status in the database
        const movie = movies.find(m => m.id === movieId);
        if (!movie) return;

        const newBannerStatus = !movie.inBanner;

        try {
            // Update in database
            const { data: updatedMovie } = await api.put(`/movies/${movieId}`, {
                ...movie,
                inBanner: newBannerStatus
            });

            // Update local state
            setMovies(movies.map(m => m.id === movieId ? updatedMovie : m));
        } catch (error) {
            console.error('Failed to update banner status:', error);
        }
    };

    const isInBanner = (movieId) => {
        const movie = movies.find(m => m.id === movieId);
        return movie ? movie.inBanner === true : false;
    };

    // Reset to default data
    const resetToDefaults = async () => {
        // Clear all movies from database (optional - could be dangerous)
        // For now, just reload from initial data
        setMovies(initialMovies);


    };

    // Refresh movies from API
    const refreshMovies = async () => {
        try {
            const { data: apiMovies } = await api.get('/movies');
            setMovies(apiMovies);
        } catch (error) {
            console.error('Failed to refresh movies:', error);
        }
    };

    const value = {
        movies,
        loading,
        // Movie CRUD
        getMovies,
        addMovie,
        updateMovie,
        deleteMovie,
        refreshMovies,

        // Banner
        getBannerMovies,
        toggleBannerMovie,
        isInBanner,
        // Utils
        resetToDefaults
    };

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    );
}
