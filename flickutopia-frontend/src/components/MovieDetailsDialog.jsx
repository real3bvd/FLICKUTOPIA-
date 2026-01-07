import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Chip, IconButton } from '@mui/material';

function MovieDetailsDialog({ open, movie, onClose, onRent, onAddToLibrary, inLibrary, isRented, onRemoveRental }) {
    const [trailerOpen, setTrailerOpen] = useState(false);
    const [moviePlayerOpen, setMoviePlayerOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    if (!movie) return null;

    const getImagePath = (title) => {
        const filename = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        return `http://localhost:8080/api/posters/${filename}.jpg`;
    };

    const handleOpenTrailer = () => {
        setTrailerOpen(true);
    };

    const handleCloseTrailer = () => {
        setTrailerOpen(false);
    };

    const handleStartWatching = () => {
        setMoviePlayerOpen(true);
    };

    const handleCloseMoviePlayer = () => {
        setMoviePlayerOpen(false);
        // Movie stays in rentals - user has 48 hours from first watch
    };

    // Fallback placeholder for missing posters
    const posterUrl = movie.posterUrl || getImagePath(movie.title);
    const placeholderGradient = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1d1d1f',
                        backgroundImage: 'none',
                        borderRadius: 3
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h4">{movie.title}</Typography>
                    <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    {/* Side by side layout: Poster left, Info right */}
                    <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                        {/* Left: Poster */}
                        <Box sx={{
                            width: { xs: '100%', md: '300px' },
                            flexShrink: 0,
                            position: 'relative'
                        }}>
                            <Box sx={{
                                width: '100%',
                                height: { xs: 350, md: 450 },
                                borderRadius: 2,
                                background: imageError ? placeholderGradient : `url(${posterUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* Hidden img to detect load errors */}
                                <img
                                    src={posterUrl}
                                    alt=""
                                    style={{ display: 'none' }}
                                    onError={() => setImageError(true)}
                                />
                                {/* Show title on placeholder */}
                                {imageError && (
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textAlign: 'center',
                                            px: 2,
                                            fontWeight: 600
                                        }}
                                    >
                                        {movie.title}
                                    </Typography>
                                )}
                                {/* Watch Trailer Button */}
                                <Button
                                    variant="contained"
                                    onClick={handleOpenTrailer}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': {
                                            bgcolor: 'rgba(0,0,0,0.85)'
                                        },
                                        borderRadius: 2,
                                        px: 2.5,
                                        py: 1
                                    }}
                                >
                                    <span className="material-icons" style={{ marginRight: 8, fontSize: 20 }}>play_circle</span>
                                    Watch Trailer
                                </Button>
                            </Box>
                        </Box>

                        {/* Right: Info */}
                        <Box sx={{ flex: 1 }}>
                            {/* Tags */}
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                {movie.genre && <Chip label={movie.genre} color="primary" size="small" />}
                                {movie.ageConsent && <Chip label={movie.ageConsent} variant="outlined" size="small" />}
                                {movie.duration && <Chip label={movie.duration} variant="outlined" size="small" />}
                                {movie.releaseDate && <Chip label={movie.releaseDate} variant="outlined" size="small" />}
                            </Box>

                            {/* Description */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    {movie.description}
                                </Typography>
                            </Box>

                            {/* Director & Producers */}
                            <Box sx={{ display: 'flex', gap: 4, mb: 2, flexWrap: 'wrap' }}>
                                {movie.director && (
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Director</Typography>
                                        <Typography variant="body1">{movie.director}</Typography>
                                    </Box>
                                )}
                                {movie.producers && (
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Producers</Typography>
                                        <Typography variant="body1">{movie.producers}</Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Cast - handle both string and array format */}
                            {movie.actors && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Cast</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {(typeof movie.actors === 'string'
                                            ? movie.actors.split(',').map(a => a.trim())
                                            : movie.actors
                                        ).map((actor, i) => (
                                            <Chip key={i} label={actor} variant="outlined" size="small" />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Pricing / Rental Status */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                mt: 2,
                                p: 2,
                                bgcolor: isRented ? 'rgba(0,200,83,0.1)' : 'transparent',
                                borderRadius: 2,
                                border: isRented ? '1px solid rgba(0,200,83,0.3)' : 'none'
                            }}>
                                {isRented ? (
                                    <>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <span className="material-icons" style={{ color: '#00c853', fontSize: 24 }}>
                                                check_circle
                                            </span>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#00c853' }}>
                                                Rental Active
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                                            • 7 days to start watching
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                                            • 48 hours to finish once started
                                        </Typography>
                                    </>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            Rental Price:
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                background: 'linear-gradient(135deg, #0071e3 0%, #00c6ff 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                letterSpacing: '-0.02em'
                                            }}
                                        >
                                            ₺{movie.rentPrice}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={onClose}>Close</Button>
                    {!isRented && (
                        <Button
                            variant={inLibrary ? "contained" : "outlined"}
                            color={inLibrary ? "success" : "primary"}
                            onClick={() => onAddToLibrary(movie)}
                            sx={{
                                transition: 'all 0.3s ease',
                                transform: inLibrary ? 'scale(1.02)' : 'scale(1)'
                            }}
                        >
                            <span className="material-icons" style={{ marginRight: 8, fontSize: 20 }}>
                                {inLibrary ? 'check' : 'add'}
                            </span>
                            {inLibrary ? 'In Watchlist' : 'Add to Watchlist'}
                        </Button>
                    )}
                    {isRented ? (
                        <>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => { onRemoveRental(movie.id); onClose(); }}
                                sx={{ mr: 1 }}
                            >
                                <span className="material-icons" style={{ marginRight: 8, fontSize: 20 }}>delete</span>
                                Remove Rental
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleStartWatching}
                                sx={{
                                    background: 'linear-gradient(135deg, #00c853 0%, #00e676 100%)',
                                    px: 3,
                                    py: 1.2,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #00a844 0%, #00c853 100%)',
                                    }
                                }}
                            >
                                <span className="material-icons" style={{ marginRight: 8, fontSize: 20 }}>play_circle_filled</span>
                                Start Watching
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => { onRent(movie); }}
                        >
                            <span className="material-icons" style={{ marginRight: 8, fontSize: 20 }}>play_arrow</span>
                            Rent ₺{movie.rentPrice}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Trailer Modal */}
            <Dialog
                open={trailerOpen}
                onClose={handleCloseTrailer}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#000',
                        backgroundImage: 'none',
                        borderRadius: 3,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#000',
                    color: '#fff',
                    py: 1.5
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {movie.title} - Official Trailer
                    </Typography>
                    <IconButton onClick={handleCloseTrailer} sx={{ color: '#fff' }}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, bgcolor: '#000' }}>
                    {movie.trailerId ? (
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '56.25%',
                        }}>
                            <iframe
                                src={`https://www.youtube.com/embed/${movie.trailerId}?autoplay=1&rel=0`}
                                title={`${movie.title} Trailer`}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none'
                                }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                            />
                        </Box>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 300,
                            color: 'text.secondary',
                            textAlign: 'center',
                            p: 4
                        }}>
                            <span className="material-icons" style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>
                                videocam_off
                            </span>
                            <Typography variant="h6" gutterBottom>
                                Trailer Currently Unavailable
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                We're sorry, the trailer for this movie is not available at the moment.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Movie Player Modal */}
            <Dialog
                open={moviePlayerOpen}
                onClose={handleCloseMoviePlayer}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#000',
                        backgroundImage: 'none',
                        borderRadius: 3,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#000',
                    color: '#fff',
                    py: 1.5
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span className="material-icons" style={{ color: '#00c853' }}>play_circle_filled</span>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                            Now Playing: {movie.title}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleCloseMoviePlayer} sx={{ color: '#fff' }}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, bgcolor: '#000' }}>
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%',
                    }}>
                        <iframe
                            src="https://www.youtube.com/embed/bNJW113tbKk?autoplay=1&rel=0"
                            title={`${movie.title} - Full Movie`}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default MovieDetailsDialog;