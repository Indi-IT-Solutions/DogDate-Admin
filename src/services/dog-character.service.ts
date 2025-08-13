import { apiClient } from './api.config';
import { DOG_CHARACTER_ENDPOINTS } from '../config/api.endpoints';
import type {
    DogCharacter,
    DogCharacterFilters,
    ApiResponse,
} from '../types/api.types';

export class DogCharacterService {
    // Get all dog characters
    static async getDogCharacters(filters: DogCharacterFilters = {}): Promise<DogCharacter[]> {
        try {
            console.log('🔍 Dog Character API URL:', DOG_CHARACTER_ENDPOINTS.LIST);
            const response = await apiClient.post(DOG_CHARACTER_ENDPOINTS.LIST, filters);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch dog characters');
        } catch (error: any) {
            console.error('❌ Error fetching dog characters:', error);
            throw error;
        }
    }

    // Get dog character by ID
    static async getDogCharacterById(id: string): Promise<DogCharacter> {
        try {
            const response = await apiClient.post(DOG_CHARACTER_ENDPOINTS.GET_BY_ID, {
                document_id: id
            });

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch dog character');
        } catch (error: any) {
            console.error('❌ Error fetching dog character:', error);
            throw error;
        }
    }

    // Create new dog character
    static async createDogCharacter(dogCharacterData: { name: string; description?: string }): Promise<void> {
        try {
            const response = await apiClient.post(DOG_CHARACTER_ENDPOINTS.CREATE, dogCharacterData);

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to create dog character');
        } catch (error: any) {
            console.error('❌ Error creating dog character:', error);
            throw error;
        }
    }

    // Update dog character
    static async updateDogCharacter(id: string, dogCharacterData: { name: string; description?: string }): Promise<void> {
        try {
            const response = await apiClient.post(DOG_CHARACTER_ENDPOINTS.UPDATE, {
                document_id: id,
                ...dogCharacterData
            });

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to update dog character');
        } catch (error: any) {
            console.error('❌ Error updating dog character:', error);
            throw error;
        }
    }

    // Delete dog character (soft delete)
    static async deleteDogCharacter(id: string): Promise<DogCharacter[]> {
        try {
            const response = await apiClient.post(DOG_CHARACTER_ENDPOINTS.DELETE, {
                document_id: id
            });

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to delete dog character');
        } catch (error: any) {
            console.error('❌ Error deleting dog character:', error);
            throw error;
        }
    }
}
