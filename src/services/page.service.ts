import { apiClient } from './api.config';
import { PAGE_ENDPOINTS } from '../config/api.endpoints';
import type {
    Page,
    PageFilters,
    ApiResponse,
} from '../types/api.types';

export class PageService {
    // Get all pages
    static async getPages(filters: PageFilters = {}): Promise<Page[]> {
        try {
            console.log('🔍 Page API URL:', PAGE_ENDPOINTS.LIST);
            const response = await apiClient.get(PAGE_ENDPOINTS.LIST);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch pages');
        } catch (error: any) {
            console.error('❌ Error fetching pages:', error);
            throw error;
        }
    }

    // Get page by ID
    static async getPageById(id: string): Promise<Page> {
        try {
            const response = await apiClient.post(PAGE_ENDPOINTS.GET_BY_ID, {
                page_id: id
            });

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch page');
        } catch (error: any) {
            console.error('❌ Error fetching page:', error);
            throw error;
        }
    }

    // Update page
    static async updatePage(id: string, pageData: { description: string | any }): Promise<void> {
        try {
            const response = await apiClient.post(PAGE_ENDPOINTS.UPDATE, {
                page_id: id,
                ...pageData
            });

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to update page');
        } catch (error: any) {
            console.error('❌ Error updating page:', error);
            throw error;
        }
    }
}
