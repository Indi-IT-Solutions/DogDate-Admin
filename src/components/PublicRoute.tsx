import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/services';
import { usePermissions } from '@/context/PermissionsContext';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
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
            null
        );
    }

    // If authenticated, redirect to an allowed route (validate 'from')
    if (isAuthenticated) {
        const from = (location.state as any)?.from?.pathname;
        const user = AuthService.getCurrentUser();
        const isAdmin = (user as any)?.type === 'admin';

        const { allowedRoutes, isLoading } = usePermissions();
        const allowedFromUser: string[] = Array.isArray((user as any)?.allowed_routes) ? (user as any).allowed_routes : [];
        const effectiveAllowed = allowedFromUser.length > 0 ? allowedFromUser : (!isLoading ? allowedRoutes : []);

        const isPathAllowed = (path: string): boolean => {
            if (isAdmin) return true;
            if (!path) return false;
            const hasCMS = effectiveAllowed.includes('/pages');
            if (path.startsWith('/pages')) return hasCMS || effectiveAllowed.some(p => path === p || path.startsWith(p + '/'));
            return effectiveAllowed.some(p => path === p || path.startsWith(p + '/'));
        };

        if (from && isPathAllowed(from)) {
            return <Navigate to={from} replace />;
        }

        // fallback to first allowed route
        let target = isAdmin ? '/dashboard' : (effectiveAllowed[0] || '/dashboard');
        if (target === '/pages') target = '/pages/content-management';
        return <Navigate to={target} replace />;
    }

    // If not authenticated, render the public component (login, forgot password, etc.)
    return <>{children}</>;
};

export default PublicRoute; 