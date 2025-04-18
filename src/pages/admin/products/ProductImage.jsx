import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import productsService from '../../../services/products';
import { useParams } from 'react-router-dom';

const ProductImage = () => {
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();
    const { id } = useParams();
    // Query lấy danh sách ảnh
    const { data: images, isLoading } = useQuery({
        queryKey: ['product-images', id, page],
        queryFn: () => productsService.getProductImages(id, page)
    });

    // Mutation xóa ảnh
    const deleteMutation = useMutation({
        mutationFn: (imageId) => productsService.deleteProductImage(imageId),
        onSuccess: () => {
            queryClient.invalidateQueries(['product-images', id]);
            toast.success('Xóa ảnh thành công');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa ảnh');
        }
    });

    // Xử lý xóa ảnh
    const handleDelete = (imageId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
            deleteMutation.mutate(imageId);
        }
    };

    // Xử lý thêm ảnh mới
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const formData = new FormData();

        files.forEach(file => {
            formData.append('images[]', file);
        });

        try {
            await productsService.uploadProductImages(id, formData);
            queryClient.invalidateQueries(['product-images', id]);
            toast.success('Tải ảnh lên thành công');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tải ảnh lên');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Quản lý hình ảnh</h2>
                    <div>
                        <input
                            type="file"
                            id="image-upload"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="image-upload"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                        >
                            <ImageIcon className="w-5 h-5 mr-2" />
                            Thêm ảnh mới
                        </label>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hình ảnh
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {images?.data.map((image) => (
                                <tr key={image.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}/${image.url}`}
                                                alt="Product"
                                                className="h-16 w-16 object-cover rounded"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(image.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(image.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {images && images.last_page > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: images.last_page }, (_, i) => i + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={`px-4 py-2 text-sm rounded-lg ${pageNumber === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductImage;
