import { apiClient, objectToQueryString } from './api.config';
import { REPORT_ENDPOINTS } from '../config/api.endpoints';
import type {
    Report,
    ReportFilters,
    ReportStats,
    PaginatedResponse,
    ApiResponse,
} from '../types/api.types';

export class ReportService {
    // Get all reports with pagination and search
    static async getReports(filters: ReportFilters = {}): Promise<PaginatedResponse<Report>> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${REPORT_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`;
            console.log('🔍 Report API URL:', url);
            const response = await apiClient.get(url);

            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;
                const paginatedResponse: PaginatedResponse<Report> = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.reports || [],
                    meta: {
                        current_page: backendData.pagination?.current_page || 1,
                        per_page: backendData.pagination?.per_page || 10,
                        total_reports: backendData.pagination?.total_reports || 0,
                        total_pages: backendData.pagination?.total_pages || 0,
                        has_next_page: backendData.pagination?.has_next_page || false,
                        has_prev_page: backendData.pagination?.has_prev_page || false,
                    }
                };
                return paginatedResponse;
            }

            throw new Error(response.data.message || 'Failed to fetch reports');
        } catch (error: any) {
            console.error('❌ Error fetching reports:', error);
            throw error;
        }
    }

    // Get report by ID
    static async getReportById(id: string): Promise<Report> {
        try {
            const response = await apiClient.get(REPORT_ENDPOINTS.GET_BY_ID(id));

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch report');
        } catch (error: any) {
            console.error('❌ Error fetching report:', error);
            throw error;
        }
    }

    // Update report status
    static async updateReportStatus(id: string, status: { action?: string; status?: string }): Promise<Report> {
        try {
            const response = await apiClient.put(REPORT_ENDPOINTS.UPDATE_STATUS(id), status);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to update report status');
        } catch (error: any) {
            console.error('❌ Error updating report status:', error);
            throw error;
        }
    }

    // Delete report
    static async deleteReport(id: string): Promise<void> {
        try {
            const response = await apiClient.delete(REPORT_ENDPOINTS.DELETE(id));

            if (response.data.status === 1) {
                return;
            }

            throw new Error(response.data.message || 'Failed to delete report');
        } catch (error: any) {
            console.error('❌ Error deleting report:', error);
            throw error;
        }
    }

    // Get report statistics
    static async getReportStats(): Promise<ReportStats> {
        try {
            const response = await apiClient.get(REPORT_ENDPOINTS.STATS);

            if (response.data.status === 1 && response.data.data) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch report stats');
        } catch (error: any) {
            console.error('❌ Error fetching report stats:', error);
            throw error;
        }
    }
}
