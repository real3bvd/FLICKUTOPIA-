import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function ProtectedRoute({ children }) {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#000'
            }}>
                <CircularProgress sx={{ color: '#0071e3' }} />
                <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!isAdmin) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#000',
                color: '#fff',
                textAlign: 'center',
                p: 4
            }}>
                <span className="material-icons" style={{ fontSize: 80, color: '#ff5c5c', marginBottom: 16 }}>
                    block
                </span>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                    Access Denied
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    You don't have admin privileges to access this page.
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Contact an administrator if you believe this is an error.
                </Typography>
            </Box>
        );
    }

    return children;
}
