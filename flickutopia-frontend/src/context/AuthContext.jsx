import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Get token with claims
                const tokenResult = await user.getIdTokenResult();
                setIsAdmin(tokenResult.claims.admin === true);
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        // Refresh token to get latest claims
        const tokenResult = await result.user.getIdTokenResult(true);
        setIsAdmin(tokenResult.claims.admin === true);
        return result;
    };

    const logout = async () => {
        await signOut(auth);
        setIsAdmin(false);
    };

    // Force refresh admin status
    const refreshAdminStatus = async () => {
        if (user) {
            const tokenResult = await user.getIdTokenResult(true);
            setIsAdmin(tokenResult.claims.admin === true);
        }
    };

    const value = {
        user,
        isAdmin,
        signup,
        login,
        logout,
        refreshAdminStatus,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
