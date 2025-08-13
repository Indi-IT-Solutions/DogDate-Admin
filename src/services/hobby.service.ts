import { apiClient } from './api.config';
import { HOBBY_ENDPOINTS } from '../config/api.endpoints';
import type {
    Hobby,
    HobbyFilters,
    ApiResponse,
} from '../types/api.types';

export class HobbyService {
    // Get all hobbies
    static async getHobbies(filters: HobbyFilters = {}): Promise<Hobby[]> {
        try {
            console.log('🔍 Hobby API URL:', HOBBY_ENDPOINTS.LIST);
            const response = await apiClient.post(HOBBY_ENDPOINTS.LIST, filters);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch hobbies');
        } catch (error: any) {
            console.error('❌ Error fetching hobbies:', error);
            throw error;
        }
    }

    // Get hobby by ID
    static async getHobbyById(id: string): Promise<Hobby> {
        try {
            const response = await apiClient.post(HOBBY_ENDPOINTS.GET_BY_ID, {
                document_id: id
            });

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch hobby');
        } catch (error: any) {
            console.error('❌ Error fetching hobby:', error);
            throw error;
        }
    }

    // Create new hobby
    static async createHobby(hobbyData: { name: string; description?: string }): Promise<void> {
        try {
            const response = await apiClient.post(HOBBY_ENDPOINTS.CREATE, hobbyData);

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to create hobby');
        } catch (error: any) {
            console.error('❌ Error creating hobby:', error);
            throw error;
        }
    }

    // Update hobby
    static async updateHobby(id: string, hobbyData: { name: string; description?: string }): Promise<void> {
        try {
            const response = await apiClient.post(HOBBY_ENDPOINTS.UPDATE, {
                document_id: id,
                ...hobbyData
            });

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to update hobby');
        } catch (error: any) {
            console.error('❌ Error updating hobby:', error);
            throw error;
        }
    }

    // Delete hobby (soft delete)
    static async deleteHobby(id: string): Promise<Hobby[]> {
        try {
            const response = await apiClient.post(HOBBY_ENDPOINTS.DELETE, {
                document_id: id
            });

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to delete hobby');
        } catch (error: any) {
            console.error('❌ Error deleting hobby:', error);
            throw error;
        }
    }
}
