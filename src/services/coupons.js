import instance from "./instance";

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
    }
};

export default couponService;