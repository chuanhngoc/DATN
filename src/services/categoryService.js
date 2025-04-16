import instance from './instance';

const categoryService = {
  getAll: async () => {
    return (await instance.get('/categories')).data?.data;
  },

  getById: async (id) => {
    return (await instance.get(`/categories/${id}`)).data;
  },

  create: (data) => {
    return instance.post('/categories', data);
  },

  update: (id, data) => {
    return instance.put(`/categories/${id}`, data);
  },

  delete: (id) => {
    return instance.delete(`/categories/${id}`);
  }
};

export default categoryService;