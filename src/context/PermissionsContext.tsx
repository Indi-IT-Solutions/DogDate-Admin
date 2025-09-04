import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ProfileService, tokenManager } from '@/services';

type PermissionsContextType = {
    allowedRoutes: string[];
    isLoading: boolean;
    refresh: () => Promise<void>;
};

const PermissionsContext = createContext<PermissionsContextType>({
    allowedRoutes: [],
    isLoading: true,
    refresh: async () => { },
});

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allowedRoutes, setAllowedRoutes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchPermissions = async () => {
        try {
            setIsLoading(true);
            // If there is no token (e.g., just logged out), skip API and clear permissions
            const token = tokenManager.getToken();
            if (!token) {
                setAllowedRoutes([]);
                setIsLoading(false);
                return;
            }
            const profile: any = await ProfileService.getProfile();
            const routes = Array.isArray(profile?.allowed_routes) ? profile.allowed_routes : [];
            setAllowedRoutes(routes);
        } catch (_err) {
            // On error, default to empty (frontend guard stays permissive only when empty)
            setAllowedRoutes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    // React to auth changes from elsewhere (e.g., after login)
    useEffect(() => {
        const handleAuthLogin = () => {
            fetchPermissions();
        };
        const handlePermissionsRefresh = () => {
            fetchPermissions();
        };
        window.addEventListener('auth:login', handleAuthLogin);
        window.addEventListener('permissions:refresh', handlePermissionsRefresh);
        return () => {
            window.removeEventListener('auth:login', handleAuthLogin);
            window.removeEventListener('permissions:refresh', handlePermissionsRefresh);
        };
    }, []);

    const value = useMemo(() => ({
        allowedRoutes,
        isLoading,
        refresh: fetchPermissions,
    }), [allowedRoutes, isLoading]);

    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = () => useContext(PermissionsContext);


