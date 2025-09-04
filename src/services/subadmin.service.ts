import { apiClient, objectToQueryString } from './api.config';
import { SUB_ADMIN_ENDPOINTS } from '../config/api.endpoints';

export class SubAdminService {
    static async list(params: { page?: number; limit?: number; search?: string } = {}) {
        const qs = objectToQueryString(params as any);
        const url = `${SUB_ADMIN_ENDPOINTS.LIST}${qs ? `?${qs}` : ''}`;
        const response = await apiClient.get(url);
        return response.data;
    }

    static async create(payload: { name: string; email: string; password: string; allowed_routes: string[] }) {
        const response = await apiClient.post(SUB_ADMIN_ENDPOINTS.CREATE, payload);
        return response.data;
    }

    static async getById(id: string) {
        const response = await apiClient.get(SUB_ADMIN_ENDPOINTS.GET_BY_ID(id));
        return response.data;
    }

    static async update(id: string, payload: Partial<{ name: string; email: string; password: string; allowed_routes: string[]; status: 'active' | 'inactive' }>) {
        const response = await apiClient.put(SUB_ADMIN_ENDPOINTS.UPDATE(id), payload);
        return response.data;
    }

    static async updateStatus(id: string, status: 'active' | 'inactive') {
        const response = await apiClient.patch(SUB_ADMIN_ENDPOINTS.UPDATE_STATUS(id), { status });
        return response.data;
    }

    static async delete(id: string) {
        const response = await apiClient.delete(SUB_ADMIN_ENDPOINTS.DELETE(id));
        return response.data;
    }
}

export default SubAdminService;


