import { apiClient, objectToQueryString } from './api.config';
import { CONTACT_ENDPOINTS } from '../config/api.endpoints';
import type {
    ContactUs,
    ContactFilters,
    ContactStats,
    SendContactReply,
    PaginatedResponse,
    ApiResponse,
} from '../types/api.types';

export class ContactService {
    // Get all contact queries with pagination and search
    static async getContactQueries(filters: ContactFilters = {}): Promise<PaginatedResponse<ContactUs>> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${CONTACT_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`;
            console.log('🔍 Contact API URL:', url);
            const response = await apiClient.get(url);

            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;
                const paginatedResponse: any = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.contact_queries || [],
                    meta: {
                        current_page: backendData.pagination?.current_page || 1,
                        per_page: backendData.pagination?.per_page || 10,
                        total_queries: backendData.pagination?.total_queries || 0,
                        total_pages: backendData.pagination?.total_pages || 0,
                        has_next_page: backendData.pagination?.has_next_page || false,
                        has_prev_page: backendData.pagination?.has_prev_page || false,
                    }
                };
                return paginatedResponse;
            }

            throw new Error(response.data.message || 'Failed to fetch contact queries');
        } catch (error: any) {
            console.error('❌ Error fetching contact queries:', error);
            throw error;
        }
    }

    // Get contact query by ID
    static async getContactQueryById(id: string): Promise<ContactUs> {
        try {
            const response = await apiClient.get(CONTACT_ENDPOINTS.GET_BY_ID(id));

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch contact query');
        } catch (error: any) {
            console.error('❌ Error fetching contact query:', error);
            throw error;
        }
    }

    // Send reply to contact query
    static async sendContactReply(data: SendContactReply): Promise<void> {
        try {
            const response = await apiClient.post(CONTACT_ENDPOINTS.REPLY, data);

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to send reply');
        } catch (error: any) {
            console.error('❌ Error sending contact reply:', error);
            throw error;
        }
    }

    // Update contact query status
    static async updateContactStatus(id: string, status: { query_status?: string; status?: string }): Promise<ContactUs> {
        try {
            const response = await apiClient.put(CONTACT_ENDPOINTS.UPDATE_STATUS(id), status);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to update contact status');
        } catch (error: any) {
            console.error('❌ Error updating contact status:', error);
            throw error;
        }
    }

    // Get contact statistics
    static async getContactStats(): Promise<ContactStats> {
        try {
            const response = await apiClient.get(CONTACT_ENDPOINTS.STATS);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch contact stats');
        } catch (error: any) {
            console.error('❌ Error fetching contact stats:', error);
            throw error;
        }
    }
}
