import instance from './instance';

const categoryService = {
  getAll: () => {
    return instance.get('/categories');
  },

  getById: (id) => {
    return instance.get(`/categories/${id}`);
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