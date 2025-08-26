import { apiClient } from './api.config';
import { FAQ_ENDPOINTS } from '../config/api.endpoints';
import { objectToQueryString } from './api.config';
import type {
    FAQ,
    FAQFilters,
    FAQStats,
    ApiResponse,
} from '../types/api.types';

export class FAQService {
    // Get all FAQs
    static async getFAQs(filters: FAQFilters = {}): Promise<FAQ[]> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${FAQ_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`;
            console.log('🔍 FAQ API URL:', url);

            const response = await apiClient.get(url);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch FAQs');
        } catch (error: any) {
            console.error('❌ Error fetching FAQs:', error);
            throw error;
        }
    }

    // Get FAQ by ID
    static async getFAQById(id: string): Promise<FAQ> {
        try {
            const response = await apiClient.get(FAQ_ENDPOINTS.GET_BY_ID(id));

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch FAQ');
        } catch (error: any) {
            console.error('❌ Error fetching FAQ:', error);
            throw error;
        }
    }

    // Create new FAQ
    static async createFAQ(faqData: { order: number; question: string; answer: string; status?: "active" | "inactive" }): Promise<void> {
        try {
            const response = await apiClient.post(FAQ_ENDPOINTS.CREATE, faqData);

            if (response.data.status === 1) {
                return;
            }

            // If the backend returns an error, throw it with the specific message
            throw new Error(response.data.message || 'Failed to create FAQ');
        } catch (error: any) {
            console.error('❌ Error creating FAQ:', error);

            // If it's an axios error with response data, extract the message
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            // If it's already an Error object with a message, re-throw it
            if (error.message) {
                throw error;
            }

            // Fallback to generic error
            throw new Error('Failed to create FAQ');
        }
    }

    // Update FAQ
    static async updateFAQ(id: string, faqData: { order?: number; question?: string; answer?: string; status?: "active" | "inactive" }): Promise<void> {
        try {
            const response = await apiClient.put(FAQ_ENDPOINTS.UPDATE(id), faqData);

            if (response.data.status === 1) {
                return;
            }

            // If the backend returns an error, throw it with the specific message
            throw new Error(response.data.message || 'Failed to update FAQ');
        } catch (error: any) {
            console.error('❌ Error updating FAQ:', error);

            // If it's an axios error with response data, extract the message
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            // If it's already an Error object with a message, re-throw it
            if (error.message) {
                throw error;
            }

            // Fallback to generic error
            throw new Error('Failed to update FAQ');
        }
    }

    // Delete FAQ
    static async deleteFAQ(id: string): Promise<void> {
        try {
            const response = await apiClient.delete(FAQ_ENDPOINTS.DELETE(id));

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to delete FAQ');
        } catch (error: any) {
            console.error('❌ Error deleting FAQ:', error);
            throw error;
        }
    }

    // Get FAQ stats
    static async getFAQStats(): Promise<FAQStats> {
        try {
            const response = await apiClient.get(FAQ_ENDPOINTS.STATS);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch FAQ stats');
        } catch (error: any) {
            console.error('❌ Error fetching FAQ stats:', error);
            throw error;
        }
    }
}
