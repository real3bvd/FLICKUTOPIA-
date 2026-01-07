import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import { LibraryProvider } from './context/LibraryContext';
import App from './App';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <MovieProvider>
                    <LibraryProvider>
                        <Routes>
                            <Route path="/" element={<App />} />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <AdminPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </LibraryProvider>
                </MovieProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
