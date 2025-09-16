import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/services';
import { usePermissions } from '@/context/PermissionsContext';
import AppLoader from './Apploader';

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
        // Try to send to dashboard if allowed, else first allowed route (prefer user payload), else login
        const userAllowed: string[] = Array.isArray((user as any)?.allowed_routes) ? (user as any).allowed_routes : [];
        let fallback = isAdmin
            ? '/dashboard'
            : (userAllowed[0] || allowedRoutes[0] || '/dashboard');
        // If fallback is CMS parent, send to a concrete CMS page
        if (fallback === '/pages') fallback = '/pages/content-management';
        return <Navigate to={fallback} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 