import { apiClient } from './api.config';
import { REDEEMABLE_COIN_ENDPOINTS } from '../config/api.endpoints';

export class RedeemableCoinService {
    static async add(payload: { user_id: string; amount: number }) {
        const response = await apiClient.post(REDEEMABLE_COIN_ENDPOINTS.ADD, payload);
        return response.data;
    }

    static async list(params: { page?: number; limit?: number; search?: string } = {}) {
        const qs = new URLSearchParams();
        if (params.page) qs.set('page', String(params.page));
        if (params.limit) qs.set('limit', String(params.limit));
        if (params.search) qs.set('search', String(params.search));
        const url = `${REDEEMABLE_COIN_ENDPOINTS.LIST}${qs.toString() ? `?${qs}` : ''}`;
        const response = await apiClient.get(url);
        return response.data;
    }

    static async bulkAdd(payload: { user_ids: string[]; amount: number }) {
        const response = await apiClient.post(REDEEMABLE_COIN_ENDPOINTS.BULK_ADD, payload);
        return response.data;
    }

    static async listByUser(userId: string) {
        const response = await apiClient.get(REDEEMABLE_COIN_ENDPOINTS.LIST_BY_USER(userId));
        return response.data;
    }
}

export default RedeemableCoinService;


