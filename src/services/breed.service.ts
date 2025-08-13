import { apiClient } from './api.config';
import { BREED_ENDPOINTS } from '../config/api.endpoints';
import type {
    DogBreed,
    DogBreedFilters,
    ApiResponse,
} from '../types/api.types';

export class BreedService {
    // Get all breeds
    static async getBreeds(filters: DogBreedFilters = {}): Promise<DogBreed[]> {
        try {
            console.log('🔍 Breed API URL:', BREED_ENDPOINTS.LIST);
            const response = await apiClient.post(BREED_ENDPOINTS.LIST, filters);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch breeds');
        } catch (error: any) {
            console.error('❌ Error fetching breeds:', error);
            throw error;
        }
    }

    // Get breed by ID
    static async getBreedById(id: string): Promise<DogBreed> {
        try {
            const response = await apiClient.post(BREED_ENDPOINTS.GET_BY_ID, {
                document_id: id
            });

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch breed');
        } catch (error: any) {
            console.error('❌ Error fetching breed:', error);
            throw error;
        }
    }

    // Create new breed
    static async createBreed(breedData: { name: string }): Promise<void> {
        try {
            const response = await apiClient.post(BREED_ENDPOINTS.CREATE, breedData);

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to create breed');
        } catch (error: any) {
            console.error('❌ Error creating breed:', error);
            throw error;
        }
    }

    // Update breed
    static async updateBreed(id: string, breedData: { name: string }): Promise<void> {
        try {
            const response = await apiClient.post(BREED_ENDPOINTS.UPDATE, {
                document_id: id,
                ...breedData
            });

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to update breed');
        } catch (error: any) {
            console.error('❌ Error updating breed:', error);
            throw error;
        }
    }

    // Delete breed (soft delete)
    static async deleteBreed(id: string): Promise<DogBreed[]> {
        try {
            const response = await apiClient.post(BREED_ENDPOINTS.DELETE, {
                document_id: id
            });

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to delete breed');
        } catch (error: any) {
            console.error('❌ Error deleting breed:', error);
            throw error;
        }
    }
}
