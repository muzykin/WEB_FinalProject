import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ requireAdmin = false }) => {
    const { auth, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    // If user is not logged in, redirect to login page
    if (!auth?.user) {
        return <Navigate to="/login" replace />;
    }

    // If route requires admin, but user is not admin, redirect to home
    if (requireAdmin && auth.user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;