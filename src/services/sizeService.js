import instance from './instance';

const sizeService = {
    getAll: async () => {
        const response = await instance.get('/sizes');
        return response.data?.data;
    },
    getById: async (id) => {
        const response = await instance.get(`/sizes/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await instance.post('/sizes', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await instance.put(`/sizes/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await instance.delete(`/sizes/${id}`);
        return response.data;
    }
};

export default sizeService; 