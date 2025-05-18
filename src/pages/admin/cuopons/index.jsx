import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus, Eye, X, Filter, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import couponService from '../../../services/coupons';

const CouponDetailModal = ({ coupon, onClose }) => {

    if (!coupon) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 z-50">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Chi tiết mã giảm giá</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Mã giảm giá</div>
                                <div className="mt-1 text-sm text-gray-900">{coupon.code}</div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Tên</div>
                                <div className="mt-1 text-sm text-gray-900">{coupon.name}</div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Mô tả</div>
                                <div className="mt-1 text-sm text-gray-900">{coupon.description}</div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Loại giảm giá</div>
                                <div className="mt-1 text-sm text-gray-900">
                                    {coupon.type === 'percent' ? 'Phần trăm' : 'Số tiền'}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Giảm giá</div>
                                <div className="mt-1 text-sm text-gray-900">
                                    {coupon.type === 'percent' ? `${coupon.discount_percent}%` : `${coupon.amount?.toLocaleString()}đ`}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Giảm tối đa</div>
                                <div className="mt-1 text-sm text-gray-900">{coupon.max_discount_amount?.toLocaleString()}đ</div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Giá trị đơn tối thiểu</div>
                                <div className="mt-1 text-sm text-gray-900">{coupon.min_product_price?.toLocaleString()}đ</div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Giới hạn sử dụng</div>
                                <div className="mt-1 text-sm text-gray-900">{coupon.usage_limit} lần</div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Thời gian</div>
                                <div className="mt-1 text-sm text-gray-900">
                                    {new Date(coupon.start_date).toLocaleDateString()} - {new Date(coupon.expiry_date).toLocaleDateString()}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Trạng thái</div>
                                <div className="mt-1">
                                    <span className={`px-2 py-1 text-xs rounded-full ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {coupon.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

const Coupons = () => {
    const queryClient = useQueryClient();
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        is_active: '',
        type: '',
        code: ''
    });

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        
        // Convert is_active to boolean if needed
        let convertedValue = value;
        if (name === 'is_active' && (value === '1' || value === '0')) {
            convertedValue = value === '1' ? true : false;
        }
        
        setFilters(prev => ({
            ...prev,
            [name]: convertedValue
        }));
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            is_active: '',
            type: '',
            code: ''
        });
    };

    const { data: coupons = [], isLoading, error } = useQuery({
        queryKey: ['coupons', filters],
        queryFn: () => couponService.getAll(filters)
    });

    const deleteMutation = useMutation({
        mutationFn: couponService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
            toast.success('Xóa mã giảm giá thành công');
        },
        onError: () => {
            toast.error('Xóa mã giảm giá thất bại');
        }
    });

    const handleDelete = (code) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
            deleteMutation.mutate(code);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-red-500">Có lỗi xảy ra khi tải danh sách mã giảm giá</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý mã giảm giá</h1>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                    >
                        <Filter size={20} />
                        {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                    </button>
                    <Link
                        to="/admin/coupons/add"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Thêm mã giảm giá
                    </Link>
                </div>
            </div>

            {/* Filter Section */}
            {showFilters && (
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <select
                                name="is_active"
                                value={filters.is_active === true ? '1' : filters.is_active === false ? '0' : ''}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="1">Đang hoạt động</option>
                                <option value="0">Không hoạt động</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại voucher
                            </label>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Tất cả loại</option>
                                <option value="percent">Phần trăm</option>
                                <option value="fixed">Số tiền cố định</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mã voucher
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={filters.code}
                                onChange={handleFilterChange}
                                placeholder="Nhập mã voucher"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            <X size={18} />
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại giảm giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {coupons?.length > 0 ? (
                            coupons.map((coupon) => (
                                <tr key={coupon.code} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.type === 'percent' ? 'Phần trăm' : 'Số tiền cố định'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {coupon.type === 'percent' ? `${coupon.discount_percent}%` : `${coupon.amount?.toLocaleString()}đ`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(coupon.start_date).toLocaleDateString()} - {new Date(coupon.expiry_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {coupon.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedCoupon(coupon)}
                                                className="text-green-600 hover:text-green-900 transition-colors"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <Link
                                                to={`/admin/coupons/edit/${coupon.id}`}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                            >
                                                <Edit2 size={20} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    Không tìm thấy mã giảm giá nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedCoupon && (
                <CouponDetailModal
                    coupon={selectedCoupon}
                    onClose={() => setSelectedCoupon(null)}
                />
            )}
        </div>
    );
};

export default Coupons;
