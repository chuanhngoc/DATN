import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService from '../../services/categoryService';
import { toast } from 'react-toastify';

const Categories = () => {
    const queryClient = useQueryClient();
    //hàm gọi api
    const { data: categories = [], isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAll()
    });
    //xóa
    const deleteMutation = useMutation({
        mutationFn: async (id) => await categoryService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Xóa danh mục thành công');
        },
        onError: () => {
            toast.error('Xóa danh mục thất bại');
        }
    });

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            deleteMutation.mutate(id);
        }
    };

    // if (isLoading) {
    //     return (
    //         <div className="p-6">
    //             <div className="animate-pulse">
    //                 <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
    //                 <div className="h-10 bg-gray-200 rounded w-full"></div>
    //             </div>
    //         </div>
    //     );
    // }

    // if (error) {
    //     return (
    //         <div className="p-6">
    //             <div className="text-red-500">Có lỗi xảy ra khi tải danh sách danh mục</div>
    //         </div>
    //     );
    // }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
                <Link
                    to="/admin/categories/add"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Thêm danh mục
                </Link>
            </div>

            {/* bảng hiển thị danh sách danh mục */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td className="px-6 py-4">{category.id}</td>
                                <td className="px-6 py-4">{category.name}</td>
                                <td className="px-6 py-4">
                                    {category.id !== 1 && <>

                                        <Link
                                            to={`/admin/categories/${category.id}/edit`}
                                            className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-1"
                                        >
                                            <Edit2 size={18} />
                                            Sửa
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 size={18} />
                                            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
                                        </button></>}

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories;