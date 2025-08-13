import { apiClient, objectToQueryString } from './api.config';
import { PAYMENT_ENDPOINTS } from '../config/api.endpoints';
import type {
    PaymentHistory,
    PaymentFilters,
    PaymentStats,
    PaginatedResponse,
    ApiResponse,
} from '../types/api.types';

export class PaymentService {
    // Get all payments with pagination and filters
    static async getPayments(filters: PaymentFilters = {}): Promise<any> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${PAYMENT_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);

            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;

                const paginatedResponse: any = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.payments || [],
                    meta: {
                        current_page: backendData.pagination?.current_page || 1,
                        per_page: backendData.pagination?.per_page || 10,
                        total_payments: backendData.pagination?.total_payments || 0,
                        total_pages: backendData.pagination?.total_pages || 0,
                        has_next_page: backendData.pagination?.has_next_page || false,
                        has_prev_page: backendData.pagination?.has_prev_page || false,
                    }
                };

                return paginatedResponse;
            }

            return {
                status: 0,
                message: response.data.message || 'No payments found',
                data: [],
                meta: {
                    current_page: 1,
                    per_page: 10,
                    total_payments: 0,
                    total_pages: 0,
                    has_next_page: false,
                    has_prev_page: false,
                }
            };
        } catch (error: any) {
            console.error('❌ Error fetching payments:', error);
            throw error.response?.data || error;
        }
    }

    // Get payment by ID
    static async getPaymentById(paymentId: string): Promise<ApiResponse<PaymentHistory>> {
        try {
            const response = await apiClient.get(PAYMENT_ENDPOINTS.GET_BY_ID(paymentId));

            if (response.data.status === 1) {
                return {
                    status: response.data.status,
                    message: response.data.message,
                    data: response.data.data
                };
            }

            return {
                status: 0,
                message: response.data.message || 'Payment not found'
            };
        } catch (error: any) {
            console.error('❌ Error fetching payment by ID:', error);
            throw error.response?.data || error;
        }
    }

    // Get payment statistics
    static async getPaymentStats(): Promise<ApiResponse<PaymentStats>> {
        try {
            const response = await apiClient.get(PAYMENT_ENDPOINTS.STATS);

            if (response.data.status === 1) {
                return {
                    status: response.data.status,
                    message: response.data.message,
                    data: response.data.data
                };
            }

            return {
                status: 0,
                message: response.data.message || 'Failed to fetch payment statistics'
            };
        } catch (error: any) {
            console.error('❌ Error fetching payment stats:', error);
            throw error.response?.data || error;
        }
    }
}

export default PaymentService; 