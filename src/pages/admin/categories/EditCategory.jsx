import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService from '../../../services/categoryService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

// cái này là schema để validate form, thằng name phải có ít nhất 2 ký tự và tối đa 50 ký tự
const categorySchema = z.object({
    name: z.string()
        .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
        .max(50, 'Tên danh mục không được quá 50 ký tự')
});

const EditCategory = () => {
    // lấy id từ url
    const { id } = useParams();
    // dùng để chuyển trang
    const navigate = useNavigate();
    // cái này để invalidate cache
    const queryClient = useQueryClient();

    // cái này là form, có reset để reset form
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(categorySchema)
    });

    // gọi api lấy thông tin danh mục
    const { data: category, isLoading, error } = useQuery({
        // key để cache, có id để cache riêng cho từng danh mục
        queryKey: ['category', id],
        // hàm gọi api
        queryFn: async () => await categoryService.getById(id)
    });

    // cái này để set giá trị form khi data thay đổi
    useEffect(() => {
        if (category) {
            console.log(category);
            reset({ name: category.name });
        }
    }, [category, reset]);

    // hàm để update danh mục
    const updateMutation = useMutation({
        // hàm gọi api update
        mutationFn: (data) => categoryService.update(id, data),
        // khi update thành công
        onSuccess: () => {
            // xóa cache của danh sách danh mục để cập nhật lại
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            // hiển thị thông báo thành công
            toast.success('Cập nhật danh mục thành công');
            // chuyển về trang danh sách
            navigate('/admin/categories');
        },
        // khi update thất bại
        onError: () => {
            // hiển thị thông báo lỗi
            toast.error('Cập nhật danh mục thất bại');
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
                <div className="text-red-500">Không tìm thấy danh mục</div>
                <button
                    onClick={() => navigate('/admin/categories')}
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
                <h1 className="text-2xl font-bold">Sửa danh mục</h1>
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
                    disabled={updateMutation.isPending}
                >
                    <Edit2 size={20} />
                    {updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật danh mục'}
                </button>
            </form>
        </div>
    );
};

export default EditCategory; 