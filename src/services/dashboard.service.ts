import { apiClient } from './api.config';
import { DASHBOARD_ENDPOINTS } from '../config/api.endpoints';
import type {
    DashboardStats,
    DashboardOverview,
    AccountRequest,
    UserGrowthData,
    RevenueData,
    ApiResponse,
} from '../types/api.types';

export class DashboardService {
    // Get complete dashboard overview
    static async getDashboardOverview(): Promise<ApiResponse<DashboardOverview>> {
        try {
            const response = await apiClient.get(DASHBOARD_ENDPOINTS.OVERVIEW);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get dashboard statistics
    static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
        try {
            const response = await apiClient.get(DASHBOARD_ENDPOINTS.STATS);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }


    // Approve account request
    static async approveAccountRequest(requestId: string, user_id: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.post(DASHBOARD_ENDPOINTS.APPROVE_ACCOUNT, {
                dog_profile_id: requestId,
                user_id: user_id
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Reject account request
    static async rejectAccountRequest(requestId: string, user_id: string, reason: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.post(DASHBOARD_ENDPOINTS.REJECT_ACCOUNT, {
                dog_profile_id: requestId,
                user_id: user_id,
                reject_reason: reason
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get user growth data for chart
    static async getUserGrowthData(period: string = '6months'): Promise<ApiResponse<UserGrowthData[]>> {
        try {
            const response = await apiClient.get(`${DASHBOARD_ENDPOINTS.USER_GROWTH}?period=${period}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get revenue data for chart
    static async getRevenueData(period: string = '6months'): Promise<ApiResponse<RevenueData[]>> {
        try {
            const response = await apiClient.get(`${DASHBOARD_ENDPOINTS.REVENUE_DATA}?period=${period}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get recent activities
    static async getRecentActivities(): Promise<ApiResponse> {
        try {
            const response = await apiClient.get(DASHBOARD_ENDPOINTS.RECENT_ACTIVITIES);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}

export default DashboardService; 