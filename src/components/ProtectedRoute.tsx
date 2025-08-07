import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/services';

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
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to login with return URL
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // If authenticated, render the protected component
    return <>{children}</>;
};

export default ProtectedRoute; 