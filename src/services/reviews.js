import instance from './instance';

const reviewsService = {
    // Get all reviews with pagination and filters
    getAll: async (filters = {}) => {
        try {
            // Construct query parameters from filters
            const queryParams = new URLSearchParams();
            
            // Add all filters as query parameters if they have values
            if (filters.has_reply !== undefined && filters.has_reply !== '') {
                queryParams.append('has_reply', filters.has_reply === true ? 1 : 0);
            }
            if (filters.is_active !== undefined && filters.is_active !== '') {
                queryParams.append('is_active', filters.is_active === true ? 1 : 0);
            }
            if (filters.rating) queryParams.append('rating', filters.rating);
            if (filters.page) queryParams.append('page', filters.page);
            
            const queryString = queryParams.toString();
            const url = `/reviews${queryString ? `?${queryString}` : ''}`;
            
            const response = await instance.get(url);
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
