import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderDetail, cancelOrder } from '../services/order';
import { toast } from 'react-toastify';
import { useState } from 'react';

const OrderDetail = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // Fetch order details
    const { data: orderDetail, isLoading, error } = useQuery({
        queryKey: ['order-detail', id],
        queryFn: async () => {
            const response = await getOrderDetail(id);
            return response.data;
        },
    });

    // Cancel order mutation
    const cancelOrderMutation = useMutation({
        mutationFn: async (data) => await cancelOrder(id, data.cancel_reason),
        onSuccess: () => {
            queryClient.invalidateQueries(['order-detail', id]);
            toast.success('Đơn hàng đã được hủy thành công');
            setShowCancelModal(false);
            setCancelReason('');
        },
        onError: (error) => {
            toast.error(error.message || 'Không thể hủy đơn hàng');
        }
    });

    const handleCancelOrder = async (e) => {
        e.preventDefault();
        if (!cancelReason.trim()) {
            toast.error('Vui lòng nhập lý do hủy đơn hàng');
            return;
        }
        await cancelOrderMutation.mutate({ cancel_reason: cancelReason });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Đã có lỗi xảy ra</h2>
                    <p className="text-gray-600">{error.message || 'Không thể tải thông tin đơn hàng'}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="p-6 border-b">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Đơn hàng #{orderDetail?.code}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Đặt ngày: {orderDetail?.created_at}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="flex flex-col gap-2">
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {orderDetail?.status?.name}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                        {orderDetail?.payment_status?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h2>
                        <div className="space-y-4">
                            {orderDetail?.items.map((item) => (
                                <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                                    <img
                                        src={`http://127.0.0.1:8000/storage/${item.image}`}
                                        alt={item.product_name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800">{item.product_name}</h3>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {Object.entries(item.variation).map(([key, value]) => (
                                                <span key={key}>{key}: {value} </span>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-blue-600 font-medium">
                                                {formatPrice(item.product_price)}
                                            </span>
                                            <span className="text-gray-600">x{item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-6 bg-gray-50">
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span>{formatPrice(orderDetail?.total_amount - orderDetail?.shipping)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span>{formatPrice(orderDetail?.shipping)}</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Tổng cộng</span>
                                    <span className="text-blue-600">{formatPrice(orderDetail?.final_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="p-6 border-t">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">Phương thức thanh toán</h3>
                                <p className="text-gray-600 mt-1">
                                    {orderDetail?.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán online'}
                                </p>
                            </div>
                            {(orderDetail?.status?.id === 1 || orderDetail?.status?.id === 2) && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                                >
                                    Hủy đơn hàng
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order History */}
                    {orderDetail?.histories && orderDetail.histories.length > 0 && (
                        <div className="p-6 border-t">
                            <h3 className="font-medium mb-4">Lịch sử đơn hàng</h3>
                            <div className="space-y-3">
                                {orderDetail.histories.map((history) => (
                                    <div key={history.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{history.status}</span>
                                        <span className="text-gray-500">{history.created_at}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cancel Reason - Show if order is cancelled */}
                    {orderDetail?.cancel_reason && (
                        <div className="p-6 border-t bg-red-50">
                            <h3 className="font-medium text-red-600 mb-2">Lý do hủy</h3>
                            <p className="text-gray-600">{orderDetail.cancel_reason}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">Hủy đơn hàng</h2>
                        <form onSubmit={handleCancelOrder}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Lý do hủy đơn hàng
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Vui lòng cho biết lý do hủy đơn hàng..."
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setCancelReason('');
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    disabled={cancelOrderMutation.isPending}
                                    className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200
                                        ${cancelOrderMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {cancelOrderMutation.isPending ? 'Đang xử lý...' : 'Xác nhận hủy'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderDetail;
