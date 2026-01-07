import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, Switch, Snackbar, Alert, Tabs, Tab, FormControl, InputLabel, Select,
    MenuItem, OutlinedInput
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';

const GENRES = ['Action', 'Drama', 'Thriller', 'Comedy', 'Sci-Fi', 'Romance', 'Horror', 'Adventure', 'History'];

export default function AdminPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const {
        movies, addMovie, updateMovie, deleteMovie,
        toggleBannerMovie, isInBanner, resetToDefaults
    } = useMovies();

    const [activeTab, setActiveTab] = useState(0);
    const [movieDialogOpen, setMovieDialogOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Movie form state
    const [movieForm, setMovieForm] = useState({
        title: '', description: '', genre: '', genres: [],
        rentPrice: '', director: '', producers: '',
        actors: '', releaseDate: '', ageConsent: '', duration: '', trailerId: ''
    });
    const [posterFile, setPosterFile] = useState(null);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    // ==================== MOVIE HANDLERS ====================

    const openAddMovieDialog = () => {
        setEditingMovie(null);
        setMovieForm({
            title: '', description: '', genre: '', genres: [],
            rentPrice: '', director: '', producers: '',
            actors: '', releaseDate: '', ageConsent: '', duration: '', trailerId: ''
        });
        setMovieDialogOpen(true);
    };

    const openEditMovieDialog = (movie) => {
        setEditingMovie(movie);
        setMovieForm({
            title: movie.title || '',
            description: movie.description || '',
            genre: movie.genre || '',
            genres: movie.genres || [],
            rentPrice: movie.rentPrice || '',
            director: movie.director || '',
            producers: movie.producers || '',
            actors: Array.isArray(movie.actors) ? movie.actors.join(', ') : (movie.actors || ''),
            releaseDate: movie.releaseDate || '',
            ageConsent: movie.ageConsent || '',
            duration: movie.duration || '',
            trailerId: movie.trailerId || ''
        });
        setPosterFile(null); // Reset file input
        setMovieDialogOpen(true);
    };

    const handleMovieFormChange = (field, value) => {
        setMovieForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveMovie = async () => {
        if (!movieForm.title.trim()) {
            showSnackbar('Title is required', 'error');
            return;
        }

        const movieData = {
            ...movieForm,
            actors: movieForm.actors, // Keep as comma-separated string for backend
            genre: movieForm.genre || movieForm.genres[0] || 'Drama'
        };

        try {
            // Upload poster if a new file was selected
            if (posterFile) {
                const formData = new FormData();
                formData.append('file', posterFile);
                const filename = movieForm.title.toLowerCase().replace(/[^a-z0-9]/g, '');
                formData.append('filename', filename);

                const uploadResponse = await fetch('http://localhost:8080/api/posters/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!uploadResponse.ok) {
                    throw new Error('Poster upload failed');
                }
            }

            if (editingMovie) {
                await updateMovie(editingMovie.id, movieData);
                showSnackbar('Movie updated successfully');
            } else {
                await addMovie(movieData);
                showSnackbar('Movie added successfully');
            }
            setMovieDialogOpen(false);
            setPosterFile(null);
        } catch (error) {
            showSnackbar('Error saving movie: ' + error.message, 'error');
        }
    };

    const handleDeleteClick = (movie) => {
        setMovieToDelete(movie);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (movieToDelete) {
            await deleteMovie(movieToDelete.id);
            showSnackbar('Movie deleted successfully');
        }
        setDeleteConfirmOpen(false);
        setMovieToDelete(null);
    };

    // ==================== RENDER ====================

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#000' }}>
            {/* Sidebar */}
            <Box sx={{
                width: 260,
                bgcolor: '#0a0a0a',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                p: 3,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
                    <span className="material-icons" style={{ verticalAlign: 'middle', mr: 1 }}>movie</span>
                    {' '}Admin Panel
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
                    {user?.email}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {['Movies', 'Banner'].map((label, idx) => (
                        <Button
                            key={label}
                            onClick={() => setActiveTab(idx)}
                            sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                color: activeTab === idx ? '#fff' : 'rgba(255,255,255,0.6)',
                                bgcolor: activeTab === idx ? '#0071e3' : 'transparent',
                                borderRadius: 2,
                                py: 1.2,
                                px: 2,
                                '&:hover': {
                                    bgcolor: activeTab === idx ? '#0071e3' : 'rgba(255,255,255,0.05)'
                                }
                            }}
                        >
                            <span className="material-icons" style={{ marginRight: 12, fontSize: 20 }}>
                                {idx === 0 ? 'movie_filter' : 'view_carousel'}
                            </span>
                            {label}
                        </Button>
                    ))}
                </Box>

                <Box sx={{ mt: 'auto' }}>
                    <Button
                        onClick={() => navigate('/')}
                        sx={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            color: 'rgba(255,255,255,0.6)',
                            mb: 1
                        }}
                    >
                        <span className="material-icons" style={{ marginRight: 12, fontSize: 20 }}>home</span>
                        Back to Site
                    </Button>
                    <Button
                        onClick={resetToDefaults}
                        sx={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            color: '#ff9500',
                            mb: 1
                        }}
                    >
                        <span className="material-icons" style={{ marginRight: 12, fontSize: 20 }}>refresh</span>
                        Reset Data
                    </Button>
                    <Button
                        onClick={logout}
                        sx={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            color: '#ff5c5c'
                        }}
                    >
                        <span className="material-icons" style={{ marginRight: 12, fontSize: 20 }}>logout</span>
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
                {/* Movies Tab */}
                {activeTab === 0 && (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff' }}>
                                Manage Movies
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={openAddMovieDialog}
                                sx={{ textTransform: 'none' }}
                            >
                                <span className="material-icons" style={{ marginRight: 8 }}>add</span>
                                Add Movie
                            </Button>
                        </Box>

                        <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a', borderRadius: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Title</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Genre</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Year</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Rent</TableCell>
                                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }} align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {movies.map((movie) => (
                                        <TableRow key={movie.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                                            <TableCell sx={{ color: '#fff' }}>{movie.title}</TableCell>
                                            <TableCell>
                                                <Chip label={movie.genre} size="small" sx={{ bgcolor: 'rgba(0,113,227,0.2)', color: '#0071e3' }} />
                                            </TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{movie.releaseDate}</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>₺{movie.rentPrice}</TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => openEditMovieDialog(movie)} sx={{ color: '#0071e3' }}>
                                                    <span className="material-icons">edit</span>
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteClick(movie)} sx={{ color: '#ff5c5c' }}>
                                                    <span className="material-icons">delete</span>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 2 }}>
                            Total: {movies.length} movies
                        </Typography>
                    </Box>
                )}


                {/* Banner Tab */}
                {activeTab === 1 && (
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                            Banner Movies
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
                            Toggle movies to show in the hero carousel
                        </Typography>
                        <Paper sx={{ bgcolor: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                            {movies.map((movie) => (
                                <Box
                                    key={movie.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        px: 3,
                                        py: 2,
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        '&:last-child': { borderBottom: 'none' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography sx={{ color: '#fff' }}>{movie.title}</Typography>
                                        <Chip label={movie.genre} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }} />
                                    </Box>
                                    <Switch
                                        checked={isInBanner(movie.id)}
                                        onChange={() => toggleBannerMovie(movie.id)}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#0071e3' },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#0071e3' }
                                        }}
                                    />
                                </Box>
                            ))}
                        </Paper>
                    </Box>
                )}
            </Box>

            {/* Movie Dialog */}
            <Dialog
                open={movieDialogOpen}
                onClose={() => setMovieDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { bgcolor: '#1a1a1a', borderRadius: 3 } }}
            >
                <DialogTitle sx={{ color: '#fff', fontWeight: 600 }}>
                    {editingMovie ? 'Edit Movie' : 'Add New Movie'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Title *"
                            value={movieForm.title}
                            onChange={(e) => handleMovieFormChange('title', e.target.value)}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Primary Genre</InputLabel>
                            <Select
                                value={movieForm.genre}
                                onChange={(e) => handleMovieFormChange('genre', e.target.value)}
                                label="Primary Genre"
                                sx={{ color: '#fff' }}
                            >
                                {GENRES.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Additional Genres</InputLabel>
                            <Select
                                multiple
                                value={movieForm.genres}
                                onChange={(e) => handleMovieFormChange('genres', e.target.value)}
                                input={<OutlinedInput label="Additional Genres" />}
                                sx={{ color: '#fff' }}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => <Chip key={value} label={value} size="small" />)}
                                    </Box>
                                )}
                            >
                                {GENRES.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Release Year"
                            value={movieForm.releaseDate}
                            onChange={(e) => handleMovieFormChange('releaseDate', e.target.value)}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="Duration"
                            value={movieForm.duration}
                            onChange={(e) => handleMovieFormChange('duration', e.target.value)}
                            placeholder="e.g., 2h 30m"
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="Age Rating"
                            value={movieForm.ageConsent}
                            onChange={(e) => handleMovieFormChange('ageConsent', e.target.value)}
                            placeholder="e.g., 13+, 18+"
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="Rent Price (₺)"
                            value={movieForm.rentPrice}
                            onChange={(e) => handleMovieFormChange('rentPrice', e.target.value)}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="Director"
                            value={movieForm.director}
                            onChange={(e) => handleMovieFormChange('director', e.target.value)}
                            sx={{ gridColumn: 'span 2' }}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="Actors (comma separated)"
                            value={movieForm.actors}
                            onChange={(e) => handleMovieFormChange('actors', e.target.value)}
                            sx={{ gridColumn: 'span 2' }}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="YouTube Trailer ID"
                            value={movieForm.trailerId}
                            onChange={(e) => handleMovieFormChange('trailerId', e.target.value)}
                            placeholder="e.g., dQw4w9WgXcQ"
                            sx={{ gridColumn: 'span 2' }}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />

                        {/* Poster Upload */}
                        <Box sx={{ gridColumn: 'span 2' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                {editingMovie ? 'Update Poster Image (JPG) - Optional' : 'Upload Poster Image (JPG)'}
                            </Typography>

                            {editingMovie && (
                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        component="img"
                                        src={`http://localhost:8080/api/posters/${editingMovie.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.jpg`}
                                        alt={editingMovie.title}
                                        sx={{
                                            width: 80,
                                            height: 120,
                                            borderRadius: 1,
                                            objectFit: 'cover',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                        Current poster (leave empty to keep)
                                    </Typography>
                                </Box>
                            )}

                            <input
                                type="file"
                                accept="image/jpeg,image/jpg"
                                onChange={(e) => setPosterFile(e.target.files[0])}
                                style={{
                                    display: 'block',
                                    padding: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    width: '100%',
                                    cursor: 'pointer'
                                }}
                            />
                            {posterFile && (
                                <Typography variant="caption" sx={{ color: '#00c853', mt: 0.5, display: 'block' }}>
                                    ✓ New poster: {posterFile.name} (will replace current)
                                </Typography>
                            )}
                        </Box>

                        <TextField
                            fullWidth
                            label="Description"
                            value={movieForm.description}
                            onChange={(e) => handleMovieFormChange('description', e.target.value)}
                            multiline
                            rows={3}
                            sx={{ gridColumn: 'span 2' }}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setMovieDialogOpen(false)} sx={{ textTransform: 'none', color: 'rgba(255,255,255,0.7)' }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSaveMovie} sx={{ textTransform: 'none' }}>
                        {editingMovie ? 'Update' : 'Add'} Movie
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                PaperProps={{ sx: { bgcolor: '#1a1a1a', borderRadius: 3 } }}
            >
                <DialogTitle sx={{ color: '#fff' }}>Delete Movie?</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Are you sure you want to delete "{movieToDelete?.title}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ textTransform: 'none', color: 'rgba(255,255,255,0.7)' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ textTransform: 'none' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
