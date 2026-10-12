import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
    try {
        // jwt-decode is a direct function import, not a default export
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token Data:", decodedToken);
        return decodedToken;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};