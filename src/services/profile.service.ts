import { apiClient } from './api.config';
import { PROFILE_ENDPOINTS } from '../config/api.endpoints';
import type {
    AdminProfile,
    UpdateProfileData,
    ChangePasswordData,
} from '../types/api.types';

export class ProfileService {
    // Get admin profile
    static async getProfile(): Promise<AdminProfile> {
        try {
            console.log('🔍 Profile Service - Making request to:', PROFILE_ENDPOINTS.GET_PROFILE);
            const response = await apiClient.get(PROFILE_ENDPOINTS.GET_PROFILE);
            console.log('🔍 Profile Service - Response:', response.data);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch profile');
        } catch (error: any) {
            console.error('❌ Error fetching profile:', error);
            throw error;
        }
    }

    // Update admin profile
    static async updateProfile(profileData: UpdateProfileData): Promise<void> {
        try {
            const response = await apiClient.put(PROFILE_ENDPOINTS.UPDATE_PROFILE, profileData);

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to update profile');
        } catch (error: any) {
            console.error('❌ Error updating profile:', error);
            throw error;
        }
    }

    // Change admin password
    static async changePassword(passwordData: ChangePasswordData): Promise<void> {
        try {
            const response = await apiClient.post(PROFILE_ENDPOINTS.CHANGE_PASSWORD, passwordData);

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to change password');
        } catch (error: any) {
            console.error('❌ Error changing password:', error);
            throw error;
        }
    }
}
