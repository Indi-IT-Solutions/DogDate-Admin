import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.endpoints';

// Extend the axios request config to include our custom retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Storage keys
const STORAGE_KEYS = {
    AUTH_TOKEN: 'dogdate_admin_token',
    REFRESH_TOKEN: 'dogdate_admin_refresh_token',
    USER_DATA: 'dogdate_admin_user',
} as const;

// Token management utilities
export const tokenManager = {
    getToken: (): string | null => {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    },

    setToken: (token: string): void => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        console.log('🔑 Token stored:', token.substring(0, 20) + '...');
    },

    removeToken: (): void => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        console.log('🗑️ Token removed');
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    setRefreshToken: (token: string): void => {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    },

    getUserData: () => {
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    },

    setUserData: (userData: any): void => {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        console.log('👤 User data stored:', userData.name || userData.email);
    },
};

// Simple toast notifications (can be replaced with react-toastify later)
const toast = {
    success: (message: string) => {
        console.log('✅ Success:', message);
        alert(message); // Replace with proper toast later
    },
    error: (message: string) => {
        console.error('❌ Error:', message);
        alert(message); // Replace with proper toast later
    },
    warning: (message: string) => {
        console.warn('⚠️ Warning:', message);
        alert(message); // Replace with proper toast later
    },
};

// Create API instance
const createApiInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = tokenManager.getToken();

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('🔐 Request with token:', {
                    url: config.url,
                    method: config.method?.toUpperCase(),
                    hasToken: !!token,
                    tokenPreview: token.substring(0, 20) + '...'
                });
            } else {
                console.log('📨 Request without token:', {
                    url: config.url,
                    method: config.method?.toUpperCase(),
                    hasToken: false
                });
            }

            // Log all requests in development
            if (import.meta.env.DEV) {
                console.log('🚀 API Request:', {
                    method: config.method?.toUpperCase(),
                    url: config.url,
                    baseURL: config.baseURL,
                    headers: config.headers,
                    data: config.data,
                });
            }

            return config;
        },
        (error: AxiosError) => {
            console.error('❌ Request Error:', error);
            return Promise.reject(error);
        }
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            // Log response in development
            if (import.meta.env.DEV) {
                console.log('✅ API Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.config.url,
                    data: response.data,
                });
            }

            return response;
        },
        async (error: AxiosError) => {
            const originalRequest = error.config as ExtendedAxiosRequestConfig;

            // Log error in development
            if (import.meta.env.DEV) {
                console.error('❌ API Error:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    url: error.config?.url,
                    method: error.config?.method?.toUpperCase(),
                    message: error.message,
                    data: error.response?.data,
                    hasToken: !!tokenManager.getToken()
                });
            }

            // Handle different error status codes
            if (error.response?.status) {
                switch (error.response.status) {
                    case 401:
                        // More intelligent 401 handling
                        const currentPath = window.location.pathname;
                        const isLoginRequest = originalRequest?.url?.includes('/login');
                        const isAuthRequest = originalRequest?.url?.includes('/auth');

                        console.warn('🚫 401 Unauthorized:', {
                            url: originalRequest?.url,
                            isLoginRequest,
                            isAuthRequest,
                            currentPath,
                            hasToken: !!tokenManager.getToken(),
                            responseData: error.response?.data
                        });

                        // Don't auto-logout on login requests or if already on login page
                        if (isLoginRequest || currentPath === '/') {
                            console.log('ℹ️ Login request failed or already on login page - not auto-logging out');
                            break;
                        }

                        // Show the actual backend error message
                        const errorData = error.response?.data as any;
                        if (errorData?.message) {
                            // toast.error(`Authentication failed: ${errorData.message}`);
                        } else {
                            // toast.error('Authentication failed - please login again');
                        }

                        // Auto-logout for protected routes
                        if (tokenManager.getToken() && !originalRequest?._retry) {
                            if (originalRequest) originalRequest._retry = true;

                            const refreshToken = tokenManager.getRefreshToken();
                            if (refreshToken) {
                                try {
                                    // Attempt to refresh token (if your backend supports it)
                                    // const refreshResponse = await instance.post('/admin/auth_v1/refresh', {
                                    //   refresh_token: refreshToken
                                    // });

                                    // If successful, update tokens and retry original request
                                    // tokenManager.setToken(refreshResponse.data.token);
                                    // return instance(originalRequest);
                                } catch (refreshError) {
                                    // Refresh failed, clear tokens and redirect
                                    console.log('🔄 Token refresh failed, logging out');
                                    handleAuthError();
                                    return Promise.reject(refreshError);
                                }
                            } else {
                                console.log('🚪 No refresh token, logging out');
                                handleAuthError();
                            }
                        }
                        break;

                    case 403:
                        // toast.error('Access denied. You do not have permission to perform this action.');
                        break;

                    case 404:
                        console.warn('🔍 404 Not Found:', originalRequest?.url);
                        // Don't show toast for 404s as they might be expected in some cases
                        break;

                    case 422:
                        // Validation errors
                        if (error.response.data && typeof error.response.data === 'object' && 'errors' in error.response.data) {
                            const errors = (error.response.data as any).errors;
                            Object.keys(errors).forEach(key => {
                                // toast.error(`${key}: ${errors[key][0]}`);
                            });
                        } else {
                            // toast.error((error.response.data as any)?.message || 'Validation failed.');
                        }
                        break;

                    case 500:
                        // toast.error('Internal server error. Please try again later.');
                        break;

                    default:
                        console.warn('🤷 Unexpected error status:', error.response.status);
                }
            } else if (error.request) {
                // Network error
                console.error('🌐 Network error:', error.request);
                // toast.error('Network error. Please check your connection and backend server.');
            } else {
                // Other error
                console.error('❓ Other error:', error.message);
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

// Handle authentication errors
const handleAuthError = (): void => {
    console.log('🚨 Handling auth error - clearing tokens and redirecting');
    tokenManager.removeToken();
    // toast.error('Session expired. Please login again.');

    // Redirect to login page
    if (window.location.pathname !== '/') {
        console.log('↩️ Redirecting to login page');
        window.location.href = '/';
    }
};

// Create and export the API instance
export const apiClient = createApiInstance();

// Utility function to create form data
export const createFormData = (data: Record<string, any>): FormData => {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
        const value = data[key];
        if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    formData.append(`${key}[${index}]`, item);
                });
            } else if (value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, String(value));
            }
        }
    });

    return formData;
};

// Utility function to convert object to query string
export const objectToQueryString = (obj: Record<string, any>): string => {
    const params = new URLSearchParams();

    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value !== null && value !== undefined && value !== '') {
            if (Array.isArray(value)) {
                value.forEach(item => params.append(key, String(item)));
            } else {
                params.append(key, String(value));
            }
        }
    });

    return params.toString();
};

export default apiClient; 