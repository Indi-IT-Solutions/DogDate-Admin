import { apiClient, objectToQueryString } from './api.config';
import { CONTENT_ENDPOINTS, HOBBY_ENDPOINTS, MEETUP_AVAILABILITY_ENDPOINTS } from '../config/api.endpoints';
import type {
    Breed,
    DogCharacter,
    Hobby,
    DogLike,
    DogAge,
    MeetupAvailability,
    PaginationRequest,
    PaginatedResponse,
    ApiResponse,
} from '../types/api.types';

export class ContentService {
    // Breeds Management
    static async getBreeds(filters: PaginationRequest = {}): Promise<PaginatedResponse<Breed>> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${CONTENT_ENDPOINTS.BREEDS}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async createBreed(data: Partial<Breed>): Promise<ApiResponse<Breed>> {
        try {
            const response = await apiClient.post(CONTENT_ENDPOINTS.BREEDS, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async updateBreed(id: string, data: Partial<Breed>): Promise<ApiResponse<Breed>> {
        try {
            const response = await apiClient.put(`${CONTENT_ENDPOINTS.BREEDS}/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async deleteBreed(id: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.delete(`${CONTENT_ENDPOINTS.BREEDS}/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Dog Characters Management
    static async getDogCharacters(filters: PaginationRequest = {}): Promise<PaginatedResponse<DogCharacter>> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${CONTENT_ENDPOINTS.DOG_CHARACTERS}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async createDogCharacter(data: Partial<DogCharacter>): Promise<ApiResponse<DogCharacter>> {
        try {
            const response = await apiClient.post(CONTENT_ENDPOINTS.DOG_CHARACTERS, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async updateDogCharacter(id: string, data: Partial<DogCharacter>): Promise<ApiResponse<DogCharacter>> {
        try {
            const response = await apiClient.put(`${CONTENT_ENDPOINTS.DOG_CHARACTERS}/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async deleteDogCharacter(id: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.delete(`${CONTENT_ENDPOINTS.DOG_CHARACTERS}/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Hobbies Management
    static async getHobbies(filters: PaginationRequest = {}): Promise<PaginatedResponse<Hobby>> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${CONTENT_ENDPOINTS.HOBBIES}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async createHobby(data: Partial<Hobby>): Promise<ApiResponse<Hobby>> {
        try {
            const response = await apiClient.post(CONTENT_ENDPOINTS.HOBBIES, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async updateHobby(id: string, data: Partial<Hobby>): Promise<ApiResponse<Hobby>> {
        try {
            const response = await apiClient.put(`${CONTENT_ENDPOINTS.HOBBIES}/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async deleteHobby(id: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.delete(`${CONTENT_ENDPOINTS.HOBBIES}/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Dog Likes Management
    static async getDogLikes(filters: PaginationRequest = {}): Promise<PaginatedResponse<DogLike>> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${CONTENT_ENDPOINTS.DOG_LIKES}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async createDogLike(data: Partial<DogLike>): Promise<ApiResponse<DogLike>> {
        try {
            const response = await apiClient.post(CONTENT_ENDPOINTS.DOG_LIKES, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async updateDogLike(id: string, data: Partial<DogLike>): Promise<ApiResponse<DogLike>> {
        try {
            const response = await apiClient.put(`${CONTENT_ENDPOINTS.DOG_LIKES}/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async deleteDogLike(id: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.delete(`${CONTENT_ENDPOINTS.DOG_LIKES}/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Dog Ages Management
    static async getDogAges(filters: PaginationRequest = {}): Promise<PaginatedResponse<DogAge>> {
        try {
            const queryString = objectToQueryString(filters);
            const url = `${CONTENT_ENDPOINTS.DOG_AGES}${queryString ? `?${queryString}` : ''}`;

            const response = await apiClient.get(url);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async createDogAge(data: Partial<DogAge>): Promise<ApiResponse<DogAge>> {
        try {
            const response = await apiClient.post(CONTENT_ENDPOINTS.DOG_AGES, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async updateDogAge(id: string, data: Partial<DogAge>): Promise<ApiResponse<DogAge>> {
        try {
            const response = await apiClient.put(`${CONTENT_ENDPOINTS.DOG_AGES}/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async deleteDogAge(id: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.delete(`${CONTENT_ENDPOINTS.DOG_AGES}/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Meetup Availability Management
    static async getMeetupAvailability(filters: PaginationRequest = {}): Promise<PaginatedResponse<MeetupAvailability>> {
        try {
            console.log('🔍 Meetup Availability API URL:', MEETUP_AVAILABILITY_ENDPOINTS.LIST);
            const response = await apiClient.post(MEETUP_AVAILABILITY_ENDPOINTS.LIST, filters);

            if (response.data.status === 1 && response.data.data) {
                return {
                    data: response.data.data,
                    meta: {
                        total: response.data.data.length,
                        page: 1,
                        limit: response.data.data.length,
                        totalPages: 1
                    }
                };
            }

            throw new Error(response.data.message || 'Failed to fetch meetup availability');
        } catch (error: any) {
            console.error('❌ Error fetching meetup availability:', error);
            throw error.response?.data || error;
        }
    }

    static async createMeetupAvailability(data: Partial<MeetupAvailability>): Promise<ApiResponse<MeetupAvailability>> {
        try {
            const response = await apiClient.post(CONTENT_ENDPOINTS.MEETUP_AVAILABILITY, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async updateMeetupAvailability(id: string, data: Partial<MeetupAvailability>): Promise<ApiResponse<MeetupAvailability>> {
        try {
            const response = await apiClient.put(`${CONTENT_ENDPOINTS.MEETUP_AVAILABILITY}/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    static async deleteMeetupAvailability(id: string): Promise<ApiResponse> {
        try {
            const response = await apiClient.delete(`${CONTENT_ENDPOINTS.MEETUP_AVAILABILITY}/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }
}

export default ContentService; 