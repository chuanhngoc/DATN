import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Trash2, Plus, Pencil, Loader2, X, Save } from 'lucide-react';
import productsService from '../../../services/products';
import colorService from '../../../services/colorService';
import sizeService from '../../../services/sizeService';
import { useParams } from 'react-router-dom';

const ProductVariant = () => {
    const { id } = useParams();
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);
    const queryClient = useQueryClient();

    // Form state
    const [formData, setFormData] = useState({
        color_id: '',
        size_id: '',
        price: '',
        sale_price: ''
    });

    // Queries
    const { data: variants, isLoading } = useQuery({
        queryKey: ['product-variants', id, page],
        queryFn: () => productsService.getProductVariants(id, page)
    });

    const { data: colors = [] } = useQuery({
        queryKey: ['colors'],
        queryFn: () => colorService.getAll()
    });

    const { data: sizes = [] } = useQuery({
        queryKey: ['sizes'],
        queryFn: () => sizeService.getAll()
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data) => productsService.createProductVariant(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['product-variants', id]);
            toast.success('Thêm biến thể thành công');
            setIsModalOpen(false);
            resetForm();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm biến thể');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => productsService.updateProductVariant(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['product-variants', id]);
            toast.success('Cập nhật biến thể thành công');
            setIsModalOpen(false);
            setEditingVariant(null);
            resetForm();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật biến thể');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (variantId) => productsService.deleteProductVariant(variantId),
        onSuccess: () => {
            queryClient.invalidateQueries(['product-variants', id]);
            toast.success('Xóa biến thể thành công');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa biến thể');
        }
    });

    // Handlers
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            price: Number(formData.price),
            sale_price: formData.sale_price ? Number(formData.sale_price) : null
        };

        if (editingVariant) {
            updateMutation.mutate({ id: editingVariant.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (variant) => {
        setEditingVariant(variant);
        setFormData({
            color_id: variant.color_id.toString(),
            size_id: variant.size_id.toString(),
            price: variant.price.toString(),
            sale_price: variant.sale_price ? variant.sale_price.toString() : ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = (variantId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa biến thể này?')) {
            deleteMutation.mutate(variantId);
        }
    };

    const resetForm = () => {
        setFormData({
            color_id: '',
            size_id: '',
            price: '',
            sale_price: ''
        });
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
                    <h2 className="text-xl font-semibold text-gray-800">Quản lý biến thể</h2>
                    <button
                        onClick={() => {
                            resetForm();
                            setEditingVariant(null);
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Thêm biến thể
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Màu sắc
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kích thước
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá khuyến mãi
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {variants?.data.map((variant) => (
                                <tr key={variant.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {variant.color.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {variant.size.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {variant.sale_price
                                            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.sale_price)
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEdit(variant)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(variant.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {variants && variants.last_page > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: variants.last_page }, (_, i) => i + 1).map((pageNumber) => (
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

            {/* Modal thêm/sửa biến thể */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-opacity-50 bg-[#00000033] flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editingVariant ? 'Sửa biến thể' : 'Thêm biến thể mới'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingVariant(null);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Màu sắc <span className="text-red-500">*</span>
                                </label>
                                <select
                                    disabled={editingVariant}
                                    value={formData.color_id}
                                    onChange={(e) => setFormData({ ...formData, color_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Chọn màu</option>
                                    {colors.map((color) => (
                                        <option key={color.id} value={color.id}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kích thước <span className="text-red-500">*</span>
                                </label>
                                <select
                                    disabled={editingVariant}
                                    value={formData.size_id}
                                    onChange={(e) => setFormData({ ...formData, size_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Chọn size</option>
                                    {sizes.map((size) => (
                                        <option key={size.id} value={size.id}>
                                            {size.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giá <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giá khuyến mãi
                                </label>
                                <input
                                    type="number"
                                    value={formData.sale_price}
                                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingVariant(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    {editingVariant ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductVariant;
