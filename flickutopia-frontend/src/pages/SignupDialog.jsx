import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, Alert, InputAdornment } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function SignupDialog({ open, onClose, onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 8) {
            return setError('Password must be at least 8 characters');
        }

        setLoading(true);

        try {
            await signup(email, password);
            onClose();
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error('Signup error:', err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email is already registered');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak');
            } else {
                setError('Failed to create account. Please try again.');
            }
        }
        setLoading(false);
    };

    const handleClose = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#1d1d1f',
                    backgroundImage: 'none',
                    borderRadius: 3
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Create Account</Typography>
                <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
                    <span className="material-icons">close</span>
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        helperText="At least 8 characters"
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                                    >
                                        <span className="material-icons" style={{ fontSize: 20 }}>
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                                    >
                                        <span className="material-icons" style={{ fontSize: 20 }}>
                                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                        Already have an account?{' '}
                        <Box
                            component="span"
                            onClick={onSwitchToLogin}
                            sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                            Login
                        </Box>
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ py: 1.5, fontSize: '1rem' }}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default SignupDialog;
