import { apiClient, objectToQueryString } from './api.config';
import { SUBSCRIPTION_ENDPOINTS } from '../config/api.endpoints';
import type {
    SubscriptionPackage,
    SubscriptionFilters,
    SubscriptionStats,
    PaginatedResponse,
    ApiResponse,
} from '../types/api.types';

export class SubscriptionService {
    // Get all subscription packages with pagination and filters
    static async getSubscriptionPackages(filters: SubscriptionFilters = {}): Promise<PaginatedResponse<SubscriptionPackage>> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${SUBSCRIPTION_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);

            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;

                const paginatedResponse: PaginatedResponse<SubscriptionPackage> = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.subscription_packages || [],
                    meta: {
                        current_page: backendData.pagination?.current_page || 1,
                        per_page: backendData.pagination?.per_page || 10,
                        total_packages: backendData.pagination?.total_packages || 0,
                        total_pages: backendData.pagination?.total_pages || 0,
                        has_next_page: backendData.pagination?.has_next_page || false,
                        has_prev_page: backendData.pagination?.has_prev_page || false,
                    }
                };

                return paginatedResponse;
            }

            return {
                status: 0,
                message: response.data.message || 'No subscription packages found',
                data: [],
                meta: {
                    current_page: 1,
                    per_page: 10,
                    total_packages: 0,
                    total_pages: 0,
                    has_next_page: false,
                    has_prev_page: false,
                }
            };
        } catch (error: any) {
            console.error('❌ Error fetching subscription packages:', error);
            throw error.response?.data || error;
        }
    }

    // Get subscription package by ID
    static async getSubscriptionPackageById(id: string): Promise<SubscriptionPackage> {
        try {
            const response = await apiClient.get(SUBSCRIPTION_ENDPOINTS.GET_BY_ID(id));

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Subscription package not found');
        } catch (error: any) {
            console.error('❌ Error fetching subscription package by ID:', error);
            throw error.response?.data || error;
        }
    }

    // Create subscription package
    static async createSubscriptionPackage(data: {
        type: "Breeding" | "Playmates";
        title: string;
        amount: number;
        interval: "One time" | "Monthly" | "Yearly";
        matches: string;
        features: string[];
        iap_product_id: string;
    }): Promise<SubscriptionPackage> {
        try {
            const response = await apiClient.post(SUBSCRIPTION_ENDPOINTS.CREATE, data);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to create subscription package');
        } catch (error: any) {
            console.error('❌ Error creating subscription package:', error);
            throw error.response?.data || error;
        }
    }

    // Update subscription package (price not allowed)
    static async updateSubscriptionPackage(id: string, data: {
        type?: "Breeding" | "Playmates";
        title?: string;
        interval?: "One time" | "Monthly" | "Yearly";
        matches?: string;
        features?: string[];
        is_active?: boolean;
    }): Promise<SubscriptionPackage> {
        try {
            const response = await apiClient.put(SUBSCRIPTION_ENDPOINTS.UPDATE(id), data);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to update subscription package');
        } catch (error: any) {
            console.error('❌ Error updating subscription package:', error);
            throw error.response?.data || error;
        }
    }

    // Delete subscription package
    static async deleteSubscriptionPackage(id: string): Promise<void> {
        try {
            const response = await apiClient.delete(SUBSCRIPTION_ENDPOINTS.DELETE(id));

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to delete subscription package');
        } catch (error: any) {
            console.error('❌ Error deleting subscription package:', error);
            throw error.response?.data || error;
        }
    }

    // Get subscription package statistics
    static async getSubscriptionStats(): Promise<SubscriptionStats> {
        try {
            const response = await apiClient.get(SUBSCRIPTION_ENDPOINTS.STATS);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch subscription stats');
        } catch (error: any) {
            console.error('❌ Error fetching subscription stats:', error);
            throw error.response?.data || error;
        }
    }
}
