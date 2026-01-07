import { useState } from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';

function MovieCard({ movie, onViewDetails }) {
    const [isHovered, setIsHovered] = useState(false);
    const { isInWatchlist, toggleWatchlist } = useLibrary();
    const { user } = useAuth();

    const inWatchlist = isInWatchlist(movie.id);

    const getImagePath = (title) => {
        const filename = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        return `http://localhost:8080/api/posters/${filename}.jpg`;
    };

    const handleWatchlistClick = (e) => {
        e.stopPropagation(); // Don't open movie details
        if (user) {
            toggleWatchlist(movie.id);
        }
    };

    return (
        <Box
            onClick={() => onViewDetails(movie)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                zIndex: isHovered ? 100 : 1,
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            {/* Watchlist Button - Top Right */}
            {user && (
                <IconButton
                    onClick={handleWatchlistClick}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 10,
                        bgcolor: inWatchlist ? 'rgba(0, 200, 83, 0.9)' : 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        width: 36,
                        height: 36,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: inWatchlist ? 'scale(1.1)' : 'scale(1)',
                        '&:hover': {
                            bgcolor: inWatchlist ? 'rgba(0, 200, 83, 1)' : 'rgba(0,113,227,0.9)',
                            transform: 'scale(1.15)',
                        },
                    }}
                >
                    <span
                        className="material-icons"
                        style={{
                            fontSize: 20,
                            transition: 'transform 0.3s ease',
                            transform: inWatchlist ? 'rotate(360deg)' : 'rotate(0deg)'
                        }}
                    >
                        {inWatchlist ? 'check' : 'add'}
                    </span>
                </IconButton>
            )}

            {/* Movie Poster */}
            <Box
                sx={{
                    height: { xs: 260, sm: 300, md: 340 },
                    width: '100%',
                    borderRadius: 2,
                    backgroundImage: `url(${getImagePath(movie.title)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#1d1d1f',
                    boxShadow: isHovered
                        ? '0 20px 40px rgba(0,0,0,0.8)'
                        : '0 4px 15px rgba(0,0,0,0.4)',
                    transition: 'all 0.3s ease',
                }}
            />

            {/* Info Panel - appears on hover as overlay */}
            {isHovered && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 70%, transparent 100%)',
                        borderRadius: '0 0 8px 8px',
                        p: 2,
                        pt: 4,
                        animation: 'fadeIn 0.2s ease-in-out',
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'translateY(10px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            mb: 1,
                            color: '#fff'
                        }}
                    >
                        {movie.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                        <Chip
                            label={movie.genre}
                            size="small"
                            sx={{
                                bgcolor: '#0071e3',
                                color: '#fff',
                                fontSize: '0.7rem',
                                height: 24
                            }}
                        />
                        <Chip
                            label={movie.ageConsent}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: '#fff',
                                fontSize: '0.7rem',
                                height: 24
                            }}
                        />
                        <Chip
                            label={movie.duration}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: '#fff',
                                fontSize: '0.7rem',
                                height: 24
                            }}
                        />
                        {movie.year && (
                            <Chip
                                label={movie.year}
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    color: '#fff',
                                    fontSize: '0.7rem',
                                    height: 24
                                }}
                            />
                        )}
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.85rem',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {movie.description}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default MovieCard;