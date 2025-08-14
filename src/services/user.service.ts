import { apiClient, objectToQueryString } from './api.config';
import { USER_ENDPOINTS } from '../config/api.endpoints';
import type {
    User,
    UserFilters,
    PaginatedResponse,
    ApiResponse,
} from '../types/api.types';

export class UserService {
    // Get all users with pagination and filters
    static async getUsers(filters: UserFilters = {}): Promise<any> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${USER_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);

            console.log('✅ Users API response:', response.data);

            // Transform backend response to frontend format
            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;

                const paginatedResponse: any = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.users || [],
                    meta: {
                        page: backendData.pagination?.current_page || 1,
                        limit: backendData.pagination?.per_page || 10,
                        total: backendData.pagination?.total_users || 0,
                        totalPages: backendData.pagination?.total_pages || 0,
                    }
                };

                return paginatedResponse;
            }

            // Return empty response if no data
            return {
                status: 0,
                message: response.data.message || 'No users found',
                data: [],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                }
            };
        } catch (error: any) {
            console.error('❌ Error fetching users:', error);
            throw error.response?.data || error;
        }
    }

    // Get user by ID
    static async getUserById(userId: string): Promise<ApiResponse<User>> {
        try {
            const response = await apiClient.get(USER_ENDPOINTS.GET_BY_ID(userId));
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Update user
    static async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
        try {
            const response = await apiClient.put(USER_ENDPOINTS.UPDATE(userId), userData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get user's dogs
    static async getUserDogs(userId: string, filters: UserFilters = {}): Promise<any> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${USER_ENDPOINTS.GET_DOGS(userId)}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);

            console.log('✅ User Dogs API response:', response.data);

            // Transform backend response to frontend format
            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;

                const paginatedResponse: any = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.dogs || [],
                    meta: {
                        page: backendData.pagination?.current_page || 1,
                        limit: backendData.pagination?.per_page || 10,
                        total: backendData.pagination?.total_dogs || 0,
                        totalPages: backendData.pagination?.total_pages || 0,
                    }
                };

                return paginatedResponse;
            }

            // Return empty response if no data
            return {
                status: 0,
                message: response.data.message || 'No dogs found',
                data: [],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                }
            };
        } catch (error: any) {
            console.error('❌ Error fetching user dogs:', error);
            throw error.response?.data || error;
        }
    }

    // Get user's confirmed matches
    static async getUserConfirmedMatches(userId: string, filters: UserFilters = {}): Promise<any> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${USER_ENDPOINTS.GET_CONFIRMED_MATCHES(userId)}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);

            console.log('✅ User Confirmed Matches API response:', response.data);

            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;

                const paginatedResponse: any = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.matches || [],
                    meta: {
                        page: backendData.pagination?.current_page || 1,
                        limit: backendData.pagination?.per_page || 10,
                        total: backendData.pagination?.total_matches || 0,
                        totalPages: backendData.pagination?.total_pages || 0,
                    }
                };

                return paginatedResponse;
            }

            return {
                status: 0,
                message: response.data.message || 'No confirmed matches found',
                data: [],
                meta: { page: 1, limit: 10, total: 0, totalPages: 0, }
            };
        } catch (error: any) {
            console.error('❌ Error fetching user confirmed matches:', error);
            throw error.response?.data || error;
        }
    }

    // Get user's sent requests
    static async getUserSentRequests(userId: string, filters: UserFilters = {}): Promise<any> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${USER_ENDPOINTS.GET_SENT_REQUESTS(userId)}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);

            console.log('✅ User Sent Requests API response:', response.data);

            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;

                const paginatedResponse: any = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.matches || [],
                    meta: {
                        page: backendData.pagination?.current_page || 1,
                        limit: backendData.pagination?.per_page || 10,
                        total: backendData.pagination?.total_matches || 0,
                        totalPages: backendData.pagination?.total_pages || 0,
                    }
                };

                return paginatedResponse;
            }

            return {
                status: 0,
                message: response.data.message || 'No sent requests found',
                data: [],
                meta: { page: 1, limit: 10, total: 0, totalPages: 0, }
            };
        } catch (error: any) {
            console.error('❌ Error fetching user sent requests:', error);
            throw error.response?.data || error;
        }
    }

    // Get user's received requests
    static async getUserReceivedRequests(userId: string, filters: UserFilters = {}): Promise<any> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${USER_ENDPOINTS.GET_RECEIVED_REQUESTS(userId)}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);

            console.log('✅ User Received Requests API response:', response.data);

            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;

                const paginatedResponse: any = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.matches || [],
                    meta: {
                        page: backendData.pagination?.current_page || 1,
                        limit: backendData.pagination?.per_page || 10,
                        total: backendData.pagination?.total_matches || 0,
                        totalPages: backendData.pagination?.total_pages || 0,
                    }
                };

                return paginatedResponse;
            }

            return {
                status: 0,
                message: response.data.message || 'No received requests found',
                data: [],
                meta: { page: 1, limit: 10, total: 0, totalPages: 0, }
            };
        } catch (error: any) {
            console.error('❌ Error fetching user received requests:', error);
            throw error.response?.data || error;
        }
    }

    // Get user's lost matches
    static async getUserLostMatches(userId: string, filters: UserFilters = {}): Promise<any> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${USER_ENDPOINTS.GET_LOST_MATCHES(userId)}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);

            console.log('✅ User Lost Matches API response:', response.data);

            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;

                const paginatedResponse: any = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.matches || [],
                    meta: {
                        page: backendData.pagination?.current_page || 1,
                        limit: backendData.pagination?.per_page || 10,
                        total: backendData.pagination?.total_matches || 0,
                        totalPages: backendData.pagination?.total_pages || 0,
                    }
                };

                return paginatedResponse;
            }

            return {
                status: 0,
                message: response.data.message || 'No lost matches found',
                data: [],
                meta: { page: 1, limit: 10, total: 0, totalPages: 0, }
            };
        } catch (error: any) {
            console.error('❌ Error fetching user lost matches:', error);
            throw error.response?.data || error;
        }
    }

    // Update user
    static async getUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
        try {
            const response = await apiClient.put(USER_ENDPOINTS.GET_BY_ID(userId), userData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Update user status
    static async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'blocked'): Promise<ApiResponse> {
        try {
            const response = await apiClient.patch(USER_ENDPOINTS.UPDATE_STATUS(userId), {
                status
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Delete user
    static async deleteUser(userId: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.delete(USER_ENDPOINTS.DELETE(userId));
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Reset user password
    static async resetUserPassword(userId: string, newPassword: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.post(USER_ENDPOINTS.RESET_PASSWORD(userId), {
                new_password: newPassword
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get user statistics
    static async getUserStats(): Promise<ApiResponse> {
        try {
            const response = await apiClient.get(USER_ENDPOINTS.STATS);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}

export default UserService; 