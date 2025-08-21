import { apiClient, tokenManager } from './api.config';
import { AUTH_ENDPOINTS } from '../config/api.endpoints';
import type {
    AdminLoginRequest,
    AdminLoginResponse,
    ForgotPasswordRequest,
    VerifyOtpRequest,
    ResetPasswordRequest,
    VerifyOtpAndResetPasswordRequest,
    ApiResponse,
} from '../types/api.types';

export class AuthService {
    // Admin login
    static async login(credentials: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse>> {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);

            if (response.data.status === 1 && response.data.data) {
                const { token, user_details } = response.data.data;
                tokenManager.setToken(token);
                tokenManager.setUserData(user_details);
            }

            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Send OTP for forgot password
    static async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Verify OTP and reset password in one call
    static async verifyOtpAndResetPassword(data: VerifyOtpAndResetPasswordRequest): Promise<ApiResponse> {
        try {
            const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_OTP_AND_RESET, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Logout
    static logout(): void {
        tokenManager.removeToken();
        window.location.href = '/';
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        const token = tokenManager.getToken();
        return !!token;
    }

    // Get current user data
    static getCurrentUser() {
        return tokenManager.getUserData();
    }
}

export default AuthService; 