import instance from './instance';

const userService = {
    getAll: async (filters = {}) => {
        try {
            // Construct query parameters from filters
            const queryParams = new URLSearchParams();
            
            if (filters.role) queryParams.append('role', filters.role);
            if (filters.is_active !== undefined && filters.is_active !== '') {
                queryParams.append('is_active', filters.is_active === true ? 1 : 0);
            }
            if (filters.search) queryParams.append('search', filters.search);
            
            const queryString = queryParams.toString();
            const url = `/users${queryString ? `?${queryString}` : ''}`;
            
            const response = await instance.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
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