import { Box, Typography, Grid, Container, Tabs, Tab, Chip } from '@mui/material';
import { useLibrary } from '../context/LibraryContext';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';

function LibraryPage({ onViewDetails }) {
    const { user } = useAuth();
    const { movies } = useMovies();
    const { watchlist, rentals, loading } = useLibrary();

    // Get full movie objects from IDs
    const watchlistMovies = movies.filter(m => watchlist.includes(m.id));
    const rentalMovies = movies.filter(m => rentals.includes(m.id));

    if (!user) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <span className="material-icons" style={{ fontSize: 80, color: '#555' }}>lock</span>
                <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
                    Please log in to view your library
                </Typography>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">Loading your library...</Typography>
            </Box>
        );
    }

    const totalMovies = watchlistMovies.length + rentalMovies.length;

    return (
        <Box>
            {/* Watchlist Section */}
            <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <span className="material-icons" style={{ fontSize: 28, marginRight: 12, color: '#0071e3' }}>
                        bookmark
                    </span>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Watchlist
                    </Typography>
                    <Chip
                        label={watchlistMovies.length}
                        size="small"
                        sx={{ ml: 2, bgcolor: 'rgba(0,113,227,0.2)', color: '#0071e3' }}
                    />
                </Box>

                {watchlistMovies.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 6,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        borderRadius: 3,
                        border: '1px dashed rgba(255,255,255,0.1)'
                    }}>
                        <span className="material-icons" style={{ fontSize: 48, color: '#444' }}>
                            add_circle_outline
                        </span>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                            Your watchlist is empty
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Click the + button on any movie to add it here
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' },
                        gap: 3
                    }}>
                        {watchlistMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} onViewDetails={onViewDetails} />
                        ))}
                    </Box>
                )}
            </Box>

            {/* Divider */}
            <Box sx={{
                height: 1,
                bgcolor: 'rgba(255,255,255,0.1)',
                my: 5
            }} />

            {/* My Rentals Section */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <span className="material-icons" style={{ fontSize: 28, marginRight: 12, color: '#00c853' }}>
                        play_circle_filled
                    </span>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        My Rentals
                    </Typography>
                    <Chip
                        label={rentalMovies.length}
                        size="small"
                        sx={{ ml: 2, bgcolor: 'rgba(0,200,83,0.2)', color: '#00c853' }}
                    />
                </Box>

                {rentalMovies.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 6,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        borderRadius: 3,
                        border: '1px dashed rgba(255,255,255,0.1)'
                    }}>
                        <span className="material-icons" style={{ fontSize: 48, color: '#444' }}>
                            movie
                        </span>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                            No rentals yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Movies you rent will appear here
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' },
                        gap: 3
                    }}>
                        {rentalMovies.map(movie => (
                            <Box key={movie.id} sx={{ position: 'relative' }}>
                                <MovieCard movie={movie} onViewDetails={onViewDetails} />
                                {/* Rented badge */}
                                <Chip
                                    label="RENTED"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        bgcolor: 'rgba(0,200,83,0.9)',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '0.65rem'
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default LibraryPage;
