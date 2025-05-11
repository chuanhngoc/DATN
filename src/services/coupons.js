import instance from "./instance";

const couponService = {
    getAll: async () => {
        return (await instance.get('/vouchers')).data.data;
    },
};

export default couponService;