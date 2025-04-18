import instance from './instance';

const userService = {
    getAll: async () => {
        const response = await instance.get('/users');
        return response.data;
    },
    getById: async (id) => {
        const response = await instance.get(`/users/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await instance.post('/users', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    update: async (id, data) => {
        const response = await instance.post(`/users/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    delete: async (id) => {
        const response = await instance.delete(`/users/${id}`);
        return response.data;
    }
};

export default userService; 