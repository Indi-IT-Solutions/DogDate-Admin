import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const [redirecting, setRedirecting] = useState(true);

    useEffect(() => {
        const handleRedirect = () => {
            try {
                // Check authentication status
                const isAuthenticated = AuthService.isAuthenticated();

                // Redirect based on authentication status
                if (isAuthenticated) {
                    // If logged in, redirect to dashboard
                    navigate('/dashboard', { replace: true });
                } else {
                    // If not logged in, redirect to login
                    navigate('/', { replace: true });
                }
            } catch (error) {
                console.error('Error during redirect:', error);
                // Fallback: redirect to login
                navigate('/', { replace: true });
            }
        };

        // Small delay to show the message briefly
        const timer = setTimeout(handleRedirect, 100);

        return () => clearTimeout(timer);
    }, [navigate]);

    // This component will redirect immediately, but we show a brief message
    // in case the redirect takes a moment
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="text-center">
                <div className="text-warning mb-3" style={{ fontSize: '64px' }}>⚠️</div>
                <h4>Page Not Found</h4>
                <p className="text-muted">
                    {redirecting ? 'Redirecting you to the appropriate page...' : 'Page not found'}
                </p>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
