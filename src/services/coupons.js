import { token_auth } from "../auth/getToken";
import instance, { instanceLocal } from "./instance";
const getAuthHeaders = () => {
    const token_ = token_auth();
    return token_ ? { Authorization: `Bearer ${token_}` } : {};
};
const couponService = {
    getAll: async (filters = {}) => {
        try {
            // Construct query parameters from filters
            const queryParams = new URLSearchParams();
            
            if (filters.is_active !== undefined && filters.is_active !== '') {
                queryParams.append('is_active', filters.is_active === true ? 1 : 0);
            }
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.code) queryParams.append('code', filters.code);
            
            const queryString = queryParams.toString();
            const url = `/vouchers${queryString ? `?${queryString}` : ''}`;
            
            const response = await instance.get(url);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching coupons:', error);
            throw error;
        }
    },
    create: async (data) => {
        return (await instance.post('/vouchers', data)).data;
    },
    update: async (code, data) => {
        return (await instance.put(`/vouchers/${code}`, data)).data;
    },
    delete: async (code) => {
        return (await instance.delete(`/vouchers/${code}`)).data;
    },
    getOne: async (code) => {
        return (await instance.get(`/vouchers/${code}`)).data;
    },

    getVoucher: async (amount) => {
        return (await instanceLocal.get(`/list-voucher?amount=${amount}`, {
            headers: getAuthHeaders(),
        })).data;
    },

    applyVoucher: async (data) => {
        return (await instanceLocal.post('/apply-voucher', data, {
            headers: getAuthHeaders(),
        })).data;
    }
};

export default couponService;