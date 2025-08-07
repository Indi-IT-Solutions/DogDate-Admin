import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/services';

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
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // If authenticated, redirect to dashboard (or the intended route)
    if (isAuthenticated) {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        return <Navigate to={from} replace />;
    }

    // If not authenticated, render the public component (login, forgot password, etc.)
    return <>{children}</>;
};

export default PublicRoute; 