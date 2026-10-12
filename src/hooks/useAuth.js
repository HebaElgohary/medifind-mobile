import { useSelector, useDispatch } from 'react-redux';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectToken,
    selectTokenData,
    logout
} from '../redux/Slice/authSlice';

// Define role constants
export const ROLES = {
    USER: 'user',
    DOCTOR: 'doctor'
};

export const useAuth = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const tokenData = useSelector(selectTokenData);


    // Check if token is valid (not expired)
    const isTokenValid = token && tokenData && tokenData.exp * 1000 > Date.now();

    // Helper functions for role-based checks
    const hasRole = (role) => tokenData?.role === role;

    const handleLogout = () => {
        dispatch(logout());
    };

    return {
        token,
        user,
        isAuthenticated,
        tokenData,
        // Add useful properties from token data
        userId: tokenData?.sub || tokenData?.id,
        userRole: tokenData?.role,
        isTokenValid,

        // Add expiration check
        isTokenValid: token && tokenData && tokenData.exp * 1000 > Date.now(),
        logout: handleLogout,

        // Role-based helper methods
        isUser: hasRole(ROLES.USER),
        isDoctor: hasRole(ROLES.DOCTOR),
        hasRole

    };
};