import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/RootColor';
export const ProtectedRoute = ({
    component: Component,
    allowedRoles = [],
    navigation,
    ...rest
}) => {
    const { isAuthenticated, userRole, isTokenValid } = useAuth();

    useEffect(() => {
        // Debug logging to help identify the issue


        // Only redirect if definitely not authenticated
        if (isAuthenticated === false) {

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
            return;
        }

        // Only check roles if we have roles to check and we know the user role
        if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        }
    }, [isAuthenticated, userRole, isTokenValid, allowedRoles, navigation]);

    // If we're still determining authentication status, show loading
    if (isAuthenticated === null || isAuthenticated === undefined) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.mainColor} />
            </View>
        );
    }

    // If we're authenticated but checking role or token validity, show component
    // This prevents flickering between screens during checks
    return <Component {...rest} />;
};