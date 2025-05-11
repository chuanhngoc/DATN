import instance from './instance';

const reviewsService = {
    // Get all reviews with pagination
    getAll: async (page = 1) => {
        try {
            const response = await instance.get(`/reviews?page=${page}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Có lỗi xảy ra';
        }
    },

    // Get review details
    getOne: async (id) => {
        try {
            const response = await instance.get(`/reviews/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Có lỗi xảy ra';
        }
    },

    // Reply to review
    reply: async (id, data) => {
        try {
            const response = await instance.post(`/reviews/${id}/reply`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Có lỗi xảy ra';
        }
    },

    // Block/Unblock review
    block: async (id, data) => {
        try {
            const response = await instance.post(`/reviews/${id}/block`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Có lỗi xảy ra';
        }
    }
};

export default reviewsService;
