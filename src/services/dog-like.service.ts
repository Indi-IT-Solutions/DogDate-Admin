import { apiClient } from './api.config';
import { DOG_LIKE_ENDPOINTS } from '../config/api.endpoints';
import type {
    DogLike,
    DogLikeFilters,
    ApiResponse,
} from '../types/api.types';

export class DogLikeService {
    // Get all dog likes
    static async getDogLikes(filters: DogLikeFilters = {}): Promise<DogLike[]> {
        try {
            console.log('🔍 Dog Like API URL:', DOG_LIKE_ENDPOINTS.LIST);
            const response = await apiClient.post(DOG_LIKE_ENDPOINTS.LIST, filters);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch dog likes');
        } catch (error: any) {
            console.error('❌ Error fetching dog likes:', error);
            throw error;
        }
    }

    // Get dog like by ID
    static async getDogLikeById(id: string): Promise<DogLike> {
        try {
            const response = await apiClient.post(DOG_LIKE_ENDPOINTS.GET_BY_ID, {
                document_id: id
            });

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch dog like');
        } catch (error: any) {
            console.error('❌ Error fetching dog like:', error);
            throw error;
        }
    }

    // Create new dog like
    static async createDogLike(dogLikeData: { name: string; description?: string }): Promise<void> {
        try {
            const response = await apiClient.post(DOG_LIKE_ENDPOINTS.CREATE, dogLikeData);

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to create dog like');
        } catch (error: any) {
            console.error('❌ Error creating dog like:', error);
            throw error;
        }
    }

    // Update dog like
    static async updateDogLike(id: string, dogLikeData: { name: string; description?: string }): Promise<void> {
        try {
            const response = await apiClient.post(DOG_LIKE_ENDPOINTS.UPDATE, {
                document_id: id,
                ...dogLikeData
            });

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to update dog like');
        } catch (error: any) {
            console.error('❌ Error updating dog like:', error);
            throw error;
        }
    }

    // Delete dog like (soft delete)
    static async deleteDogLike(id: string): Promise<DogLike[]> {
        try {
            const response = await apiClient.post(DOG_LIKE_ENDPOINTS.DELETE, {
                document_id: id
            });

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to delete dog like');
        } catch (error: any) {
            console.error('❌ Error deleting dog like:', error);
            throw error;
        }
    }
}
