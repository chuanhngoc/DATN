import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderDetail, cancelOrder, retryPayment, requestRefund, completeOrder } from '../services/order';
import { toast } from 'react-toastify';
import { useState } from 'react';

const OrderDetail = () => {
    // Hooks và state management
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State cho các modal
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // State cho form hoàn tiền
    const [refundData, setRefundData] = useState({
        reason: '', // Lý do hoàn tiền
        bank_name: '', // Tên ngân hàng
        bank_account_name: '', // Tên chủ tài khoản
        bank_account_number: '', // Số tài khoản
        images: [] // Danh sách ảnh đính kèm
    });

    // Query lấy thông tin chi tiết đơn hàng
    const { data: orderDetail, isLoading, error } = useQuery({
        queryKey: ['order-detail', id],
        queryFn: async () => {
            const response = await getOrderDetail(id);
            return response.data;
        },
    });

    // Mutation hủy đơn hàng
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

    // Mutation thanh toán lại
    const retryPaymentMutation = useMutation({
        mutationFn: () => retryPayment(id),
        onSuccess: (data) => {
            if (data?.payment_url) {
                window.location.href = data.payment_url;
            } else {
                toast.error('Không thể tạo liên kết thanh toán');
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Không thể thực hiện thanh toán lại');
        }
    });

    // Mutation hoàn thành đơn hàng
    const completeOrderMutation = useMutation({
        mutationFn: () => completeOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['order-detail', id]);
            toast.success('Đơn hàng đã được hoàn thành');
            setShowCompleteModal(false);
        },
        onError: (error) => {
            toast.error(error.message || 'Không thể hoàn thành đơn hàng');
        }
    });

    // Mutation yêu cầu hoàn tiền
    const requestRefundMutation = useMutation({
        mutationFn: (data) => requestRefund(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['order-detail', id]);
            toast.success('Yêu cầu hoàn tiền đã được gửi');
            setShowRefundModal(false);
            // Reset form
            setRefundData({
                reason: '',
                bank_name: '',
                bank_account_name: '',
                bank_account_number: '',
                images: []
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Không thể gửi yêu cầu hoàn tiền');
        }
    });

    // Xử lý hủy đơn hàng
    const handleCancelOrder = async (e) => {
        e.preventDefault();
        if (!cancelReason.trim()) {
            toast.error('Vui lòng nhập lý do hủy đơn hàng');
            return;
        }
        await cancelOrderMutation.mutate({ cancel_reason: cancelReason });
    };

    // Xử lý thanh toán lại
    const handleRetryPayment = async () => {
        await retryPaymentMutation.mutate();
    };

    // Xử lý gửi yêu cầu hoàn tiền
    const handleRefundSubmit = (e) => {
        e.preventDefault();
        if (!refundData.reason.trim()) {
            toast.error('Vui lòng nhập lý do hoàn tiền');
            return;
        }
        if (!refundData.bank_name.trim() || !refundData.bank_account_name.trim() || !refundData.bank_account_number.trim()) {
            toast.error('Vui lòng nhập đầy đủ thông tin ngân hàng');
            return;
        }
        requestRefundMutation.mutate(refundData);
    };

    // Xử lý hoàn thành đơn hàng
    const handleCompleteOrder = () => {
        completeOrderMutation.mutate();
    };

    // Xử lý upload ảnh
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setRefundData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    // Format giá tiền sang VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Hiển thị loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Hiển thị lỗi
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
                    {/* Phần header của đơn hàng - hiển thị mã và trạng thái */}
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
                                    {/* Hiển thị trạng thái đơn hàng */}
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {orderDetail?.status?.name}
                                    </span>
                                    {/* Hiển thị trạng thái thanh toán */}
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                        {orderDetail?.payment_status?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm trong đơn */}
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h2>
                        <div className="space-y-4">
                            {orderDetail?.items.map((item) => (
                                <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                                    {/* Ảnh sản phẩm */}
                                    <img
                                        src={`http://127.0.0.1:8000/storage/${item.image}`}
                                        alt={item.product_name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        {/* Tên sản phẩm */}
                                        <h3 className="font-medium text-gray-800">{item.product_name}</h3>
                                        {/* Biến thể sản phẩm */}
                                        <div className="text-sm text-gray-600 mt-1">
                                            {Object.entries(item.variation).map(([key, value]) => (
                                                <span key={key}>{key}: {value} </span>
                                            ))}
                                        </div>
                                        {/* Giá và số lượng */}
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

                    {/* Tổng kết đơn hàng */}
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

                    {/* Phần thanh toán và các nút tác vụ */}
                    <div className="p-6 border-t">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">Phương thức thanh toán</h3>
                                <p className="text-gray-600 mt-1">
                                    {orderDetail?.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán VNPay'}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {/* Nút thanh toán lại - chỉ hiện khi thanh toán VNPay chưa thành công */}
                                {orderDetail?.payment_method === 'vnpay' &&
                                    orderDetail?.payment_status?.id === 1 && (
                                        <button
                                            onClick={handleRetryPayment}
                                            disabled={retryPaymentMutation.isPending}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {retryPaymentMutation.isPending ? 'Đang xử lý...' : 'Thanh toán lại'}
                                        </button>
                                    )}

                                {/* Nút hủy đơn - chỉ hiện khi đơn hàng mới hoặc đã xác nhận */}
                                {(orderDetail?.status?.id === 1 || orderDetail?.status?.id === 2) && (
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Hủy đơn hàng
                                    </button>
                                )}

                                {/* Nút hoàn tiền và hoàn thành - chỉ hiện khi đơn đã giao */}
                                {(orderDetail?.status?.id === 4) && (
                                    <>
                                        <button
                                            onClick={() => setShowRefundModal(true)}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            Hoàn hàng/trả tiền
                                        </button>
                                        <button
                                            onClick={() => setShowCompleteModal(true)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            Hoàn thành
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lịch sử đơn hàng */}
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

                    {/* Hiển thị lý do hủy nếu đơn đã bị hủy */}
                    {orderDetail?.cancel_reason && (
                        <div className="p-6 border-t bg-red-50">
                            <h3 className="font-medium text-red-600 mb-2">Lý do hủy</h3>
                            <p className="text-gray-600">{orderDetail.cancel_reason}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal hủy đơn hàng */}
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

            {/* Modal yêu cầu hoàn tiền */}
            {showRefundModal && (
                <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Yêu cầu hoàn tiền</h2>
                        <form onSubmit={handleRefundSubmit} className="space-y-4">
                            {/* Form nhập lý do hoàn tiền */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lý do hoàn tiền
                                </label>
                                <textarea
                                    value={refundData.reason}
                                    onChange={(e) => setRefundData(prev => ({ ...prev, reason: e.target.value }))}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Nhập lý do hoàn tiền"
                                />
                            </div>

                            {/* Form nhập thông tin ngân hàng */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thông tin ngân hàng
                                </label>
                                <input
                                    type="text"
                                    value={refundData.bank_name}
                                    onChange={(e) => setRefundData(prev => ({ ...prev, bank_name: e.target.value }))}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-2"
                                    placeholder="Tên ngân hàng"
                                />
                                <input
                                    type="text"
                                    value={refundData.bank_account_name}
                                    onChange={(e) => setRefundData(prev => ({ ...prev, bank_account_name: e.target.value }))}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-2"
                                    placeholder="Tên chủ tài khoản"
                                />
                                <input
                                    type="text"
                                    value={refundData.bank_account_number}
                                    onChange={(e) => setRefundData(prev => ({ ...prev, bank_account_number: e.target.value }))}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Số tài khoản"
                                />
                            </div>

                            {/* Form upload ảnh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hình ảnh chứng minh
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full"
                                />
                                {refundData.images.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {refundData.images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setRefundData(prev => ({
                                                        ...prev,
                                                        images: prev.images.filter((_, i) => i !== index)
                                                    }))}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Nút hủy và gửi yêu cầu */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowRefundModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={requestRefundMutation.isPending}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {requestRefundMutation.isPending ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal xác nhận hoàn thành đơn hàng */}
            {showCompleteModal && (
                <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Xác nhận hoàn thành đơn hàng</h2>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xác nhận đã nhận được đơn hàng và hài lòng với sản phẩm?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCompleteModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCompleteOrder}
                                disabled={completeOrderMutation.isPending}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {completeOrderMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderDetail;
