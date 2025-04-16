import instance from './instance';

const colorService = {
    getAll: async () => {
        const response = await instance.get('/colors');
        return response.data?.data;
    },
    getById: async (id) => {
        const response = await instance.get(`/colors/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await instance.post('/colors', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await instance.put(`/colors/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await instance.delete(`/colors/${id}`);
        return response.data;
    }
};

export default colorService; 