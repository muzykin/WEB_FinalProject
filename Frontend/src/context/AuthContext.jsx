import { createContext, useState, useEffect, useContext } from 'react';
import { axiosPrivate, axiosPublic } from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null); // { user: {}, token: '' }
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on app startup
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axiosPrivate.get('/api/auth/me');
                    setAuth({ user: response.data.user, token });
                } catch (error) {
                    console.error('Session expired or invalid token', error);
                    localStorage.removeItem('token');
                    setAuth(null);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        const response = await axiosPublic.post('/api/auth/login', { email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        setAuth({ user, token });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;