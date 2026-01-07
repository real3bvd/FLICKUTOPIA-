import { useState, useEffect, useRef } from 'react';
import {
    AppBar, Toolbar, Typography, Container, Grid, Button, Box, CircularProgress,
    Chip, ThemeProvider, createTheme, CssBaseline, IconButton, Snackbar, Badge, Popover, Avatar
} from '@mui/material';
import MovieCard from './components/MovieCard';
import MovieDetailsDialog from './components/MovieDetailsDialog';
import LoginDialog from './pages/LoginDialog';
import SignupDialog from './pages/SignupDialog';
import LibraryPage from './pages/LibraryPage';
import PaymentDialog from './components/PaymentDialog';
import { useAuth } from './context/AuthContext';
import { useMovies } from './context/MovieContext';
import { useLibrary } from './context/LibraryContext';
import './App.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#0071e3' },
        secondary: { main: '#f5f5f7' },
        background: { default: '#000000', paper: '#1d1d1f' }
    },
    typography: {
        fontFamily: '"Poppins", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
        h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
        h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
        h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
        h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
        h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
        h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 }
    }
});

function App() {
    const { user, logout, isAdmin } = useAuth();
    const { movies, getBannerMovies, loading: moviesLoading } = useMovies();
    const { watchlist, rentals, addToRentals } = useLibrary();
    const [loading, setLoading] = useState(true);
    const [posterMovies, setPosterMovies] = useState([]);
    const [posterIndex, setPosterIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const autoSlideRef = useRef(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [paymentMovie, setPaymentMovie] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [currentTab, setCurrentTab] = useState(0);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);

    const accountCloseTimerRef = useRef(null);

    const genres = ['All', 'Action', 'Drama', 'Thriller', 'Comedy', 'Sci-Fi', 'Romance', 'Horror', 'Adventure', 'History'];

    // Reset to home when user logs out
    useEffect(() => {
        if (!user) {
            setCurrentTab(0);
        }
    }, [user]);

    useEffect(() => {
        // Movies are now loaded from MovieContext
        if (!moviesLoading) {
            setLoading(false);
        }
    }, [moviesLoading]);

    useEffect(() => {
        if (movies.length > 0) {
            // Get banner movies from context (admin-configurable)
            const bannerMovies = getBannerMovies();
            setPosterMovies(bannerMovies.length > 0 ? bannerMovies : movies.slice(0, 4));
            setPosterIndex(0);
        }
    }, [movies, getBannerMovies]);

    // Auto-slideshow effect
    useEffect(() => {
        if (posterMovies.length > 0 && currentTab === 0) {
            autoSlideRef.current = setInterval(() => {
                triggerTransition(() => {
                    setPosterIndex(i => (i + 1) % posterMovies.length);
                });
            }, 5000);
        }
        return () => {
            if (autoSlideRef.current) clearInterval(autoSlideRef.current);
        };
    }, [posterMovies.length, currentTab]);

    const resetAutoSlide = () => {
        if (autoSlideRef.current) clearInterval(autoSlideRef.current);
        autoSlideRef.current = setInterval(() => {
            triggerTransition(() => {
                setPosterIndex(i => (i + 1) % posterMovies.length);
            });
        }, 5000);
    };

    const triggerTransition = (callback) => {
        setIsTransitioning(true);
        setTimeout(() => {
            callback();
            setIsTransitioning(false);
        }, 300);
    };

    // loadMovies is no longer needed - data comes from MovieContext

    // Open payment dialog for rental
    const handleRent = (movie) => {
        if (!user) {
            setSnackbarMessage('Please log in to rent movies');
            setSnackbarOpen(true);
            setLoginOpen(true);
            return;
        }
        setPaymentMovie(movie);
        setPaymentOpen(true);
        setDialogOpen(false); // Close movie details
    };

    // Handle successful payment
    const handlePaymentSuccess = (movie) => {
        addToRentals(movie.id);
        setSnackbarMessage(`✓ Successfully rented "${movie.title}"! Check your Library.`);
        setSnackbarOpen(true);
    };

    const { toggleWatchlist: toggleLibraryWatchlist, isInWatchlist, isRented, removeRental } = useLibrary();

    const handleRemoveRental = (movieId) => {
        removeRental(movieId);
        setSnackbarMessage('✓ Movie watched! Removed from rentals.');
        setSnackbarOpen(true);
    };

    const handleAddToLibrary = (movie) => {
        if (!user) {
            setSnackbarMessage('Please log in to add to watchlist');
            setSnackbarOpen(true);
            return;
        }
        const inList = isInWatchlist(movie.id);
        toggleLibraryWatchlist(movie.id);
        setSnackbarMessage(inList
            ? `✓ Removed "${movie.title}" from watchlist`
            : `✓ Added "${movie.title}" to watchlist`);
        setSnackbarOpen(true);
    };

    const handleViewDetails = (movie) => {
        setSelectedMovie(movie);
        setDialogOpen(true);
    };

    const handlePrevPoster = () => {
        triggerTransition(() => {
            setPosterIndex(i => (i - 1 + posterMovies.length) % posterMovies.length);
        });
        resetAutoSlide();
    };

    const handleNextPoster = () => {
        triggerTransition(() => {
            setPosterIndex(i => (i + 1) % posterMovies.length);
        });
        resetAutoSlide();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleAccountOpen = (event) => {
        if (accountCloseTimerRef.current) {
            clearTimeout(accountCloseTimerRef.current);
            accountCloseTimerRef.current = null;
        }
        setAccountMenuAnchor(event.currentTarget);
    };

    const handleAccountCloseNow = () => {
        if (accountCloseTimerRef.current) {
            clearTimeout(accountCloseTimerRef.current);
            accountCloseTimerRef.current = null;
        }
        setAccountMenuAnchor(null);
    };

    const filteredMovies = (() => {
        // Library is now handled by LibraryPage component
        // Home tab (0) and default
        let result = movies;
        const query = searchQuery.trim().toLowerCase();

        if (query) {
            // Filter movies whose titles start with or contain the search query (case-insensitive)
            const startsWithQuery = movies.filter(m =>
                m.title.toLowerCase().startsWith(query)
            );
            const containsQuery = movies.filter(m =>
                !m.title.toLowerCase().startsWith(query) &&
                m.title.toLowerCase().includes(query)
            );
            // Prioritize movies starting with the query, then those containing it
            result = [...startsWithQuery, ...containsQuery];
        } else if (selectedGenre !== 'All') {
            result = movies.filter(m => m.genre === selectedGenre);
        }

        return result;
    })();

    const getImagePath = (title) => {
        const filename = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        return `http://localhost:8080/api/posters/${filename}.jpg`;
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
                <AppBar position="sticky" elevation={0} sx={{
                    bgcolor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)',
                    borderBottom: 'none'
                }}>
                    <Toolbar>
                        <Box
                            onClick={() => { setCurrentTab(0); setSelectedGenre('All'); setSearchQuery(''); }}
                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        >
                            <span className="material-icons" style={{ marginRight: 16, fontSize: 32 }}>movie</span>
                            <Typography variant="h6" sx={{ fontWeight: 500, letterSpacing: '-0.01em' }}>
                                Flickutopia
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            py: 0.8,
                            mr: 2,
                            width: { xs: '200px', md: '320px' },
                            transition: 'all 0.3s ease'
                        }}>
                            <span className="material-icons"
                                style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', marginRight: 8 }}>
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search movies by title..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#fff',
                                    width: '100%',
                                    fontSize: '0.9rem',
                                    fontFamily: 'inherit'
                                }}
                            />
                            {searchQuery && (
                                <span
                                    className="material-icons"
                                    style={{
                                        fontSize: 18,
                                        color: 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer',
                                        marginLeft: 8,
                                        transition: 'color 0.2s'
                                    }}
                                    onClick={handleClearSearch}
                                    onMouseOver={(e) => e.target.style.color = '#fff'}
                                    onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}
                                >
                                    close
                                </span>
                            )}
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            mr: 2
                        }}>
                            <Button
                                onClick={() => { setCurrentTab(0); setSelectedGenre('All'); }}
                                sx={{
                                    textTransform: 'none',
                                    color: currentTab === 0 ? '#fff' : 'rgba(255,255,255,0.7)',
                                    bgcolor: currentTab === 0 ? '#0071e3' : 'transparent',
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    outline: 'none',
                                    border: 'none',
                                    '&:focus': { outline: 'none', boxShadow: 'none' },
                                    '&:hover': {
                                        bgcolor: currentTab === 0 ? '#0071e3' : 'rgba(255,255,255,0.1)'
                                    }
                                }}>
                                Home
                            </Button>
                            <Button
                                onClick={() => { setCurrentTab(1); setSelectedGenre('All'); setSearchQuery(''); }}
                                sx={{
                                    textTransform: 'none',
                                    color: currentTab === 1 ? '#fff' : 'rgba(255,255,255,0.7)',
                                    bgcolor: currentTab === 1 ? '#0071e3' : 'transparent',
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    outline: 'none',
                                    border: 'none',
                                    '&:focus': { outline: 'none', boxShadow: 'none' },
                                    '&:hover': {
                                        bgcolor: currentTab === 1 ? '#0071e3' : 'rgba(255,255,255,0.1)'
                                    }
                                }}>
                                <Badge badgeContent={watchlist.length + rentals.length} color="error" sx={{ mr: 1 }}>
                                    <span className="material-icons" style={{ fontSize: 18 }}>video_library</span>
                                </Badge>
                                Library
                            </Button>
                        </Box>

                        <Box>
                            <IconButton
                                onMouseEnter={handleAccountOpen}
                                onClick={(e) => {
                                    if (accountMenuAnchor) handleAccountCloseNow();
                                    else handleAccountOpen(e);
                                }}
                                sx={{
                                    color: '#fff',
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
                                }}
                            >
                                <span className="material-icons">account_circle</span>
                            </IconButton>

                            <Popover
                                open={Boolean(accountMenuAnchor)}
                                anchorEl={accountMenuAnchor}
                                onClose={handleAccountCloseNow}
                                disableRestoreFocus
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                PaperProps={{
                                    onMouseLeave: handleAccountCloseNow,
                                    sx: {
                                        mt: 1,
                                        bgcolor: '#1d1d1f',
                                        backgroundImage: 'none',
                                        borderRadius: 3,
                                        width: 260,
                                        boxShadow: '0 18px 60px rgba(0,0,0,0.65)'
                                    }
                                }}
                            >
                                <Box sx={{ p: 2 }}>
                                    {user ? (
                                        <>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Avatar sx={{ bgcolor: '#0071e3', width: 44, height: 44 }}>
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                                                        {user.email?.split('@')[0]}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button fullWidth onClick={async () => {
                                                await logout();
                                                setSnackbarMessage('Logged out successfully');
                                                setSnackbarOpen(true);
                                                handleAccountCloseNow();
                                            }} sx={{
                                                textTransform: 'none',
                                                justifyContent: 'flex-start',
                                                fontWeight: 600,
                                                color: '#ff5c5c',
                                                py: 1.2,
                                                borderRadius: 2,
                                                '&:hover': { bgcolor: 'rgba(255,92,92,0.1)' }
                                            }}>
                                                <span className="material-icons" style={{ marginRight: 8, fontSize: 20 }}>logout</span>
                                                Log Out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Typography variant="subtitle2" sx={{
                                                mb: 1.5,
                                                color: 'rgba(255,255,255,0.6)',
                                                textTransform: 'uppercase',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                Your Account
                                            </Typography>
                                            <Button fullWidth onClick={() => {
                                                setSignupOpen(true);
                                                handleAccountCloseNow();
                                            }} sx={{
                                                textTransform: 'none',
                                                justifyContent: 'flex-start',
                                                fontWeight: 600,
                                                color: '#fff',
                                                py: 1.2,
                                                borderRadius: 2,
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                                            }}>
                                                Sign Up
                                            </Button>
                                            <Button fullWidth onClick={() => {
                                                setLoginOpen(true);
                                                handleAccountCloseNow();
                                            }} sx={{
                                                mt: 0.5,
                                                textTransform: 'none',
                                                justifyContent: 'flex-start',
                                                fontWeight: 600,
                                                color: '#fff',
                                                py: 1.2,
                                                borderRadius: 2,
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                                            }}>
                                                Log In
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Popover>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Hero Section - hidden when actively searching */}
                {!(currentTab === 0 && searchQuery.trim()) && (
                    <Box sx={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #000000 100%)', py: { xs: 4, md: 6 }, textAlign: 'center' }}>
                        <Container maxWidth="lg">
                            {currentTab === 0 ? (
                                posterMovies.length > 0 ? (
                                    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 3, height: { xs: '300px', md: '500px' } }}>
                                        <Box sx={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundImage: `url(${getImagePath(posterMovies[posterIndex].title)})`,
                                            backgroundSize: 'cover', backgroundPosition: 'center',
                                            filter: 'blur(40px)', transform: 'scale(1.1)', opacity: 0.5,
                                            transition: 'all 0.5s ease-in-out'
                                        }} />
                                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)' }} />
                                        <Box sx={{
                                            position: 'relative', height: '100%', display: 'flex',
                                            alignItems: 'center', px: { xs: 3, md: 6 }, gap: 4,
                                            opacity: isTransitioning ? 0 : 1,
                                            transform: isTransitioning ? 'translateX(20px)' : 'translateX(0)',
                                            transition: 'all 0.3s ease-in-out'
                                        }}>
                                            <Box sx={{
                                                width: { xs: '140px', md: '280px' },
                                                height: { xs: '210px', md: '420px' },
                                                backgroundImage: `url(${getImagePath(posterMovies[posterIndex].title)})`,
                                                backgroundSize: 'cover', borderRadius: 2,
                                                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                                                transition: 'all 0.5s ease-in-out'
                                            }} />
                                            <Box sx={{ flexGrow: 1, color: '#fff', textAlign: 'left' }}>
                                                <Typography variant="h2" sx={{
                                                    fontWeight: 600, fontSize: { xs: '1.5rem', md: '2.2rem' },
                                                    textShadow: '2px 2px 10px rgba(0,0,0,0.8)'
                                                }}>
                                                    {posterMovies[posterIndex].title}
                                                </Typography>
                                                <Typography sx={{
                                                    fontSize: { xs: '0.85rem', md: '1rem' },
                                                    color: 'rgba(255,255,255,0.9)',
                                                    display: { xs: 'none', sm: 'block' },
                                                    maxWidth: '600px', mt: 2
                                                }}>
                                                    {posterMovies[posterIndex].description}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                                    <Chip label={posterMovies[posterIndex].genre} sx={{ bgcolor: 'rgba(0,113,227,0.9)', color: '#fff' }} />
                                                    <Chip label={posterMovies[posterIndex].duration} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
                                                    <Chip label={posterMovies[posterIndex].ageConsent} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
                                                </Box>
                                                <Button variant="contained" onClick={() => handleViewDetails(posterMovies[posterIndex])} sx={{ mt: 2, textTransform: 'none' }}>
                                                    <span className="material-icons" style={{ marginRight: 8, fontSize: 18 }}>info</span>
                                                    View Details
                                                </Button>
                                            </Box>
                                        </Box>
                                        <IconButton onClick={handlePrevPoster} sx={{
                                            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                                            bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', outline: 'none',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                            '&:focus': { outline: 'none' }
                                        }}>
                                            <span className="material-icons">chevron_left</span>
                                        </IconButton>
                                        <IconButton onClick={handleNextPoster} sx={{
                                            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                                            bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', outline: 'none',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                            '&:focus': { outline: 'none' }
                                        }}>
                                            <span className="material-icons">chevron_right</span>
                                        </IconButton>
                                        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                                            {posterMovies.map((m, idx) => (
                                                <Box key={m.id} onClick={() => {
                                                    triggerTransition(() => setPosterIndex(idx));
                                                    resetAutoSlide();
                                                }} sx={{
                                                    width: 12, height: 12, borderRadius: '50%',
                                                    bgcolor: idx === posterIndex ? '#0071e3' : 'rgba(255,255,255,0.4)',
                                                    cursor: 'pointer', transition: 'all 0.3s',
                                                    transform: idx === posterIndex ? 'scale(1.3)' : 'scale(1)'
                                                }} />
                                            ))}
                                        </Box>
                                    </Box>
                                ) : <Typography variant="h4">Loading...</Typography>
                            ) : (
                                <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' } }}>
                                    My Library
                                </Typography>
                            )}
                            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                                {currentTab === 0 ? 'Step into your movie paradise'
                                    : `${watchlist.length + rentals.length} movies in your collection`}
                            </Typography>
                        </Container>
                    </Box>
                )}

                {currentTab === 0 && (
                    <Container maxWidth="lg" sx={{ mt: 4 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 3 }}>
                            {genres.map(g => (
                                <Chip key={g} label={g} onClick={() => setSelectedGenre(g)}
                                    color={selectedGenre === g ? "primary" : "default"}
                                    variant={selectedGenre === g ? "filled" : "outlined"}
                                    sx={{ cursor: 'pointer', borderRadius: 2 }} />
                            ))}
                        </Box>
                    </Container>
                )}

                <Container maxWidth="lg" sx={{ py: 4 }}>
                    {loading ? (
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                            gap: 4,
                            width: '100%'
                        }}>
                            {[...Array(8)].map((_, index) => (
                                <Box key={index} className="skeleton-card">
                                    <Box sx={{
                                        height: { xs: 260, sm: 300, md: 340 },
                                        borderRadius: 2,
                                        bgcolor: '#1d1d1f',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                                            animation: 'shimmer 1.5s infinite'
                                        }
                                    }} />
                                    <Box sx={{ mt: 2 }}>
                                        <Box sx={{
                                            height: 20,
                                            width: '70%',
                                            borderRadius: 1,
                                            bgcolor: '#1d1d1f',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                                                animation: 'shimmer 1.5s infinite 0.2s'
                                            }
                                        }} />
                                        <Box sx={{
                                            height: 14,
                                            width: '40%',
                                            borderRadius: 1,
                                            bgcolor: '#1d1d1f',
                                            mt: 1,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                                                animation: 'shimmer 1.5s infinite 0.4s'
                                            }
                                        }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : currentTab === 1 ? (
                        <LibraryPage onViewDetails={handleViewDetails} />
                    ) : filteredMovies.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <span className="material-icons" style={{ fontSize: 80, color: '#555' }}>
                                {currentTab === 0 && searchQuery ? 'search_off' : 'movie_filter'}
                            </span>
                            <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
                                {currentTab === 0 && searchQuery
                                    ? "No movies found. Try a different title."
                                    : 'Your library is empty'}
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                            gap: 4,
                            width: '100%',
                            pb: 20
                        }}>
                            {filteredMovies.map((movie, index) => (
                                <Box
                                    key={`${movie.id}-${searchQuery}`}
                                    className={searchQuery.trim() ? 'movie-card-animated' : ''}
                                    style={searchQuery.trim() ? { animationDelay: `${index * 0.05}s` } : {}}
                                >
                                    <MovieCard movie={movie} onViewDetails={handleViewDetails} />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Container>

                <MovieDetailsDialog
                    open={dialogOpen}
                    movie={selectedMovie}
                    onClose={() => { setDialogOpen(false); setTimeout(() => setSelectedMovie(null), 300); }}
                    onRent={handleRent}
                    onAddToLibrary={handleAddToLibrary}
                    inLibrary={selectedMovie ? isInWatchlist(selectedMovie.id) : false}
                    isRented={selectedMovie ? isRented(selectedMovie.id) : false}
                    onRemoveRental={handleRemoveRental}
                />

                <PaymentDialog
                    open={paymentOpen}
                    onClose={() => { setPaymentOpen(false); setPaymentMovie(null); }}
                    movie={paymentMovie}
                    onPaymentSuccess={handlePaymentSuccess}
                />

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    message={snackbarMessage}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />

                {/* Auth Dialogs */}
                <LoginDialog
                    open={loginOpen}
                    onClose={() => setLoginOpen(false)}
                    onSwitchToSignup={() => { setLoginOpen(false); setSignupOpen(true); }}
                />
                <SignupDialog
                    open={signupOpen}
                    onClose={() => setSignupOpen(false)}
                    onSwitchToLogin={() => { setSignupOpen(false); setLoginOpen(true); }}
                />

                <Box sx={{ bgcolor: '#1d1d1f', py: 4, mt: 8, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Flickutopia © 2025
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        University Web Design and Programming Project
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;