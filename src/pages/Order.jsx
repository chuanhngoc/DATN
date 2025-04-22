import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrders, cancelOrder } from '../services/order';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrderPage = () => {
    const [status, setStatus] = useState('');

    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'waiting_confirm', label: 'Chờ xác nhận' },
        { value: 'waiting_payment', label: 'Chờ thanh toán' },
        { value: 'confirmed', label: 'Đã xác nhận' },
        { value: 'shipping', label: 'Đang giao' },
        { value: 'shipped', label: 'Đã giao' },
        { value: 'completed', label: 'Hoàn thành' },
        { value: 'refunding', label: 'Hoàn hàng/Trả tiền' },
        { value: 'cancelled', label: 'Đã hủy' }
    ];

    const { data: orders, isLoading, refetch } = useQuery({
        queryKey: ['orders', status],
        queryFn: () => getOrders(status)
    });

    const handleCancelOrder = async (orderId) => {
        try {
            await cancelOrder(orderId);
            toast.success('Hủy đơn hàng thành công');
            refetch();
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusStyle = (orderStatus) => {
        const styles = {
            waiting_confirm: 'bg-yellow-100 text-yellow-800',
            waiting_payment: 'bg-orange-100 text-orange-800',
            confirmed: 'bg-blue-100 text-blue-800',
            shipping: 'bg-purple-100 text-purple-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            completed: 'bg-green-100 text-green-800',
            refunding: 'bg-pink-100 text-pink-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return styles[orderStatus] || 'bg-gray-100 text-gray-800';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {statusOptions.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setStatus(value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition
                            ${status === value 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Empty State */}
            {(!orders || orders.length === 0) && (
                <div className="text-center py-12">
                    <div className="mb-4">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-medium mb-2">Chưa có đơn hàng nào</h2>
                    <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào trong mục này</p>
                    <Link to="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            )}

            {/* Orders List */}
            <div className="space-y-4">
                {orders?.map(order => (
                    <div key={order.id} className="bg-white rounded-lg shadow p-6">
                        {/* Order Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-medium">Đơn hàng #{order.id}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Đặt ngày: {formatDate(order.created_at)}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}>
                                {statusOptions.find(s => s.value === order.status)?.label || order.status}
                            </span>
                        </div>

                        {/* Order Items */}
                        <div className="border-t border-b py-4 space-y-4">
                            {order.items.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <img
                                        src={`http://127.0.0.1:8000/storage/${item.variation.product.main_image}`}
                                        alt={item.variation.product.name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.variation.product.name}</h4>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Màu: {item.variation.color.name} | Size: {item.variation.size.name}
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-blue-600 font-medium">
                                                {formatPrice(item.variation.sale_price)}
                                            </span>
                                            <span className="text-gray-500">x{item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Footer */}
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-gray-500">{order.items.length} sản phẩm</span>
                            <div className="text-right">
                                <span className="text-gray-500 text-sm">Tổng tiền:</span>
                                <div className="text-xl font-semibold text-blue-600">
                                    {formatPrice(order.total_amount)}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {order.status === 'waiting_confirm' && (
                            <div className="mt-4 pt-4 border-t flex justify-end">
                                <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                                >
                                    Hủy đơn hàng
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderPage;
