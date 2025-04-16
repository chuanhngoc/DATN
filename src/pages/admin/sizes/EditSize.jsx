import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import sizeService from '../../../services/sizeService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

// cái này là schema để validate form, thằng name phải có ít nhất 2 ký tự và tối đa 50 ký tự
const sizeSchema = z.object({
  name: z.string()
    .min(2, 'Tên size phải có ít nhất 2 ký tự')
    .max(50, 'Tên size không được quá 50 ký tự')
});

const EditSize = () => {
  // lấy id từ url
  const { id } = useParams();
  // dùng để chuyển trang
  const navigate = useNavigate();
  // cái này để invalidate cache
  const queryClient = useQueryClient();

  // cái này là form, có reset để reset form
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(sizeSchema)
  });

  // gọi api lấy thông tin size
  const { data: size, isLoading, error } = useQuery({
    // key để cache, có id để cache riêng cho từng size
    queryKey: ['size', id],
    // hàm gọi api
    queryFn: async () => await sizeService.getById(id)
  });

  // cái này để set giá trị form khi data thay đổi
  useEffect(() => {
    if (size) {
      console.log(size);
      reset({ name: size.name });
    }
  }, [size, reset]);

  // hàm để update size
  const updateMutation = useMutation({
    // hàm gọi api update
    mutationFn: (data) => sizeService.update(id, data),
    // khi update thành công
    onSuccess: () => {
      // xóa cache của danh sách size để cập nhật lại
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      // hiển thị thông báo thành công
      toast.success('Cập nhật size thành công');
      // chuyển về trang danh sách
      navigate('/admin/sizes');
    },
    // khi update thất bại
    onError: () => {
      // hiển thị thông báo lỗi
      toast.error('Cập nhật size thất bại');
    }
  });

  // hàm này chạy khi submit form
  const onSubmit = (data) => {
    // gọi hàm update
    updateMutation.mutate(data);
  };

  // nếu đang loading thì hiển thị cái này
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  // nếu có lỗi thì hiển thị cái này
  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Không tìm thấy size</div>
        <button
          onClick={() => navigate('/admin/sizes')}
          className="mt-4 text-gray-600 hover:text-gray-900"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sửa size</h1>
        <button
          onClick={() => navigate('/admin/sizes')}
          className="text-gray-600 hover:text-gray-900"
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tên size
          </label>
          <input
            {...register('name')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Nhập tên size"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          disabled={updateMutation.isPending}
        >
          <Edit2 size={20} />
          {updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật size'}
        </button>
      </form>
    </div>
  );
};

export default EditSize; 