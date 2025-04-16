import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import colorService from '../../../services/colorService';
import { toast } from 'react-toastify';

// cái này là schema để validate form, thằng name phải có ít nhất 2 ký tự và tối đa 50 ký tự
const colorSchema = z.object({
  name: z.string()
    .min(2, 'Tên màu phải có ít nhất 2 ký tự')
    .max(50, 'Tên màu không được quá 50 ký tự')
});

const AddColor = () => {
  // dùng để chuyển trang
  const navigate = useNavigate();
  // cái này để invalidate cache
  const queryClient = useQueryClient();

  // cái này là form
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(colorSchema)
  });

  // hàm để thêm màu
  const addMutation = useMutation({
    // hàm gọi api thêm
    mutationFn: colorService.create,
    // khi thêm thành công
    onSuccess: () => {
      // xóa cache của danh sách màu để cập nhật lại
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      // hiển thị thông báo thành công
      toast.success('Thêm màu thành công');
      // chuyển về trang danh sách
      navigate('/admin/colors');
    },
    // khi thêm thất bại
    onError: () => {
      // hiển thị thông báo lỗi
      toast.error('Thêm màu thất bại');
    }
  });

  // hàm này chạy khi submit form
  const onSubmit = (data) => {
    // gọi hàm thêm
    addMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thêm màu</h1>
        <button
          onClick={() => navigate('/admin/colors')}
          className="text-gray-600 hover:text-gray-900"
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tên màu
          </label>
          <input
            {...register('name')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Nhập tên màu"
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
          {addMutation.isPending ? 'Đang thêm...' : 'Thêm màu'}
        </button>
      </form>
    </div>
  );
};

export default AddColor; 