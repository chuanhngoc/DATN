import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, Eye, X } from 'lucide-react';
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
                                    {coupon.type === 'percent' ? 'Phần trăm' : 'Số tiền cố định'}
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
                                        {coupon.is_active ? 'Đang hoạt động' : 'Đã hết hạn'}
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
    const navigate = useNavigate();
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const { data: coupons = [], isLoading, error } = useQuery({
        queryKey: ['coupons'],
        queryFn: couponService.getAll
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
                <Link
                    to="/admin/coupons/add"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Thêm mã giảm giá
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {coupons?.map((coupon) => (
                            <tr key={coupon.code} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {coupon.type === 'percent' ? `${coupon.discount_percent}%` : `${coupon.amount?.toLocaleString()}đ`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(coupon.start_date).toLocaleDateString()} - {new Date(coupon.expiry_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {coupon.is_active ? 'Đang hoạt động' : 'Đã hết hạn'}
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
                                            onClick={() => handleDelete(coupon.code)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
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
