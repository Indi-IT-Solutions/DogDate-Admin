import { apiClient, objectToQueryString } from './api.config';
import { DOG_ENDPOINTS, DOG_PROFILE_ENDPOINTS } from '../config/api.endpoints';
import type {
    Dog,
    DogFilters,
    PaginatedResponse,
    ApiResponse,
    ApproveRejectDogRequest,
    DeleteDogRequest,
} from '../types/api.types';

export class DogService {
    // Get all dogs with pagination and filters
    static async getDogs(filters: DogFilters = {}): Promise<any> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${DOG_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`;

            const response: any = await apiClient.get(url);

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
            console.error('❌ Error fetching dogs:', error);
            throw error.response?.data || error;
        }
    }

    // Get dog by ID
    static async getDogById(dogId: string): Promise<ApiResponse<Dog>> {
        try {
            const response = await apiClient.get(DOG_ENDPOINTS.GET_BY_ID(dogId));

            if (response.data.status === 1) {
                return {
                    status: response.data.status,
                    message: response.data.message,
                    data: response.data.data
                };
            }

            return {
                status: 0,
                message: response.data.message || 'Dog not found'
            };
        } catch (error: any) {
            console.error('❌ Error fetching dog by ID:', error);
            throw error.response?.data || error;
        }
    }

    // Approve dog profile
    static async approveDogProfile(data: ApproveRejectDogRequest): Promise<ApiResponse> {
        try {
            const response = await apiClient.post(DOG_PROFILE_ENDPOINTS.APPROVE, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Reject dog profile
    static async rejectDogProfile(data: ApproveRejectDogRequest): Promise<ApiResponse> {
        try {
            const response = await apiClient.post(DOG_PROFILE_ENDPOINTS.REJECT, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Delete dog profile
    static async deleteDogProfile(data: DeleteDogRequest): Promise<ApiResponse> {
        try {
            const response = await apiClient.post(DOG_PROFILE_ENDPOINTS.DELETE, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Update dog status
    static async updateDogStatus(dogId: string, status: 'active' | 'inactive'): Promise<ApiResponse> {
        try {
            const response = await apiClient.patch(DOG_ENDPOINTS.UPDATE_STATUS(dogId), {
                status
            });

            if (response.data.status === 1) {
                return {
                    status: response.data.status,
                    message: response.data.message,
                    data: response.data.data
                };
            }

            return {
                status: 0,
                message: response.data.message || 'Failed to update dog status'
            };
        } catch (error: any) {
            console.error('❌ Error updating dog status:', error);
            throw error.response?.data || error;
        }
    }

    // Delete dog
    static async deleteDog(dogId: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.delete(DOG_ENDPOINTS.DELETE(dogId));
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get dog statistics
    static async getDogStats(): Promise<ApiResponse> {
        try {
            const response = await apiClient.get(DOG_ENDPOINTS.STATS);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Get dog breeding data
    static async getDogBreedingData(dogId: string, filters: any = {}): Promise<any> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${DOG_ENDPOINTS.BREEDING_DATA(dogId)}${queryString ? `?${queryString}` : ''}`;

            const response: any = await apiClient.get(url);

            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;

                const paginatedResponse: any = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.breedings || [],
                    meta: {
                        page: backendData.pagination?.current_page || 1,
                        limit: backendData.pagination?.per_page || 10,
                        total: backendData.pagination?.total_breedings || 0,
                        totalPages: backendData.pagination?.total_pages || 0,
                    }
                };

                return paginatedResponse;
            }

            return {
                status: 0,
                message: response.data.message || 'No breeding data found',
                data: [],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                }
            };
        } catch (error: any) {
            console.error('❌ Error fetching dog breeding data:', error);
            throw error.response?.data || error;
        }
    }

    // Get dog playdate data
    static async getDogPlaydateData(dogId: string, filters: any = {}): Promise<any> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${DOG_ENDPOINTS.PLAYDATE_DATA(dogId)}${queryString ? `?${queryString}` : ''}`;

            const response: any = await apiClient.get(url);

            if (response.data.status === 1 && response.data.data) {
                const backendData = response.data.data;

                const paginatedResponse: any = {
                    status: response.data.status,
                    message: response.data.message,
                    data: backendData.playdates || [],
                    meta: {
                        page: backendData.pagination?.current_page || 1,
                        limit: backendData.pagination?.per_page || 10,
                        total: backendData.pagination?.total_playdates || 0,
                        totalPages: backendData.pagination?.total_pages || 0,
                    }
                };

                return paginatedResponse;
            }

            return {
                status: 0,
                message: response.data.message || 'No playdate data found',
                data: [],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                }
            };
        } catch (error: any) {
            console.error('❌ Error fetching dog playdate data:', error);
            throw error.response?.data || error;
        }
    }

    // Admin edit dog profile
    static async adminEditDog(dogId: string, payload: any): Promise<ApiResponse> {
        try {
            const response = await apiClient.put(DOG_ENDPOINTS.ADMIN_EDIT(dogId), payload);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}

export default DogService; 