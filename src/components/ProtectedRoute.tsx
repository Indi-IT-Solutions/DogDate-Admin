import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/services';
import { usePermissions } from '@/context/PermissionsContext';
import AppLoader from './Apploader';
import { showError } from '@/utils/sweetAlert';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = AuthService.isAuthenticated();
            setIsAuthenticated(authenticated);
        };

        checkAuth();
    }, []);

    // Show loading while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <AppLoader size={150} />
            </div>
        );
    }

    // If not authenticated, redirect to login with return URL
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Enforce allowed_routes from context (server-sourced)
    const { allowedRoutes, isLoading } = usePermissions();
    const currentPath = location.pathname;
    const user = AuthService.getCurrentUser();
    const isAdmin = user?.type === 'admin';

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <AppLoader size={150} />
            </div>
        );
    }

    const pagesGroupAllowed = currentPath.startsWith('/pages') &&
        allowedRoutes.some((r: string) => r === '/pages' || r.startsWith('/pages'));
    // Always allow profile settings for authenticated users (manage own profile)
    const profileSettingsAllowed = currentPath === '/profile-settings' || currentPath.startsWith('/profile-settings');

    const isAllowedRoute = (
        isAdmin ||
        profileSettingsAllowed ||
        pagesGroupAllowed ||
        allowedRoutes.some((prefix: string) => (
            currentPath === prefix ||
            currentPath.startsWith(prefix + "/")
        ))
    );

    if (!isAllowedRoute) {
        // Determine the best fallback route for the user
        const userAllowed: string[] = Array.isArray((user as any)?.allowed_routes) ? (user as any).allowed_routes : [];

        let fallback = null;

        if (isAdmin) {
            // Admin always has access to dashboard
            fallback = '/dashboard';
        } else {
            // For sub-admins, find the first route they actually have permission to access
            const allUserRoutes = [...allowedRoutes, ...userAllowed];
            const uniqueRoutes = [...new Set(allUserRoutes)]; // Remove duplicates

            // Define valid routes in order of preference
            const routePriority = [
                '/dashboard',
                '/users',
                '/payments',
                '/contact',
                '/pages/content-management',
                '/profile-settings',
                '/report',
                '/dogs',
                '/faqs',
                '/sub-admins',
                '/gifting',
                '/pages/dog-breeds',
                '/pages/dog-characters',
                '/pages/hobbies',
                '/pages/dog-likes'
            ];

            // Find the first allowed route based on priority
            for (const route of routePriority) {
                if (uniqueRoutes.some(allowedRoute =>
                    allowedRoute === route ||
                    allowedRoute.startsWith(route + "/") ||
                    (route === '/pages' && allowedRoute.startsWith('/pages'))
                )) {
                    fallback = route;
                    break;
                }
            }

            // Handle special cases for parent routes
            if (fallback === '/pages') {
                fallback = '/pages/content-management';
            }

            // If no valid route found, use the first available route
            if (!fallback && uniqueRoutes.length > 0) {
                fallback = uniqueRoutes[0];
                if (fallback === '/pages') {
                    fallback = '/pages/content-management';
                }
            }
        }

        // Final fallback - if still no route found, redirect to profile settings (always allowed)
        if (!fallback) {
            fallback = '/profile-settings';
        }

        console.log(`🚫 Access denied to ${currentPath}. Redirecting to: ${fallback}`);

        // Show notification to user about access denial
        showError(
            "Access Denied",
            `You don't have permission to access this page. Redirecting to ${fallback.replace('/', '').replace('-', ' ').toUpperCase()}.`
        );

        return <Navigate to={fallback} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 