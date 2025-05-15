import { token_auth } from "../auth/getToken";
import instance, { instanceLocal } from "./instance";
const getAuthHeaders = () => {
    const token_ = token_auth();
    return token_ ? { Authorization: `Bearer ${token_}` } : {};
};
const couponService = {
    getAll: async () => {
        return (await instance.get('/vouchers')).data.data;
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