import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService from '../../../services/categoryService';
import { toast } from 'react-toastify';

// Schema validation cho form
const categorySchema = z.object({
  name: z.string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(50, 'Tên danh mục không được quá 50 ký tự')
});

const AddCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema)
  });

  const addMutation = useMutation({
    mutationFn: (data) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Thêm danh mục thành công');
      navigate('/admin/categories');
    },
    onError: () => {
      toast.error('Thêm danh mục thất bại');
    }
  });

  const onSubmit = (data) => {
    addMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thêm danh mục mới</h1>
        <button
          onClick={() => navigate('/admin/categories')}
          className="text-gray-600 hover:text-gray-900"
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tên danh mục
          </label>
          <input
            {...register('name')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Nhập tên danh mục"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          disabled={addMutation.isPending}
        >
          <Plus size={20} />
          {addMutation.isPending ? 'Đang thêm...' : 'Thêm danh mục'}
        </button>
      </form>
    </div>
  );
};

export default AddCategory; 